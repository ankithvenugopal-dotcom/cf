// TDEE / BMR calculation — Mifflin-St Jeor + IIFYM macro method
// Protein → Fat (body-weight anchored) → Carbs fill remaining calories

const ACTIVITY_MULTIPLIERS = {
  sedentary:   1.2,
  light:       1.375,
  moderate:    1.55,
  active:      1.725,
  very_active: 1.9,
};

// % of TDEE to add/subtract per goal (IIFYM: -10–25% cut, +5–15% gain)
const GOAL_CALORIE_ADJUSTMENTS = {
  cut:       -0.20,  // -20% → aggressive cut
  mild_cut:  -0.12,  // -12% → slow cut
  maintain:   0,
  mild_gain: +0.10,  // +10% → lean bulk
  gain:      +0.15,  // +15% → bulk
};

// Protein targets in g per kg of body weight (IIFYM: 0.7–1.2g/lb ≈ 1.5–2.6g/kg)
// Higher protein during cuts to preserve muscle
const PROTEIN_G_PER_KG = {
  cut:       2.2,
  mild_cut:  2.0,
  maintain:  1.6,
  mild_gain: 1.8,
  gain:      2.0,
};

// Fat targets in g per kg of body weight (IIFYM: 0.3–0.5g/lb ≈ 0.66–1.1g/kg)
const FAT_G_PER_KG = {
  cut:       0.75,
  mild_cut:  0.80,
  maintain:  0.90,
  mild_gain: 0.85,
  gain:      0.80,
};

const DAILY_FLOOR = { female: 1300, male: 1300, other: 1300 };

function calculateBMR(weightKg, heightCm, ageYears, sex) {
  if (sex === 'female') {
    return 10 * weightKg + 6.25 * heightCm - 5 * ageYears - 161;
  }
  return 10 * weightKg + 6.25 * heightCm - 5 * ageYears + 5;
}

function calculateTDEE(bmr, activityLevel) {
  const mult = ACTIVITY_MULTIPLIERS[activityLevel] || 1.2;
  return Math.round(bmr * mult);
}

function calculateTargetCalories(tdee, goal, sex) {
  const pct = GOAL_CALORIE_ADJUSTMENTS[goal] ?? 0;
  const adjusted = Math.round(tdee * (1 + pct));
  const floor = DAILY_FLOOR[sex] || DAILY_FLOOR.other;
  return Math.max(adjusted, floor);
}

function calculateMacros(targetCalories, goal, weightKg) {
  // 1. Protein: anchored to body weight
  const proteinG = Math.round((PROTEIN_G_PER_KG[goal] || 1.6) * weightKg);

  // 2. Fat: anchored to body weight, with floor at 20% of calories
  const fatFromWeight = Math.round((FAT_G_PER_KG[goal] || 0.8) * weightKg);
  const fatFloor = Math.round((targetCalories * 0.20) / 9);
  const fatG = Math.max(fatFromWeight, fatFloor);

  // 3. Carbs: fill remaining calories
  const remainingCals = targetCalories - proteinG * 4 - fatG * 9;
  const carbsG = Math.max(Math.round(remainingCals / 4), 50);

  return { proteinG, carbsG, fatG };
}

function buildUserProfile(data) {
  const { weightKg, heightCm, ageYears, sex, activityLevel, goal } = data;

  const bmr = Math.round(calculateBMR(weightKg, heightCm, ageYears, sex));
  const tdee = calculateTDEE(bmr, activityLevel);
  const targetCalories = calculateTargetCalories(tdee, goal, sex);
  const macros = calculateMacros(targetCalories, goal, weightKg);
  const dailyFloor = DAILY_FLOOR[sex] || DAILY_FLOOR.other;

  return {
    bmr,
    tdee,
    targetCalories,
    macros,
    dailyFloor,
    weeklyCalorieBudget: targetCalories * 7,
  };
}

module.exports = { buildUserProfile, DAILY_FLOOR, calculateBMR, calculateTDEE };
