const { FOODS } = require('../data/foods');

const MEAL_SLOTS = ['breakfast', 'snack1', 'lunch', 'snack2', 'dinner'];

const SLOT_RATIOS = {
  breakfast: 0.25,
  snack1:    0.10,
  lunch:     0.35,
  snack2:    0.10,
  dinner:    0.20,
};

const MEAL_COMPONENT_RATIOS = {
  cut:       { carb: 0.25, protein: 0.55, veg: 0.20 },
  mild_cut:  { carb: 0.30, protein: 0.48, veg: 0.22 },
  maintain:  { carb: 0.38, protein: 0.38, veg: 0.24 },
  mild_gain: { carb: 0.45, protein: 0.35, veg: 0.20 },
  gain:      { carb: 0.52, protein: 0.32, veg: 0.16 },
};

const DIET_EXCLUDES = {
  vegetarian:    new Set(['f030','f031','f035','f036','f120','f121','f122','f123','f126','f152','f153','f154','f155','f160','f161','f162','f164','f166','f173','f175','f194']),
  vegan:         new Set(['f032','f033','f034','f040','f041','f042','f043','f130','f131','f132','f120','f030','f031','f035','f036','f121','f122','f123','f125','f126','f213','f152','f153','f154','f155','f160','f161','f162','f164','f166','f173','f175','f194']),
  jain:          new Set(['f030','f031','f032','f033','f035','f036','f120','f121','f122','f123','f126']),
  non_vegetarian: new Set(),
};

function generateWeeklyPlan(userProfile, preferences = {}) {
  const { targetCalories, macros } = userProfile;
  const goal      = preferences.goal    || 'maintain';
  const dietPref  = preferences.diet    || 'non_vegetarian';
  const preferred = new Set(preferences.preferredFoodIds || []);
  const excluded  = DIET_EXCLUDES[dietPref] || new Set();
  const allowedFoods = FOODS.filter(f => !excluded.has(f.id) && f.category !== 'FastFood');

  const days = [];
  for (let d = 0; d < 7; d++) {
    days.push(generateDayPlan(d, targetCalories, macros, allowedFoods, goal, preferred));
  }

  return {
    weekStartDate: getMondayDate(),
    days,
    weeklyTargetCalories: targetCalories * 7,
    weeklyTargetProtein:  macros.proteinG * 7,
    weeklyTargetCarbs:    macros.carbsG * 7,
    weeklyTargetFat:      macros.fatG * 7,
  };
}

