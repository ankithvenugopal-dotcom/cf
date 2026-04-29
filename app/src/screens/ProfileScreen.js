import React, { useEffect, useState } from 'react';
import {
  View, Text, ScrollView, StyleSheet, TouchableOpacity,
  ActivityIndicator, TextInput, Alert,
} from 'react-native';
import { getUserId, getUser, updateUser } from '../services/api';
import { COLORS } from '../utils/colors';

export default function ProfileScreen({ navigation }) {
  const [user, setUser]         = useState(null);
  const [loading, setLoading]   = useState(true);
  const [editWeight, setEditWeight] = useState(false);
  const [weightInput, setWeightInput] = useState('');
  const [saving, setSaving]     = useState(false);

  const load = async () => {
    const uid = await getUserId();
    if (uid) setUser(await getUser(uid));
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleUpdateWeight = async () => {
    const w = parseFloat(weightInput);
    if (!w || w < 20 || w > 300) {
      Alert.alert('Invalid', 'Enter a valid weight between 20–300 kg');
      return;
    }
    setSaving(true);
    try {
      const uid = await getUserId();
      const res = await updateUser(uid, { weightKg: w });
      setUser(res.user);
      setEditWeight(false);
      setWeightInput('');
      Alert.alert('Updated!', `Weight set to ${w} kg. Macros and plan recalculated.`);
    } catch (e) {
      Alert.alert('Error', e.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <View style={s.center}><ActivityIndicator size="large" color={COLORS.primary} /></View>;

  const p = user?.profile;

  return (
    <ScrollView style={s.screen}>
      <View style={s.header}>
        <View style={s.avatar}>
          <Text style={s.avatarText}>{(user?.name || 'U')[0].toUpperCase()}</Text>
        </View>
        <Text style={s.name}>{user?.name}</Text>
        <Text style={s.goalBadge}>{user?.goal?.replace(/_/g, ' ').toUpperCase()}</Text>
      </View>

      {/* Weight Reset */}
      <View style={s.section}>
        <Text style={s.sectionTitle}>Update Weight</Text>
        {editWeight ? (
          <View style={s.weightEditRow}>
            <TextInput
              style={s.weightInput}
              placeholder={`Current: ${user?.weightKg} kg`}
              keyboardType="decimal-pad"
              value={weightInput}
              onChangeText={setWeightInput}
              autoFocus
            />
            <TouchableOpacity style={s.saveBtn} onPress={handleUpdateWeight} disabled={saving}>
              {saving
                ? <ActivityIndicator size="small" color={COLORS.white} />
                : <Text style={s.saveBtnText}>Save</Text>
              }
            </TouchableOpacity>
            <TouchableOpacity style={s.cancelBtn} onPress={() => { setEditWeight(false); setWeightInput(''); }}>
              <Text style={s.cancelBtnText}>✕</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity style={s.weightRow} onPress={() => setEditWeight(true)}>
            <View>
              <Text style={s.weightValue}>{user?.weightKg} kg</Text>
              <Text style={s.weightSub}>Tap to update — macros will recalculate</Text>
            </View>
            <Text style={s.editIcon}>✏️</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={s.section}>
        <Text style={s.sectionTitle}>Stats</Text>
        <InfoRow label="Age"      value={`${user?.ageYears} years`} />
        <InfoRow label="Weight"   value={`${user?.weightKg} kg`} />
        <InfoRow label="Height"   value={`${user?.heightCm} cm`} />
        <InfoRow label="Sex"      value={user?.sex} />
        <InfoRow label="Activity" value={user?.activityLevel?.replace(/_/g, ' ')} />
        <InfoRow label="Diet"     value={user?.diet?.replace(/_/g, '-')} />
      </View>

      {p && (
        <View style={s.section}>
          <Text style={s.sectionTitle}>Your Numbers</Text>
          <InfoRow label="BMR"            value={`${p.bmr} kcal`} />
          <InfoRow label="TDEE"           value={`${p.tdee} kcal`} />
          <InfoRow label="Daily Target"   value={`${p.targetCalories} kcal`} />
          <InfoRow label="Weekly Budget"  value={`${p.weeklyCalorieBudget?.toLocaleString()} kcal`} />
          <InfoRow label="Protein Target" value={`${p.macros?.proteinG}g / day`} />
          <InfoRow label="Carb Target"    value={`${p.macros?.carbsG}g / day`} />
          <InfoRow label="Fat Target"     value={`${p.macros?.fatG}g / day`} />
          <InfoRow label="Daily Minimum"  value="1300 kcal (safety floor)" />
        </View>
      )}

      {p && (
        <View style={s.section}>
          <Text style={s.sectionTitle}>Macro Method (IIFYM)</Text>
          <Text style={s.iifymNote}>
            Protein ({p.macros?.proteinG}g) is set at 2.2g/kg for fat loss or 1.6–2.0g/kg for other goals.
            Fat ({p.macros?.fatG}g) is set at 0.75–0.9g/kg. Carbs ({p.macros?.carbsG}g) fill remaining calories.
          </Text>
        </View>
      )}

      <View style={s.disclaimer}>
        <Text style={s.disclaimerText}>
          ⚕️ CraveFit is not medical advice. If you have diabetes, PCOS, kidney issues, or any medical condition, consult a registered dietitian before following any meal plan.
        </Text>
      </View>
    </ScrollView>
  );
}

function InfoRow({ label, value }) {
  return (
    <View style={s.infoRow}>
      <Text style={s.infoLabel}>{label}</Text>
      <Text style={s.infoValue}>{value}</Text>
    </View>
  );
}

const s = StyleSheet.create({
  screen:        { flex: 1, backgroundColor: COLORS.screenBg },
  center:        { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header:        { backgroundColor: COLORS.primary, padding: 28, paddingTop: 56, alignItems: 'center' },
  avatar:        { width: 72, height: 72, borderRadius: 36, backgroundColor: COLORS.white + '30', justifyContent: 'center', alignItems: 'center', marginBottom: 10 },
  avatarText:    { fontSize: 30, fontWeight: '700', color: COLORS.white },
  name:          { fontSize: 22, fontWeight: '700', color: COLORS.white },
  goalBadge:     { marginTop: 6, backgroundColor: COLORS.white + '25', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 20 },
  section:       { margin: 16, marginBottom: 0, backgroundColor: COLORS.white, borderRadius: 14, padding: 16, borderWidth: 1, borderColor: COLORS.border },
  sectionTitle:  { fontSize: 13, fontWeight: '700', color: COLORS.muted, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 12 },
  weightRow:     { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 8 },
  weightValue:   { fontSize: 24, fontWeight: '700', color: COLORS.dark },
  weightSub:     { fontSize: 12, color: COLORS.muted, marginTop: 2 },
  editIcon:      { fontSize: 20 },
  weightEditRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  weightInput:   { flex: 1, borderWidth: 1.5, borderColor: COLORS.primary, borderRadius: 10, padding: 12, fontSize: 16, color: COLORS.dark },
  saveBtn:       { backgroundColor: COLORS.primary, paddingHorizontal: 18, paddingVertical: 12, borderRadius: 10 },
  saveBtnText:   { color: COLORS.white, fontWeight: '700', fontSize: 14 },
  cancelBtn:     { padding: 12 },
  cancelBtnText: { color: COLORS.muted, fontSize: 18 },
  infoRow:       { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  infoLabel:     { fontSize: 14, color: COLORS.mid },
  infoValue:     { fontSize: 14, fontWeight: '600', color: COLORS.dark, textTransform: 'capitalize' },
  iifymNote:     { fontSize: 13, color: COLORS.mid, lineHeight: 20 },
  disclaimer:    { margin: 16, padding: 16, backgroundColor: COLORS.warning + '15', borderRadius: 12, borderWidth: 1, borderColor: COLORS.warning + '50', marginBottom: 40 },
  disclaimerText:{ fontSize: 13, color: COLORS.mid, lineHeight: 20 },
});
