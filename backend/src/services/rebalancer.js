const { DAILY_FLOOR } = require('./tdee');

const MAX_CHEAT_RATIO    = 0.25;
const MAX_WEEKLY_OVERAGE = 0.05; // hard cap: weekly total never exceeds budget + 5%
const DAILY_MIN          = 1300;

function rebalanceWeek(weekPlan, cravingFood, dayIndex, userProfile) {
  const { targetCalories, macros, sex } = userProfile;
  const weeklyBudget = userProfile.weeklyCalorieBudget; // targetCalories * 7
  const days = weekPlan.days;

  const warnings    = [];
  let flagForReview = false;

  // ── Clone all days ────────────────────────────────────────────────────────
  const updatedDays = days.map(d => ({
    ...d,
    meals: [...(d.meals || [])],
  }));

  // ── Inject craving into the target day ───────────────────────────────────
  updatedDays[dayIndex].meals.push({
    slot: 'craving',
    name: cravingFood.name,
    calories: cravingFood.calories,
    protein:  cravingFood.protein,
    carbs:    cravingFood.carbs,
    fat:      cravingFood.fat,
    isCheat:  true,
    loggedAt: new Date().toISOString(),
  });
  updatedDays[dayIndex].cheatCalories =
    (updatedDays[dayIndex].cheatCalories || 0) + cravingFood.calories;
  recalcDayTotals(updatedDays[dayIndex]);

  // ── Find future rebalanceable days ────────────────────────────────────────
  const futureDayIndices = [];
  for (let i = dayIndex + 1; i < 7; i++) {
    if (!updatedDays[i].completed) futureDayIndices.push(i);
  }

  const maxAllowedExcess = weeklyBudget * MAX_WEEKLY_OVERAGE;
  const totalCheatCals   = updatedDays.reduce((s, d) => s + (d.cheatCalories || 0), 0);

  // The craving calories ALWAYS need to be offset from future days
  // so the weekly total stays flat regardless of whether the plan was under budget
  const excess = cravingFood.calories;

  // ── Cheat ratio warning ───────────────────────────────────────────────────
  if (totalCheatCals > weeklyBudget * MAX_CHEAT_RATIO) {
    warnings.push(
      `${Math.round((totalCheatCals / weeklyBudget) * 100)}% of this week's budget is cheat meals. Remaining days will be very lean.`
    );
  }

  // ── Eating pattern flag ───────────────────────────────────────────────────
  const totalMeals = updatedDays.reduce((s, d) => s + (d.meals?.length || 0), 0);
  const cheatMeals = updatedDays.reduce((s, d) => s + (d.meals?.filter(m => m.isCheat).length || 0), 0);
  if (totalMeals >= 7 && cheatMeals / totalMeals >= 0.80) {
    flagForReview = true;
    warnings.push('Most of your logged meals are indulgence items. Balanced eating works best alongside cravings.');
  }

  // ── Nothing to rebalance ──────────────────────────────────────────────────
  if (futureDayIndices.length === 0) {
    warnings.push(
      `No future days left to offset this craving (${cravingFood.calories} kcal). Weekly total will be slightly higher this week.`
    );
    return buildResult(weekPlan, updatedDays, 0, targetCalories, warnings, flagForReview, cravingFood.calories);
  }

  // ── Distribute deduction evenly across future days ────────────────────────
  // Deduct `excess` calories total from future days, floor at DAILY_MIN each
  const deductionPerDay = excess / futureDayIndices.length;

  let unabsorbedExcess = 0;
  futureDayIndices.forEach(i => {
    const currentTarget = updatedDays[i].totalCalories || updatedDays[i].targetCalories || targetCalories;
    const proposed      = currentTarget - deductionPerDay;
    const newTarget     = Math.max(Math.round(proposed), DAILY_MIN);

    if (proposed < DAILY_MIN) {
      // This day hit the floor — record any leftover that couldn't be deducted
      unabsorbedExcess += DAILY_MIN - proposed;
    }

    updatedDays[i] = regenerateDayPlan(updatedDays[i], newTarget, macros);
  });

  // ── If some excess couldn't be absorbed (floor limits), warn ──────────────
  if (unabsorbedExcess > maxAllowedExcess) {
    warnings.push(
      `Future days hit the 1300 kcal daily minimum. ~${Math.round(unabsorbedExcess)} kcal couldn't be offset — weekly total is slightly over budget.`
    );
  }

  // ── Verify final weekly total ─────────────────────────────────────────────
  const finalTotal = updatedDays.reduce(
    (sum, d) => sum + (d.totalCalories || d.targetCalories || targetCalories),
    0
  );
  const finalOverage = finalTotal - weeklyBudget;

  const newDailyTarget = Math.round(
    updatedDays
      .filter((_, i) => futureDayIndices.includes(i))
      .reduce((s, d) => s + d.targetCalories, 0) / futureDayIndices.length
  );

  return {
    updatedPlan: {
      ...weekPlan,
      days: updatedDays,
      // Recalculate weekly totals to stay accurate
      weeklyTotalCalories: finalTotal,
    },
    cravingCalories:  cravingFood.calories,
    rebalancedDays:   futureDayIndices.length,
    newDailyTarget,
    weeklyOverage:    Math.max(0, Math.round(finalOverage)),
    weeklyOveragePct: Math.max(0, Math.round((finalOverage / weeklyBudget) * 100)),
    warnings,
    flagForReview,
  };
}

// ── Helpers ───────────────────────────────────────────────────────────────

function buildResult(weekPlan, updatedDays, rebalancedDays, targetCalories, warnings, flagForReview, cravingCalories) {
  const finalTotal = updatedDays.reduce(
    (sum, d) => sum + (d.totalCalories || d.targetCalories || targetCalories),
    0
  );
  return {
    updatedPlan: { ...weekPlan, days: updatedDays, weeklyTotalCalories: finalTotal },
    cravingCalories,
    rebalancedDays,
    newDailyTarget: targetCalories,
    weeklyOverage: 0,
    weeklyOveragePct: 0,
    warnings,
    flagForReview,
  };
}

function recalcDayTotals(day) {
  const meals = day.meals || [];
  day.totalCalories = Math.round(meals.reduce((s, m) => s + (m.calories || 0), 0));
  day.totalProtein  = Math.round(meals.reduce((s, m) => s + (m.protein  || 0), 0));
  day.totalCarbs    = Math.round(meals.reduce((s, m) => s + (m.carbs    || 0), 0));
  day.totalFat      = Math.round(meals.reduce((s, m) => s + (m.fat      || 0), 0));
}

function regenerateDayPlan(day, newCalorieTarget, macros) {
  // Scale macros proportionally
  const ratio       = newCalorieTarget / (day.targetCalories || newCalorieTarget);
  const proteinG    = Math.round((macros.proteinG || 0) * ratio);
  const fatG        = Math.round((macros.fatG     || 0) * ratio);
  const carbsG      = Math.round((macros.carbsG   || 0) * ratio);

  return {
    ...day,
    rebalanced:     true,
    planStale:      true,
    targetCalories: newCalorieTarget,
    targetProtein:  proteinG,
    targetCarbs:    carbsG,
    targetFat:      fatG,
    // Update totals so weekly sums are correct even before plan is regenerated
    totalCalories:  newCalorieTarget,
    totalProtein:   proteinG,
    totalCarbs:     carbsG,
    totalFat:       fatG,
  };
}

module.exports = { rebalanceWeek };
