import React, { useState, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, FlatList,
  StyleSheet, Alert, ActivityIndicator, Modal, ScrollView,
} from 'react-native';
import { searchFoods, logCraving, getUserId, getWeekPlan } from '../services/api';
import { COLORS } from '../utils/colors';

const DAY_NAMES = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export default function CravingScreen({ navigation }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [selectedFood, setSelectedFood] = useState(null);
  const [selectedDay, setSelectedDay] = useState(null);
  const [logging, setLogging] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [rebalanceResult, setRebalanceResult] = useState(null);

  // Default day = today
  useEffect(() => {
    const day = new Date().getDay();
    setSelectedDay(day === 0 ? 6 : day - 1);
  }, []);

  useEffect(() => {
    if (!query.trim()) { setResults([]); return; }
    const t = setTimeout(async () => {
      setSearching(true);
      try {
        const data = await searchFoods(query);
        setResults(data);
      } catch (_) {}
      finally { setSearching(false); }
    }, 400);
    return () => clearTimeout(t);
  }, [query]);

  async function handleLog() {
    if (!selectedFood || selectedDay == null) {
      Alert.alert('Oops', 'Select a food and the day it happened on.');
      return;
    }
    setLogging(true);
    try {
      const uid = await getUserId();
      const result = await logCraving(uid, selectedFood.id, selectedDay);
      setRebalanceResult(result);
      setShowResult(true);
    } catch (e) {
      Alert.alert('Error', e.response?.data?.error || 'Could not log craving. Try again.');
    } finally {
      setLogging(false);
    }
  }

  return (
    <View style={s.screen}>
      {/* ── Header ──────────────────────────────────────────────── */}
      <View style={s.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={s.backBtn}>
          <Text style={s.backText}>←</Text>
        </TouchableOpacity>
        <View>
          <Text style={s.headerTitle}>Log a Craving 🍔</Text>
          <Text style={s.headerSub}>We'll rebalance the rest of your week</Text>
        </View>
      </View>

      <ScrollView style={s.body} keyboardShouldPersistTaps="handled">
        {/* ── Food Search ──────────────────────────────────────── */}
        <Text style={s.sectionLabel}>What did you eat?</Text>
        <View style={s.searchBox}>
          <TextInput
            style={s.searchInput}
            placeholder="Search food... (e.g. biryani, burger)"
            value={query}
            onChangeText={setQuery}
            autoFocus
          />
          {searching && <ActivityIndicator size="small" color={COLORS.primary} style={{ marginRight: 10 }} />}
        </View>

        {selectedFood && (
          <View style={s.selectedCard}>
            <View style={s.selectedInfo}>
              <Text style={s.selectedName}>{selectedFood.name}</Text>
              <Text style={s.selectedMacros}>
                {selectedFood.calories} kcal · P {selectedFood.protein}g · C {selectedFood.carbs}g · F {selectedFood.fat}g
              </Text>
            </View>
            <TouchableOpacity onPress={() => setSelectedFood(null)}>
              <Text style={s.removeText}>✕</Text>
            </TouchableOpacity>
          </View>
        )}

        {results.length > 0 && !selectedFood && (
          <View style={s.resultsBox}>
            {results.map(food => (
              <TouchableOpacity
                key={food.id} style={s.resultRow}
                onPress={() => { setSelectedFood(food); setResults([]); setQuery(food.name); }}
              >
                <View style={{ flex: 1 }}>
                  <Text style={s.resultName}>{food.name}</Text>
                  <Text style={s.resultSub}>{food.calories} kcal per {food.serving} {food.unit}</Text>
                </View>
                <View style={[s.catBadge, food.category === 'Cheat' && s.catBadgeCheat]}>
                  <Text style={[s.catBadgeText, food.category === 'Cheat' && s.catBadgeTextCheat]}>
                    {food.category}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* ── Day Picker ───────────────────────────────────────── */}
        <Text style={[s.sectionLabel, { marginTop: 20 }]}>When did this happen?</Text>
        <View style={s.dayRow}>
          {DAY_NAMES.map((name, i) => (
            <TouchableOpacity
              key={i} style={[s.dayChip, selectedDay === i && s.dayChipActive]}
              onPress={() => setSelectedDay(i)}
            >
              <Text style={[s.dayChipText, selectedDay === i && s.dayChipTextActive]}>
                {name.slice(0, 3)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* ── Impact Preview ───────────────────────────────────── */}
        {selectedFood && (
          <View style={s.impactCard}>
            <Text style={s.impactTitle}>📊 Impact Preview</Text>
            <Text style={s.impactText}>
              Logging <Text style={s.impactBold}>{selectedFood.calories} kcal</Text> from your craving.
              The remaining days will be slightly lighter to keep you on track.
            </Text>
          </View>
        )}

        {/* ── Log Button ───────────────────────────────────────── */}
        <TouchableOpacity
          style={[s.logBtn, (!selectedFood || selectedDay == null) && s.logBtnDisabled]}
          onPress={handleLog}
          disabled={logging || !selectedFood}
        >
          {logging
            ? <ActivityIndicator color="#fff" />
            : <Text style={s.logBtnText}>Log Craving & Rebalance Week</Text>
          }
        </TouchableOpacity>
      </ScrollView>

      {/* ── Result Modal ─────────────────────────────────────────── */}
      <Modal visible={showResult} animationType="slide" transparent>
        <View style={s.modalOverlay}>
          <View style={s.modalCard}>
            <Text style={s.modalTitle}>✅ Week Rebalanced!</Text>
            {rebalanceResult && (
              <>
                <Text style={s.modalStat}>
                  Craving: <Text style={s.modalBold}>{rebalanceResult.cravingCalories} kcal</Text>
                </Text>
                <Text style={s.modalStat}>
                  Days rebalanced: <Text style={s.modalBold}>{rebalanceResult.rebalancedDays}</Text>
                </Text>
                <Text style={s.modalStat}>
                  New daily target: <Text style={s.modalBold}>{rebalanceResult.newDailyTarget} kcal</Text>
                </Text>
                {rebalanceResult.warnings?.map((w, i) => (
                  <View key={i} style={s.warningBox}>
                    <Text style={s.warningText}>⚠️ {w}</Text>
                  </View>
                ))}
              </>
            )}
            <TouchableOpacity
              style={s.modalBtn}
              onPress={() => {
                setShowResult(false);
                navigation.navigate('WeeklyPlan');
              }}
            >
              <Text style={s.modalBtnText}>See Updated Plan</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const s = StyleSheet.create({
  screen:       { flex: 1, backgroundColor: COLORS.screenBg },
  header:       { flexDirection: 'row', alignItems: 'center', gap: 14, padding: 24, paddingTop: 52, backgroundColor: COLORS.primary },
  backBtn:      { padding: 6 },
  backText:     { fontSize: 22, color: COLORS.white, fontWeight: '700' },
  headerTitle:  { fontSize: 20, fontWeight: '700', color: COLORS.white },
  headerSub:    { fontSize: 13, color: COLORS.white + 'CC' },
  body:         { flex: 1, padding: 16 },
  sectionLabel: { fontSize: 15, fontWeight: '700', color: COLORS.dark, marginBottom: 10, marginTop: 4 },
  searchBox:    { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.white, borderRadius: 12, borderWidth: 1.5, borderColor: COLORS.border },
  searchInput:  { flex: 1, padding: 14, fontSize: 15 },
  resultsBox:   { backgroundColor: COLORS.white, borderRadius: 12, borderWidth: 1, borderColor: COLORS.border, overflow: 'hidden', marginTop: 6 },
  resultRow:    { flexDirection: 'row', alignItems: 'center', padding: 14, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  resultName:   { fontSize: 15, fontWeight: '600', color: COLORS.dark },
  resultSub:    { fontSize: 12, color: COLORS.muted, marginTop: 2 },
  catBadge:     { backgroundColor: COLORS.screenBg, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  catBadgeCheat:{ backgroundColor: COLORS.primary + '20' },
  catBadgeText: { fontSize: 11, color: COLORS.muted, fontWeight: '600' },
  catBadgeTextCheat: { color: COLORS.primary },
  selectedCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.primary + '12', borderRadius: 12, padding: 14, marginTop: 10, borderWidth: 1.5, borderColor: COLORS.primary + '40' },
  selectedInfo: { flex: 1 },
  selectedName: { fontSize: 16, fontWeight: '700', color: COLORS.dark },
  selectedMacros:{ fontSize: 12, color: COLORS.muted, marginTop: 3 },
  removeText:   { fontSize: 18, color: COLORS.muted, paddingLeft: 12 },
  dayRow:       { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  dayChip:      { paddingVertical: 8, paddingHorizontal: 14, borderRadius: 20, borderWidth: 1.5, borderColor: COLORS.border, backgroundColor: COLORS.white },
  dayChipActive:{ borderColor: COLORS.primary, backgroundColor: COLORS.primary + '15' },
  dayChipText:  { fontSize: 13, color: COLORS.muted, fontWeight: '500' },
  dayChipTextActive: { color: COLORS.primary, fontWeight: '700' },
  impactCard:   { marginTop: 20, backgroundColor: COLORS.secondary + '15', borderRadius: 12, padding: 16, borderWidth: 1, borderColor: COLORS.secondary + '40' },
  impactTitle:  { fontSize: 15, fontWeight: '700', color: COLORS.dark, marginBottom: 6 },
  impactText:   { fontSize: 14, color: COLORS.mid, lineHeight: 20 },
  impactBold:   { fontWeight: '700', color: COLORS.dark },
  logBtn:       { backgroundColor: COLORS.primary, borderRadius: 14, padding: 18, alignItems: 'center', marginTop: 24, marginBottom: 40 },
  logBtnDisabled:{ opacity: 0.4 },
  logBtnText:   { color: COLORS.white, fontSize: 16, fontWeight: '700' },
  modalOverlay: { flex: 1, backgroundColor: '#000000AA', justifyContent: 'flex-end' },
  modalCard:    { backgroundColor: COLORS.white, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 28 },
  modalTitle:   { fontSize: 22, fontWeight: '700', color: COLORS.dark, marginBottom: 16 },
  modalStat:    { fontSize: 16, color: COLORS.mid, marginBottom: 8 },
  modalBold:    { fontWeight: '700', color: COLORS.dark },
  warningBox:   { backgroundColor: COLORS.warning + '20', borderRadius: 10, padding: 12, marginTop: 8, borderWidth: 1, borderColor: COLORS.warning + '60' },
  warningText:  { fontSize: 13, color: COLORS.dark, lineHeight: 18 },
  modalBtn:     { backgroundColor: COLORS.primary, borderRadius: 12, padding: 16, alignItems: 'center', marginTop: 20 },
  modalBtnText: { color: COLORS.white, fontSize: 16, fontWeight: '700' },
});
