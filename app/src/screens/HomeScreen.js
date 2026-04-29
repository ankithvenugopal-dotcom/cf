import React, { useEffect, useState, useCallback } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
  ActivityIndicator, RefreshControl, Alert, TextInput, Modal,
} from 'react-native';
import Svg, { Circle, G } from 'react-native-svg';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getUserId, getUser, getWeekPlan, getFoodLog, getSteps, logSteps, logFood } from '../services/api';
import { COLORS } from '../utils/colors';

const DAY_SHORT = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export default function HomeScreen({ navigation }) {
  const [user, setUser]       = useState(null);
  const [plan, setPlan]       = useState(null);
  const [logData, setLogData] = useState({ entries: [], summary: { calories: 0, protein: 0, carbs: 0, fat: 0, cheatCalories: 0 } });
  const [stepsData, setStepsData] = useState({ steps: 0, caloriesBurned: 0 });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [stepsModal, setStepsModal] = useState(false);
  const [stepsInput, setStepsInput] = useState('');

  const today = new Date().toISOString().split('T')[0];

  const load = useCallback(async () => {
    try {
      const uid = await getUserId();
      if (!uid) { navigation.replace('Onboarding'); return; }
      const [u, p, log, steps] = await Promise.all([
        getUser(uid), getWeekPlan(uid), getFoodLog(uid, today), getSteps(uid),
      ]);
      setUser(u);
      setPlan(p);
      setLogData(log);
      setStepsData(steps);
    } catch (e) {
      if (e.response?.status === 404) {
        await AsyncStorage.removeItem('userId');
        navigation.replace('Onboarding');
      } else {
        Alert.alert('Connection Error', `Could not load your plan.\n\n${e.message}`);
      }
    }
  }, [navigation, today]);

  useEffect(() => { load().finally(() => setLoading(false)); }, [load]);
  useEffect(() => {
    const unsub = navigation.addListener('focus', load);
    return unsub;
  }, [navigation, load]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  }, [load]);

  const handleLogSteps = useCallback(async () => {
    const n = parseInt(stepsInput);
    if (!n || n < 0) { Alert.alert('Invalid', 'Enter a valid step count'); return; }
    try {
      const uid = await getUserId();
      const res = await logSteps(uid, n);
      setStepsData(res);
      setStepsModal(false);
      setStepsInput('');
      if (res.needsCompensation) {
        Alert.alert(
          '⚡ Calorie Compensation',
          `You burned ${res.caloriesBurned} kcal walking. Net calories (${res.netCalories} kcal) are below 1300 kcal minimum. Eat ${res.compensationNeeded} extra kcal today to compensate.`
        );
      }
    } catch (e) {
      Alert.alert('Error', e.message);
    }
  }, [stepsInput]);

  if (loading) return <View style={s.center}><ActivityIndicator size="large" color={COLORS.primary} /></View>;

  const profile  = user?.profile;
  const today0   = new Date().getDay();
  const todayIdx = today0 === 0 ? 6 : today0 - 1;
  const todayPlan = plan?.days?.[todayIdx];
  const logSummary = logData.summary || {};
  const target = profile?.targetCalories || 0;
  const burned = stepsData.caloriesBurned || 0;

  return (
    <ScrollView
      style={s.screen}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      {/* Header */}
      <View style={s.header}>
        <View>
          <Text style={s.greeting}>Hey, {user?.name?.split(' ')[0] || 'there'} 👋</Text>
          <Text style={s.subGreeting}>Here's your plan for today</Text>
        </View>
        <TouchableOpacity style={s.profileBtn} onPress={() => navigation.navigate('Profile')}>
          <Text style={s.profileInitial}>{(user?.name || 'U')[0].toUpperCase()}</Text>
        </TouchableOpacity>
      </View>

      {/* Stats */}
      {profile && (
        <View style={s.statsRow}>
          <StatCard label="Daily Target" value={`${profile.targetCalories}`} unit="kcal" />
          <StatCard label="Protein" value={`${profile.macros?.proteinG}`} unit="g" />
          <StatCard label="Goal" value={user?.goal?.replace('_', ' ')} unit="" />
        </View>
      )}

      {/* Macro Pie Chart — Daily */}
      {profile && (
        <View style={s.card}>
          <Text style={s.cardTitle}>Today's Macros</Text>
          <View style={s.pieRow}>
            <MacroPieChart
              eaten={{ protein: logSummary.protein || 0, carbs: logSummary.carbs || 0, fat: logSummary.fat || 0 }}
              target={{ protein: profile.macros?.proteinG || 1, carbs: profile.macros?.carbsG || 1, fat: profile.macros?.fatG || 1 }}
            />
            <View style={s.pieLegend}>
              <LegendRow label="Protein" eaten={Math.round(logSummary.protein || 0)} target={profile.macros?.proteinG} color={COLORS.secondary} />
              <LegendRow label="Carbs"   eaten={Math.round(logSummary.carbs || 0)}   target={profile.macros?.carbsG}   color={COLORS.warning} />
              <LegendRow label="Fat"     eaten={Math.round(logSummary.fat || 0)}     target={profile.macros?.fatG}     color="#9C27B0" />
              <LegendRow label="Calories" eaten={Math.round(logSummary.calories || 0)} target={target} color={COLORS.primary} unit="kcal" />
            </View>
          </View>
          {/* Weekly macro note */}
          {plan && (
            <View style={s.weeklyMacroNote}>
              <Text style={s.weeklyMacroText}>
                Weekly: {plan.weeklyTargetProtein}g P · {plan.weeklyTargetCarbs}g C · {plan.weeklyTargetFat}g F · {plan.weeklyTargetCalories?.toLocaleString()} kcal
              </Text>
            </View>
          )}
        </View>
      )}

      {/* Cheat Meal Bar */}
      {logSummary.cheatCalories > 0 && (
        <View style={s.card}>
          <Text style={s.cardTitle}>🍔 Cheat Calories Today</Text>
          <View style={s.cheatBarWrap}>
            <View style={s.cheatBarTrack}>
              <View style={[s.cheatBarFill, { width: `${Math.min((logSummary.cheatCalories / (target * 0.3)) * 100, 100)}%` }]} />
            </View>
            <Text style={s.cheatBarValue}>{Math.round(logSummary.cheatCalories)} / {Math.round(target * 0.3)} kcal recommended max</Text>
          </View>
        </View>
      )}

      {/* Step Count */}
      <View style={s.card}>
        <View style={s.stepHeader}>
          <Text style={s.cardTitle}>👟 Steps Today</Text>
          <TouchableOpacity style={s.logStepsBtn} onPress={() => setStepsModal(true)}>
            <Text style={s.logStepsBtnText}>Log Steps</Text>
          </TouchableOpacity>
        </View>
        <View style={s.stepRow}>
          <StepStat label="Steps" value={(stepsData.steps || 0).toLocaleString()} />
          <StepStat label="Burned" value={`${burned} kcal`} />
          <StepStat label="Net Calories" value={`${Math.max(target - burned, 0)}`} unit="kcal" highlight={target - burned < 1300} />
        </View>
        {stepsData.needsCompensation && (
          <Text style={s.stepWarning}>⚡ Eat {stepsData.compensationNeeded} extra kcal to stay above 1300 kcal minimum</Text>
        )}
      </View>

      {/* Week Strip */}
      {plan && (
        <View>
          <Text style={s.sectionTitle}>This Week</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={s.weekStrip}>
            {plan.days.map((day, i) => (
              <TouchableOpacity
                key={i}
                style={[s.dayChip, i === todayIdx && s.dayChipToday, day.completed && s.dayChipDone]}
                onPress={() => navigation.navigate('Plan', { dayIndex: i })}
              >
                <Text style={[s.dayChipLabel, i === todayIdx && s.dayChipLabelActive]}>{DAY_SHORT[i]}</Text>
                <Text style={[s.dayChipCal, i === todayIdx && s.dayChipLabelActive]}>
                  {day.totalCalories || day.targetCalories}
                </Text>
                {day.rebalanced && <View style={s.rebalancedDot} />}
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}

      {/* Today's Meals */}
      {todayPlan && (
        <View>
          <View style={s.sectionRow}>
            <Text style={s.sectionTitle}>Today's Meals</Text>
            <Text style={s.calBadge}>{todayPlan.totalCalories || todayPlan.targetCalories} kcal</Text>
          </View>
          {todayPlan.meals?.map((meal, i) => <MealRow key={i} meal={meal} onLogged={load} />)}
        </View>
      )}

      {/* Action Buttons */}
      <View style={s.actionButtons}>
        <TouchableOpacity style={s.logFoodBtn} onPress={() => navigation.navigate('FoodLog')}>
          <Text style={s.actionBtnIcon}>📋</Text>
          <View>
            <Text style={s.actionBtnTitle}>Log Food</Text>
            <Text style={s.actionBtnSub}>Track what you've eaten</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={s.cravingBtn} onPress={() => navigation.navigate('Craving')}>
          <Text style={s.actionBtnIcon}>🍔</Text>
          <View>
            <Text style={s.actionBtnTitle}>Log Craving</Text>
            <Text style={s.actionBtnSub}>We'll rebalance your week</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Steps Modal */}
      <Modal visible={stepsModal} transparent animationType="slide">
        <View style={s.modalOverlay}>
          <View style={s.modalBox}>
            <Text style={s.modalTitle}>Log Today's Steps</Text>
            <TextInput
              style={s.modalInput}
              placeholder="e.g. 8500"
              keyboardType="numeric"
              value={stepsInput}
              onChangeText={setStepsInput}
              autoFocus
            />
            <View style={s.modalBtns}>
              <TouchableOpacity style={s.modalCancel} onPress={() => setStepsModal(false)}>
                <Text style={s.modalCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={s.modalConfirm} onPress={handleLogSteps}>
                <Text style={s.modalConfirmText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

// ── Sub-components ────────────────────────────────────────────────────────

function MacroPieChart({ eaten, target }) {
  const size = 120;
  const r = 40;
  const cx = size / 2;
  const cy = size / 2;
  const stroke = 14;
  const circumference = 2 * Math.PI * r;

  const segments = [
    { key: 'protein', color: COLORS.secondary, eaten: eaten.protein, target: target.protein },
    { key: 'carbs',   color: COLORS.warning,   eaten: eaten.carbs,   target: target.carbs },
    { key: 'fat',     color: '#9C27B0',         eaten: eaten.fat,     target: target.fat },
  ];

  const totalEaten  = eaten.protein * 4 + eaten.carbs * 4 + eaten.fat * 9;
  const totalTarget = target.protein * 4 + target.carbs * 4 + target.fat * 9;
  const pct = totalTarget > 0 ? Math.min(Math.round((totalEaten / totalTarget) * 100), 100) : 0;

  let rotation = -90;
  const arcs = segments.map(seg => {
    const segTarget = seg.target * (seg.key === 'fat' ? 9 : 4);
    const share = totalTarget > 0 ? segTarget / totalTarget : 0;
    const segEaten = seg.eaten * (seg.key === 'fat' ? 9 : 4);
    const fillRatio = segTarget > 0 ? Math.min(segEaten / segTarget, 1) : 0;
    const fullAngle = share * 360;
    const fillAngle = fullAngle * fillRatio;
    const arc = {
      key: seg.key,
      color: seg.color,
      bgDash: (fullAngle / 360) * circumference,
      bgOffset: circumference - (fullAngle / 360) * circumference,
      fillDash: (fillAngle / 360) * circumference,
      fillOffset: circumference - (fillAngle / 360) * circumference,
      rotation,
    };
    rotation += fullAngle;
    return arc;
  });

  return (
    <View style={{ alignItems: 'center' }}>
      <Svg width={size} height={size}>
        <G>
          {arcs.map(arc => (
            <React.Fragment key={arc.key}>
              <Circle cx={cx} cy={cy} r={r} fill="none"
                stroke={arc.color + '30'} strokeWidth={stroke}
                strokeDasharray={`${arc.bgDash} ${arc.bgOffset}`}
                strokeDashoffset={0}
                transform={`rotate(${arc.rotation} ${cx} ${cy})`}
              />
              <Circle cx={cx} cy={cy} r={r} fill="none"
                stroke={arc.color} strokeWidth={stroke}
                strokeDasharray={`${arc.fillDash} ${arc.fillOffset}`}
                strokeDashoffset={0}
                transform={`rotate(${arc.rotation} ${cx} ${cy})`}
                strokeLinecap="round"
              />
            </React.Fragment>
          ))}
        </G>
      </Svg>
      <Text style={s.pieCenter}>{pct}%</Text>
      <Text style={s.pieCenterLabel}>eaten</Text>
    </View>
  );
}

function LegendRow({ label, eaten, target, color, unit = 'g' }) {
  const pct = target > 0 ? Math.min(Math.round((eaten / target) * 100), 100) : 0;
  return (
    <View style={s.legendRow}>
      <View style={[s.legendDot, { backgroundColor: color }]} />
      <Text style={s.legendLabel}>{label}</Text>
      <View style={s.legendBarWrap}>
        <View style={[s.legendBarFill, { width: `${pct}%`, backgroundColor: color }]} />
      </View>
      <Text style={s.legendValue}>{eaten}/{target}{unit}</Text>
    </View>
  );
}

function StepStat({ label, value, highlight }) {
  return (
    <View style={s.stepStat}>
      <Text style={[s.stepStatValue, highlight && { color: COLORS.danger }]}>{value}</Text>
      <Text style={s.stepStatLabel}>{label}</Text>
    </View>
  );
}

function StatCard({ label, value, unit }) {
  return (
    <View style={s.statCard}>
      <Text style={s.statValue}>{value}<Text style={s.statUnit}> {unit}</Text></Text>
      <Text style={s.statLabel}>{label}</Text>
    </View>
  );
}

function MealRow({ meal, onLogged }) {
  const [logging, setLogging] = useState(false);

  const handleLog = async () => {
    setLogging(true);
    try {
      const uid = await getUserId();
      const items = meal.items?.length ? meal.items : [meal];
      for (const item of items) {
        await logFood(uid, item.id || null, item.id ? null : { name: item.name, calories: item.calories, protein: item.protein, carbs: item.carbs, fat: item.fat });
      }
      onLogged?.();
    } catch {
      // silently fail — user can log manually
    } finally {
      setLogging(false);
    }
  };

  return (
    <View style={[s.mealRow, meal.isCheat && s.mealRowCheat]}>
      <View style={s.mealSlotBadge}>
        <Text style={s.mealSlotText}>{meal.slot}</Text>
      </View>
      <View style={s.mealInfo}>
        <Text style={s.mealName} numberOfLines={1}>{meal.name}</Text>
        <Text style={s.mealMacros}>
          {meal.calories} kcal · P {meal.protein}g · C {meal.carbs}g · F {meal.fat}g
        </Text>
      </View>
      <TouchableOpacity style={s.logMealBtn} onPress={handleLog} disabled={logging}>
        {logging
          ? <ActivityIndicator size="small" color={COLORS.secondary} />
          : <Text style={s.logMealBtnText}>✓</Text>
        }
      </TouchableOpacity>
    </View>
  );
}

const s = StyleSheet.create({
  screen:       { flex: 1, backgroundColor: COLORS.screenBg },
  center:       { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header:       { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 24, paddingTop: 52, backgroundColor: COLORS.primary },
  greeting:     { fontSize: 22, fontWeight: '700', color: COLORS.white },
  subGreeting:  { fontSize: 14, color: COLORS.white + 'CC', marginTop: 2 },
  profileBtn:   { width: 42, height: 42, borderRadius: 21, backgroundColor: COLORS.white + '30', justifyContent: 'center', alignItems: 'center' },
  profileInitial:{ fontSize: 18, fontWeight: '700', color: COLORS.white },
  statsRow:     { flexDirection: 'row', gap: 10, padding: 16, backgroundColor: COLORS.primary, paddingTop: 0 },
  statCard:     { flex: 1, backgroundColor: COLORS.white + '20', borderRadius: 10, padding: 12, alignItems: 'center' },
  statValue:    { fontSize: 18, fontWeight: '700', color: COLORS.white },
  statUnit:     { fontSize: 11, fontWeight: '400', color: COLORS.white + 'CC' },
  statLabel:    { fontSize: 11, color: COLORS.white + 'CC', marginTop: 2 },
  card:         { margin: 16, marginBottom: 0, backgroundColor: COLORS.white, borderRadius: 14, padding: 16, borderWidth: 1, borderColor: COLORS.border },
  cardTitle:    { fontSize: 15, fontWeight: '700', color: COLORS.dark, marginBottom: 12 },
  pieRow:       { flexDirection: 'row', alignItems: 'center', gap: 16 },
  pieCenter:    { position: 'absolute', top: 44, fontSize: 18, fontWeight: '700', color: COLORS.dark, textAlign: 'center', width: 120 },
  pieCenterLabel:{ position: 'absolute', top: 66, fontSize: 10, color: COLORS.muted, textAlign: 'center', width: 120 },
  pieLegend:    { flex: 1, gap: 8 },
  legendRow:    { flexDirection: 'row', alignItems: 'center', gap: 6 },
  legendDot:    { width: 8, height: 8, borderRadius: 4 },
  legendLabel:  { fontSize: 11, color: COLORS.mid, width: 50 },
  legendBarWrap:{ flex: 1, height: 6, backgroundColor: COLORS.border, borderRadius: 3, overflow: 'hidden' },
  legendBarFill:{ height: '100%', borderRadius: 3 },
  legendValue:  { fontSize: 10, color: COLORS.muted, width: 72, textAlign: 'right' },
  weeklyMacroNote:{ marginTop: 12, paddingTop: 12, borderTopWidth: 1, borderTopColor: COLORS.border },
  weeklyMacroText:{ fontSize: 12, color: COLORS.muted, textAlign: 'center' },
  cheatBarWrap: { gap: 6 },
  cheatBarTrack:{ height: 10, backgroundColor: COLORS.border, borderRadius: 5, overflow: 'hidden' },
  cheatBarFill: { height: '100%', backgroundColor: '#FF8F00', borderRadius: 5 },
  cheatBarValue:{ fontSize: 12, color: COLORS.muted },
  stepHeader:   { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  logStepsBtn:  { backgroundColor: COLORS.primary + '15', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16 },
  logStepsBtnText:{ color: COLORS.primary, fontWeight: '600', fontSize: 13 },
  stepRow:      { flexDirection: 'row', justifyContent: 'space-around' },
  stepStat:     { alignItems: 'center' },
  stepStatValue:{ fontSize: 18, fontWeight: '700', color: COLORS.dark },
  stepStatLabel:{ fontSize: 11, color: COLORS.muted, marginTop: 2 },
  stepWarning:  { marginTop: 10, fontSize: 12, color: COLORS.danger, fontWeight: '600', textAlign: 'center' },
  sectionTitle: { fontSize: 17, fontWeight: '700', color: COLORS.dark, padding: 16, paddingBottom: 10 },
  sectionRow:   { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingRight: 16 },
  calBadge:     { fontSize: 13, fontWeight: '600', color: COLORS.primary },
  weekStrip:    { paddingLeft: 16, paddingBottom: 8 },
  dayChip:      { width: 60, padding: 10, borderRadius: 12, backgroundColor: COLORS.white, marginRight: 8, alignItems: 'center', borderWidth: 1.5, borderColor: COLORS.border },
  dayChipToday: { borderColor: COLORS.primary, backgroundColor: COLORS.primary + '15' },
  dayChipDone:  { backgroundColor: COLORS.success + '15', borderColor: COLORS.success },
  dayChipLabel: { fontSize: 12, fontWeight: '600', color: COLORS.muted },
  dayChipLabelActive:{ color: COLORS.primary },
  dayChipCal:   { fontSize: 11, color: COLORS.muted, marginTop: 2 },
  rebalancedDot:{ width: 6, height: 6, borderRadius: 3, backgroundColor: COLORS.warning, marginTop: 3 },
  mealRow:      { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.white, marginHorizontal: 16, marginBottom: 8, borderRadius: 12, padding: 12, borderWidth: 1, borderColor: COLORS.border },
  mealRowCheat: { borderColor: COLORS.primary + '60', backgroundColor: COLORS.primary + '08' },
  mealSlotBadge:{ backgroundColor: COLORS.screenBg, borderRadius: 6, paddingHorizontal: 8, paddingVertical: 4, marginRight: 12 },
  mealSlotText: { fontSize: 11, color: COLORS.muted, textTransform: 'uppercase', fontWeight: '600' },
  mealInfo:     { flex: 1 },
  mealName:     { fontSize: 14, fontWeight: '600', color: COLORS.dark },
  mealMacros:   { fontSize: 11, color: COLORS.muted, marginTop: 2 },
  cheatBadge:   { fontSize: 10, color: COLORS.primary, fontWeight: '700', backgroundColor: COLORS.primary + '18', paddingHorizontal: 7, paddingVertical: 3, borderRadius: 6 },
  logMealBtn:   { width: 32, height: 32, borderRadius: 16, backgroundColor: COLORS.secondary + '20', justifyContent: 'center', alignItems: 'center' },
  logMealBtnText:{ color: COLORS.secondary, fontSize: 16, fontWeight: '700' },
  actionButtons:{ flexDirection: 'row', gap: 12, margin: 16, marginBottom: 40 },
  logFoodBtn:   { flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.secondary, borderRadius: 14, padding: 16, gap: 12 },
  cravingBtn:   { flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.dark, borderRadius: 14, padding: 16, gap: 12 },
  actionBtnIcon:{ fontSize: 24 },
  actionBtnTitle:{ fontSize: 14, fontWeight: '700', color: COLORS.white },
  actionBtnSub: { fontSize: 11, color: COLORS.white + '99', marginTop: 2 },
  modalOverlay: { flex: 1, backgroundColor: '#00000066', justifyContent: 'flex-end' },
  modalBox:     { backgroundColor: COLORS.white, borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 24 },
  modalTitle:   { fontSize: 18, fontWeight: '700', color: COLORS.dark, marginBottom: 16 },
  modalInput:   { borderWidth: 1.5, borderColor: COLORS.border, borderRadius: 12, padding: 14, fontSize: 18, color: COLORS.dark, marginBottom: 16 },
  modalBtns:    { flexDirection: 'row', gap: 12 },
  modalCancel:  { flex: 1, padding: 14, borderRadius: 12, backgroundColor: COLORS.border, alignItems: 'center' },
  modalCancelText:{ color: COLORS.mid, fontWeight: '600', fontSize: 15 },
  modalConfirm: { flex: 1, padding: 14, borderRadius: 12, backgroundColor: COLORS.primary, alignItems: 'center' },
  modalConfirmText:{ color: COLORS.white, fontWeight: '700', fontSize: 15 },
});
