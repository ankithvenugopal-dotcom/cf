import React, { useState, useCallback } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, ScrollView, FlatList,
  StyleSheet, Alert, ActivityIndicator, KeyboardAvoidingView, Platform, Modal,
} from 'react-native';
import { onboardUser, searchFoods } from '../services/api';
import { FOOD_COMBOS, getPreferredFoodIds } from '../data/foodCombos';
import { COLORS } from '../utils/colors';

const STEPS = [
  { key: 'basics',    title: "Let's get to know you",      subtitle: 'A few basics to personalise your plan.' },
  { key: 'body',      title: 'Your body stats',            subtitle: 'Used to calculate your daily calorie target.' },
  { key: 'goal',      title: "What's your goal?",          subtitle: 'This adjusts your calorie & macro targets.' },
  { key: 'numbers',   title: 'Your calculated numbers',    subtitle: 'Here\'s exactly how your plan is built.' },
  { key: 'foodprefs', title: 'What do you like to eat?',   subtitle: 'Select combos you enjoy — we\'ll build your plan around them.' },
  { key: 'diet',      title: 'Dietary preference',         subtitle: 'We\'ll make sure every meal fits your diet.' },
];

const GOALS = [
  { value: 'cut',       label: 'Lose weight',        icon: '🔥', desc: '−20% calories' },
  { value: 'mild_cut',  label: 'Lose weight slowly', icon: '📉', desc: '−12% calories' },
  { value: 'maintain',  label: 'Maintain weight',    icon: '⚖️',  desc: 'TDEE calories' },
  { value: 'mild_gain', label: 'Lean bulk',          icon: '💪', desc: '+10% calories' },
  { value: 'gain',      label: 'Build muscle fast',  icon: '🏋️', desc: '+15% calories' },
];

const ACTIVITY_LEVELS = [
  { value: 'sedentary',   label: 'Desk job, little / no exercise',   factor: 1.2 },
  { value: 'light',       label: 'Light exercise 1–3×/week',         factor: 1.375 },
  { value: 'moderate',    label: 'Moderate exercise 3–5×/week',      factor: 1.55 },
  { value: 'active',      label: 'Hard training 6–7×/week',          factor: 1.725 },
  { value: 'very_active', label: 'Athlete / physical job',           factor: 1.9 },
];

const DIETS = [
  { value: 'non_vegetarian', label: 'Non-Vegetarian', icon: '🍗' },
  { value: 'vegetarian',     label: 'Vegetarian',     icon: '🥗' },
  { value: 'vegan',          label: 'Vegan',          icon: '🌱' },
  { value: 'jain',           label: 'Jain',           icon: '🙏' },
];

// ── TDEE / Macro calculator (mirrors backend logic) ──────────────────────────
function calcNumbers(form) {
  const w = parseFloat(form.weightKg);
  const h = parseFloat(form.heightCm);
  const a = parseInt(form.ageYears);
  if (!w || !h || !a || !form.sex || !form.activityLevel || !form.goal) return null;

  // Mifflin-St Jeor BMR
  const bmr = form.sex === 'female'
    ? 10 * w + 6.25 * h - 5 * a - 161
    : 10 * w + 6.25 * h - 5 * a + 5;

  const actFactor = ACTIVITY_LEVELS.find(al => al.value === form.activityLevel)?.factor || 1.2;
  const tdee      = Math.round(bmr * actFactor);

  const goalAdj = { cut: -0.20, mild_cut: -0.12, maintain: 0, mild_gain: 0.10, gain: 0.15 };
  const targetCals = Math.round(tdee * (1 + (goalAdj[form.goal] || 0)));

  // IIFYM macros
  const proteinMultiplier = form.goal === 'cut' ? 2.2 : form.goal === 'maintain' ? 1.8 : 1.6;
  const fatMultiplier     = form.goal === 'cut' ? 0.75 : 0.9;
  const proteinG = Math.round(w * proteinMultiplier);
  const fatG     = Math.round(w * fatMultiplier);
  const carbsG   = Math.max(Math.round((targetCals - proteinG * 4 - fatG * 9) / 4), 0);
  const bmi      = (w / Math.pow(h / 100, 2)).toFixed(1);

  const bmiLabel =
    bmi < 18.5 ? 'Underweight' :
    bmi < 25   ? 'Normal weight' :
    bmi < 30   ? 'Overweight' : 'Obese';

  return { bmr: Math.round(bmr), tdee, targetCals, proteinG, fatG, carbsG, bmi, bmiLabel };
}

