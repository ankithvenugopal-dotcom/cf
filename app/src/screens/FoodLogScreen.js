import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, FlatList,
  StyleSheet, ActivityIndicator, Alert,
} from 'react-native';
import { getUserId, searchFoods, logFood, getFoodLog, deleteLogEntry } from '../services/api';
import { COLORS } from '../utils/colors';

export default function FoodLogScreen({ navigation }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [log, setLog]     = useState([]);
  const [summary, setSummary] = useState({ calories: 0, protein: 0, carbs: 0, fat: 0, cheatCalories: 0 });
  const [loading, setLoading] = useState(false);
  const today = new Date().toISOString().split('T')[0];

  const loadLog = useCallback(async () => {
    const uid = await getUserId();
    if (!uid) return;
    const data = await getFoodLog(uid, today);
    setLog(data.entries || []);
    setSummary(data.summary || {});
  }, [today]);

  useEffect(() => { loadLog(); }, [loadLog]);
  useEffect(() => {
    const unsub = navigation.addListener('focus', loadLog);
    return unsub;
  }, [navigation, loadLog]);

  const handleSearch = useCallback(async (text) => {
    setQuery(text);
    if (text.length < 2) { setResults([]); return; }
    setSearching(true);
    try {
      const data = await searchFoods(text);
      setResults(data || []);
    } catch {
      setResults([]);
    } finally {
      setSearching(false);
    }
  }, []);

  const handleLog = useCallback(async (food) => {
    setLoading(true);
    try {
      const uid = await getUserId();
      await logFood(uid, food.id, null, food.category === 'FastFood');
      setQuery('');
      setResults([]);
      await loadLog();
    } catch (e) {
      Alert.alert('Error', e.message);
    } finally {
      setLoading(false);
    }
  }, [loadLog]);

  const handleDelete = useCallback(async (entryId) => {
    try {
      const uid = await getUserId();
      await deleteLogEntry(uid, entryId, today);
      await loadLog();
    } catch (e) {
      Alert.alert('Error', e.message);
    }
  }, [loadLog, today]);

  const canGoBack = navigation.canGoBack();

  return (
    <View style={s.screen}>
      <View style={s.header}>
        {canGoBack && (
          <TouchableOpacity onPress={() => navigation.goBack()} style={s.backBtn}>
            <Text style={s.backText}>←</Text>
          </TouchableOpacity>
        )}
        <View>
          <Text style={s.title}>Diary</Text>
          <Text style={s.subtitle}>Today · {today}</Text>
        </View>
      </View>

      {/* Summary bar */}
      <View style={s.summaryRow}>
        <SumChip label="Eaten" value={Math.round(summary.calories)} unit="kcal" color={COLORS.primary} />
        <SumChip label="Protein" value={Math.round(summary.protein)} unit="g" color={COLORS.secondary} />
        <SumChip label="Carbs" value={Math.round(summary.carbs)} unit="g" color={COLORS.warning} />
        <SumChip label="Fat" value={Math.round(summary.fat)} unit="g" color="#9C27B0" />
      </View>

      {summary.cheatCalories > 0 && (
        <View style={s.cheatBar}>
          <Text style={s.cheatBarLabel}>🍔 Cheat calories today: {Math.round(summary.cheatCalories)} kcal</Text>
        </View>
      )}

      {/* Search */}
      <View style={s.searchWrap}>
        <TextInput
          style={s.searchInput}
          placeholder="Search food (e.g. rice, chicken, pizza...)"
          value={query}
          onChangeText={handleSearch}
          placeholderTextColor={COLORS.muted}
        />
        {searching && <ActivityIndicator style={s.searchSpinner} size="small" color={COLORS.primary} />}
      </View>

      {/* Search results */}
      {results.length > 0 && (
        <View style={s.resultsBox}>
          <FlatList
            data={results}
            keyExtractor={item => item.id}
            style={{ maxHeight: 280 }}
            keyboardShouldPersistTaps="handled"
            renderItem={({ item }) => (
              <TouchableOpacity style={s.resultRow} onPress={() => handleLog(item)} disabled={loading}>
                <View style={s.resultInfo}>
                  <Text style={s.resultName}>{item.name}</Text>
                  <Text style={s.resultMeta}>
                    {item.calories} kcal · P {item.protein}g · C {item.carbs}g · F {item.fat}g
                    {item.serving ? ` · per ${item.serving} ${item.unit}` : ''}
                  </Text>
                </View>
                <View style={[s.catBadge, item.category === 'FastFood' && s.catBadgeCheat]}>
                  <Text style={s.catText}>{item.category === 'FastFood' ? '🍔' : '+'}</Text>
                </View>
              </TouchableOpacity>
            )}
          />
        </View>
      )}

      {/* Today's log */}
      <Text style={s.logTitle}>Today's Log</Text>
      {log.length === 0
        ? <Text style={s.emptyLog}>Nothing logged yet. Search above to add foods.</Text>
        : (
          <FlatList
            data={log}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
              <View style={[s.logRow, item.isCheat && s.logRowCheat]}>
                <View style={s.logInfo}>
                  <Text style={s.logName}>{item.name}</Text>
                  <Text style={s.logMeta}>
                    {item.calories} kcal · P {item.protein}g · C {item.carbs}g · F {item.fat}g
                    {item.isCheat ? '  🍔 cheat' : ''}
                  </Text>
                </View>
                <TouchableOpacity onPress={() => handleDelete(item.id)} style={s.deleteBtn}>
                  <Text style={s.deleteText}>✕</Text>
                </TouchableOpacity>
              </View>
            )}
          />
        )
      }
    </View>
  );
}

