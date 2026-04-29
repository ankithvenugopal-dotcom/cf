import React, { useState, useCallback } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, ScrollView, FlatList,
  StyleSheet, Alert, ActivityIndicator, KeyboardAvoidingView, Platform, Modal,
} from 'react-native';
import { onboardUser, searchFoods } from '../services/api';
import { FOOD_COMBOS, getPreferredFoodIds } from '../data/foodCombos';
import { COLORS } from '../utils/colors';

const STEPS = [
  { key: 'basics',    title: "Let's get to know you" },
  { key: 'body',      title: 'Your body stats' },
  { key: 'foodprefs', title: 'What do you like to eat?' },
  { key: 'goal',      title: "What's your goal?" },
  { key: 'diet',      title: 'Dietary preference' },
];

const GOALS = [
  { value: 'cut',       label: 'Lose weight',       icon: '🔥' },
  { value: 'mild_cut',  label: 'Lose weight slowly', icon: '📉' },
  { value: 'maintain',  label: 'Maintain weight',    icon: '⚖️' },
  { value: 'mild_gain', label: 'Lean bulk',          icon: '💪' },
  { value: 'gain',      label: 'Build muscle fast',  icon: '🏋️' },
];

const ACTIVITY_LEVELS = [
  { value: 'sedentary',   label: 'Desk job, no exercise' },
  { value: 'light',       label: 'Light exercise 1-3x/week' },
  { value: 'moderate',    label: 'Moderate exercise 3-5x/week' },
  { value: 'active',      label: 'Hard training 6-7x/week' },
  { value: 'very_active', label: 'Athlete / physical job' },
];

const DIETS = [
  { value: 'non_vegetarian', label: 'Non-Vegetarian', icon: '🍗' },
  { value: 'vegetarian',     label: 'Vegetarian',     icon: '🥗' },
  { value: 'vegan',          label: 'Vegan',          icon: '🌱' },
  { value: 'jain',           label: 'Jain',           icon: '🙏' },
];

