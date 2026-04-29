import React, { useEffect, useState, useCallback } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
  ActivityIndicator, RefreshControl, Modal, Alert,
} from 'react-native';
import { getUserId, getWeekPlan, regeneratePlan, completeDay, getFoodLog, getAlternatives, swapMealItem, logFood } from '../services/api';
import { COLORS } from '../utils/colors';

const DAY_NAMES = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'];
const DAY_SHORT = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];

const SLOT_COLORS = {
  breakfast: '#F59E0B',
  lunch:     '#10B981',
  dinner:    '#6366F1',
  snack:     '#EC4899',
  craving:   COLORS.primary,
};

function getTodayIndex() {
  const d = new Date().getDay();
  return d === 0 ? 6 : d - 1;
}

export default function WeeklyPlanScreen({ navigation, route }) {
  const [plan, setPlan]         = useState(null);
  const [log, setLog]           = useState({ summary: {} });
  const [loading, setLoading]   = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeDay, setActiveDay]   = useState(route.params?.dayIndex ?? getTodayIndex());

  const load = useCallback(async () => {
    const uid = await getUserId();
    if (!uid) return;
    const today = new Date().toISOString().split('T')[0];
    const [p, l] = await Promise.all([getWeekPlan(uid), getFoodLog(uid, today)]);
    setPlan(p);
    setLog(l);
  }, []);

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

  async function handleRegenerate() {
    Alert.alert('Regenerate Plan', 'This will rebuild all meals for the week. Continue?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Regenerate', onPress: async () => {
          setLoading(true);
          const uid = await getUserId();
          const p = await regeneratePlan(uid);
          setPlan(p);
          setLoading(false);
        },
      },
    ]);
  }

  async function handleCompleteDay(i) {
    const uid = await getUserId();
    await completeDay(uid, i);
    load();
  }

  if (loading) {
    return (
      <View style={s.center}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  const day        = plan?.days?.[activeDay];
  const logSummary = log.summary || {};
  const todayIdx   = getTodayIndex();

  const weeklyActual = plan?.days?.reduce(
    (acc, d) => ({
      calories: acc.calories + (d.totalCalories || 0),
      protein:  acc.protein  + (d.totalProtein  || 0),
      carbs:    acc.carbs    + (d.totalCarbs    || 0),
      fat:      acc.fat      + (d.totalFat      || 0),
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0 }
  );

  return (
    <View style={s.screen}>

      {/* ── Header ──────────────────────────────────────────────── */}
      <View style={s.header}>
        <Text style={s.headerTitle}>Weekly Plan</Text>
        <TouchableOpacity onPress={handleRegenerate} style={s.regenBtn}>
          <Text style={s.regenText}>↺  Regenerate</Text>
        </TouchableOpacity>
      </View>

      {/* ── Day Selector ────────────────────────────────────────── */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={s.dayStrip}
        contentContainerStyle={s.dayStripContent}
      >
        {plan?.days?.map((d, i) => {
          const isActive    = i === activeDay;
          const isToday     = i === todayIdx;
          const slotColor   = isToday ? COLORS.blue : COLORS.primary;
          return (
            <TouchableOpacity
              key={i}
              style={[s.dayTab, isActive && s.dayTabActive]}
              onPress={() => setActiveDay(i)}
              activeOpacity={0.75}
            >
              <Text style={[s.dayTabShort, isActive && s.dayTabShortActive]}>
                {DAY_SHORT[i]}
              </Text>
              <Text style={[s.dayTabCal, isActive && s.dayTabCalActive]}>
                {(d.totalCalories || d.targetCalories)?.toLocaleString()}
              </Text>
              {isToday && !d.completed && (
                <View style={s.todayDot} />
              )}
              {d.completed && (
                <Text style={s.doneCheck}>✓</Text>
              )}
              {d.rebalanced && !d.completed && (
                <Text style={s.rebalancedMark}>↺</Text>
              )}
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* ── Day Detail ──────────────────────────────────────────── */}
      <ScrollView
        style={s.scroll}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.muted} />}
      >
        {day && (
          <>
            {/* Day title + status */}
            <View style={s.dayTitleRow}>
              <View>
                <Text style={s.dayName}>{DAY_NAMES[activeDay]}</Text>
                {activeDay === todayIdx && <Text style={s.todayLabel}>Today</Text>}
              </View>
              <View style={s.dayBadges}>
                {day.rebalanced && (
                  <View style={s.rebalancedBadge}>
                    <Text style={s.rebalancedBadgeText}>↺ Rebalanced</Text>
                  </View>
                )}
                {day.completed && (
                  <View style={s.completedBadge}>
                    <Text style={s.completedBadgeText}>✓ Done</Text>
                  </View>
                )}
              </View>
            </View>

            {/* Macro summary chips */}
            <View style={s.macroRow}>
              <MacroChip label="Calories" value={day.totalCalories || day.targetCalories} target={day.targetCalories} unit="kcal" color={COLORS.blue} />
              <MacroChip label="Protein"  value={day.totalProtein  || day.targetProtein}  target={day.targetProtein}  unit="g"    color={COLORS.secondary} />
              <MacroChip label="Carbs"    value={day.totalCarbs    || day.targetCarbs}    target={day.targetCarbs}    unit="g"    color={COLORS.warning} />
              <MacroChip label="Fat"      value={day.totalFat      || day.targetFat}      target={day.targetFat}      unit="g"    color="#9C27B0" />
            </View>

            {/* Logged today banner */}
            {activeDay === todayIdx && logSummary.calories > 0 && (
              <View style={s.loggedBanner}>
                <Text style={s.loggedBannerTitle}>Logged today</Text>
                <View style={s.loggedMacroRow}>
                  <LoggedMacro label="kcal"    value={Math.round(logSummary.calories)} color={COLORS.blue} />
                  <LoggedMacro label="protein" value={`${Math.round(logSummary.protein)}g`} color={COLORS.secondary} />
                  <LoggedMacro label="carbs"   value={`${Math.round(logSummary.carbs)}g`}   color={COLORS.warning} />
                  <LoggedMacro label="fat"     value={`${Math.round(logSummary.fat)}g`}     color="#9C27B0" />
                </View>
                {logSummary.cheatCalories > 0 && (
                  <Text style={s.cheatNote}>🍔 {Math.round(logSummary.cheatCalories)} cheat kcal logged</Text>
                )}
              </View>
            )}

            {/* Weekly summary card */}
            {plan && (
              <View style={s.weekCard}>
                <Text style={s.weekCardTitle}>This Week</Text>
                <WeekBar label="Calories" actual={weeklyActual.calories} target={plan.weeklyTargetCalories} unit="kcal" color={COLORS.blue} />
                <WeekBar label="Protein"  actual={weeklyActual.protein}  target={plan.weeklyTargetProtein}  unit="g"    color={COLORS.secondary} />
                <WeekBar label="Carbs"    actual={weeklyActual.carbs}    target={plan.weeklyTargetCarbs}    unit="g"    color={COLORS.warning} />
                <WeekBar label="Fat"      actual={weeklyActual.fat}      target={plan.weeklyTargetFat}      unit="g"    color="#9C27B0" />
              </View>
            )}

            {/* Meals */}
            <Text style={s.sectionTitle}>Meals</Text>
            {day.meals?.length > 0
              ? day.meals.map((meal, i) => (
                  <MealCard key={i} meal={meal} dayIndex={activeDay} onSwapDone={load} onLogMeal={load} />
                ))
              : (
                <View style={s.emptyDay}>
                  <Text style={s.emptyIcon}>{day.planStale ? '⚡' : '🍽️'}</Text>
                  <Text style={s.emptyText}>
                    {day.planStale
                      ? 'Day rebalanced. Tap Regenerate to get fresh meals.'
                      : 'No meals planned yet.'}
                  </Text>
                  <Text style={s.emptyTargetText}>
                    Target: {day.targetCalories} kcal · P {day.targetProtein}g · C {day.targetCarbs}g · F {day.targetFat}g
                  </Text>
                </View>
              )
            }

            {/* Action row */}
            <View style={s.actionRow}>
              <TouchableOpacity style={s.actionBtn} onPress={() => navigation.navigate('Diary')}>
                <Text style={s.actionBtnIcon}>📋</Text>
                <Text style={s.actionBtnText}>Log Food</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[s.actionBtn, s.actionBtnOrange]} onPress={() => navigation.navigate('Craving')}>
                <Text style={s.actionBtnIcon}>🍔</Text>
                <Text style={s.actionBtnText}>Craving</Text>
              </TouchableOpacity>
              {!day.completed && (
                <TouchableOpacity style={[s.actionBtn, s.actionBtnGreen]} onPress={() => handleCompleteDay(activeDay)}>
                  <Text style={s.actionBtnIcon}>✓</Text>
                  <Text style={s.actionBtnText}>Done</Text>
                </TouchableOpacity>
              )}
            </View>
          </>
        )}
        <View style={{ height: 32 }} />
      </ScrollView>
    </View>
  );
}

// ── WeekBar ───────────────────────────────────────────────────────────────────

function WeekBar({ label, actual, target, unit, color }) {
  const pct = target > 0 ? Math.min((actual / target) * 100, 100) : 0;
  return (
    <View style={s.weekBarRow}>
      <Text style={s.weekBarLabel}>{label}</Text>
      <View style={s.weekBarTrack}>
        <View style={[s.weekBarFill, { width: `${pct}%`, backgroundColor: color }]} />
      </View>
      <Text style={s.weekBarValue}>
        <Text style={{ color }}>{actual?.toLocaleString()}</Text>
        <Text style={s.weekBarTarget}>/{target?.toLocaleString()}{unit}</Text>
      </Text>
    </View>
  );
}

// ── MacroChip ─────────────────────────────────────────────────────────────────

function MacroChip({ label, value, target, unit, color }) {
  const pct = target ? Math.min(Math.round((value / target) * 100), 100) : 0;
  return (
    <View style={s.macroChip}>
      <Text style={[s.macroChipValue, { color }]}>
        {value}<Text style={s.macroChipUnit}>{unit}</Text>
      </Text>
      <Text style={s.macroChipLabel}>{label}</Text>
      <View style={s.macroChipTrack}>
        <View style={[s.macroChipFill, { width: `${pct}%`, backgroundColor: color }]} />
      </View>
    </View>
  );
}

// ── LoggedMacro ───────────────────────────────────────────────────────────────

function LoggedMacro({ label, value, color }) {
  return (
    <View style={s.loggedMacro}>
      <Text style={[s.loggedMacroValue, { color }]}>{value}</Text>
      <Text style={s.loggedMacroLabel}>{label}</Text>
    </View>
  );
}

// ── MealCard ──────────────────────────────────────────────────────────────────

function MealCard({ meal, dayIndex, onSwapDone, onLogMeal }) {
  const [expanded, setExpanded] = useState(false);
  const [swapState, setSwapState] = useState({ visible: false, itemIndex: -1, alts: [], loading: false });
  const [logging, setLogging]     = useState(false);

  const slotColor = SLOT_COLORS[meal.slot] || COLORS.muted;

  const openSwap = async (item, itemIndex) => {
    setSwapState(prev => ({ ...prev, visible: true, itemIndex, loading: true, alts: [] }));
    try {
      const uid  = await getUserId();
      const alts = await getAlternatives(uid, item.id, item.calories, item.category);
      setSwapState(prev => ({ ...prev, alts, loading: false }));
    } catch {
      setSwapState(prev => ({ ...prev, loading: false }));
    }
  };

  const confirmSwap = async (newFood) => {
    setSwapState(prev => ({ ...prev, visible: false }));
    try {
      const uid = await getUserId();
      await swapMealItem(uid, dayIndex, meal.slot, swapState.itemIndex, newFood.id, meal.items[swapState.itemIndex]?.calories);
      onSwapDone?.();
    } catch (e) {
      Alert.alert('Swap failed', e.message);
    }
  };

  const handleLogMeal = async () => {
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
      Alert.alert('Logged!', `${meal.name} added to your diary.`);
      onLogMeal?.();
    } catch (e) {
      Alert.alert('Error', e.message);
    } finally {
      setLogging(false);
    }
  };

  return (
    <View style={[s.mealCard, meal.isCheat && s.mealCardCheat]}>
      {/* Slot colour bar */}
      <View style={[s.mealSlotBar, { backgroundColor: slotColor }]} />

      <View style={s.mealCardInner}>
        {/* Header row */}
        <TouchableOpacity onPress={() => setExpanded(e => !e)} activeOpacity={0.8} style={s.mealCardHeader}>
          <View style={s.mealSlotBadge}>
            <Text style={[s.mealSlotText, { color: slotColor }]}>
              {meal.slot.toUpperCase()}
            </Text>
          </View>
          {meal.isCheat && (
            <View style={s.cheatBadge}>
              <Text style={s.cheatBadgeText}>🍔 Craving</Text>
            </View>
          )}
          <Text style={s.expandIcon}>{expanded ? '▲' : '▼'}</Text>
        </TouchableOpacity>

        {/* Meal name */}
        <Text style={s.mealName} numberOfLines={expanded ? undefined : 2}>{meal.name}</Text>

        {/* Macro tags */}
        <View style={s.mealMacroRow}>
          <MacroTag icon="🔥" value={`${meal.calories} kcal`} />
          <MacroTag icon="🥩" value={`P ${meal.protein}g`} />
          <MacroTag icon="🌾" value={`C ${meal.carbs}g`} />
          <MacroTag icon="🧈" value={`F ${meal.fat}g`} />
        </View>

        {/* Log button */}
        <TouchableOpacity style={s.logMealBtn} onPress={handleLogMeal} disabled={logging}>
          {logging
            ? <ActivityIndicator size="small" color={COLORS.secondary} />
            : <Text style={s.logMealBtnText}>✓  Log this meal</Text>
          }
        </TouchableOpacity>

        {/* Expanded items list */}
        {expanded && meal.items?.length > 0 && (
          <View style={s.itemsList}>
            <Text style={s.itemsListTitle}>Ingredients</Text>
            {meal.items.map((item, i) => (
              <View key={i} style={s.itemRow}>
                <View style={s.itemDot} />
                <View style={{ flex: 1 }}>
                  <Text style={s.itemName}>{item.name}</Text>
                  <Text style={s.itemServing}>
                    {item.servingDisplay || `${item.serving} ${item.unit}`} · {item.calories} kcal
                  </Text>
                </View>
                <TouchableOpacity style={s.swapBtn} onPress={() => openSwap(item, i)}>
                  <Text style={s.swapBtnText}>⇄ Swap</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}
      </View>

      {/* Swap modal */}
      <Modal visible={swapState.visible} transparent animationType="slide">
        <View style={s.modalOverlay}>
          <View style={s.modalBox}>
            <Text style={s.modalTitle}>Choose a swap</Text>
            <Text style={s.modalSub}>Similar calories & macros</Text>
            {swapState.loading
              ? <ActivityIndicator size="large" color={COLORS.primary} style={{ marginVertical: 24 }} />
              : swapState.alts.length === 0
              ? <Text style={s.noAlts}>No alternatives found.</Text>
              : swapState.alts.map((alt, i) => (
                <TouchableOpacity key={i} style={s.altRow} onPress={() => confirmSwap(alt)}>
                  <View style={{ flex: 1 }}>
                    <Text style={s.altName}>{alt.name}</Text>
                    <Text style={s.altMeta}>{alt.calories} kcal · P {alt.protein}g · C {alt.carbs}g · F {alt.fat}g</Text>
                  </View>
                  <View style={s.altPickBtn}>
                    <Text style={s.altPickBtnText}>Swap</Text>
                  </View>
                </TouchableOpacity>
              ))
            }
            <TouchableOpacity style={s.modalCancelBtn} onPress={() => setSwapState(p => ({ ...p, visible: false }))}>
              <Text style={s.modalCancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

// ── MacroTag ──────────────────────────────────────────────────────────────────

function MacroTag({ icon, value }) {
  return (
    <View style={s.macroTag}>
      <Text style={s.macroTagText}>{icon} {value}</Text>
    </View>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────

const s = StyleSheet.create({
  screen:   { flex: 1, backgroundColor: COLORS.bg },
  center:   { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.bg },

  // Header
  header:       { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 56, paddingBottom: 16, backgroundColor: COLORS.surface, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  headerTitle:  { fontSize: 20, fontWeight: '800', color: COLORS.text },
  regenBtn:     { backgroundColor: COLORS.cardAlt, paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, borderWidth: 1, borderColor: COLORS.border },
  regenText:    { color: COLORS.textSub, fontSize: 13, fontWeight: '600' },

  // Day strip
  dayStrip:        { flexGrow: 0, backgroundColor: COLORS.surface, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  dayStripContent: { paddingHorizontal: 12, paddingVertical: 10, gap: 6, flexDirection: 'row' },
  dayTab:          { alignItems: 'center', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 12, backgroundColor: COLORS.cardAlt, minWidth: 58 },
  dayTabActive:    { backgroundColor: COLORS.primary + '25', borderWidth: 1.5, borderColor: COLORS.primary },
  dayTabShort:     { fontSize: 13, fontWeight: '700', color: COLORS.muted },
  dayTabShortActive:{ color: COLORS.primary },
  dayTabCal:       { fontSize: 11, color: COLORS.muted, marginTop: 2 },
  dayTabCalActive: { color: COLORS.primary },
  todayDot:        { width: 5, height: 5, borderRadius: 3, backgroundColor: COLORS.blue, marginTop: 3 },
  doneCheck:       { fontSize: 12, color: COLORS.success, marginTop: 2, fontWeight: '700' },
  rebalancedMark:  { fontSize: 11, color: COLORS.warning, marginTop: 2, fontWeight: '700' },

  // Scroll
  scroll: { flex: 1, paddingHorizontal: 16, paddingTop: 16 },

  // Day title
  dayTitleRow:   { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 },
  dayName:       { fontSize: 22, fontWeight: '800', color: COLORS.text },
  todayLabel:    { fontSize: 12, color: COLORS.blue, fontWeight: '600', marginTop: 2 },
  dayBadges:     { flexDirection: 'row', gap: 8 },
  rebalancedBadge:     { backgroundColor: COLORS.warning + '22', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20, borderWidth: 1, borderColor: COLORS.warning + '50' },
  rebalancedBadgeText: { fontSize: 12, color: COLORS.warning, fontWeight: '700' },
  completedBadge:      { backgroundColor: COLORS.success + '22', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20, borderWidth: 1, borderColor: COLORS.success + '50' },
  completedBadgeText:  { fontSize: 12, color: COLORS.success, fontWeight: '700' },

  // Macro chips row
  macroRow:      { flexDirection: 'row', gap: 8, marginBottom: 12 },
  macroChip:     { flex: 1, backgroundColor: COLORS.surface, borderRadius: 12, padding: 10, alignItems: 'center', borderWidth: 1, borderColor: COLORS.border },
  macroChipValue:{ fontSize: 14, fontWeight: '800', color: COLORS.text },
  macroChipUnit: { fontSize: 9, fontWeight: '400', color: COLORS.muted },
  macroChipLabel:{ fontSize: 10, color: COLORS.muted, marginTop: 2 },
  macroChipTrack:{ height: 3, width: '100%', backgroundColor: COLORS.border, borderRadius: 2, marginTop: 6, overflow: 'hidden' },
  macroChipFill: { height: '100%', borderRadius: 2 },

  // Logged today banner
  loggedBanner:    { backgroundColor: COLORS.secondary + '15', borderRadius: 14, padding: 14, marginBottom: 12, borderWidth: 1, borderColor: COLORS.secondary + '40' },
  loggedBannerTitle:{ fontSize: 11, fontWeight: '700', color: COLORS.secondary, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 8 },
  loggedMacroRow:  { flexDirection: 'row', justifyContent: 'space-around' },
  loggedMacro:     { alignItems: 'center' },
  loggedMacroValue:{ fontSize: 16, fontWeight: '800' },
  loggedMacroLabel:{ fontSize: 11, color: COLORS.muted, marginTop: 2 },
  cheatNote:       { fontSize: 12, color: COLORS.primary, fontWeight: '600', marginTop: 8, textAlign: 'center' },

  // Weekly summary card
  weekCard:      { backgroundColor: COLORS.surface, borderRadius: 14, padding: 14, marginBottom: 16, borderWidth: 1, borderColor: COLORS.border },
  weekCardTitle: { fontSize: 12, fontWeight: '700', color: COLORS.muted, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 10 },
  weekBarRow:    { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
  weekBarLabel:  { fontSize: 12, color: COLORS.textSub, width: 52 },
  weekBarTrack:  { flex: 1, height: 6, backgroundColor: COLORS.border, borderRadius: 3, overflow: 'hidden' },
  weekBarFill:   { height: '100%', borderRadius: 3 },
  weekBarValue:  { fontSize: 12, fontWeight: '600', color: COLORS.text, width: 90, textAlign: 'right' },
  weekBarTarget: { color: COLORS.muted, fontWeight: '400' },

  // Section title
  sectionTitle:  { fontSize: 15, fontWeight: '700', color: COLORS.text, marginBottom: 10 },

  // Meal card
  mealCard:       { backgroundColor: COLORS.surface, borderRadius: 14, marginBottom: 10, borderWidth: 1, borderColor: COLORS.border, overflow: 'hidden', flexDirection: 'row' },
  mealCardCheat:  { borderColor: COLORS.primary + '60' },
  mealSlotBar:    { width: 4 },
  mealCardInner:  { flex: 1, padding: 14 },
  mealCardHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
  mealSlotBadge:  { backgroundColor: COLORS.cardAlt, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  mealSlotText:   { fontSize: 11, fontWeight: '700', letterSpacing: 0.5 },
  cheatBadge:     { backgroundColor: COLORS.primary + '20', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  cheatBadgeText: { fontSize: 11, fontWeight: '700', color: COLORS.primary },
  expandIcon:     { marginLeft: 'auto', fontSize: 10, color: COLORS.muted },
  mealName:       { fontSize: 15, fontWeight: '700', color: COLORS.text, marginBottom: 10, lineHeight: 21 },
  mealMacroRow:   { flexDirection: 'row', gap: 6, flexWrap: 'wrap', marginBottom: 10 },
  macroTag:       { backgroundColor: COLORS.cardAlt, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  macroTagText:   { fontSize: 12, color: COLORS.textSub, fontWeight: '500' },
  logMealBtn:     { borderTopWidth: 1, borderTopColor: COLORS.border, paddingTop: 10, alignItems: 'center' },
  logMealBtnText: { color: COLORS.secondary, fontWeight: '700', fontSize: 13 },

  // Items list (expanded)
  itemsList:      { marginTop: 10, paddingTop: 10, borderTopWidth: 1, borderTopColor: COLORS.border },
  itemsListTitle: { fontSize: 11, fontWeight: '700', color: COLORS.muted, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 8 },
  itemRow:        { flexDirection: 'row', alignItems: 'center', paddingVertical: 6, gap: 8 },
  itemDot:        { width: 6, height: 6, borderRadius: 3, backgroundColor: COLORS.border },
  itemName:       { fontSize: 13, color: COLORS.text, fontWeight: '500' },
  itemServing:    { fontSize: 11, color: COLORS.muted, marginTop: 1 },
  swapBtn:        { backgroundColor: COLORS.primary + '20', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 8, borderWidth: 1, borderColor: COLORS.primary + '40' },
  swapBtnText:    { color: COLORS.primary, fontWeight: '700', fontSize: 12 },

  // Empty day
  emptyDay:       { backgroundColor: COLORS.surface, borderRadius: 14, padding: 24, alignItems: 'center', borderWidth: 1, borderColor: COLORS.border, marginBottom: 12 },
  emptyIcon:      { fontSize: 36, marginBottom: 10 },
  emptyText:      { fontSize: 14, color: COLORS.muted, textAlign: 'center', lineHeight: 20 },
  emptyTargetText:{ fontSize: 13, color: COLORS.primary, textAlign: 'center', marginTop: 8, fontWeight: '600' },

  // Action row
  actionRow:       { flexDirection: 'row', gap: 10, marginTop: 8 },
  actionBtn:       { flex: 1, backgroundColor: COLORS.surface, borderRadius: 14, paddingVertical: 14, alignItems: 'center', borderWidth: 1, borderColor: COLORS.border },
  actionBtnOrange: { backgroundColor: COLORS.primary + '20', borderColor: COLORS.primary + '60' },
  actionBtnGreen:  { backgroundColor: COLORS.success + '20', borderColor: COLORS.success + '60' },
  actionBtnIcon:   { fontSize: 20, marginBottom: 4 },
  actionBtnText:   { fontSize: 12, fontWeight: '700', color: COLORS.text },

  // Swap modal
  modalOverlay:    { flex: 1, backgroundColor: '#00000088', justifyContent: 'flex-end' },
  modalBox:        { backgroundColor: COLORS.surface, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, maxHeight: '70%', borderWidth: 1, borderColor: COLORS.border },
  modalTitle:      { fontSize: 18, fontWeight: '800', color: COLORS.text, marginBottom: 2 },
  modalSub:        { fontSize: 13, color: COLORS.muted, marginBottom: 16 },
  altRow:          { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  altName:         { fontSize: 14, fontWeight: '600', color: COLORS.text },
  altMeta:         { fontSize: 12, color: COLORS.muted, marginTop: 2 },
  altPickBtn:      { backgroundColor: COLORS.primary, paddingHorizontal: 14, paddingVertical: 8, borderRadius: 10 },
  altPickBtnText:  { color: COLORS.text, fontWeight: '700', fontSize: 13 },
  noAlts:          { color: COLORS.muted, textAlign: 'center', paddingVertical: 24, fontSize: 14 },
  modalCancelBtn:  { marginTop: 16, padding: 14, borderRadius: 14, backgroundColor: COLORS.cardAlt, alignItems: 'center' },
  modalCancelText: { color: COLORS.muted, fontWeight: '600', fontSize: 15 },
});
