// In-memory store for beta — swap for Postgres in production
const users    = new Map(); // userId → user object
const weekPlans = new Map(); // userId → weekPlan object
const foodLogs  = new Map(); // userId → { 'YYYY-MM-DD' → [logEntry] }
const stepsLog  = new Map(); // userId → { 'YYYY-MM-DD' → steps }

// ── Users ─────────────────────────────────────────────────────────────────
function createUser(id, data) {
  users.set(id, { id, ...data, createdAt: new Date().toISOString() });
  return users.get(id);
}

function getUser(id) {
  return users.get(id) || null;
}

function updateUser(id, patch) {
  const u = users.get(id);
  if (!u) return null;
  const updated = { ...u, ...patch, updatedAt: new Date().toISOString() };
  users.set(id, updated);
  return updated;
}

// ── Plans ─────────────────────────────────────────────────────────────────
function setWeekPlan(userId, plan) {
  weekPlans.set(userId, { ...plan, updatedAt: new Date().toISOString() });
  return weekPlans.get(userId);
}

function getWeekPlan(userId) {
  return weekPlans.get(userId) || null;
}

// ── Food Log ──────────────────────────────────────────────────────────────
function getLog(userId, date) {
  const userLogs = foodLogs.get(userId) || {};
  return userLogs[date] || [];
}

function addLogEntry(userId, date, entry) {
  if (!foodLogs.has(userId)) foodLogs.set(userId, {});
  const userLogs = foodLogs.get(userId);
  if (!userLogs[date]) userLogs[date] = [];
  userLogs[date].push(entry);
  return entry;
}

function removeLogEntry(userId, date, entryId) {
  const userLogs = foodLogs.get(userId) || {};
  if (!userLogs[date]) return false;
  const before = userLogs[date].length;
  userLogs[date] = userLogs[date].filter(e => e.id !== entryId);
  return userLogs[date].length < before;
}

function getLogSummary(userId, date) {
  const entries = getLog(userId, date);
  return entries.reduce(
    (acc, e) => ({
      calories: acc.calories + (e.calories || 0),
      protein:  acc.protein  + (e.protein  || 0),
      carbs:    acc.carbs    + (e.carbs    || 0),
      fat:      acc.fat      + (e.fat      || 0),
      cheatCalories: acc.cheatCalories + (e.isCheat ? (e.calories || 0) : 0),
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0, cheatCalories: 0 }
  );
}

// ── Steps ─────────────────────────────────────────────────────────────────
function setSteps(userId, date, steps) {
  if (!stepsLog.has(userId)) stepsLog.set(userId, {});
  stepsLog.get(userId)[date] = steps;
}

function getSteps(userId, date) {
  return (stepsLog.get(userId) || {})[date] || 0;
}

function getWeeklySteps(userId) {
  const log = stepsLog.get(userId) || {};
  return Object.values(log).reduce((a, b) => a + b, 0);
}

module.exports = {
  createUser, getUser, updateUser,
  setWeekPlan, getWeekPlan,
  getLog, addLogEntry, removeLogEntry, getLogSummary,
  setSteps, getSteps, getWeeklySteps,
};
