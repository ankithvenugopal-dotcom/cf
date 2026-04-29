// Popular Indian food combos shown during onboarding
// foodIds must match IDs in backend/src/data/foods.js

export const FOOD_COMBOS = [
  // ── Breakfast combos ──────────────────────────────────────────────────────
  {
    id: 'c01', name: 'Idli Sambhar', icon: '🫓',
    desc: 'Soft idlis with hot sambhar',
    foodIds: ['f005', 'f100'],
    tags: ['south-indian', 'light', 'breakfast'],
  },
  {
    id: 'c02', name: 'Dosa & Chutney', icon: '🥞',
    desc: 'Crispy dosa, a South Indian classic',
    foodIds: ['f006'],
    tags: ['south-indian', 'breakfast'],
  },
  {
    id: 'c03', name: 'Poha', icon: '🥣',
    desc: 'Light flattened rice with peanuts',
    foodIds: ['f007', 'f052'],
    tags: ['breakfast', 'light'],
  },
  {
    id: 'c04', name: 'Paratha & Curd', icon: '🫓',
    desc: 'Stuffed paratha with fresh dahi',
    foodIds: ['f003', 'f041'],
    tags: ['north-indian', 'filling', 'breakfast'],
  },
  {
    id: 'c05', name: 'Oats & Milk', icon: '🥣',
    desc: 'Healthy oat bowl with milk',
    foodIds: ['f081'],
    tags: ['healthy', 'breakfast'],
  },
  {
    id: 'c06', name: 'Bread & Eggs', icon: '🍳',
    desc: 'Whole wheat toast with boiled eggs',
    foodIds: ['f082', 'f032'],
    tags: ['high-protein', 'breakfast'],
  },
  {
    id: 'c07', name: 'Besan Chilla', icon: '🥞',
    desc: 'Chickpea flour pancakes',
    foodIds: ['f211'],
    tags: ['high-protein', 'breakfast'],
  },
  {
    id: 'c08', name: 'Upma', icon: '🥣',
    desc: 'Semolina upma with vegetables',
    foodIds: ['f008'],
    tags: ['south-indian', 'breakfast'],
  },
  {
    id: 'c09', name: 'Masala Omelette', icon: '🍳',
    desc: '2-egg omelette with onion & chilli',
    foodIds: ['f213', 'f082'],
    tags: ['high-protein', 'breakfast'],
  },

  // ── Lunch / Dinner combos ────────────────────────────────────────────────
  {
    id: 'c10', name: 'Dal Chawal', icon: '🍛',
    desc: 'Dal tadka with basmati rice',
    foodIds: ['f010', 'f001'],
    tags: ['classic', 'north-indian', 'lunch'],
  },
  {
    id: 'c11', name: 'Roti Sabzi', icon: '🫓',
    desc: 'Chapati with seasonal vegetable curry',
    foodIds: ['f002', 'f023'],
    tags: ['classic', 'north-indian'],
  },
  {
    id: 'c12', name: 'Rajma Chawal', icon: '🍛',
    desc: 'Creamy rajma with steamed rice',
    foodIds: ['f013', 'f001'],
    tags: ['north-indian', 'high-protein'],
  },
  {
    id: 'c13', name: 'Chole Roti', icon: '🫓',
    desc: 'Spiced chickpeas with roti',
    foodIds: ['f014', 'f002'],
    tags: ['north-indian', 'high-protein'],
  },
  {
    id: 'c14', name: 'Palak Paneer & Roti', icon: '🥬',
    desc: 'Creamy spinach-paneer with chapati',
    foodIds: ['f020', 'f002'],
    tags: ['vegetarian', 'high-protein'],
  },
  {
    id: 'c15', name: 'Chicken Rice', icon: '🍗',
    desc: 'Chicken curry with basmati rice',
    foodIds: ['f030', 'f001'],
    tags: ['non-veg', 'high-protein'],
  },
  {
    id: 'c16', name: 'Roti & Tandoori Chicken', icon: '🍗',
    desc: 'Tandoori chicken with whole wheat roti',
    foodIds: ['f036', 'f002'],
    tags: ['non-veg', 'high-protein'],
  },
  {
    id: 'c17', name: 'Egg Bhurji & Roti', icon: '🍳',
    desc: 'Spiced scrambled eggs with roti',
    foodIds: ['f120', 'f002'],
    tags: ['non-veg', 'high-protein'],
  },
  {
    id: 'c18', name: 'Fish Curry & Rice', icon: '🐟',
    desc: 'Coastal fish curry with rice',
    foodIds: ['f035', 'f001'],
    tags: ['non-veg', 'high-protein'],
  },
  {
    id: 'c19', name: 'Khichdi', icon: '🍲',
    desc: 'Comforting moong dal rice khichdi',
    foodIds: ['f015', 'f001'],
    tags: ['light', 'comfort'],
  },
  {
    id: 'c20', name: 'Dal Makhani & Naan', icon: '🫓',
    desc: 'Rich creamy dal with naan bread',
    foodIds: ['f011', 'f093'],
    tags: ['rich', 'north-indian'],
  },
  {
    id: 'c21', name: 'Paneer Tikka & Roti', icon: '🧀',
    desc: 'Grilled paneer with chapati',
    foodIds: ['f125', 'f002'],
    tags: ['vegetarian', 'high-protein'],
  },
  {
    id: 'c22', name: 'Chicken Tikka & Salad', icon: '🥗',
    desc: 'Grilled chicken with fresh salad',
    foodIds: ['f121'],
    tags: ['non-veg', 'high-protein', 'low-carb'],
  },
  {
    id: 'c23', name: 'Brown Rice & Dal', icon: '🍛',
    desc: 'Healthy brown rice with moong dal',
    foodIds: ['f009', 'f015'],
    tags: ['healthy', 'high-protein'],
  },
  {
    id: 'c24', name: 'Aloo Gobi & Roti', icon: '🥔',
    desc: 'Potato cauliflower sabzi with chapati',
    foodIds: ['f021', 'f002'],
    tags: ['vegetarian', 'classic'],
  },
];

// Build a flat set of food IDs from selected combo IDs
export function getPreferredFoodIds(selectedComboIds) {
  const ids = new Set();
  FOOD_COMBOS
    .filter(c => selectedComboIds.includes(c.id))
    .forEach(c => c.foodIds.forEach(id => ids.add(id)));
  return Array.from(ids);
}