function generateDayPlan(dayIndex, targetCalories, macros, allowedFoods, goal, preferred) {
  const DAY_NAMES = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'];
  const meals = [];

  MEAL_SLOTS.forEach(slot => {
    const slotCalTarget = Math.round(targetCalories * SLOT_RATIOS[slot]);
    const meal = buildMealForSlot(slot, slotCalTarget, allowedFoods, goal, preferred);
    if (meal) meals.push(meal);
  });

  const totals = meals.reduce(
    (acc, m) => ({
      calories: acc.calories + (m.calories || 0),
      protein:  acc.protein  + (m.protein  || 0),
      carbs:    acc.carbs    + (m.carbs    || 0),
      fat:      acc.fat      + (m.fat      || 0),
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0 }
  );

  return {
    dayIndex,
    dayName: DAY_NAMES[dayIndex],
    targetCalories,
    targetProtein: macros.proteinG,
    targetCarbs:   macros.carbsG,
    targetFat:     macros.fatG,
    meals,
    totalCalories: Math.max(Math.round(totals.calories), 1300),
    totalProtein:  Math.round(totals.protein),
    totalCarbs:    Math.round(totals.carbs),
    totalFat:      Math.round(totals.fat),
    cheatCalories: 0,
    completed: false,
    rebalanced: false,
    planStale: false,
  };
}

function buildMealForSlot(slot, targetCals, allowedFoods, goal, preferred) {
  if (slot === 'snack1' || slot === 'snack2') return buildSnack(slot, targetCals, allowedFoods, preferred);
  if (slot === 'breakfast') return buildBreakfast(targetCals, allowedFoods, goal, preferred);
  return buildMainMeal(slot, targetCals, allowedFoods, goal, preferred);
}

function buildMainMeal(slot, targetCals, allowedFoods, goal, preferred) {
  const r = MEAL_COMPONENT_RATIOS[goal] || MEAL_COMPONENT_RATIOS.maintain;

  const carbFoods    = allowedFoods.filter(f => f.category === 'Staples');
  const proteinFoods = allowedFoods.filter(f => ['Protein', 'Dals'].includes(f.category));
  const vegFoods     = allowedFoods.filter(f => ['Vegetables', 'Dals'].includes(f.category));

  const carbFood    = pickAndScale(carbFoods,    targetCals * r.carb,    preferred);
  const proteinFood = pickAndScale(proteinFoods, targetCals * r.protein, preferred);
  const vegFood     = pickAndScale(vegFoods,     targetCals * r.veg,     preferred);

  const items = [carbFood, proteinFood, vegFood].filter(Boolean);
  if (!items.length) return null;

  const totals = sumItems(items);
  return { slot, name: items.map(f => f.name).join(' + '), items, ...totals };
}

function buildBreakfast(targetCals, allowedFoods, goal, preferred) {
  const grainFoods   = allowedFoods.filter(f => ['Breakfast', 'Staples'].includes(f.category));
  const proteinFoods = allowedFoods.filter(f => ['Protein', 'Dairy'].includes(f.category));
  const proteinShare = goal === 'cut' ? 0.45 : goal === 'gain' ? 0.35 : 0.40;

  const grain   = pickAndScale(grainFoods,   targetCals * (1 - proteinShare), preferred);
  const protein = pickAndScale(proteinFoods, targetCals * proteinShare,       preferred);

  const items = [grain, protein].filter(Boolean);
  if (!items.length) return null;

  const totals = sumItems(items);
  return { slot: 'breakfast', name: items.map(f => f.name).join(' + '), items, ...totals };
}

function buildSnack(slot, targetCals, allowedFoods, preferred) {
  const snackFoods = allowedFoods.filter(f => ['Snacks', 'Dairy'].includes(f.category));
  if (!snackFoods.length) return null;
  const picked = pickClosest(snackFoods, targetCals, preferred);
  if (!picked) return null;
  return { slot, name: picked.name, items: [picked], calories: picked.calories, protein: picked.protein, carbs: picked.carbs, fat: picked.fat, fiber: picked.fiber || 0 };
}

// ── Alternatives (for swap) ───────────────────────────────────────────────
function getAlternatives(foodId, targetCals, category, limit = 6) {
  const source = FOODS.find(f => f.id === foodId);
  const calTarget = targetCals || source?.calories || 200;

  const cats = category
    ? [category]
    : source
    ? [source.category]
    : null;

  const pool = FOODS.filter(f =>
    f.id !== foodId &&
    f.category !== 'FastFood' &&
    (!cats || cats.includes(f.category)) &&
    Math.abs(f.calories - calTarget) / calTarget < 0.40
  );

  return pool
    .sort((a, b) => Math.abs(a.calories - calTarget) - Math.abs(b.calories - calTarget))
    .slice(0, limit)
    .map(f => scaleFood(f, calTarget));
}

// ── Swap a single item within a meal ──────────────────────────────────────
function swapMealItem(plan, dayIndex, mealSlot, itemIndex, newFoodId, targetCals) {
  const day  = plan.days[dayIndex];
  const meal = day.meals.find(m => m.slot === mealSlot);
  if (!meal || !meal.items) return plan;

  const newFood = FOODS.find(f => f.id === newFoodId);
  if (!newFood) return plan;

  const scaled = scaleFood(newFood, targetCals || meal.items[itemIndex]?.calories || newFood.calories);
  meal.items[itemIndex] = scaled;

  // Recalculate meal totals
  const totals = sumItems(meal.items);
  meal.name     = meal.items.map(f => f.name).join(' + ');
  meal.calories = totals.calories;
  meal.protein  = totals.protein;
  meal.carbs    = totals.carbs;
  meal.fat      = totals.fat;
  meal.fiber    = totals.fiber;

  // Recalculate day totals
  const dayTotals = day.meals.reduce(
    (acc, m) => ({ calories: acc.calories + m.calories, protein: acc.protein + m.protein, carbs: acc.carbs + m.carbs, fat: acc.fat + m.fat }),
    { calories: 0, protein: 0, carbs: 0, fat: 0 }
  );
  day.totalCalories = Math.round(dayTotals.calories);
  day.totalProtein  = Math.round(dayTotals.protein);
  day.totalCarbs    = Math.round(dayTotals.carbs);
  day.totalFat      = Math.round(dayTotals.fat);

  return plan;
}

// ── Helpers ───────────────────────────────────────────────────────────────
function pickAndScale(candidates, targetCals, preferred) {
  const picked = pickClosest(candidates, targetCals, preferred);
  return picked ? scaleFood(picked, targetCals) : null;
}

function pickClosest(candidates, targetCals, preferred) {
  if (!candidates.length) return null;

  // Try preferred foods first (foods the user said they like)
  if (preferred && preferred.size > 0) {
    const preferredCandidates = candidates.filter(f => preferred.has(f.id));
    if (preferredCandidates.length > 0) {
      const scored = preferredCandidates
        .map(f => ({ ...f, diff: Math.abs(f.calories - targetCals) }))
        .sort((a, b) => a.diff - b.diff);
      const pool = scored.slice(0, Math.min(3, scored.length));
      return pool[Math.floor(Math.random() * pool.length)];
    }
  }

  // Fall back to all candidates
  const scored = candidates
    .map(f => ({ ...f, diff: Math.abs(f.calories - targetCals) }))
    .sort((a, b) => a.diff - b.diff);
  const pool = scored.slice(0, Math.min(5, scored.length));
  return pool[Math.floor(Math.random() * pool.length)];
}

function scaleFood(food, targetCals) {
  if (!food || food.calories === 0) return food;
  const ratio = targetCals / food.calories;
  const discreteUnits = ['piece', 'plate', 'bowl', 'burger', 'sub', 'bar', 'cup', 'glass'];
  const servingAmt = discreteUnits.includes(food.unit)
    ? Math.max(1, Math.round(food.serving * ratio))
    : Math.round(food.serving * ratio);
  return {
    ...food,
    servingDisplay: `${servingAmt} ${food.unit}`,
    calories: Math.round(food.calories * ratio),
    protein:  Math.round(food.protein  * ratio * 10) / 10,
    carbs:    Math.round(food.carbs    * ratio * 10) / 10,
    fat:      Math.round(food.fat      * ratio * 10) / 10,
    fiber:    Math.round((food.fiber || 0) * ratio * 10) / 10,
  };
}

function sumItems(items) {
  return items.reduce(
    (acc, f) => ({
      calories: acc.calories + (f.calories || 0),
      protein:  Math.round((acc.protein + (f.protein || 0)) * 10) / 10,
      carbs:    Math.round((acc.carbs    + (f.carbs    || 0)) * 10) / 10,
      fat:      Math.round((acc.fat      + (f.fat      || 0)) * 10) / 10,
      fiber:    Math.round((acc.fiber    + (f.fiber    || 0)) * 10) / 10,
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 }
  );
}

function getMondayDate() {
  const now  = new Date();
  const day  = now.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  const mon  = new Date(now);
  mon.setDate(now.getDate() + diff);
  mon.setHours(0, 0, 0, 0);
  return mon.toISOString().split('T')[0];
}

module.exports = { generateWeeklyPlan, generateDayPlan, getAlternatives, swapMealItem };