export default function OnboardingScreen({ navigation }) {
  const [step, setStep]       = useState(0);
  const [loading, setLoading] = useState(false);
  const [form, setForm]       = useState({
    name: '', ageYears: '', weightKg: '', heightCm: '',
    sex: '', activityLevel: '', goal: '', diet: '',
    likedCombos: [],      // combo IDs selected from grid
    customCombos: [],     // [{ name, foodIds: [] }]
  });

  // Custom combo modal state
  const [customModal, setCustomModal]     = useState(false);
  const [customName, setCustomName]       = useState('');
  const [customSlots, setCustomSlots]     = useState(['', '', '']);
  const [slotResults, setSlotResults]     = useState([[], [], []]);
  const [slotPicked, setSlotPicked]       = useState([null, null, null]);
  const [searchingSlot, setSearchingSlot] = useState(-1);

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }));

  const toggleCombo = (id) => {
    setForm(f => ({
      ...f,
      likedCombos: f.likedCombos.includes(id)
        ? f.likedCombos.filter(c => c !== id)
        : [...f.likedCombos, id],
    }));
  };

  // Search for a food for a custom combo slot
  const handleSlotSearch = useCallback(async (text, slotIdx) => {
    const updated = [...customSlots];
    updated[slotIdx] = text;
    setCustomSlots(updated);

    if (text.length < 2) {
      const updatedResults = [...slotResults];
      updatedResults[slotIdx] = [];
      setSlotResults(updatedResults);
      return;
    }
    setSearchingSlot(slotIdx);
    try {
      const results = await searchFoods(text);
      const updatedResults = [...slotResults];
      updatedResults[slotIdx] = results.slice(0, 5);
      setSlotResults(updatedResults);
    } catch {
      // ignore search errors
    } finally {
      setSearchingSlot(-1);
    }
  }, [customSlots, slotResults]);

  const pickSlotFood = (food, slotIdx) => {
    const updated = [...slotPicked];
    updated[slotIdx] = food;
    setSlotPicked(updated);
    const updatedSlots = [...customSlots];
    updatedSlots[slotIdx] = food.name;
    setCustomSlots(updatedSlots);
    const updatedResults = [...slotResults];
    updatedResults[slotIdx] = [];
    setSlotResults(updatedResults);
  };

  const saveCustomCombo = () => {
    const picked = slotPicked.filter(Boolean);
    if (picked.length === 0) { Alert.alert('Add at least one food'); return; }
    const name = customName.trim() || picked.map(f => f.name.split(' ')[0]).join(' + ');
    const combo = { name, foodIds: picked.map(f => f.id) };
    setForm(f => ({ ...f, customCombos: [...f.customCombos, combo] }));
    setCustomModal(false);
    setCustomName('');
    setCustomSlots(['', '', '']);
    setSlotResults([[], [], []]);
    setSlotPicked([null, null, null]);
  };

  const removeCustomCombo = (idx) => {
    setForm(f => ({ ...f, customCombos: f.customCombos.filter((_, i) => i !== idx) }));
  };

  async function handleSubmit() {
    setLoading(true);
    try {
      // Combine selected combos + custom combos into preferred food IDs
      const comboFoodIds = getPreferredFoodIds(form.likedCombos);
      const customFoodIds = form.customCombos.flatMap(c => c.foodIds);
      const preferredFoodIds = [...new Set([...comboFoodIds, ...customFoodIds])];

      const payload = {
        name: form.name,
        ageYears: parseInt(form.ageYears),
        weightKg: parseFloat(form.weightKg),
        heightCm: parseFloat(form.heightCm),
        sex: form.sex,
        activityLevel: form.activityLevel,
        goal: form.goal,
        diet: form.diet || 'non_vegetarian',
        preferredFoodIds,
      };
      await onboardUser(payload);
      navigation.replace('Main');
    } catch (e) {
      Alert.alert('Error', e.response?.data?.error || e.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  }

  function canNext() {
    if (step === 0) return form.name.trim() && form.ageYears && form.sex;
    if (step === 1) return form.weightKg && form.heightCm && form.activityLevel;
    if (step === 2) return true; // food prefs optional
    if (step === 3) return form.goal;
    if (step === 4) return true;
    return false;
  }

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView style={s.screen} contentContainerStyle={s.container} keyboardShouldPersistTaps="handled">

        {/* Progress dots */}
        <View style={s.progressRow}>
          {STEPS.map((_, i) => (
            <View key={i} style={[s.progressDot, i <= step && s.progressDotActive]} />
          ))}
        </View>

        <Text style={s.title}>{STEPS[step].title}</Text>
        {step === 2 && <Text style={s.subtitle}>Select all the combos you enjoy eating. We'll build your plan around them.</Text>}

        {/* ── Step 0: Basics ────────────────────────────────────── */}
        {step === 0 && (
          <View>
            <Text style={s.label}>Your name</Text>
            <TextInput style={s.input} placeholder="e.g. Priya" value={form.name} onChangeText={v => set('name', v)} />
            <Text style={s.label}>Age</Text>
            <TextInput style={s.input} placeholder="e.g. 26" keyboardType="numeric" value={form.ageYears} onChangeText={v => set('ageYears', v)} />
            <Text style={s.label}>Biological sex</Text>
            <View style={s.chipRow}>
              {['male', 'female', 'other'].map(sx => (
                <TouchableOpacity key={sx} style={[s.chip, form.sex === sx && s.chipActive]} onPress={() => set('sex', sx)}>
                  <Text style={[s.chipText, form.sex === sx && s.chipTextActive]}>{sx.charAt(0).toUpperCase() + sx.slice(1)}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* ── Step 1: Body ──────────────────────────────────────── */}
        {step === 1 && (
          <View>
            <Text style={s.label}>Weight (kg)</Text>
            <TextInput style={s.input} placeholder="e.g. 72" keyboardType="decimal-pad" value={form.weightKg} onChangeText={v => set('weightKg', v)} />
            <Text style={s.label}>Height (cm)</Text>
            <TextInput style={s.input} placeholder="e.g. 168" keyboardType="decimal-pad" value={form.heightCm} onChangeText={v => set('heightCm', v)} />
            <Text style={s.label}>Activity level</Text>
            {ACTIVITY_LEVELS.map(al => (
              <TouchableOpacity key={al.value} style={[s.optionRow, form.activityLevel === al.value && s.optionRowActive]} onPress={() => set('activityLevel', al.value)}>
                <Text style={[s.optionText, form.activityLevel === al.value && s.optionTextActive]}>{al.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* ── Step 2: Food Preferences ──────────────────────────── */}
        {step === 2 && (
          <View>
            <View style={s.comboGrid}>
              {FOOD_COMBOS.map(combo => {
                const liked = form.likedCombos.includes(combo.id);
                return (
                  <TouchableOpacity
                    key={combo.id}
                    style={[s.comboCard, liked && s.comboCardActive]}
                    onPress={() => toggleCombo(combo.id)}
                  >
                    <Text style={s.comboIcon}>{combo.icon}</Text>
                    <Text style={[s.comboName, liked && s.comboNameActive]} numberOfLines={1}>{combo.name}</Text>
                    <Text style={s.comboDesc} numberOfLines={1}>{combo.desc}</Text>
                    {liked && <View style={s.comboBadge}><Text style={s.comboBadgeText}>✓</Text></View>}
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Custom combos list */}
            {form.customCombos.length > 0 && (
              <View style={s.customList}>
                <Text style={s.customListTitle}>Your custom combos</Text>
                {form.customCombos.map((c, i) => (
                  <View key={i} style={s.customComboRow}>
                    <Text style={s.customComboName}>🍽️ {c.name}</Text>
                    <TouchableOpacity onPress={() => removeCustomCombo(i)}>
                      <Text style={s.customComboRemove}>✕</Text>
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            )}

            {/* Add custom combo button */}
            {form.customCombos.length < 4 && (
              <TouchableOpacity style={s.addCustomBtn} onPress={() => setCustomModal(true)}>
                <Text style={s.addCustomBtnText}>+ Add your own combo</Text>
              </TouchableOpacity>
            )}

            {form.likedCombos.length === 0 && form.customCombos.length === 0 && (
              <Text style={s.skipNote}>You can skip this — we'll build a balanced plan for you.</Text>
            )}
          </View>
        )}

        {/* ── Step 3: Goal ──────────────────────────────────────── */}
        {step === 3 && (
          <View>
            {GOALS.map(g => (
              <TouchableOpacity key={g.value} style={[s.goalCard, form.goal === g.value && s.goalCardActive]} onPress={() => set('goal', g.value)}>
                <Text style={s.goalIcon}>{g.icon}</Text>
                <Text style={[s.goalLabel, form.goal === g.value && s.goalLabelActive]}>{g.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* ── Step 4: Diet ──────────────────────────────────────── */}
        {step === 4 && (
          <View>
            {DIETS.map(d => (
              <TouchableOpacity key={d.value} style={[s.optionRow, form.diet === d.value && s.optionRowActive]} onPress={() => set('diet', d.value)}>
                <Text style={s.dietIcon}>{d.icon}</Text>
                <Text style={[s.optionText, form.diet === d.value && s.optionTextActive]}>{d.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Navigation buttons */}
        <View style={s.btnRow}>
          {step > 0 && (
            <TouchableOpacity style={s.btnBack} onPress={() => setStep(step - 1)}>
              <Text style={s.btnBackText}>Back</Text>
            </TouchableOpacity>
          )}
          {step < STEPS.length - 1 ? (
            <TouchableOpacity style={[s.btn, !canNext() && s.btnDisabled]} onPress={() => canNext() && setStep(step + 1)}>
              <Text style={s.btnText}>Next</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={s.btn} onPress={handleSubmit} disabled={loading}>
              {loading ? <ActivityIndicator color="#fff" /> : <Text style={s.btnText}>Generate My Plan</Text>}
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>

      {/* Custom Combo Modal */}
      <Modal visible={customModal} animationType="slide" transparent>
        <View style={s.modalOverlay}>
          <View style={s.modalBox}>
            <Text style={s.modalTitle}>Create your combo</Text>
            <Text style={s.modalSub}>Name it and pick 1–3 foods you eat together</Text>

            <TextInput
              style={s.modalInput}
              placeholder="Combo name (optional)"
              value={customName}
              onChangeText={setCustomName}
            />

            {[0, 1, 2].map(idx => (
              <View key={idx} style={s.slotWrap}>
                <Text style={s.slotLabel}>Food {idx + 1}{idx === 0 ? ' *' : ' (optional)'}</Text>
                <View style={s.slotInputRow}>
                  <TextInput
                    style={[s.slotInput, slotPicked[idx] && s.slotInputPicked]}
                    placeholder={`Search food ${idx + 1}...`}
                    value={customSlots[idx]}
                    onChangeText={t => handleSlotSearch(t, idx)}
                  />
                  {searchingSlot === idx && <ActivityIndicator size="small" color={COLORS.primary} style={{ marginLeft: 8 }} />}
                  {slotPicked[idx] && (
                    <TouchableOpacity onPress={() => {
                      const u = [...slotPicked]; u[idx] = null; setSlotPicked(u);
                      const s2 = [...customSlots]; s2[idx] = ''; setCustomSlots(s2);
                    }}>
                      <Text style={s.clearSlot}>✕</Text>
                    </TouchableOpacity>
                  )}
                </View>
                {slotResults[idx]?.length > 0 && (
                  <View style={s.slotDropdown}>
                    {slotResults[idx].map(food => (
                      <TouchableOpacity key={food.id} style={s.slotOption} onPress={() => pickSlotFood(food, idx)}>
                        <Text style={s.slotOptionName}>{food.name}</Text>
                        <Text style={s.slotOptionCal}>{food.calories} kcal</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </View>
            ))}

            <View style={s.modalBtns}>
              <TouchableOpacity style={s.modalCancel} onPress={() => setCustomModal(false)}>
                <Text style={s.modalCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={s.modalConfirm} onPress={saveCustomCombo}>
                <Text style={s.modalConfirmText}>Add Combo</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
}

const s = StyleSheet.create({
  screen:          { flex: 1, backgroundColor: COLORS.screenBg },
  container:       { padding: 24, paddingBottom: 60 },
  progressRow:     { flexDirection: 'row', gap: 8, marginBottom: 28 },
  progressDot:     { width: 8, height: 8, borderRadius: 4, backgroundColor: COLORS.border },
  progressDotActive:{ backgroundColor: COLORS.primary },
  title:           { fontSize: 24, fontWeight: '700', color: COLORS.dark, marginBottom: 8 },
  subtitle:        { fontSize: 14, color: COLORS.muted, marginBottom: 20, lineHeight: 20 },
  label:           { fontSize: 14, fontWeight: '600', color: COLORS.mid, marginBottom: 6, marginTop: 16 },
  input:           { backgroundColor: COLORS.white, borderWidth: 1, borderColor: COLORS.border, borderRadius: 10, padding: 14, fontSize: 16 },
  chipRow:         { flexDirection: 'row', gap: 10, marginTop: 4 },
  chip:            { paddingVertical: 8, paddingHorizontal: 18, borderRadius: 20, borderWidth: 1.5, borderColor: COLORS.border, backgroundColor: COLORS.white },
  chipActive:      { borderColor: COLORS.primary, backgroundColor: COLORS.primary + '15' },
  chipText:        { color: COLORS.mid, fontWeight: '500' },
  chipTextActive:  { color: COLORS.primary, fontWeight: '700' },
  optionRow:       { flexDirection: 'row', alignItems: 'center', padding: 14, borderRadius: 10, borderWidth: 1.5, borderColor: COLORS.border, backgroundColor: COLORS.white, marginTop: 8 },
  optionRowActive: { borderColor: COLORS.primary, backgroundColor: COLORS.primary + '10' },
  optionText:      { fontSize: 15, color: COLORS.dark },
  optionTextActive:{ color: COLORS.primary, fontWeight: '600' },
  dietIcon:        { fontSize: 20, marginRight: 12 },
  goalCard:        { flexDirection: 'row', alignItems: 'center', padding: 16, borderRadius: 12, borderWidth: 1.5, borderColor: COLORS.border, backgroundColor: COLORS.white, marginTop: 10 },
  goalCardActive:  { borderColor: COLORS.primary, backgroundColor: COLORS.primary + '10' },
  goalIcon:        { fontSize: 24, marginRight: 14 },
  goalLabel:       { fontSize: 16, color: COLORS.dark, fontWeight: '500' },
  goalLabelActive: { color: COLORS.primary, fontWeight: '700' },

  // Combo grid
  comboGrid:       { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  comboCard:       { width: '47%', backgroundColor: COLORS.white, borderRadius: 12, padding: 12, borderWidth: 1.5, borderColor: COLORS.border, position: 'relative' },
  comboCardActive: { borderColor: COLORS.primary, backgroundColor: COLORS.primary + '08' },
  comboIcon:       { fontSize: 28, marginBottom: 6 },
  comboName:       { fontSize: 14, fontWeight: '700', color: COLORS.dark },
  comboNameActive: { color: COLORS.primary },
  comboDesc:       { fontSize: 11, color: COLORS.muted, marginTop: 2 },
  comboBadge:      { position: 'absolute', top: 8, right: 8, width: 20, height: 20, borderRadius: 10, backgroundColor: COLORS.primary, justifyContent: 'center', alignItems: 'center' },
  comboBadgeText:  { color: COLORS.white, fontSize: 10, fontWeight: '700' },

  // Custom combos
  customList:      { marginTop: 16, backgroundColor: COLORS.white, borderRadius: 12, padding: 12, borderWidth: 1, borderColor: COLORS.border },
  customListTitle: { fontSize: 12, fontWeight: '700', color: COLORS.muted, textTransform: 'uppercase', marginBottom: 8 },
  customComboRow:  { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 6 },
  customComboName: { fontSize: 14, color: COLORS.dark, flex: 1 },
  customComboRemove:{ color: COLORS.danger, fontSize: 16, paddingLeft: 12 },
  addCustomBtn:    { marginTop: 12, borderWidth: 1.5, borderColor: COLORS.primary, borderRadius: 12, borderStyle: 'dashed', padding: 14, alignItems: 'center' },
  addCustomBtnText:{ color: COLORS.primary, fontWeight: '700', fontSize: 14 },
  skipNote:        { marginTop: 16, color: COLORS.muted, fontSize: 13, textAlign: 'center' },

  // Nav buttons
  btnRow:          { flexDirection: 'row', gap: 12, marginTop: 36 },
  btn:             { flex: 1, backgroundColor: COLORS.primary, borderRadius: 12, padding: 16, alignItems: 'center' },
  btnDisabled:     { opacity: 0.45 },
  btnText:         { color: COLORS.white, fontSize: 16, fontWeight: '700' },
  btnBack:         { flex: 0.4, backgroundColor: COLORS.border, borderRadius: 12, padding: 16, alignItems: 'center' },
  btnBackText:     { color: COLORS.mid, fontSize: 16, fontWeight: '600' },

  // Modal
  modalOverlay:    { flex: 1, backgroundColor: '#00000066', justifyContent: 'flex-end' },
  modalBox:        { backgroundColor: COLORS.white, borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 24, maxHeight: '90%' },
  modalTitle:      { fontSize: 18, fontWeight: '700', color: COLORS.dark, marginBottom: 4 },
  modalSub:        { fontSize: 13, color: COLORS.muted, marginBottom: 16 },
  modalInput:      { borderWidth: 1.5, borderColor: COLORS.border, borderRadius: 10, padding: 12, fontSize: 15, color: COLORS.dark, marginBottom: 12 },
  slotWrap:        { marginBottom: 12 },
  slotLabel:       { fontSize: 12, fontWeight: '600', color: COLORS.muted, marginBottom: 4 },
  slotInputRow:    { flexDirection: 'row', alignItems: 'center' },
  slotInput:       { flex: 1, borderWidth: 1.5, borderColor: COLORS.border, borderRadius: 10, padding: 11, fontSize: 14, color: COLORS.dark },
  slotInputPicked: { borderColor: COLORS.success, backgroundColor: COLORS.success + '10' },
  clearSlot:       { color: COLORS.muted, fontSize: 18, paddingLeft: 10 },
  slotDropdown:    { backgroundColor: COLORS.white, borderRadius: 8, borderWidth: 1, borderColor: COLORS.border, marginTop: 4, overflow: 'hidden' },
  slotOption:      { flexDirection: 'row', justifyContent: 'space-between', padding: 10, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  slotOptionName:  { fontSize: 13, color: COLORS.dark, flex: 1 },
  slotOptionCal:   { fontSize: 12, color: COLORS.muted },
  modalBtns:       { flexDirection: 'row', gap: 12, marginTop: 16 },
  modalCancel:     { flex: 1, padding: 14, borderRadius: 12, backgroundColor: COLORS.border, alignItems: 'center' },
  modalCancelText: { color: COLORS.mid, fontWeight: '600' },
  modalConfirm:    { flex: 1, padding: 14, borderRadius: 12, backgroundColor: COLORS.primary, alignItems: 'center' },
  modalConfirmText:{ color: COLORS.white, fontWeight: '700' },
});
