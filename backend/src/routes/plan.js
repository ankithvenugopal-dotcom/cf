const express = require('express');
const { v4: uuidv4 } = require('uuid');
const store = require('../models/store');
const { rebalanceWeek } = require('../services/rebalancer');
const { getFoodById, searchFoods } = require('../data/foods');
const { generateWeeklyPlan, getAlternatives, swapMealItem } = require('../services/planGenerator');

const router = express.Router();

// GET /api/plan/:userId
router.get('/:userId', (req, res) => {
  const user = store.getUser(req.params.userId);
  if (!user) return res.status(404).json({ error: 'User not found' });

  let plan = store.getWeekPlan(req.params.userId);
  if (!plan) {
    plan = generateWeeklyPlan(user.profile, { diet: user.diet, goal: user.goal });
    store.setWeekPlan(req.params.userId, plan);
  }
  res.json(plan);
});

// POST /api/plan/:userId/regenerate
router.post('/:userId/regenerate', (req, res) => {
  const user = store.getUser(req.params.userId);
  if (!user) return res.status(404).json({ error: 'User not found' });

  const plan = generateWeeklyPlan(user.profile, { diet: user.diet, goal: user.goal });
  store.setWeekPlan(req.params.userId, plan);
  res.json(plan);
});

// POST /api/plan/:userId/craving
router.post('/:userId/craving', (req, res) => {
  const user = store.getUser(req.params.userId);
  if (!user) return res.status(404).json({ error: 'User not found' });

  const plan = store.getWeekPlan(req.params.userId);
  if (!plan) return res.status(404).json({ error: 'No active plan. Generate a plan first.' });

  const { foodId, food, dayIndex } = req.body;
  if (dayIndex == null || dayIndex < 0 || dayIndex > 6) {
    return res.status(400).json({ error: 'dayIndex must be 0–6' });
  }

  let cravingFood = food;
  if (foodId) {
    cravingFood = getFoodById(foodId);
    if (!cravingFood) return res.status(404).json({ error: `Food id "${foodId}" not found` });
  }
  if (!cravingFood || !cravingFood.calories) {
    return res.status(400).json({ error: 'Provide a valid foodId or food object with calories' });
  }

  const result = rebalanceWeek(plan, { ...cravingFood, isCheat: true }, dayIndex, user.profile);
  store.setWeekPlan(req.params.userId, result.updatedPlan);

  res.json({
    message: `Craving logged! Rebalanced ${result.rebalancedDays} day(s).`,
    cravingCalories: result.cravingCalories,
    rebalancedDays: result.rebalancedDays,
    newDailyTarget: result.newDailyTarget,
    warnings: result.warnings,
    updatedPlan: result.updatedPlan,
  });
});

// POST /api/plan/:userId/complete-day
router.post('/:userId/complete-day', (req, res) => {
  const user = store.getUser(req.params.userId);
  if (!user) return res.status(404).json({ error: 'User not found' });

  const plan = store.getWeekPlan(req.params.userId);
  if (!plan) return res.status(404).json({ error: 'No plan found' });

  const { dayIndex } = req.body;
  if (dayIndex == null) return res.status(400).json({ error: 'dayIndex required' });

  plan.days[dayIndex].completed = true;
  store.setWeekPlan(req.params.userId, plan);
  res.json({ message: `Day ${dayIndex} marked complete`, plan });
});

// GET /api/plan/:userId/alternatives?foodId=X&targetCals=N&category=Y
router.get('/:userId/alternatives', (req, res) => {
  const user = store.getUser(req.params.userId);
  if (!user) return res.status(404).json({ error: 'User not found' });

  const { foodId, targetCals, category } = req.query;
  const alts = getAlternatives(foodId, targetCals ? parseInt(targetCals) : null, category);
  res.json(alts);
});

// PUT /api/plan/:userId/swap
// Body: { dayIndex, mealSlot, itemIndex, newFoodId, targetCals }
router.put('/:userId/swap', (req, res) => {
  const user = store.getUser(req.params.userId);
  if (!user) return res.status(404).json({ error: 'User not found' });

  let plan = store.getWeekPlan(req.params.userId);
  if (!plan) return res.status(404).json({ error: 'No active plan found' });

  const { dayIndex, mealSlot, itemIndex, newFoodId, targetCals } = req.body;
  if (dayIndex == null || !mealSlot || itemIndex == null || !newFoodId) {
    return res.status(400).json({ error: 'dayIndex, mealSlot, itemIndex, newFoodId required' });
  }

  plan = swapMealItem(plan, dayIndex, mealSlot, itemIndex, newFoodId, targetCals);
  store.setWeekPlan(req.params.userId, plan);
  res.json({ message: 'Item swapped', day: plan.days[dayIndex] });
});

// ── Food Log ──────────────────────────────────────────────────────────────

// GET /api/plan/:userId/log?date=YYYY-MM-DD
router.get('/:userId/log', (req, res) => {
  const user = store.getUser(req.params.userId);
  if (!user) return res.status(404).json({ error: 'User not found' });

  const date = req.query.date || todayISO();
  const entries = store.getLog(req.params.userId, date);
  const summary = store.getLogSummary(req.params.userId, date);
  res.json({ date, entries, summary });
});

// POST /api/plan/:userId/log
// Body: { foodId } OR { food: { name, calories, protein, carbs, fat }, isCheat? }
router.post('/:userId/log', (req, res) => {
  const user = store.getUser(req.params.userId);
  if (!user) return res.status(404).json({ error: 'User not found' });

  const { foodId, food, isCheat, date } = req.body;
  const logDate = date || todayISO();

  let logFood = food;
  if (foodId) {
    logFood = getFoodById(foodId);
    if (!logFood) return res.status(404).json({ error: `Food id "${foodId}" not found` });
  }
  if (!logFood || !logFood.calories) {
    return res.status(400).json({ error: 'Provide a valid foodId or food object with calories' });
  }

  const entry = {
    id: uuidv4(),
    ...logFood,
    isCheat: isCheat || logFood.category === 'FastFood',
    loggedAt: new Date().toISOString(),
  };

  store.addLogEntry(req.params.userId, logDate, entry);
  const summary = store.getLogSummary(req.params.userId, logDate);
  res.status(201).json({ entry, summary });
});

// DELETE /api/plan/:userId/log/:entryId?date=YYYY-MM-DD
router.delete('/:userId/log/:entryId', (req, res) => {
  const user = store.getUser(req.params.userId);
  if (!user) return res.status(404).json({ error: 'User not found' });

  const date = req.query.date || todayISO();
  const removed = store.removeLogEntry(req.params.userId, date, req.params.entryId);
  if (!removed) return res.status(404).json({ error: 'Log entry not found' });

  const summary = store.getLogSummary(req.params.userId, date);
  res.json({ message: 'Entry removed', summary });
});

function todayISO() {
  return new Date().toISOString().split('T')[0];
}

module.exports = router;