function SumChip({ label, value, unit, color }) {
  return (
    <View style={s.sumChip}>
      <Text style={[s.sumValue, { color }]}>{value}<Text style={s.sumUnit}> {unit}</Text></Text>
      <Text style={s.sumLabel}>{label}</Text>
    </View>
  );
}

const s = StyleSheet.create({
  screen:       { flex: 1, backgroundColor: COLORS.bg },
  header:       { flexDirection: 'row', alignItems: 'flex-end', gap: 12, backgroundColor: COLORS.surface, padding: 20, paddingTop: 56, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  backBtn:      { paddingBottom: 4 },
  backText:     { color: COLORS.text, fontSize: 22, fontWeight: '700' },
  title:        { fontSize: 22, fontWeight: '700', color: COLORS.text },
  subtitle:     { fontSize: 13, color: COLORS.muted, marginTop: 2 },
  summaryRow:   { flexDirection: 'row', padding: 12, gap: 8, backgroundColor: COLORS.surface, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  sumChip:      { flex: 1, alignItems: 'center' },
  sumValue:     { fontSize: 16, fontWeight: '700' },
  sumUnit:      { fontSize: 10, fontWeight: '400', color: COLORS.muted },
  sumLabel:     { fontSize: 10, color: COLORS.muted, marginTop: 1 },
  cheatBar:     { backgroundColor: COLORS.primary + '18', borderBottomWidth: 1, borderBottomColor: COLORS.primary + '30', paddingHorizontal: 16, paddingVertical: 8 },
  cheatBarLabel:{ fontSize: 13, color: COLORS.primary, fontWeight: '600' },
  searchWrap:   { margin: 12, flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.surface, borderRadius: 12, borderWidth: 1, borderColor: COLORS.border },
  searchInput:  { flex: 1, padding: 14, fontSize: 15, color: COLORS.text },
  searchSpinner:{ marginRight: 12 },
  resultsBox:   { marginHorizontal: 12, backgroundColor: COLORS.surface, borderRadius: 12, borderWidth: 1, borderColor: COLORS.border, overflow: 'hidden', marginBottom: 8 },
  resultRow:    { flexDirection: 'row', alignItems: 'center', padding: 12, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  resultInfo:   { flex: 1 },
  resultName:   { fontSize: 14, fontWeight: '600', color: COLORS.text },
  resultMeta:   { fontSize: 12, color: COLORS.muted, marginTop: 2 },
  catBadge:     { width: 32, height: 32, borderRadius: 16, backgroundColor: COLORS.secondary, justifyContent: 'center', alignItems: 'center' },
  catBadgeCheat:{ backgroundColor: COLORS.primary },
  catText:      { color: COLORS.text, fontSize: 16, fontWeight: '700' },
  logTitle:     { fontSize: 16, fontWeight: '700', color: COLORS.text, paddingHorizontal: 16, paddingTop: 12, paddingBottom: 6 },
  emptyLog:     { color: COLORS.muted, textAlign: 'center', marginTop: 24, fontSize: 14 },
  logRow:       { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.surface, marginHorizontal: 12, marginBottom: 6, borderRadius: 12, padding: 12, borderWidth: 1, borderColor: COLORS.border },
  logRowCheat:  { borderColor: COLORS.primary + '50', backgroundColor: COLORS.primary + '0A' },
  logInfo:      { flex: 1 },
  logName:      { fontSize: 14, fontWeight: '600', color: COLORS.text },
  logMeta:      { fontSize: 12, color: COLORS.muted, marginTop: 2 },
  deleteBtn:    { padding: 6 },
  deleteText:   { color: COLORS.danger, fontSize: 16, fontWeight: '700' },
});
