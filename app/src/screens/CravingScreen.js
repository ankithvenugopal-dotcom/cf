import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, Alert, ActivityIndicator, Modal, ScrollView,
} from 'react-native';
import { searchFoods, logCraving, getUserId } from '../services/api';
import { COLORS } from '../utils/colors';

const DAY_NAMES  = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'];
const DAY_SHORT  = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];

export default function CravingScreen({ navigation }) {
  const [query, setQuery]             = useState('');
  const [results, setResults]         = useState([]);
  const [searching, setSearching]     = useState(false);
  const [selectedFood, setSelectedFood] = useState(null);
  const [selectedDay, setSelectedDay]   = useState(null);
  const [logging, setLogging]           = useState(false);
  const [showResult, setShowResult]     = useState(false);
  const [rebalanceResult, setRebalanceResult] = useState(null);

  // Default to today
  useEffect(() => {
    const d = new Date().getDay();
    setSelectedDay(d === 0 ? 6 : d - 1);
  }, []);

  // Debounced search
  useEffect(() => {
    if (!query.trim() || selectedFood) { setResults([]); return; }
    const t = setTimeout(async () => {
      setSearching(true);
      try {
        const data = await searchFoods(query);
        setResults(data || []);
      } catch { setResults([]); }
      finally { setSearching(false); }
    }, 350);
    return () => clearTimeout(t);
  }, [query, selectedFood]);

  const pickFood = useCallback((food) => {
    setSelectedFood(food);
    setQuery(food.name);
    setResults([]);
  }, []);

  const clearFood = useCallback(() => {
    setSelectedFood(null);
    setQuery('');
    setResults([]);
  }, []);

  async function handleLog() {
    if (!selectedFood || selectedDay == null) {
      Alert.alert('Missing info', 'Select a food and the day it happened on.');
      return;
    }
    setLogging(true);
    try {
      const uid    = await getUserId();
      const result = await logCraving(uid, selectedFood.id, selectedDay);
      setRebalanceResult(result);
      setShowResult(true);
    } catch (e) {
      Alert.alert('Error', e.response?.data?.error || 'Could not log craving. Try again.');
    } finally {
      setLogging(false);
    }
  }

  function handleSeeUpdatedPlan() {
    setShowResult(false);
    // Navigate to Plan tab (Craving is a modal over the main stack)
    navigation.navigate('Main', { screen: 'Plan' });
  }

  function handleDone() {
    setShowResult(false);
    navigation.goBack();
  }

  const todayIdx = (() => { const d = new Date().getDay(); return d === 0 ? 6 : d - 1; })();

  return (
    <View style={s.screen}>

      {/* ── Header ──────────────────────────────────────────────── */}
      <View style={s.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={s.backBtn} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
          <Text style={s.backText}>✕</Text>
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={s.headerTitle}>Log a Craving</Text>
          <Text style={s.headerSub}>We'll rebalance the rest of your week</Text>
        </View>
        <Text style={s.headerEmoji}>🍔</Text>
      </View>

      <ScrollView
        style={s.body}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >

        {/* ── Step 1: Food Search ─────────────────────────────────── */}
        <View style={s.stepCard}>
          <View style={s.stepHeader}>
            <View style={s.stepBadge}><Text style={s.stepBadgeText}>1</Text></View>
            <Text style={s.stepTitle}>What did you eat?</Text>
          </View>

          {/* Search input */}
          {!selectedFood && (
            <View style={s.searchBox}>
              <Text style={s.searchIcon}>🔍</Text>
              <TextInput
                style={s.searchInput}
                placeholder="Search food… e.g. biryani, burger"
                placeholderTextColor={COLORS.muted}
                value={query}
                onChangeText={setQuery}
                autoFocus
              />
              {searching && <ActivityIndicator size="small" color={COLORS.primary} style={{ marginRight: 10 }} />}
            </View>
          )}

          {/* Selected food */}
          {selectedFood && (
            <View style={s.selectedCard}>
              <View style={s.selectedLeft}>
                <Text style={s.selectedEmoji}>
                  {selectedFood.category === 'FastFood' ? '🍔' : '🍽️'}
                </Text>
                <View style={{ flex: 1 }}>
                  <Text style={s.selectedName}>{selectedFood.name}</Text>
                  <View style={s.selectedMacroRow}>
                    <SelectedMacro label="kcal" value={selectedFood.calories} color={COLORS.primary} />
                    <SelectedMacro label="P"    value={`${selectedFood.protein}g`} color={COLORS.secondary} />
                    <SelectedMacro label="C"    value={`${selectedFood.carbs}g`}   color={COLORS.warning} />
                    <SelectedMacro label="F"    value={`${selectedFood.fat}g`}     color="#9C27B0" />
                  </View>
                </View>
              </View>
              <TouchableOpacity onPress={clearFood} style={s.clearBtn} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                <Text style={s.clearBtnText}>✕</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Results dropdown */}
          {results.length > 0 && (
            <View style={s.resultsBox}>
              {results.map(food => (
                <TouchableOpacity
                  key={food.id}
                  style={s.resultRow}
                  onPress={() => pickFood(food)}
                  activeOpacity={0.7}
                >
                  <Text style={s.resultEmoji}>
                    {food.category === 'FastFood' ? '🍔' : '🍛'}
                  </Text>
                  <View style={{ flex: 1 }}>
                    <Text style={s.resultName}>{food.name}</Text>
                    <Text style={s.resultSub}>
                      {food.calories} kcal · {food.serving} {food.unit}
                    </Text>
                  </View>
                  <View style={[s.catBadge, food.category === 'FastFood' && s.catBadgeFast]}>
                    <Text style={[s.catBadgeText, food.category === 'FastFood' && s.catBadgeTextFast]}>
                      {food.category === 'FastFood' ? 'Fast Food' : food.category}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {/* ── Step 2: Day Picker ──────────────────────────────────── */}
        <View style={s.stepCard}>
          <View style={s.stepHeader}>
            <View style={s.stepBadge}><Text style={s.stepBadgeText}>2</Text></View>
            <Text style={s.stepTitle}>When did this happen?</Text>
          </View>
          <View style={s.dayRow}>
            {DAY_SHORT.map((name, i) => (
              <TouchableOpacity
                key={i}
                style={[
                  s.dayChip,
                  selectedDay === i && s.dayChipActive,
                  i === todayIdx && selectedDay !== i && s.dayChipToday,
                ]}
                onPress={() => setSelectedDay(i)}
                activeOpacity={0.75}
              >
                <Text style={[s.dayChipText, selectedDay === i && s.dayChipTextActive]}>
                  {name}
                </Text>
                {i === todayIdx && (
                  <View style={[s.todayDot, selectedDay === i && s.todayDotActive]} />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* ── Impact Preview ──────────────────────────────────────── */}
        {selectedFood && (
          <View style={s.impactCard}>
            <Text style={s.impactTitle}>What happens next</Text>
            <View style={s.impactRow}>
              <View style={s.impactItem}>
                <Text style={s.impactValue}>{selectedFood.calories}</Text>
                <Text style={s.impactLabel}>kcal logged</Text>
              </View>
              <View style={s.impactArrow}>
                <Text style={s.impactArrowText}>→</Text>
              </View>
              <View style={s.impactItem}>
                <Text style={[s.impactValue, { color: COLORS.secondary }]}>Rebalanced</Text>
                <Text style={s.impactLabel}>future days trimmed</Text>
              </View>
              <View style={s.impactArrow}>
                <Text style={s.impactArrowText}>→</Text>
              </View>
              <View style={s.impactItem}>
                <Text style={[s.impactValue, { color: COLORS.success }]}>On track</Text>
                <Text style={s.impactLabel}>weekly goal kept</Text>
              </View>
            </View>
            <Text style={s.impactNote}>
              The remaining {7 - (selectedDay ?? 0) - 1} day(s) after {DAY_NAMES[selectedDay ?? 0]} will be slightly lighter.
            </Text>
          </View>
        )}

        {/* ── Log Button ──────────────────────────────────────────── */}
        <TouchableOpacity
          style={[s.logBtn, (!selectedFood || selectedDay == null) && s.logBtnDisabled]}
          onPress={handleLog}
          disabled={logging || !selectedFood || selectedDay == null}
          activeOpacity={0.85}
        >
          {logging
            ? <ActivityIndicator color={COLORS.white} />
            : (
              <>
                <Text style={s.logBtnText}>Log Craving & Rebalance</Text>
                <Text style={s.logBtnSub}>Your weekly budget stays intact</Text>
              </>
            )
          }
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* ── Result Bottom Sheet ─────────────────────────────────── */}
      <Modal visible={showResult} animationType="slide" transparent>
        <View style={s.modalOverlay}>
          <View style={s.modalSheet}>

            {/* Success icon */}
            <View style={s.successIcon}>
              <Text style={s.successIconText}>✓</Text>
            </View>
            <Text style={s.modalTitle}>Week Rebalanced!</Text>
            <Text style={s.modalSub}>Your craving is logged and the plan is updated.</Text>

            {rebalanceResult && (
              <>
                {/* Stats row */}
                <View style={s.resultStatsRow}>
                  <ResultStat label="Craving"      value={`${rebalanceResult.cravingCalories} kcal`} color={COLORS.primary} />
                  <ResultStat label="Days adjusted" value={`${rebalanceResult.rebalancedDays}`}       color={COLORS.secondary} />
                  <ResultStat label="New daily avg" value={`${rebalanceResult.newDailyTarget} kcal`}  color={COLORS.blue} />
                </View>

                {/* Overage */}
                {rebalanceResult.weeklyOveragePct > 0 && (
                  <View style={s.overageRow}>
                    <Text style={s.overageText}>
                      Weekly total is {rebalanceResult.weeklyOveragePct}% over budget
                      — still within the 5% limit.
                    </Text>
                  </View>
                )}

                {/* Warnings */}
                {rebalanceResult.warnings?.map((w, i) => (
                  <View key={i} style={s.warningBox}>
                    <Text style={s.warningText}>⚠️  {w}</Text>
                  </View>
                ))}
              </>
            )}

            {/* Actions */}
            <TouchableOpacity style={s.modalPrimaryBtn} onPress={handleSeeUpdatedPlan}>
              <Text style={s.modalPrimaryBtnText}>See Updated Plan  →</Text>
            </TouchableOpacity>
            <TouchableOpacity style={s.modalSecondaryBtn} onPress={handleDone}>
              <Text style={s.modalSecondaryBtnText}>Done</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

// ── Sub-components ────────────────────────────────────────────────────────────

function SelectedMacro({ label, value, color }) {
  return (
    <View style={s.selMacro}>
      <Text style={[s.selMacroValue, { color }]}>{value}</Text>
      <Text style={s.selMacroLabel}>{label}</Text>
    </View>
  );
}

function ResultStat({ label, value, color }) {
  return (
    <View style={s.resultStat}>
      <Text style={[s.resultStatValue, { color }]}>{value}</Text>
      <Text style={s.resultStatLabel}>{label}</Text>
    </View>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────

const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.bg },

  // Header
  header:      { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 20, paddingTop: 56, paddingBottom: 20, backgroundColor: COLORS.surface, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  backBtn:     { width: 36, height: 36, borderRadius: 18, backgroundColor: COLORS.cardAlt, justifyContent: 'center', alignItems: 'center' },
  backText:    { fontSize: 16, color: COLORS.muted, fontWeight: '700' },
  headerTitle: { fontSize: 20, fontWeight: '800', color: COLORS.text },
  headerSub:   { fontSize: 13, color: COLORS.muted, marginTop: 2 },
  headerEmoji: { fontSize: 30 },

  body: { flex: 1, padding: 16 },

  // Step cards
  stepCard:    { backgroundColor: COLORS.surface, borderRadius: 16, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: COLORS.border },
  stepHeader:  { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 14 },
  stepBadge:   { width: 26, height: 26, borderRadius: 13, backgroundColor: COLORS.primary, justifyContent: 'center', alignItems: 'center' },
  stepBadgeText:{ fontSize: 13, fontWeight: '800', color: COLORS.white },
  stepTitle:   { fontSize: 15, fontWeight: '700', color: COLORS.text },

  // Search
  searchBox:   { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.cardAlt, borderRadius: 12, borderWidth: 1, borderColor: COLORS.border, paddingLeft: 12 },
  searchIcon:  { fontSize: 16, marginRight: 4 },
  searchInput: { flex: 1, padding: 13, fontSize: 15, color: COLORS.text },

  // Selected food
  selectedCard:    { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.primary + '18', borderRadius: 14, padding: 14, borderWidth: 1.5, borderColor: COLORS.primary + '50' },
  selectedLeft:    { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 12 },
  selectedEmoji:   { fontSize: 30 },
  selectedName:    { fontSize: 15, fontWeight: '700', color: COLORS.text, marginBottom: 8 },
  selectedMacroRow:{ flexDirection: 'row', gap: 12 },
  selMacro:        { alignItems: 'center' },
  selMacroValue:   { fontSize: 14, fontWeight: '800' },
  selMacroLabel:   { fontSize: 10, color: COLORS.muted, marginTop: 1 },
  clearBtn:        { padding: 6 },
  clearBtnText:    { fontSize: 18, color: COLORS.muted, fontWeight: '700' },

  // Results dropdown
  resultsBox:      { backgroundColor: COLORS.cardAlt, borderRadius: 12, borderWidth: 1, borderColor: COLORS.border, overflow: 'hidden', marginTop: 8 },
  resultRow:       { flexDirection: 'row', alignItems: 'center', padding: 12, borderBottomWidth: 1, borderBottomColor: COLORS.border, gap: 10 },
  resultEmoji:     { fontSize: 22 },
  resultName:      { fontSize: 14, fontWeight: '600', color: COLORS.text },
  resultSub:       { fontSize: 12, color: COLORS.muted, marginTop: 2 },
  catBadge:        { backgroundColor: COLORS.border, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  catBadgeFast:    { backgroundColor: COLORS.primary + '25' },
  catBadgeText:    { fontSize: 11, color: COLORS.muted, fontWeight: '600' },
  catBadgeTextFast:{ color: COLORS.primary },

  // Day picker
  dayRow:          { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  dayChip:         { paddingVertical: 9, paddingHorizontal: 14, borderRadius: 22, borderWidth: 1.5, borderColor: COLORS.border, backgroundColor: COLORS.cardAlt, alignItems: 'center' },
  dayChipToday:    { borderColor: COLORS.blue + '80' },
  dayChipActive:   { borderColor: COLORS.primary, backgroundColor: COLORS.primary + '22' },
  dayChipText:     { fontSize: 13, color: COLORS.muted, fontWeight: '600' },
  dayChipTextActive:{ color: COLORS.primary, fontWeight: '800' },
  todayDot:        { width: 4, height: 4, borderRadius: 2, backgroundColor: COLORS.blue, marginTop: 3 },
  todayDotActive:  { backgroundColor: COLORS.primary },

  // Impact preview
  impactCard:      { backgroundColor: COLORS.surface, borderRadius: 16, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: COLORS.border },
  impactTitle:     { fontSize: 13, fontWeight: '700', color: COLORS.muted, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 14 },
  impactRow:       { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 },
  impactItem:      { flex: 1, alignItems: 'center' },
  impactValue:     { fontSize: 14, fontWeight: '800', color: COLORS.primary },
  impactLabel:     { fontSize: 11, color: COLORS.muted, marginTop: 4, textAlign: 'center' },
  impactArrow:     { paddingHorizontal: 4 },
  impactArrowText: { fontSize: 18, color: COLORS.border },
  impactNote:      { fontSize: 12, color: COLORS.muted, textAlign: 'center', lineHeight: 17 },

  // Log button
  logBtn:          { backgroundColor: COLORS.primary, borderRadius: 16, padding: 18, alignItems: 'center', marginBottom: 8 },
  logBtnDisabled:  { opacity: 0.4 },
  logBtnText:      { color: COLORS.white, fontSize: 16, fontWeight: '800' },
  logBtnSub:       { color: COLORS.white + 'BB', fontSize: 12, marginTop: 4 },

  // Result modal
  modalOverlay:      { flex: 1, backgroundColor: '#000000AA', justifyContent: 'flex-end' },
  modalSheet:        { backgroundColor: COLORS.surface, borderTopLeftRadius: 28, borderTopRightRadius: 28, padding: 28, paddingBottom: 44, borderWidth: 1, borderColor: COLORS.border },
  successIcon:       { width: 56, height: 56, borderRadius: 28, backgroundColor: COLORS.success + '25', justifyContent: 'center', alignItems: 'center', alignSelf: 'center', marginBottom: 14, borderWidth: 2, borderColor: COLORS.success + '60' },
  successIconText:   { fontSize: 24, color: COLORS.success, fontWeight: '800' },
  modalTitle:        { fontSize: 22, fontWeight: '800', color: COLORS.text, textAlign: 'center', marginBottom: 6 },
  modalSub:          { fontSize: 14, color: COLORS.muted, textAlign: 'center', marginBottom: 20 },
  resultStatsRow:    { flexDirection: 'row', justifyContent: 'space-around', backgroundColor: COLORS.cardAlt, borderRadius: 14, padding: 16, marginBottom: 14 },
  resultStat:        { alignItems: 'center' },
  resultStatValue:   { fontSize: 16, fontWeight: '800' },
  resultStatLabel:   { fontSize: 11, color: COLORS.muted, marginTop: 3, textAlign: 'center' },
  overageRow:        { backgroundColor: COLORS.warning + '18', borderRadius: 10, padding: 12, marginBottom: 10, borderWidth: 1, borderColor: COLORS.warning + '50' },
  overageText:       { fontSize: 13, color: COLORS.warning, fontWeight: '600', textAlign: 'center' },
  warningBox:        { backgroundColor: COLORS.cardAlt, borderRadius: 10, padding: 12, marginBottom: 8, borderWidth: 1, borderColor: COLORS.border },
  warningText:       { fontSize: 13, color: COLORS.textSub, lineHeight: 18 },
  modalPrimaryBtn:   { backgroundColor: COLORS.primary, borderRadius: 14, padding: 16, alignItems: 'center', marginTop: 8 },
  modalPrimaryBtnText:{ color: COLORS.white, fontSize: 16, fontWeight: '700' },
  modalSecondaryBtn: { borderRadius: 14, padding: 14, alignItems: 'center', marginTop: 8 },
  modalSecondaryBtnText:{ color: COLORS.muted, fontSize: 15, fontWeight: '600' },
});