// ─────────────────────────────────────────────────────────────────────────────

export default function OnboardingScreen({ navigation }) {
  const [step, setStep]       = useState(0);
  const [loading, setLoading] = useState(false);
  const [form, setForm]       = useState({
    name: '', ageYears: '', weightKg: '', heightCm: '',
    sex: '', activityLevel: '', goal: '', diet: '',
    likedCombos: [],
    customCombos: [],
  });

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

  const handleSlotSearch = useCallback(async (text, slotIdx) => {
    const updated = [...customSlots];
    updated[slotIdx] = text;
    setCustomSlots(updated);
    if (text.length < 2) {
      const r = [...slotResults]; r[slotIdx] = []; setSlotResults(r); return;
    }
    setSearchingSlot(slotIdx);
    try {
      const results = await searchFoods(text);
      const r = [...slotResults]; r[slotIdx] = results.slice(0, 5); setSlotResults(r);
    } catch { /* ignore */ }
    finally { setSearchingSlot(-1); }
  }, [customSlots, slotResults]);

  const pickSlotFood = (food, slotIdx) => {
    const p = [...slotPicked]; p[slotIdx] = food; setSlotPicked(p);
    const sl = [...customSlots]; sl[slotIdx] = food.name; setCustomSlots(sl);
    const r  = [...slotResults]; r[slotIdx]  = [];         setSlotResults(r);
  };

  const saveCustomCombo = () => {
    const picked = slotPicked.filter(Boolean);
    if (picked.length === 0) { Alert.alert('Add at least one food'); return; }
    const name = customName.trim() || picked.map(f => f.name.split(' ')[0]).join(' + ');
    setForm(f => ({ ...f, customCombos: [...f.customCombos, { name, foodIds: picked.map(f => f.id) }] }));
    setCustomModal(false);
    setCustomName('');
    setCustomSlots(['', '', '']);
    setSlotResults([[], [], []]);
    setSlotPicked([null, null, null]);
  };

  const removeCustomCombo = (idx) =>
    setForm(f => ({ ...f, customCombos: f.customCombos.filter((_, i) => i !== idx) }));

  async function handleSubmit() {
    setLoading(true);
    try {
      const comboFoodIds   = getPreferredFoodIds(form.likedCombos);
      const customFoodIds  = form.customCombos.flatMap(c => c.foodIds);
      const preferredFoodIds = [...new Set([...comboFoodIds, ...customFoodIds])];
      await onboardUser({
        name: form.name,
        ageYears: parseInt(form.ageYears),
        weightKg: parseFloat(form.weightKg),
        heightCm: parseFloat(form.heightCm),
        sex: form.sex,
        activityLevel: form.activityLevel,
        goal: form.goal,
        diet: form.diet || 'non_vegetarian',
        preferredFoodIds,
      });
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
    if (step === 2) return !!form.goal;
    if (step === 3) return true; // numbers — always can proceed
    if (step === 4) return true; // food prefs optional
    if (step === 5) return true;
    return false;
  }

  const nums = calcNumbers(form);

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView
        style={s.screen}
        contentContainerStyle={s.container}
        keyboardShouldPersistTaps="handled"
      >
        {/* Progress bar */}
        <View style={s.progressRow}>
          {STEPS.map((_, i) => (
            <View key={i} style={[s.progressDot, i <= step && s.progressDotActive]} />
          ))}
        </View>

        <Text style={s.stepLabel}>Step {step + 1} of {STEPS.length}</Text>
        <Text style={s.title}>{STEPS[step].title}</Text>
        <Text style={s.subtitle}>{STEPS[step].subtitle}</Text>

        {/* ── Step 0: Basics ──────────────────────────────────── */}
        {step === 0 && (
          <View>
            <Text style={s.label}>Your name</Text>
            <TextInput style={s.input} placeholder="e.g. Priya" placeholderTextColor={COLORS.muted}
              value={form.name} onChangeText={v => set('name', v)} />

            <Text style={s.label}>Age</Text>
            <TextInput style={s.input} placeholder="e.g. 26" placeholderTextColor={COLORS.muted}
              keyboardType="numeric" value={form.ageYears} onChangeText={v => set('ageYears', v)} />

            <Text style={s.label}>Biological sex</Text>
            <View style={s.chipRow}>
              {['male', 'female', 'other'].map(sx => (
                <TouchableOpacity key={sx} style={[s.chip, form.sex === sx && s.chipActive]} onPress={() => set('sex', sx)}>
                  <Text style={[s.chipText, form.sex === sx && s.chipTextActive]}>
                    {sx.charAt(0).toUpperCase() + sx.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* ── Step 1: Body ────────────────────────────────────── */}
        {step === 1 && (
          <View>
            <View style={s.inputRow}>
              <View style={{ flex: 1 }}>
                <Text style={s.label}>Weight</Text>
                <View style={s.inputWithUnit}>
                  <TextInput style={[s.input, { flex: 1 }]} placeholder="72" placeholderTextColor={COLORS.muted}
                    keyboardType="decimal-pad" value={form.weightKg} onChangeText={v => set('weightKg', v)} />
                  <Text style={s.unitLabel}>kg</Text>
                </View>
              </View>
              <View style={{ width: 12 }} />
              <View style={{ flex: 1 }}>
                <Text style={s.label}>Height</Text>
                <View style={s.inputWithUnit}>
                  <TextInput style={[s.input, { flex: 1 }]} placeholder="168" placeholderTextColor={COLORS.muted}
                    keyboardType="decimal-pad" value={form.heightCm} onChangeText={v => set('heightCm', v)} />
                  <Text style={s.unitLabel}>cm</Text>
                </View>
              </View>
            </View>

            {form.weightKg && form.heightCm && (
              <View style={s.bmiPeek}>
                <Text style={s.bmiPeekText}>
                  BMI: {(parseFloat(form.weightKg) / Math.pow(parseFloat(form.heightCm) / 100, 2)).toFixed(1)}
                </Text>
              </View>
            )}

            <Text style={s.label}>Activity level</Text>
            {ACTIVITY_LEVELS.map(al => (
              <TouchableOpacity key={al.value}
                style={[s.optionRow, form.activityLevel === al.value && s.optionRowActive]}
                onPress={() => set('activityLevel', al.value)}
              >
                <Text style={[s.optionText, form.activityLevel === al.value && s.optionTextActive]}>
                  {al.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* ── Step 2: Goal ────────────────────────────────────── */}
        {step === 2 && (
          <View>
            {GOALS.map(g => (
              <TouchableOpacity key={g.value}
                style={[s.goalCard, form.goal === g.value && s.goalCardActive]}
                onPress={() => set('goal', g.value)}
              >
                <Text style={s.goalIcon}>{g.icon}</Text>
                <View style={{ flex: 1 }}>
                  <Text style={[s.goalLabel, form.goal === g.value && s.goalLabelActive]}>{g.label}</Text>
                  <Text style={s.goalDesc}>{g.desc}</Text>
                </View>
                {form.goal === g.value && <Text style={s.goalCheck}>✓</Text>}
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* ── Step 3: Your Numbers (TDEE preview) ─────────────── */}
        {step === 3 && nums && (
          <View>
            {/* Main calorie target */}
            <View style={s.numbersHero}>
              <Text style={s.numbersHeroLabel}>Your daily calorie target</Text>
              <Text style={s.numbersHeroCal}>{nums.targetCals.toLocaleString()}</Text>
              <Text style={s.numbersHeroUnit}>kcal / day</Text>
            </View>

            {/* TDEE breakdown */}
            <View style={s.numbersCard}>
              <Text style={s.numbersCardTitle}>How we calculated this</Text>
              <NumberRow label="Basal Metabolic Rate (BMR)"      value={`${nums.bmr.toLocaleString()} kcal`} sub="calories your body burns at complete rest" />
              <View style={s.numbersDivider} />
              <NumberRow label={`TDEE (activity: ${form.activityLevel.replace('_', ' ')})`} value={`${nums.tdee.toLocaleString()} kcal`} sub="total daily energy expenditure" />
              <View style={s.numbersDivider} />
              <NumberRow
                label={`Goal adjustment (${form.goal.replace('_', ' ')})`}
                value={`${nums.targetCals.toLocaleString()} kcal`}
                sub="after applying your goal"
                highlight
              />
            </View>

            {/* Macros */}
            <View style={s.numbersCard}>
              <Text style={s.numbersCardTitle}>Your daily macros  (IIFYM method)</Text>
              <View style={s.macroPreviewRow}>
                <MacroPreviewChip label="Protein" value={nums.proteinG} unit="g"
                  sub={`${nums.proteinG * 4} kcal`} color={COLORS.secondary} />
                <MacroPreviewChip label="Carbs"   value={nums.carbsG}   unit="g"
                  sub={`${nums.carbsG * 4} kcal`} color={COLORS.warning} />
                <MacroPreviewChip label="Fat"     value={nums.fatG}     unit="g"
                  sub={`${nums.fatG * 9} kcal`}  color="#9C27B0" />
              </View>
              <Text style={s.macroNote}>
                Protein anchored to body weight ({(nums.proteinG / parseFloat(form.weightKg)).toFixed(1)}g/kg).
                Remaining calories filled by carbs.
              </Text>
            </View>

            {/* BMI */}
            <View style={s.numbersCard}>
              <Text style={s.numbersCardTitle}>Body Mass Index (BMI)</Text>
              <View style={s.bmiRow}>
                <Text style={s.bmiValue}>{nums.bmi}</Text>
                <View>
                  <Text style={s.bmiLabel}>{nums.bmiLabel}</Text>
                  <Text style={s.bmiSub}>{form.weightKg} kg · {form.heightCm} cm</Text>
                </View>
              </View>
            </View>

            <Text style={s.numbersNote}>
              These numbers are calculated using the Mifflin-St Jeor formula.
              Your actual plan will be refined weekly as you log cravings.
            </Text>
          </View>
        )}

        {/* ── Step 4: Food Preferences ────────────────────────── */}
        {step === 4 && (
          <View>
            <View style={s.comboGrid}>
              {FOOD_COMBOS.map(combo => {
                const liked = form.likedCombos.includes(combo.id);
                return (
                  <TouchableOpacity key={combo.id}
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

        {/* ── Step 5: Diet ────────────────────────────────────── */}
        {step === 5 && (
          <View>
            {DIETS.map(d => (
              <TouchableOpacity key={d.value}
                style={[s.optionRow, form.diet === d.value && s.optionRowActive]}
                onPress={() => set('diet', d.value)}
              >
                <Text style={s.dietIcon}>{d.icon}</Text>
                <Text style={[s.optionText, form.diet === d.value && s.optionTextActive]}>{d.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Navigation */}
        <View style={s.btnRow}>
          {step > 0 && (
            <TouchableOpacity style={s.btnBack} onPress={() => setStep(step - 1)}>
              <Text style={s.btnBackText}>Back</Text>
            </TouchableOpacity>
          )}
          {step < STEPS.length - 1 ? (
            <TouchableOpacity
              style={[s.btn, !canNext() && s.btnDisabled]}
              onPress={() => canNext() && setStep(step + 1)}
            >
              <Text style={s.btnText}>{step === 3 ? 'Looks good →' : 'Next'}</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={s.btn} onPress={handleSubmit} disabled={loading}>
              {loading
                ? <ActivityIndicator color="#fff" />
                : <Text style={s.btnText}>Generate My Plan</Text>
              }
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

            <TextInput style={s.modalInput} placeholder="Combo name (optional)"
              placeholderTextColor={COLORS.muted} value={customName} onChangeText={setCustomName} />

            {[0, 1, 2].map(idx => (
              <View key={idx} style={s.slotWrap}>
                <Text style={s.slotLabel}>Food {idx + 1}{idx === 0 ? ' *' : ' (optional)'}</Text>
                <View style={s.slotInputRow}>
                  <TextInput
                    style={[s.slotInput, slotPicked[idx] && s.slotInputPicked]}
                    placeholder={`Search food ${idx + 1}...`}
                    placeholderTextColor={COLORS.muted}
                    value={customSlots[idx]}
                    onChangeText={t => handleSlotSearch(t, idx)}
                  />
                  {searchingSlot === idx && (
                    <ActivityIndicator size="small" color={COLORS.primary} style={{ marginLeft: 8 }} />
                  )}
                  {slotPicked[idx] && (
                    <TouchableOpacity onPress={() => {
                      const p = [...slotPicked]; p[idx] = null; setSlotPicked(p);
                      const sl = [...customSlots]; sl[idx] = ''; setCustomSlots(sl);
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

// ── Sub-components ────────────────────────────────────────────────────────────

function NumberRow({ label, value, sub, highlight }) {
  return (
    <View style={s.numberRow}>
      <View style={{ flex: 1 }}>
        <Text style={[s.numberRowLabel, highlight && { color: COLORS.primary }]}>{label}</Text>
        {sub && <Text style={s.numberRowSub}>{sub}</Text>}
      </View>
      <Text style={[s.numberRowValue, highlight && { color: COLORS.primary }]}>{value}</Text>
    </View>
  );
}

function MacroPreviewChip({ label, value, unit, sub, color }) {
  return (
    <View style={[s.macroChip, { borderColor: color + '60' }]}>
      <Text style={[s.macroChipValue, { color }]}>{value}<Text style={s.macroChipUnit}>{unit}</Text></Text>
      <Text style={s.macroChipLabel}>{label}</Text>
      <Text style={s.macroChipSub}>{sub}</Text>
    </View>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────

const s = StyleSheet.create({
  screen:          { flex: 1, backgroundColor: COLORS.bg },
  container:       { padding: 24, paddingBottom: 60 },
  progressRow:     { flexDirection: 'row', gap: 6, marginBottom: 20 },
  progressDot:     { flex: 1, height: 4, borderRadius: 2, backgroundColor: COLORS.border },
  progressDotActive:{ backgroundColor: COLORS.primary },
  stepLabel:       { fontSize: 12, color: COLORS.muted, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6 },
  title:           { fontSize: 24, fontWeight: '800', color: COLORS.text, marginBottom: 6 },
  subtitle:        { fontSize: 14, color: COLORS.muted, marginBottom: 24, lineHeight: 20 },

  label:           { fontSize: 13, fontWeight: '600', color: COLORS.textSub, marginBottom: 8, marginTop: 16 },
  input:           { backgroundColor: COLORS.surface, borderWidth: 1.5, borderColor: COLORS.border, borderRadius: 12, padding: 14, fontSize: 16, color: COLORS.text },
  inputRow:        { flexDirection: 'row' },
  inputWithUnit:   { flexDirection: 'row', alignItems: 'center', gap: 8 },
  unitLabel:       { fontSize: 14, color: COLORS.muted, fontWeight: '600', width: 24 },

  bmiPeek:         { backgroundColor: COLORS.secondary + '18', borderRadius: 8, padding: 8, marginTop: 8, alignSelf: 'flex-start' },
  bmiPeekText:     { fontSize: 13, color: COLORS.secondary, fontWeight: '600' },

  chipRow:         { flexDirection: 'row', gap: 10, marginTop: 4 },
  chip:            { paddingVertical: 10, paddingHorizontal: 20, borderRadius: 22, borderWidth: 1.5, borderColor: COLORS.border, backgroundColor: COLORS.surface },
  chipActive:      { borderColor: COLORS.primary, backgroundColor: COLORS.primary + '20' },
  chipText:        { color: COLORS.muted, fontWeight: '500' },
  chipTextActive:  { color: COLORS.primary, fontWeight: '700' },

  optionRow:       { flexDirection: 'row', alignItems: 'center', padding: 14, borderRadius: 12, borderWidth: 1.5, borderColor: COLORS.border, backgroundColor: COLORS.surface, marginTop: 8 },
  optionRowActive: { borderColor: COLORS.primary, backgroundColor: COLORS.primary + '18' },
  optionText:      { fontSize: 15, color: COLORS.textSub, flex: 1 },
  optionTextActive:{ color: COLORS.primary, fontWeight: '600' },
  dietIcon:        { fontSize: 20, marginRight: 12 },

  goalCard:        { flexDirection: 'row', alignItems: 'center', padding: 16, borderRadius: 14, borderWidth: 1.5, borderColor: COLORS.border, backgroundColor: COLORS.surface, marginTop: 10 },
  goalCardActive:  { borderColor: COLORS.primary, backgroundColor: COLORS.primary + '18' },
  goalIcon:        { fontSize: 26, marginRight: 14 },
  goalLabel:       { fontSize: 15, color: COLORS.textSub, fontWeight: '500' },
  goalLabelActive: { color: COLORS.primary, fontWeight: '700' },
  goalDesc:        { fontSize: 12, color: COLORS.muted, marginTop: 2 },
  goalCheck:       { fontSize: 18, color: COLORS.primary, fontWeight: '700' },

  // Numbers step
  numbersHero:     { backgroundColor: COLORS.primary + '18', borderRadius: 16, padding: 24, alignItems: 'center', borderWidth: 1.5, borderColor: COLORS.primary + '40', marginBottom: 16 },
  numbersHeroLabel:{ fontSize: 13, color: COLORS.primary, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5 },
  numbersHeroCal:  { fontSize: 56, fontWeight: '800', color: COLORS.primary, marginTop: 8 },
  numbersHeroUnit: { fontSize: 14, color: COLORS.muted, marginTop: 2 },
  numbersCard:     { backgroundColor: COLORS.surface, borderRadius: 14, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: COLORS.border },
  numbersCardTitle:{ fontSize: 13, fontWeight: '700', color: COLORS.muted, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 12 },
  numberRow:       { flexDirection: 'row', alignItems: 'flex-start', paddingVertical: 8 },
  numberRowLabel:  { fontSize: 14, color: COLORS.text, fontWeight: '500' },
  numberRowSub:    { fontSize: 12, color: COLORS.muted, marginTop: 2 },
  numberRowValue:  { fontSize: 15, fontWeight: '700', color: COLORS.text },
  numbersDivider:  { height: 1, backgroundColor: COLORS.border },
  macroPreviewRow: { flexDirection: 'row', gap: 8, marginBottom: 12 },
  macroChip:       { flex: 1, borderRadius: 12, borderWidth: 1.5, padding: 12, alignItems: 'center', backgroundColor: COLORS.cardAlt },
  macroChipValue:  { fontSize: 22, fontWeight: '800' },
  macroChipUnit:   { fontSize: 12, fontWeight: '400' },
  macroChipLabel:  { fontSize: 12, color: COLORS.textSub, fontWeight: '600', marginTop: 2 },
  macroChipSub:    { fontSize: 11, color: COLORS.muted, marginTop: 1 },
  macroNote:       { fontSize: 12, color: COLORS.muted, lineHeight: 18 },
  bmiRow:          { flexDirection: 'row', alignItems: 'center', gap: 16 },
  bmiValue:        { fontSize: 40, fontWeight: '800', color: COLORS.text },
  bmiLabel:        { fontSize: 16, fontWeight: '700', color: COLORS.text },
  bmiSub:          { fontSize: 12, color: COLORS.muted, marginTop: 2 },
  numbersNote:     { fontSize: 12, color: COLORS.muted, textAlign: 'center', lineHeight: 18, marginTop: 4, marginBottom: 8 },

  // Combo grid
  comboGrid:       { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  comboCard:       { width: '47%', backgroundColor: COLORS.surface, borderRadius: 14, padding: 12, borderWidth: 1.5, borderColor: COLORS.border, position: 'relative' },
  comboCardActive: { borderColor: COLORS.primary, backgroundColor: COLORS.primary + '12' },
  comboIcon:       { fontSize: 28, marginBottom: 6 },
  comboName:       { fontSize: 14, fontWeight: '700', color: COLORS.text },
  comboNameActive: { color: COLORS.primary },
  comboDesc:       { fontSize: 11, color: COLORS.muted, marginTop: 2 },
  comboBadge:      { position: 'absolute', top: 8, right: 8, width: 20, height: 20, borderRadius: 10, backgroundColor: COLORS.primary, justifyContent: 'center', alignItems: 'center' },
  comboBadgeText:  { color: COLORS.white, fontSize: 10, fontWeight: '700' },

  customList:      { marginTop: 16, backgroundColor: COLORS.surface, borderRadius: 12, padding: 12, borderWidth: 1, borderColor: COLORS.border },
  customListTitle: { fontSize: 12, fontWeight: '700', color: COLORS.muted, textTransform: 'uppercase', marginBottom: 8 },
  customComboRow:  { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 6 },
  customComboName: { fontSize: 14, color: COLORS.text, flex: 1 },
  customComboRemove:{ color: COLORS.danger, fontSize: 16, paddingLeft: 12 },
  addCustomBtn:    { marginTop: 12, borderWidth: 1.5, borderColor: COLORS.primary, borderRadius: 12, borderStyle: 'dashed', padding: 14, alignItems: 'center' },
  addCustomBtnText:{ color: COLORS.primary, fontWeight: '700', fontSize: 14 },
  skipNote:        { marginTop: 16, color: COLORS.muted, fontSize: 13, textAlign: 'center' },

  // Nav buttons
  btnRow:          { flexDirection: 'row', gap: 12, marginTop: 32 },
  btn:             { flex: 1, backgroundColor: COLORS.primary, borderRadius: 14, padding: 16, alignItems: 'center' },
  btnDisabled:     { opacity: 0.4 },
  btnText:         { color: COLORS.white, fontSize: 16, fontWeight: '700' },
  btnBack:         { flex: 0.4, backgroundColor: COLORS.surface, borderRadius: 14, padding: 16, alignItems: 'center', borderWidth: 1, borderColor: COLORS.border },
  btnBackText:     { color: COLORS.muted, fontSize: 16, fontWeight: '600' },

  // Modal
  modalOverlay:    { flex: 1, backgroundColor: '#00000088', justifyContent: 'flex-end' },
  modalBox:        { backgroundColor: COLORS.surface, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, maxHeight: '90%' },
  modalTitle:      { fontSize: 18, fontWeight: '700', color: COLORS.text, marginBottom: 4 },
  modalSub:        { fontSize: 13, color: COLORS.muted, marginBottom: 16 },
  modalInput:      { borderWidth: 1.5, borderColor: COLORS.border, borderRadius: 12, padding: 12, fontSize: 15, color: COLORS.text, marginBottom: 12, backgroundColor: COLORS.cardAlt },
  slotWrap:        { marginBottom: 12 },
  slotLabel:       { fontSize: 12, fontWeight: '600', color: COLORS.muted, marginBottom: 4 },
  slotInputRow:    { flexDirection: 'row', alignItems: 'center' },
  slotInput:       { flex: 1, borderWidth: 1.5, borderColor: COLORS.border, borderRadius: 10, padding: 11, fontSize: 14, color: COLORS.text, backgroundColor: COLORS.cardAlt },
  slotInputPicked: { borderColor: COLORS.success },
  clearSlot:       { color: COLORS.muted, fontSize: 18, paddingLeft: 10 },
  slotDropdown:    { backgroundColor: COLORS.cardAlt, borderRadius: 10, borderWidth: 1, borderColor: COLORS.border, marginTop: 4, overflow: 'hidden' },
  slotOption:      { flexDirection: 'row', justifyContent: 'space-between', padding: 10, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  slotOptionName:  { fontSize: 13, color: COLORS.text, flex: 1 },
  slotOptionCal:   { fontSize: 12, color: COLORS.muted },
  modalBtns:       { flexDirection: 'row', gap: 12, marginTop: 16 },
  modalCancel:     { flex: 1, padding: 14, borderRadius: 12, backgroundColor: COLORS.cardAlt, alignItems: 'center' },
  modalCancelText: { color: COLORS.muted, fontWeight: '600' },
  modalConfirm:    { flex: 1, padding: 14, borderRadius: 12, backgroundColor: COLORS.primary, alignItems: 'center' },
  modalConfirmText:{ color: COLORS.white, fontWeight: '700' },
});
