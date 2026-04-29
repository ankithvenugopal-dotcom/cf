import React, { useEffect, useState, useCallback } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
  ActivityIndicator, RefreshControl, Alert, TextInput, Modal, Dimensions,
} from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getUserId, getUser, getWeekPlan, getFoodLog, getSteps, logSteps, logFood } from '../services/api';
import { COLORS } from '../utils/colors';

const { width: W } = Dimensions.get('window');
const DAY_SHORT = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export default function HomeScreen({ navigation }) {
  const [user, setUser]       = useState(null);
  const [plan, setPlan]       = useState(null);
  const [logData, setLogData] = useState({ entries: [], summary: { calories: 0, protein: 0, carbs: 0, fat: 0, cheatCalories: 0 } });
  const [stepsData, setStepsData] = useState({ steps: 0, caloriesBurned: 0 });
  const [loading, setLoading]     = useState(true);
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
          'Calorie Compensation',
          `You burned ${res.caloriesBurned} kcal walking. Eat ${res.compensationNeeded} extra kcal today to stay above the 1300 kcal minimum.`
        );
      }
    } catch (e) {
      Alert.alert('Error', e.message);
    }
  }, [stepsInput]);

  if (loading) {
    return (
      <View style={s.center}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  const profile    = user?.profile;
  const today0     = new Date().getDay();
  const todayIdx   = today0 === 0 ? 6 : today0 - 1;
  const todayPlan  = plan?.days?.[todayIdx];
  const logSummary = logData.summary || {};
  const target     = profile?.targetCalories || 2000;
  const eaten      = Math.round(logSummary.calories || 0);
  const burned     = stepsData.caloriesBurned || 0;
  const remaining  = Math.max(target - eaten + burned, 0);
  const isOver     = (eaten - burned) > target;

  return (
    <View style={s.screen}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.muted} />}
      >
        {/* ── Top Bar ─────────────────────────────────────────── */}
        <View style={s.topBar}>
          <TouchableOpacity style={s.avatar} onPress={() => navigation.navigate('More')}>
            <Text style={s.avatarText}>{(user?.name || 'U')[0].toUpperCase()}</Text>
          </TouchableOpacity>
          <Text style={s.topTitle}>Today</Text>
          <TouchableOpacity style={s.bellBtn} onPress={() => navigation.navigate('Craving')}>
            <Text style={s.bellIcon}>🍔</Text>
          </TouchableOpacity>
        </View>

        {/* ── Calorie Card ─────────────────────────────────────── */}
        <View style={s.calorieCard}>
          <Text style={s.calorieFormula}>Remaining = Goal − Food + Exercise</Text>
          <View style={s.calorieRow}>
            <CalorieRing remaining={remaining} goal={target} isOver={isOver} />
            <View style={s.calorieStats}>
              <CalorieStat icon="🎯" label="Base Goal" value={target.toLocaleString()} />
              <View style={s.statDivider} />
              <CalorieStat icon="🍽️" label="Food"      value={eaten.toLocaleString()} />
              <View style={s.statDivider} />
              <CalorieStat icon="🔥" label="Exercise"  value={burned.toLocaleString()} />
            </View>
          </View>
        </View>

        {/* ── Macro Bars ───────────────────────────────────────── */}
        {profile && (
          <View style={s.card}>
            <Text style={s.cardLabel}>Macros</Text>
            <MacroBar label="Protein" eaten={Math.round(logSummary.protein || 0)} target={profile.macros?.proteinG || 1} color={COLORS.secondary} />
            <MacroBar label="Carbs"   eaten={Math.round(logSummary.carbs || 0)}   target={profile.macros?.carbsG || 1}   color={COLORS.warning} />
            <MacroBar label="Fat"     eaten={Math.round(logSummary.fat || 0)}     target={profile.macros?.fatG || 1}     color="#9C27B0" />
          </View>
        )}

        {/* ── CraveFit USP Card ────────────────────────────────── */}
        <TouchableOpacity style={s.uspCard} onPress={() => navigation.navigate('Craving')} activeOpacity={0.85}>
          <View style={s.uspLeft}>
            <Text style={s.uspBadge}>CraveFit</Text>
            <Text style={s.uspTitle}>Log a Craving</Text>
            <Text style={s.uspSub}>We'll rebalance your week{'\n'}so you never blow your budget.</Text>
            <View style={s.uspBtn}>
              <Text style={s.uspBtnText}>Log Now  →</Text>
            </View>
          </View>
          <Text style={s.uspEmoji}>🍔</Text>
        </TouchableOpacity>

        {/* ── Steps + Cheat row ────────────────────────────────── */}
        <View style={s.gridRow}>
          <TouchableOpacity style={[s.gridCard, s.stepsCard]} onPress={() => setStepsModal(true)} activeOpacity={0.85}>
            <Text style={s.gridCardLabel}>Steps</Text>
            <Text style={s.stepsValue}>{(stepsData.steps || 0).toLocaleString()}</Text>
            <Text style={s.stepsGoal}>Goal: 10,000 steps</Text>
            <View style={s.stepsBarTrack}>
              <View style={[s.stepsBarFill, { width: `${Math.min(((stepsData.steps || 0) / 10000) * 100, 100)}%` }]} />
            </View>
            <Text style={s.stepsCalText}>+{burned} kcal burned</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[s.gridCard, s.exerciseCard]} onPress={() => navigation.navigate('Craving')} activeOpacity={0.85}>
            <Text style={s.gridCardLabel}>Craving Budget</Text>
            <Text style={s.exerciseValue}>
              {logSummary.cheatCalories > 0
                ? `${Math.round(logSummary.cheatCalories)} kcal`
                : '0 kcal'}
            </Text>
            <Text style={s.exerciseSub}>of {Math.round(target * 0.3)} kcal limit</Text>
            <View style={s.stepsBarTrack}>
              <View style={[s.stepsBarFill, {
                width: `${Math.min(((logSummary.cheatCalories || 0) / (target * 0.3)) * 100, 100)}%`,
                backgroundColor: COLORS.primary,
              }]} />
            </View>
            {stepsData.needsCompensation && (
              <Text style={s.warnText}>Eat {stepsData.compensationNeeded} kcal more</Text>
            )}
          </TouchableOpacity>
        </View>

        {/* ── Week Strip ───────────────────────────────────────── */}
        {plan && (
          <View style={s.card}>
            <Text style={s.cardLabel}>This Week</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 10 }}>
              {plan.days.map((day, i) => (
                <TouchableOpacity
                  key={i}
                  style={[s.dayChip, i === todayIdx && s.dayChipToday, day.completed && s.dayChipDone]}
                  onPress={() => navigation.navigate('Plan', { dayIndex: i })}
                >
                  <Text style={[s.dayChipDay, (i === todayIdx) && s.dayChipDayActive]}>{DAY_SHORT[i]}</Text>
                  <Text style={[s.dayChipCal, (i === todayIdx) && s.dayChipDayActive]}>
                    {day.totalCalories || day.targetCalories}
                  </Text>
                  {day.rebalanced && <View style={s.rebalancedDot} />}
                  {day.completed   && <Text style={s.doneCheck}>✓</Text>}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        {/* ── Today's Meals ────────────────────────────────────── */}
        {todayPlan && (
          <View style={s.card}>
            <View style={s.cardRow}>
              <Text style={s.cardLabel}>Today's Meals</Text>
              <Text style={s.cardSub}>{todayPlan.totalCalories || todayPlan.targetCalories} kcal</Text>
            </View>
            {todayPlan.meals?.map((meal, i) => (
              <MealRow key={i} meal={meal} onLogged={load} />
            ))}
          </View>
        )}

        {/* ── Diary quick link ─────────────────────────────────── */}
        <TouchableOpacity style={s.diaryBtn} onPress={() => navigation.navigate('Diary')}>
          <Text style={s.diaryBtnText}>Open Food Diary  →</Text>
        </TouchableOpacity>

        <View style={{ height: 32 }} />
      </ScrollView>

      {/* ── Log Steps Modal ──────────────────────────────────── */}
      <Modal visible={stepsModal} transparent animationType="slide">
        <View style={s.modalOverlay}>
          <View style={s.modalBox}>
            <Text style={s.modalTitle}>Log Today's Steps</Text>
            <TextInput
              style={s.modalInput}
              placeholder="e.g. 8500"
              placeholderTextColor={COLORS.muted}
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
    </View>
  );
}

// ── CalorieRing ──────────────────────────────────────────────────────────────

function CalorieRing({ remaining, goal, isOver }) {
  const size = 150;
  const r    = 58;
  const cx   = size / 2;
  const cy   = size / 2;
  const stroke      = 13;
  const circumference = 2 * Math.PI * r;
  const pct    = goal > 0 ? Math.min((goal - remaining) / goal, 1) : 0;
  const filled = pct * circumference;
  const color  = isOver ? COLORS.danger : COLORS.blue;

  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      <Svg width={size} height={size} style={{ position: 'absolute' }}>
        {/* track */}
        <Circle cx={cx} cy={cy} r={r} fill="none"
          stroke={COLORS.border} strokeWidth={stroke} />
        {/* fill */}
        <Circle cx={cx} cy={cy} r={r} fill="none"
          stroke={color} strokeWidth={stroke}
          strokeDasharray={`${filled} ${circumference - filled}`}
          strokeDashoffset={circumference * 0.25}
          strokeLinecap="round"
        />
      </Svg>
      <Text style={[s.ringNumber, isOver && { color: COLORS.danger }]}>
        {remaining.toLocaleString()}
      </Text>
      <Text style={s.ringLabel}>Remaining</Text>
    </View>
  );
}

