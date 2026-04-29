const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { buildUserProfile } = require('../services/tdee');
const { generateWeeklyPlan } = require('../services/planGenerator');
const store = require('../models/store');

const router = express.Router();

// POST /api/users/onboard
router.post('/onboard', (req, res) => {
  const { name, weightKg, heightCm, ageYears, sex, activityLevel, goal, diet } = req.body;
  const required = ['weightKg', 'heightCm', 'ageYears', 'sex', 'activityLevel', 'goal'];
  const missing = required.filter(k => req.body[k] == null);
  if (missing.length) {
    return res.status(400).json({ error: `Missing fields: ${missing.join(', ')}` });
  }

  const profile = buildUserProfile({ weightKg, heightCm, ageYears, sex, activityLevel, goal });
  const userId = uuidv4();

  const user = store.createUser(userId, {
    name: name || 'User', weightKg, heightCm, ageYears, sex, activityLevel,
    goal, diet: diet || 'non_vegetarian', profile,
    preferredFoodIds: req.body.preferredFoodIds || [],
  });

  const weekPlan = generateWeeklyPlan(profile, { diet, goal, preferredFoodIds: req.body.preferredFoodIds || [] });
  store.setWeekPlan(userId, weekPlan);

  res.status(201).json({ userId, user, weekPlan });
});

// GET /api/users/:userId
router.get('/:userId', (req, res) => {
  const user = store.getUser(req.params.userId);
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json(user);
});

// PUT /api/users/:userId — update profile + regenerate plan if needed
router.put('/:userId', (req, res) => {
  const user = store.getUser(req.params.userId);
  if (!user) return res.status(404).json({ error: 'User not found' });

  const patch = {};
  ['weightKg', 'heightCm', 'ageYears', 'activityLevel', 'goal', 'diet'].forEach(k => {
    if (req.body[k] != null) patch[k] = req.body[k];
  });

  const merged = { ...user, ...patch };
  patch.profile = buildUserProfile(merged);

  const updated = store.updateUser(req.params.userId, patch);
  const weekPlan = generateWeeklyPlan(patch.profile, { diet: merged.diet, goal: merged.goal });
  store.setWeekPlan(req.params.userId, weekPlan);

  res.json({ user: updated, weekPlan });
});

// ── Steps ─────────────────────────────────────────────────────────────────

// POST /api/users/:userId/steps — { steps, date? }
router.post('/:userId/steps', (req, res) => {
  const user = store.getUser(req.params.userId);
  if (!user) return res.status(404).json({ error: 'User not found' });

  const steps = parseInt(req.body.steps);
  if (!steps || steps < 0) return res.status(400).json({ error: 'steps must be a positive number' });

  const date = req.body.date || new Date().toISOString().split('T')[0];
  store.setSteps(req.params.userId, date, steps);

  const caloriesBurned = Math.round(steps * 0.04);
  const target = user.profile?.targetCalories || 1300;
  const netCalories = target - caloriesBurned;
  const needsCompensation = netCalories < 1300;

  res.json({
    date, steps, caloriesBurned,
    targetCalories: target,
    netCalories,
    needsCompensation,
    compensationNeeded: needsCompensation ? Math.round(1300 - netCalories) : 0,
    weeklySteps: store.getWeeklySteps(req.params.userId),
  });
});

// GET /api/users/:userId/steps?date=YYYY-MM-DD
router.get('/:userId/steps', (req, res) => {
  const user = store.getUser(req.params.userId);
  if (!user) return res.status(404).json({ error: 'User not found' });

  const date = req.query.date || new Date().toISOString().split('T')[0];
  const steps = store.getSteps(req.params.userId, date);
  const caloriesBurned = Math.round(steps * 0.04);
  const weeklySteps = store.getWeeklySteps(req.params.userId);

  res.json({ date, steps, caloriesBurned, weeklySteps, weeklyCaloriesBurned: Math.round(weeklySteps * 0.04) });
});

module.exports = router;
