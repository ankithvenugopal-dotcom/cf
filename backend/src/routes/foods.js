const express = require('express');
const { searchFoods, getFoodById, getFoodsByCategory, FOODS } = require('../data/foods');

const router = express.Router();

// GET /api/foods?q=biryani
router.get('/', (req, res) => {
  const { q, category } = req.query;
  if (category) return res.json(getFoodsByCategory(category));
  if (q) return res.json(searchFoods(q));
  res.json(FOODS);
});

// GET /api/foods/:id
router.get('/:id', (req, res) => {
  const food = getFoodById(req.params.id);
  if (!food) return res.status(404).json({ error: 'Food not found' });
  res.json(food);
});

module.exports = router;