// ── CalorieStat ──────────────────────────────────────────────────────────────

function CalorieStat({ icon, label, value }) {
  return (
    <View style={s.calorieStat}>
      <Text style={s.calorieStatIcon}>{icon}</Text>
      <View>
        <Text style={s.calorieStatLabel}>{label}</Text>
        <Text style={s.calorieStatValue}>{value}</Text>
      </View>
    </View>
  );
}

// ── MacroBar ─────────────────────────────────────────────────────────────────

function MacroBar({ label, eaten, target, color }) {
  const pct = target > 0 ? Math.min((eaten / target) * 100, 100) : 0;
  return (
    <View style={s.macroRow}>
      <Text style={s.macroLabel}>{label}</Text>
      <View style={s.macroTrack}>
        <View style={[s.macroFill, { width: `${pct}%`, backgroundColor: color }]} />
      </View>
      <Text style={s.macroValue}>{eaten}<Text style={s.macroTarget}>/{target}g</Text></Text>
    </View>
  );
}

// ── MealRow ──────────────────────────────────────────────────────────────────

function MealRow({ meal, onLogged }) {
  const [logging, setLogging] = useState(false);

  const handleLog = async () => {
    setLogging(true);
    try {
      const uid   = await getUserId();
      const items = meal.items?.length ? meal.items : [meal];
      for (const item of items) {
        await logFood(uid, item.id || null, item.id ? null : {
          name: item.name, calories: item.calories,
          protein: item.protein, carbs: item.carbs, fat: item.fat,
        });
      }
      onLogged?.();
    } catch { /* silent */ }
    finally { setLogging(false); }
  };

  return (
    <View style={[s.mealRow, meal.isCheat && s.mealRowCheat]}>
      <View style={s.mealSlot}>
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

// ── Styles ───────────────────────────────────────────────────────────────────

const s = StyleSheet.create({
  screen:       { flex: 1, backgroundColor: COLORS.bg },
  center:       { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.bg },

  // Top Bar
  topBar:       { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 56, paddingBottom: 14 },
  avatar:       { width: 40, height: 40, borderRadius: 20, backgroundColor: '#4A4A7A', justifyContent: 'center', alignItems: 'center' },
  avatarText:   { fontSize: 16, fontWeight: '700', color: COLORS.text },
  topTitle:     { fontSize: 17, fontWeight: '600', color: COLORS.text },
  bellBtn:      { width: 40, height: 40, borderRadius: 20, backgroundColor: COLORS.surface, justifyContent: 'center', alignItems: 'center' },
  bellIcon:     { fontSize: 18 },

  // Calorie Card
  calorieCard:  { backgroundColor: COLORS.surface, marginHorizontal: 16, borderRadius: 16, padding: 20, marginBottom: 12 },
  calorieFormula:{ fontSize: 12, color: COLORS.muted, marginBottom: 16, textAlign: 'center' },
  calorieRow:   { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  ringNumber:   { fontSize: 28, fontWeight: '700', color: COLORS.blue, textAlign: 'center' },
  ringLabel:    { fontSize: 12, color: COLORS.muted, textAlign: 'center', marginTop: 2 },
  calorieStats: { flex: 1, paddingLeft: 20, gap: 2 },
  calorieStat:  { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 6 },
  calorieStatIcon:{ fontSize: 18 },
  calorieStatLabel:{ fontSize: 11, color: COLORS.muted },
  calorieStatValue:{ fontSize: 15, fontWeight: '700', color: COLORS.text, marginTop: 1 },
  statDivider:  { height: 1, backgroundColor: COLORS.border, marginLeft: 28 },

  // Generic card
  card:         { backgroundColor: COLORS.surface, marginHorizontal: 16, borderRadius: 16, padding: 16, marginBottom: 12 },
  cardLabel:    { fontSize: 14, fontWeight: '700', color: COLORS.text },
  cardSub:      { fontSize: 13, color: COLORS.muted },
  cardRow:      { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },

  // Macro bars
  macroRow:     { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 10 },
  macroLabel:   { fontSize: 13, color: COLORS.textSub, width: 52 },
  macroTrack:   { flex: 1, height: 7, backgroundColor: COLORS.border, borderRadius: 4, overflow: 'hidden' },
  macroFill:    { height: '100%', borderRadius: 4 },
  macroValue:   { fontSize: 13, fontWeight: '600', color: COLORS.text, width: 64, textAlign: 'right' },
  macroTarget:  { fontWeight: '400', color: COLORS.muted },

  // USP card
  uspCard:      { marginHorizontal: 16, borderRadius: 16, backgroundColor: '#1E1130', borderWidth: 1.5, borderColor: COLORS.primary + '60', padding: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 },
  uspLeft:      { flex: 1 },
  uspBadge:     { fontSize: 10, fontWeight: '700', color: COLORS.primary, backgroundColor: COLORS.primary + '20', alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6, marginBottom: 8, letterSpacing: 1 },
  uspTitle:     { fontSize: 18, fontWeight: '800', color: COLORS.text, marginBottom: 6 },
  uspSub:       { fontSize: 13, color: COLORS.muted, lineHeight: 19, marginBottom: 14 },
  uspBtn:       { backgroundColor: COLORS.primary, alignSelf: 'flex-start', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20 },
  uspBtnText:   { color: COLORS.text, fontWeight: '700', fontSize: 13 },
  uspEmoji:     { fontSize: 52, marginLeft: 12 },

  // Grid
  gridRow:      { flexDirection: 'row', gap: 12, marginHorizontal: 16, marginBottom: 12 },
  gridCard:     { flex: 1, backgroundColor: COLORS.surface, borderRadius: 16, padding: 16 },
  stepsCard:    { },
  exerciseCard: { },
  gridCardLabel:{ fontSize: 13, fontWeight: '700', color: COLORS.text, marginBottom: 6 },
  stepsValue:   { fontSize: 26, fontWeight: '700', color: COLORS.text },
  stepsGoal:    { fontSize: 11, color: COLORS.muted, marginTop: 2, marginBottom: 8 },
  stepsBarTrack:{ height: 6, backgroundColor: COLORS.border, borderRadius: 3, overflow: 'hidden', marginBottom: 8 },
  stepsBarFill: { height: '100%', backgroundColor: '#E85252', borderRadius: 3 },
  stepsCalText: { fontSize: 11, color: COLORS.muted },
  exerciseValue:{ fontSize: 22, fontWeight: '700', color: COLORS.primary },
  exerciseSub:  { fontSize: 11, color: COLORS.muted, marginBottom: 8 },
  warnText:     { fontSize: 11, color: COLORS.danger, fontWeight: '600', marginTop: 4 },

  // Week strip
  dayChip:      { width: 58, padding: 10, borderRadius: 12, backgroundColor: COLORS.cardAlt, marginRight: 8, alignItems: 'center', borderWidth: 1.5, borderColor: COLORS.border },
  dayChipToday: { borderColor: COLORS.blue, backgroundColor: COLORS.blue + '22' },
  dayChipDone:  { borderColor: COLORS.success, backgroundColor: COLORS.success + '15' },
  dayChipDay:   { fontSize: 12, fontWeight: '600', color: COLORS.muted },
  dayChipDayActive:{ color: COLORS.blue },
  dayChipCal:   { fontSize: 11, color: COLORS.muted, marginTop: 2 },
  rebalancedDot:{ width: 5, height: 5, borderRadius: 3, backgroundColor: COLORS.warning, marginTop: 3 },
  doneCheck:    { fontSize: 10, color: COLORS.success, marginTop: 2 },

  // Meal rows
  mealRow:      { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, borderTopWidth: 1, borderTopColor: COLORS.border },
  mealRowCheat: { borderTopColor: COLORS.primary + '40' },
  mealSlot:     { backgroundColor: COLORS.cardAlt, borderRadius: 6, paddingHorizontal: 7, paddingVertical: 3, marginRight: 10 },
  mealSlotText: { fontSize: 10, color: COLORS.muted, textTransform: 'uppercase', fontWeight: '600' },
  mealInfo:     { flex: 1 },
  mealName:     { fontSize: 14, fontWeight: '600', color: COLORS.text },
  mealMacros:   { fontSize: 11, color: COLORS.muted, marginTop: 2 },
  logMealBtn:   { width: 30, height: 30, borderRadius: 15, backgroundColor: COLORS.secondary + '25', justifyContent: 'center', alignItems: 'center' },
  logMealBtnText:{ color: COLORS.secondary, fontSize: 14, fontWeight: '700' },

  // Diary link
  diaryBtn:     { marginHorizontal: 16, marginBottom: 8, backgroundColor: COLORS.surface, borderRadius: 12, padding: 14, alignItems: 'center' },
  diaryBtnText: { color: COLORS.blue, fontWeight: '600', fontSize: 14 },

  // Modal
  modalOverlay: { flex: 1, backgroundColor: '#00000088', justifyContent: 'flex-end' },
  modalBox:     { backgroundColor: COLORS.surface, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, paddingBottom: 40 },
  modalTitle:   { fontSize: 18, fontWeight: '700', color: COLORS.text, marginBottom: 16 },
  modalInput:   { borderWidth: 1.5, borderColor: COLORS.border, borderRadius: 12, padding: 14, fontSize: 18, color: COLORS.text, marginBottom: 16, backgroundColor: COLORS.cardAlt },
  modalBtns:    { flexDirection: 'row', gap: 12 },
  modalCancel:  { flex: 1, padding: 14, borderRadius: 12, backgroundColor: COLORS.cardAlt, alignItems: 'center' },
  modalCancelText:{ color: COLORS.muted, fontWeight: '600', fontSize: 15 },
  modalConfirm: { flex: 1, padding: 14, borderRadius: 12, backgroundColor: COLORS.primary, alignItems: 'center' },
  modalConfirmText:{ color: COLORS.text, fontWeight: '700', fontSize: 15 },
});
