import React, { useEffect, useState, useCallback } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
  ActivityIndicator, RefreshControl, Modal, Alert,
} from 'react-native';
import Svg, { Circle, G } from 'react-native-svg';
import { getUserId, getWeekPlan, regeneratePlan, completeDay, getFoodLog, getAlternatives, swapMealItem, logFood } from '../services/api';
import { COLORS } from '../utils/colors';

const DAY_NAMES  = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'];
const DAY_SHORT  = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];

export default function WeeklyPlanScreen({ navigation, route }) {
  const [plan, setPlan]       = useState(null);
  const [log, setLog]         = useState({ summary: {} });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeDay, setActiveDay]   = useState(route.params?.dayIndex ?? getTodayIndex());

  function getTodayIndex() {
    const d = new Date().getDay();
    return d === 0 ? 6 : d - 1;
  }

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
    setLoading(true);
    const uid = await getUserId();
    const p = await regeneratePlan(uid);
    setPlan(p);
    setLoading(false);
  }

  async function handleCompleteDay(i) {
    const uid = await getUserId();
    await completeDay(uid, i);
    load();
  }

  if (loading) return <View style={s.center}><ActivityIndicator size="large" color={COLORS.primary} /></View>;

  const day = plan?.days?.[activeDay];
  const logSummary = log.summary || {};

  // Weekly totals from plan
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
      <View style={s.header}>
        <Text style={s.headerTitle}>Weekly Plan</Text>
        <TouchableOpacity onPress={handleRegenerate} style={s.regenBtn}>
          <Text style={s.regenText}>Regenerate ↺</Text>
        </TouchableOpacity>
      </View>

      {/* Weekly macro summary */}
      {plan && (
        <View style={s.weekSummary}>
          <View style={s.weekMacroRow}>
            <WeekMacro label="Kcal" plan={plan.weeklyTargetCalories} actual={weeklyActual?.calories} color={COLORS.primary} />
            <WeekMacro label="Protein" plan={plan.weeklyTargetProtein} actual={weeklyActual?.protein} color={COLORS.secondary} unit="g" />
            <WeekMacro label="Carbs" plan={plan.weeklyTargetCarbs} actual={weeklyActual?.carbs} color={COLORS.warning} unit="g" />
            <WeekMacro label="Fat" plan={plan.weeklyTargetFat} actual={weeklyActual?.fat} color="#9C27B0" unit="g" />
          </View>
        </View>
      )}

      {/* Day strip */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={s.dayStrip}>
        {plan?.days?.map((d, i) => (
          <TouchableOpacity
            key={i}
            style={[s.dayTab, i === activeDay && s.dayTabActive, d.completed && s.dayTabDone]}
            onPress={() => setActiveDay(i)}
          >
            <Text style={[s.dayTabLabel, i === activeDay && s.dayTabLabelActive]}>{DAY_SHORT[i]}</Text>
            <Text style={[s.dayTabCal, i === activeDay && s.dayTabCalActive]}>
              {d.totalCalories || d.targetCalories}
            </Text>
            {d.rebalanced && !d.completed && <View style={s.rebalancedPill}><Text style={s.rebalancedText}>↺</Text></View>}
            {d.completed && <Text style={s.doneCheck}>✓</Text>}
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Day detail */}
      <ScrollView
        style={s.dayDetail}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {day && (
          <>
            <View style={s.dayHeader}>
              <Text style={s.dayName}>{DAY_NAMES[activeDay]}</Text>
              {day.rebalanced && (
                <View style={s.rebalancedBadge}>
                  <Text style={s.rebalancedBadgeText}>↺ Rebalanced</Text>
                </View>
              )}
            </View>

            {/* Daily macro bar — plan vs logged */}
            <View style={s.macroBar}>
              <MacroChip label="Calories" value={day.totalCalories || day.targetCalories} target={day.targetCalories} unit="kcal" color={COLORS.primary} />
              <MacroChip label="Protein"  value={day.totalProtein  || day.targetProtein}  target={day.targetProtein}  unit="g"    color={COLORS.secondary} />
              <MacroChip label="Carbs"    value={day.totalCarbs    || day.targetCarbs}    target={day.targetCarbs}    unit="g"    color={COLORS.warning} />
              <MacroChip label="Fat"      value={day.totalFat      || day.targetFat}      target={day.targetFat}      unit="g"    color="#9C27B0" />
            </View>

            {/* Today's logged vs plan */}
            {activeDay === getTodayIndex() && logSummary.calories > 0 && (
              <View style={s.loggedCard}>
                <Text style={s.loggedTitle}>Logged Today</Text>
                <Text style={s.loggedMacros}>
                  {Math.round(logSummary.calories)} kcal · P {Math.round(logSummary.protein)}g · C {Math.round(logSummary.carbs)}g · F {Math.round(logSummary.fat)}g
                </Text>
                {logSummary.cheatCalories > 0 && (
                  <Text style={s.loggedCheat}>🍔 {Math.round(logSummary.cheatCalories)} cheat kcal</Text>
                )}
              </View>
            )}

            {/* Meals */}
            {day.meals?.length > 0
              ? day.meals.map((meal, i) => <MealCard key={i} meal={meal} dayIndex={activeDay} onSwapDone={load} onLogMeal={load} />)
              : (
                <View style={s.emptyDay}>
                  <Text style={s.emptyDayText}>
                    {day.planStale
                      ? '⚡ Rebalanced day. Tap Regenerate for fresh meals.'
                      : 'No meals planned yet.'}
                  </Text>
                  <Text style={s.emptyTarget}>
                    Target: {day.targetCalories} kcal · P {day.targetProtein}g · C {day.targetCarbs}g · F {day.targetFat}g
                  </Text>
                </View>
              )
            }

            {/* Actions */}
            <View style={s.actionRow}>
              <TouchableOpacity style={s.logFoodBtn} onPress={() => navigation.navigate('FoodLog')}>
                <Text style={s.logFoodBtnText}>📋 Log Food</Text>
              </TouchableOpacity>
              <TouchableOpacity style={s.cravingMiniBtn} onPress={() => navigation.navigate('Craving')}>
                <Text style={s.cravingMiniBtnText}>🍔 Log Craving</Text>
              </TouchableOpacity>
              {!day.completed && (
                <TouchableOpacity style={s.completeBtn} onPress={() => handleCompleteDay(activeDay)}>
                  <Text style={s.completeBtnText}>Done ✓</Text>
                </TouchableOpacity>
              )}
            </View>
          </>
        )}
      </ScrollView>
    </View>
  );
}

function WeekMacro({ label, plan, actual, color, unit = '' }) {
  const pct = plan > 0 ? Math.min(Math.round((actual / plan) * 100), 100) : 0;
  return (
    <View style={s.weekMacro}>
      <Text style={[s.weekMacroValue, { color }]}>{actual?.toLocaleString()}<Text style={s.weekMacroUnit}>{unit}</Text></Text>
      <Text style={s.weekMacroLabel}>{label}</Text>
      <View style={s.weekMacroTrack}>
        <View style={[s.weekMacroFill, { width: `${pct}%`, backgroundColor: color }]} />
      </View>
      <Text style={s.weekMacroPlan}>plan: {plan?.toLocaleString()}{unit}</Text>
    </View>
  );
}

function MacroChip({ label, value, target, unit, color }) {
  const pct = target ? Math.min(Math.round((value / target) * 100), 100) : 0;
  return (
    <View style={s.macroChip}>
      <Text style={[s.macroValue, { color }]}>{value}<Text style={s.macroUnit}>{unit}</Text></Text>
      <Text style={s.macroLabel}>{label}</Text>
      <View style={s.macroTrack}>
        <View style={[s.macroFill, { width: `${pct}%`, backgroundColor: color }]} />
      </View>
    </View>
  );
}

function MealCard({ meal, dayIndex, onSwapDone, onLogMeal }) {
  const [expanded, setExpanded] = useState(false);
  const [swapState, setSwapState] = useState({ visible: false, itemIndex: -1, alts: [], loading: false });
  const [logging, setLogging]   = useState(false);

  const openSwap = async (item, itemIndex) => {
    setSwapState(s => ({ ...s, visible: true, itemIndex, loading: true, alts: [] }));
    try {
      const uid  = await getUserId();
      const alts = await getAlternatives(uid, item.id, item.calories, item.category);
      setSwapState(s => ({ ...s, alts, loading: false }));
    } catch {
      setSwapState(s => ({ ...s, loading: false }));
    }
  };

  const confirmSwap = async (newFood) => {
    setSwapState(s => ({ ...s, visible: false }));
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
      const uid = await getUserId();
      // Log each item in the meal
      const items = meal.items?.length ? meal.items : [meal];
      for (const item of items) {
        await logFood(uid, item.id || null, item.id ? null : { name: item.name, calories: item.calories, protein: item.protein, carbs: item.carbs, fat: item.fat });
      }
      Alert.alert('Logged!', `${meal.name} added to your food log.`);
      onLogMeal?.();
    } catch (e) {
      Alert.alert('Error', e.message);
    } finally {
      setLogging(false);
    }
  };

  return (
    <View style={[s.mealCard, meal.isCheat && s.mealCardCheat]}>
      <TouchableOpacity onPress={() => setExpanded(e => !e)} activeOpacity={0.8}>
        <View style={s.mealCardHeader}>
          <Text style={s.mealCardSlot}>{meal.slot}</Text>
          {meal.isCheat && <Text style={s.cheatLabel}>Craving 🍔</Text>}
          <Text style={s.expandIcon}>{expanded ? '▲' : '▼'}</Text>
        </View>
        <Text style={s.mealCardName} numberOfLines={expanded ? undefined : 1}>{meal.name}</Text>
        <View style={s.mealCardMacros}>
          <MacroTag label="kcal" value={meal.calories} />
          <MacroTag label="P" value={`${meal.protein}g`} />
          <MacroTag label="C" value={`${meal.carbs}g`} />
          <MacroTag label="F" value={`${meal.fat}g`} />
        </View>
      </TouchableOpacity>

      {/* Log this meal */}
      <TouchableOpacity style={s.logMealBtn} onPress={handleLogMeal} disabled={logging}>
        {logging
          ? <ActivityIndicator size="small" color={COLORS.secondary} />
          : <Text style={s.logMealBtnText}>✓ Log this meal</Text>
        }
      </TouchableOpacity>

      {/* Expanded: items with swap buttons */}
      {expanded && meal.items?.length > 0 && (
        <View style={s.itemsList}>
          {meal.items.map((item, i) => (
            <View key={i} style={s.itemRow}>
              <View style={{ flex: 1 }}>
                <Text style={s.itemName}>{item.name}</Text>
                <Text style={s.itemServing}>{item.servingDisplay || `${item.serving} ${item.unit}`} · {item.calories} kcal</Text>
              </View>
              <TouchableOpacity style={s.swapBtn} onPress={() => openSwap(item, i)}>
                <Text style={s.swapBtnText}>⇄ Swap</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      )}

      {/* Swap alternatives modal */}
      <Modal visible={swapState.visible} transparent animationType="slide">
        <View style={s.modalOverlay}>
          <View style={s.modalBox}>
            <Text style={s.modalTitle}>Choose a swap</Text>
            <Text style={s.modalSub}>Similar calories & macros</Text>
            {swapState.loading
              ? <ActivityIndicator size="large" color={COLORS.primary} style={{ marginVertical: 24 }} />
              : swapState.alts.length === 0
              ? <Text style={s.noAlts}>No alternatives found for this item.</Text>
              : swapState.alts.map((alt, i) => (
                <TouchableOpacity key={i} style={s.altRow} onPress={() => confirmSwap(alt)}>
                  <View style={{ flex: 1 }}>
                    <Text style={s.altName}>{alt.name}</Text>
                    <Text style={s.altMeta}>{alt.calories} kcal · P {alt.protein}g · C {alt.carbs}g · F {alt.fat}g</Text>
                  </View>
                  <Text style={s.altArrow}>→</Text>
                </TouchableOpacity>
              ))
            }
            <TouchableOpacity style={s.modalCancel} onPress={() => setSwapState(s => ({ ...s, visible: false }))}>
              <Text style={s.modalCancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

function MacroTag({ label, value }) {
  return (
    <View style={s.macroTag}>
      <Text style={s.macroTagLabel}>{label} </Text>
      <Text style={s.macroTagValue}>{value}</Text>
    </View>
  );
}

const s = StyleSheet.create({
  screen:             { flex: 1, backgroundColor: COLORS.screenBg },
  center:             { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header:             { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, paddingTop: 52, backgroundColor: COLORS.primary },
  headerTitle:        { fontSize: 20, fontWeight: '700', color: COLORS.white },
  regenBtn:           { backgroundColor: COLORS.white + '25', paddingHorizontal: 12, paddingVertical: 7, borderRadius: 20 },
  regenText:          { color: COLORS.white, fontSize: 13, fontWeight: '600' },
  weekSummary:        { backgroundColor: COLORS.primary + 'DD', paddingHorizontal: 12, paddingBottom: 14, paddingTop: 4 },
  weekMacroRow:       { flexDirection: 'row', gap: 8 },
  weekMacro:          { flex: 1, alignItems: 'center' },
  weekMacroValue:     { fontSize: 14, fontWeight: '700' },
  weekMacroUnit:      { fontSize: 9, fontWeight: '400' },
  weekMacroLabel:     { fontSize: 9, color: COLORS.white + 'BB', marginTop: 1 },
  weekMacroTrack:     { height: 3, width: '100%', backgroundColor: COLORS.white + '30', borderRadius: 2, marginTop: 3, overflow: 'hidden' },
  weekMacroFill:      { height: '100%', borderRadius: 2 },
  weekMacroPlan:      { fontSize: 9, color: COLORS.white + '80', marginTop: 2 },
  dayStrip:           { flexGrow: 0, backgroundColor: COLORS.white, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  dayTab:             { paddingHorizontal: 14, paddingVertical: 12, alignItems: 'center', borderBottomWidth: 3, borderBottomColor: 'transparent' },
  dayTabActive:       { borderBottomColor: COLORS.primary },
  dayTabDone:         { opacity: 0.6 },
  dayTabLabel:        { fontSize: 12, fontWeight: '600', color: COLORS.muted },
  dayTabLabelActive:  { color: COLORS.primary },
  dayTabCal:          { fontSize: 11, color: COLORS.muted, marginTop: 1 },
  dayTabCalActive:    { color: COLORS.primary },
  rebalancedPill:     { marginTop: 2, backgroundColor: COLORS.warning + '30', borderRadius: 6, paddingHorizontal: 4 },
  rebalancedText:     { fontSize: 10, color: COLORS.warning, fontWeight: '700' },
  doneCheck:          { fontSize: 12, color: COLORS.success, marginTop: 2 },
  dayDetail:          { flex: 1, padding: 16 },
  dayHeader:          { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 12 },
  dayName:            { fontSize: 20, fontWeight: '700', color: COLORS.dark },
  rebalancedBadge:    { backgroundColor: COLORS.warning + '25', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  rebalancedBadgeText:{ fontSize: 12, color: COLORS.warning, fontWeight: '700' },
  macroBar:           { flexDirection: 'row', gap: 6, marginBottom: 12 },
  macroChip:          { flex: 1, backgroundColor: COLORS.white, borderRadius: 10, padding: 8, alignItems: 'center', borderWidth: 1, borderColor: COLORS.border },
  macroValue:         { fontSize: 14, fontWeight: '700' },
  macroUnit:          { fontSize: 9, fontWeight: '400', color: COLORS.muted },
  macroLabel:         { fontSize: 9, color: COLORS.muted, marginTop: 1 },
  macroTrack:         { height: 3, width: '100%', backgroundColor: COLORS.border, borderRadius: 2, marginTop: 5, overflow: 'hidden' },
  macroFill:          { height: '100%', borderRadius: 2 },
  loggedCard:         { backgroundColor: COLORS.secondary + '15', borderRadius: 10, padding: 12, marginBottom: 12, borderWidth: 1, borderColor: COLORS.secondary + '40' },
  loggedTitle:        { fontSize: 12, fontWeight: '700', color: COLORS.secondary, marginBottom: 4, textTransform: 'uppercase' },
  loggedMacros:       { fontSize: 13, color: COLORS.dark, fontWeight: '500' },
  loggedCheat:        { fontSize: 12, color: '#E65100', marginTop: 4 },
  mealCard:           { backgroundColor: COLORS.white, borderRadius: 12, padding: 14, marginBottom: 10, borderWidth: 1, borderColor: COLORS.border },
  mealCardCheat:      { borderColor: COLORS.primary + '50', backgroundColor: COLORS.primary + '06' },
  mealCardHeader:     { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  mealCardSlot:       { fontSize: 11, fontWeight: '700', color: COLORS.muted, textTransform: 'uppercase' },
  cheatLabel:         { fontSize: 11, fontWeight: '700', color: COLORS.primary },
  expandIcon:         { fontSize: 10, color: COLORS.muted },
  mealCardName:       { fontSize: 15, fontWeight: '600', color: COLORS.dark, marginBottom: 8 },
  mealCardMacros:     { flexDirection: 'row', gap: 6, flexWrap: 'wrap' },
  macroTag:           { flexDirection: 'row', backgroundColor: COLORS.screenBg, paddingHorizontal: 7, paddingVertical: 3, borderRadius: 6 },
  macroTagLabel:      { fontSize: 11, color: COLORS.muted },
  macroTagValue:      { fontSize: 11, fontWeight: '600', color: COLORS.dark },
  itemsList:          { marginTop: 10, paddingTop: 10, borderTopWidth: 1, borderTopColor: COLORS.border },
  itemRow:            { flexDirection: 'row', alignItems: 'center', paddingVertical: 4 },
  itemName:           { flex: 1, fontSize: 13, color: COLORS.dark },
  itemServing:        { fontSize: 12, color: COLORS.muted, marginRight: 8 },
  itemCal:            { fontSize: 12, fontWeight: '600', color: COLORS.primary },
  logMealBtn:         { marginTop: 10, paddingVertical: 7, borderTopWidth: 1, borderTopColor: COLORS.border, alignItems: 'center' },
  logMealBtnText:     { color: COLORS.secondary, fontWeight: '600', fontSize: 13 },
  swapBtn:            { backgroundColor: COLORS.primary + '15', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 8 },
  swapBtnText:        { color: COLORS.primary, fontWeight: '600', fontSize: 12 },
  modalOverlay:       { flex: 1, backgroundColor: '#00000066', justifyContent: 'flex-end' },
  modalBox:           { backgroundColor: COLORS.white, borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 24, maxHeight: '70%' },
  modalTitle:         { fontSize: 18, fontWeight: '700', color: COLORS.dark, marginBottom: 2 },
  modalSub:           { fontSize: 13, color: COLORS.muted, marginBottom: 16 },
  altRow:             { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  altName:            { fontSize: 14, fontWeight: '600', color: COLORS.dark },
  altMeta:            { fontSize: 12, color: COLORS.muted, marginTop: 2 },
  altArrow:           { fontSize: 18, color: COLORS.primary, paddingLeft: 12 },
  noAlts:             { color: COLORS.muted, textAlign: 'center', paddingVertical: 24 },
  modalCancel:        { marginTop: 16, padding: 14, borderRadius: 12, backgroundColor: COLORS.border, alignItems: 'center' },
  modalCancelText:    { color: COLORS.mid, fontWeight: '600' },
  emptyDay:           { backgroundColor: COLORS.white, borderRadius: 12, padding: 20, borderWidth: 1, borderColor: COLORS.border, marginBottom: 12 },
  emptyDayText:       { fontSize: 14, color: COLORS.muted, textAlign: 'center', lineHeight: 20 },
  emptyTarget:        { fontSize: 13, color: COLORS.primary, textAlign: 'center', marginTop: 10, fontWeight: '600' },
  actionRow:          { flexDirection: 'row', gap: 8, marginTop: 4, marginBottom: 40 },
  logFoodBtn:         { flex: 1, backgroundColor: COLORS.secondary, borderRadius: 12, padding: 12, alignItems: 'center' },
  logFoodBtnText:     { color: COLORS.white, fontWeight: '600', fontSize: 13 },
  cravingMiniBtn:     { flex: 1, backgroundColor: COLORS.dark, borderRadius: 12, padding: 12, alignItems: 'center' },
  cravingMiniBtnText: { color: COLORS.white, fontWeight: '600', fontSize: 13 },
  completeBtn:        { flex: 1, backgroundColor: COLORS.success, borderRadius: 12, padding: 12, alignItems: 'center' },
  completeBtnText:    { color: COLORS.white, fontWeight: '600', fontSize: 13 },
});
