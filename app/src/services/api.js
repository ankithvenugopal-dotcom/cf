import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE_URL = (process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000') + '/api';
const api = axios.create({ baseURL: BASE_URL, timeout: 10000 });

// ── Auth helpers ──────────────────────────────────────────────────────────
export async function getUserId() {
  return AsyncStorage.getItem('userId');
}
export async function saveUserId(id) {
  return AsyncStorage.setItem('userId', id);
}

// ── Onboarding ────────────────────────────────────────────────────────────
export async function onboardUser(data) {
  const res = await api.post('/users/onboard', data);
  await saveUserId(res.data.userId);
  return res.data;
}

// ── Profile ───────────────────────────────────────────────────────────────
export async function getUser(userId) {
  const res = await api.get(`/users/${userId}`);
  return res.data;
}
export async function updateUser(userId, patch) {
  const res = await api.put(`/users/${userId}`, patch);
  return res.data;
}

// ── Plan ──────────────────────────────────────────────────────────────────
export async function getWeekPlan(userId) {
  const res = await api.get(`/plan/${userId}`);
  return res.data;
}
export async function regeneratePlan(userId) {
  const res = await api.post(`/plan/${userId}/regenerate`);
  return res.data;
}
export async function logCraving(userId, foodId, dayIndex, customFood = null) {
  const body = { dayIndex };
  if (foodId) body.foodId = foodId;
  else if (customFood) body.food = customFood;
  const res = await api.post(`/plan/${userId}/craving`, body);
  return res.data;
}
export async function completeDay(userId, dayIndex) {
  const res = await api.post(`/plan/${userId}/complete-day`, { dayIndex });
  return res.data;
}

// ── Food Log ──────────────────────────────────────────────────────────────
export async function getFoodLog(userId, date) {
  const res = await api.get(`/plan/${userId}/log`, { params: { date } });
  return res.data;
}
export async function logFood(userId, foodId, customFood, isCheat) {
  const body = isCheat != null ? { isCheat } : {};
  if (foodId) body.foodId = foodId;
  else if (customFood) body.food = customFood;
  const res = await api.post(`/plan/${userId}/log`, body);
  return res.data;
}
export async function deleteLogEntry(userId, entryId, date) {
  const res = await api.delete(`/plan/${userId}/log/${entryId}`, { params: { date } });
  return res.data;
}

// ── Swap & Alternatives ───────────────────────────────────────────────────
export async function getAlternatives(userId, foodId, targetCals, category) {
  const res = await api.get(`/plan/${userId}/alternatives`, { params: { foodId, targetCals, category } });
  return res.data;
}
export async function swapMealItem(userId, dayIndex, mealSlot, itemIndex, newFoodId, targetCals) {
  const res = await api.put(`/plan/${userId}/swap`, { dayIndex, mealSlot, itemIndex, newFoodId, targetCals });
  return res.data;
}

// ── Steps ─────────────────────────────────────────────────────────────────
export async function logSteps(userId, steps) {
  const res = await api.post(`/users/${userId}/steps`, { steps });
  return res.data;
}
export async function getSteps(userId) {
  const res = await api.get(`/users/${userId}/steps`);
  return res.data;
}

// ── Foods search ──────────────────────────────────────────────────────────
export async function searchFoods(query) {
  const res = await api.get('/foods', { params: { q: query } });
  return res.data;
}
export async function getFoodById(id) {
  const res = await api.get(`/foods/${id}`);
  return res.data;
}
