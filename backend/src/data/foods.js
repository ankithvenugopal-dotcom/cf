const FOODS = [

  // ─────────────────────────────────────────────────────────────────────────
  // INDIAN — STAPLES
  // ─────────────────────────────────────────────────────────────────────────
  { id: "f001", name: "Cooked Basmati Rice",       category: "Staples", serving: 150, unit: "g",      calories: 195, protein: 4.1, carbs: 42.3, fat: 0.5, fiber: 0.6 },
  { id: "f002", name: "Roti / Chapati",             category: "Staples", serving: 2,   unit: "piece",  calories: 142, protein: 5.0, carbs: 29.0, fat: 1.8, fiber: 3.8 },
  { id: "f003", name: "Paratha (plain)",             category: "Staples", serving: 2,   unit: "piece",  calories: 320, protein: 7.0, carbs: 44.0, fat: 13.0, fiber: 4.0 },
  { id: "f004", name: "Paratha (aloo)",              category: "Staples", serving: 2,   unit: "piece",  calories: 440, protein: 9.0, carbs: 64.0, fat: 17.0, fiber: 5.0 },
  { id: "f005", name: "Idli (3 pieces)",             category: "Staples", serving: 3,   unit: "piece",  calories: 117, protein: 5.7, carbs: 23.4, fat: 0.6, fiber: 1.5 },
  { id: "f006", name: "Dosa (plain)",                category: "Staples", serving: 1,   unit: "piece",  calories: 133, protein: 3.3, carbs: 22.0, fat: 3.7, fiber: 0.9 },
  { id: "f007", name: "Poha",                        category: "Staples", serving: 200, unit: "g",      calories: 220, protein: 4.2, carbs: 45.0, fat: 2.4, fiber: 2.0 },
  { id: "f008", name: "Upma",                        category: "Staples", serving: 200, unit: "g",      calories: 290, protein: 7.0, carbs: 44.0, fat: 9.0, fiber: 4.0 },
  { id: "f009", name: "Brown Rice (cooked)",         category: "Staples", serving: 150, unit: "g",      calories: 167, protein: 3.7, carbs: 34.5, fat: 1.3, fiber: 2.4 },
  { id: "f090", name: "Whole Wheat Roti",            category: "Staples", serving: 2,   unit: "piece",  calories: 150, protein: 6.0, carbs: 28.0, fat: 2.4, fiber: 4.5 },
  { id: "f091", name: "Missi Roti",                  category: "Staples", serving: 2,   unit: "piece",  calories: 180, protein: 8.0, carbs: 28.0, fat: 4.0, fiber: 5.0 },
  { id: "f092", name: "Quinoa (cooked)",             category: "Staples", serving: 150, unit: "g",      calories: 180, protein: 6.6, carbs: 30.0, fat: 2.9, fiber: 2.6 },
  { id: "f093", name: "Naan (plain)",                category: "Staples", serving: 1,   unit: "piece",  calories: 262, protein: 8.7, carbs: 45.0, fat: 5.1, fiber: 1.9 },
  { id: "f094", name: "Puri",                        category: "Staples", serving: 2,   unit: "piece",  calories: 290, protein: 5.5, carbs: 36.0, fat: 14.0, fiber: 2.0 },
  { id: "f095", name: "Uttapam",                     category: "Staples", serving: 1,   unit: "piece",  calories: 158, protein: 4.5, carbs: 24.0, fat: 5.0, fiber: 2.0 },
  { id: "f096", name: "Naan Butter",                 category: "Staples", serving: 1,   unit: "piece",  calories: 310, protein: 8.5, carbs: 45.0, fat: 10.5, fiber: 1.8 },
  { id: "f097", name: "Tandoori Roti",               category: "Staples", serving: 2,   unit: "piece",  calories: 150, protein: 5.5, carbs: 28.0, fat: 2.0, fiber: 3.0 },
  { id: "f098", name: "Roomali Roti",                category: "Staples", serving: 2,   unit: "piece",  calories: 160, protein: 5.0, carbs: 30.0, fat: 2.5, fiber: 2.0 },
  { id: "f099", name: "Lachha Paratha",              category: "Staples", serving: 2,   unit: "piece",  calories: 380, protein: 8.0, carbs: 48.0, fat: 17.0, fiber: 4.0 },

  // ─────────────────────────────────────────────────────────────────────────
  // INDIAN — DALS & LEGUMES
  // ─────────────────────────────────────────────────────────────────────────
  { id: "f010", name: "Dal Tadka",                   category: "Dals", serving: 150, unit: "g", calories: 143, protein: 8.3, carbs: 21.0, fat: 3.8, fiber: 5.3 },
  { id: "f011", name: "Dal Makhani",                 category: "Dals", serving: 150, unit: "g", calories: 203, protein: 9.8, carbs: 22.5, fat: 8.3, fiber: 6.0 },
  { id: "f012", name: "Chana Dal",                   category: "Dals", serving: 150, unit: "g", calories: 150, protein: 9.8, carbs: 23.3, fat: 2.3, fiber: 6.8 },
  { id: "f013", name: "Rajma (cooked)",              category: "Dals", serving: 150, unit: "g", calories: 191, protein: 13.1, carbs: 34.2, fat: 0.8, fiber: 9.6 },
  { id: "f014", name: "Chole (cooked)",              category: "Dals", serving: 150, unit: "g", calories: 246, protein: 13.4, carbs: 40.5, fat: 3.9, fiber: 11.4 },
  { id: "f015", name: "Moong Dal (cooked)",          category: "Dals", serving: 150, unit: "g", calories: 141, protein: 10.5, carbs: 22.5, fat: 0.6, fiber: 6.2 },
  { id: "f100", name: "Sambhar",                     category: "Dals", serving: 150, unit: "g", calories: 68,  protein: 3.2, carbs: 10.5, fat: 1.5, fiber: 3.5 },
  { id: "f101", name: "Masoor Dal",                  category: "Dals", serving: 150, unit: "g", calories: 138, protein: 10.0, carbs: 22.0, fat: 0.6, fiber: 5.5 },
  { id: "f102", name: "Toor Dal",                    category: "Dals", serving: 150, unit: "g", calories: 150, protein: 10.5, carbs: 23.5, fat: 0.8, fiber: 5.8 },
  { id: "f103", name: "Soya Chunks (cooked)",        category: "Dals", serving: 100, unit: "g", calories: 172, protein: 24.0, carbs: 12.0, fat: 0.8, fiber: 5.0 },

  // ─────────────────────────────────────────────────────────────────────────
  // INDIAN — VEGETABLES & CURRIES
  // ─────────────────────────────────────────────────────────────────────────
  { id: "f020", name: "Palak Paneer",                category: "Vegetables", serving: 150, unit: "g", calories: 198, protein: 10.8, carbs: 9.8,  fat: 14.3, fiber: 3.0 },
  { id: "f021", name: "Aloo Gobi",                   category: "Vegetables", serving: 150, unit: "g", calories: 147, protein: 3.8,  carbs: 21.0, fat: 6.0,  fiber: 3.8 },
  { id: "f022", name: "Baingan Bharta",              category: "Vegetables", serving: 150, unit: "g", calories: 120, protein: 3.0,  carbs: 14.3, fat: 6.0,  fiber: 4.5 },
  { id: "f023", name: "Mixed Veg Sabzi",             category: "Vegetables", serving: 150, unit: "g", calories: 113, protein: 3.8,  carbs: 15.0, fat: 4.5,  fiber: 3.8 },
  { id: "f024", name: "Bhindi Masala",               category: "Vegetables", serving: 150, unit: "g", calories: 128, protein: 3.0,  carbs: 15.0, fat: 6.8,  fiber: 4.5 },
  { id: "f110", name: "Matar Paneer",                category: "Vegetables", serving: 150, unit: "g", calories: 225, protein: 11.0, carbs: 14.0, fat: 14.5, fiber: 4.0 },
  { id: "f111", name: "Kadhi Pakora",                category: "Vegetables", serving: 150, unit: "g", calories: 170, protein: 5.5,  carbs: 18.0, fat: 8.0,  fiber: 2.5 },
  { id: "f112", name: "Methi Sabzi",                 category: "Vegetables", serving: 150, unit: "g", calories: 105, protein: 4.5,  carbs: 11.0, fat: 5.5,  fiber: 5.5 },
  { id: "f113", name: "Jeera Aloo",                  category: "Vegetables", serving: 150, unit: "g", calories: 158, protein: 3.0,  carbs: 24.0, fat: 5.5,  fiber: 3.0 },
  { id: "f114", name: "Raita",                       category: "Vegetables", serving: 100, unit: "g", calories: 62,  protein: 3.5,  carbs: 6.0,  fat: 2.5,  fiber: 0.5 },
  { id: "f115", name: "Kadai Paneer",                category: "Vegetables", serving: 150, unit: "g", calories: 290, protein: 14.0, carbs: 10.0, fat: 21.0, fiber: 2.5 },
  { id: "f116", name: "Shahi Paneer",                category: "Vegetables", serving: 150, unit: "g", calories: 310, protein: 13.5, carbs: 12.0, fat: 23.5, fiber: 1.5 },
  { id: "f117", name: "Paneer Butter Masala",        category: "Vegetables", serving: 150, unit: "g", calories: 320, protein: 14.0, carbs: 13.0, fat: 24.0, fiber: 2.0 },
  { id: "f118", name: "Dum Aloo",                    category: "Vegetables", serving: 150, unit: "g", calories: 240, protein: 4.5,  carbs: 28.0, fat: 13.0, fiber: 3.5 },
  { id: "f119", name: "Butter Chicken",              category: "Protein",    serving: 150, unit: "g", calories: 290, protein: 24.0, carbs: 10.0, fat: 17.0, fiber: 1.5 },

  // ─────────────────────────────────────────────────────────────────────────
  // INDIAN — PROTEINS
  // ─────────────────────────────────────────────────────────────────────────
  { id: "f030", name: "Chicken Curry",               category: "Protein", serving: 150, unit: "g",     calories: 248, protein: 27.0, carbs: 6.8,  fat: 12.8, fiber: 0.8 },
  { id: "f031", name: "Grilled Chicken Breast",      category: "Protein", serving: 150, unit: "g",     calories: 248, protein: 46.5, carbs: 0.0,  fat: 5.4,  fiber: 0.0 },
  { id: "f032", name: "Egg (whole, boiled)",         category: "Protein", serving: 2,   unit: "piece", calories: 154, protein: 12.6, carbs: 1.2,  fat: 10.6, fiber: 0.0 },
  { id: "f033", name: "Egg White (boiled)",          category: "Protein", serving: 4,   unit: "piece", calories: 68,  protein: 14.4, carbs: 0.8,  fat: 0.4,  fiber: 0.0 },
  { id: "f034", name: "Paneer (raw)",                category: "Protein", serving: 100, unit: "g",     calories: 265, protein: 18.0, carbs: 1.2,  fat: 20.0, fiber: 0.0 },
  { id: "f035", name: "Fish Curry",                  category: "Protein", serving: 150, unit: "g",     calories: 222, protein: 25.5, carbs: 6.0,  fat: 10.5, fiber: 0.8 },
  { id: "f036", name: "Tandoori Chicken",            category: "Protein", serving: 150, unit: "g",     calories: 261, protein: 40.5, carbs: 6.0,  fat: 8.3,  fiber: 0.8 },
  { id: "f120", name: "Egg Bhurji (2 eggs)",         category: "Protein", serving: 1,   unit: "plate", calories: 220, protein: 14.0, carbs: 4.0,  fat: 16.0, fiber: 0.5 },
  { id: "f121", name: "Chicken Tikka",               category: "Protein", serving: 150, unit: "g",     calories: 270, protein: 39.0, carbs: 5.0,  fat: 10.0, fiber: 0.5 },
  { id: "f122", name: "Mutton Curry",                category: "Protein", serving: 150, unit: "g",     calories: 315, protein: 28.5, carbs: 4.5,  fat: 20.0, fiber: 0.8 },
  { id: "f123", name: "Prawns Masala",               category: "Protein", serving: 150, unit: "g",     calories: 195, protein: 28.5, carbs: 6.0,  fat: 6.8,  fiber: 0.5 },
  { id: "f124", name: "Tofu Bhurji",                 category: "Protein", serving: 150, unit: "g",     calories: 152, protein: 12.8, carbs: 6.5,  fat: 8.5,  fiber: 1.5 },
  { id: "f125", name: "Paneer Tikka",                category: "Protein", serving: 150, unit: "g",     calories: 360, protein: 22.5, carbs: 6.0,  fat: 27.0, fiber: 1.0 },
  { id: "f126", name: "Chicken Keema",               category: "Protein", serving: 150, unit: "g",     calories: 285, protein: 33.0, carbs: 5.5,  fat: 14.0, fiber: 1.0 },
  { id: "f127", name: "Chicken Korma",               category: "Protein", serving: 150, unit: "g",     calories: 340, protein: 26.0, carbs: 9.0,  fat: 22.0, fiber: 1.0 },
  { id: "f128", name: "Seekh Kebab",                 category: "Protein", serving: 2,   unit: "piece", calories: 280, protein: 24.0, carbs: 6.0,  fat: 17.0, fiber: 1.0 },
  { id: "f129", name: "Galouti Kebab",               category: "Protein", serving: 2,   unit: "piece", calories: 310, protein: 20.0, carbs: 8.0,  fat: 22.0, fiber: 0.8 },
  { id: "f133", name: "Reshmi Kebab",                category: "Protein", serving: 2,   unit: "piece", calories: 260, protein: 22.0, carbs: 5.0,  fat: 16.5, fiber: 0.5 },
  { id: "f134", name: "Lamb Nihari",                 category: "Protein", serving: 150, unit: "g",     calories: 380, protein: 28.0, carbs: 8.0,  fat: 26.0, fiber: 1.5 },
  { id: "f135", name: "Haleem",                      category: "Protein", serving: 200, unit: "g",     calories: 310, protein: 22.0, carbs: 24.0, fat: 14.0, fiber: 4.0 },

  // ─────────────────────────────────────────────────────────────────────────
  // INDIAN — DAIRY
  // ─────────────────────────────────────────────────────────────────────────
  { id: "f040", name: "Whole Milk (250ml)",          category: "Dairy", serving: 250, unit: "ml",      calories: 150, protein: 8.5,  carbs: 12.0, fat: 8.0,  fiber: 0.0 },
  { id: "f041", name: "Curd / Dahi",                 category: "Dairy", serving: 150, unit: "g",       calories: 92,  protein: 5.3,  carbs: 6.8,  fat: 4.8,  fiber: 0.0 },
  { id: "f042", name: "Greek Yogurt",                category: "Dairy", serving: 150, unit: "g",       calories: 89,  protein: 15.0, carbs: 5.4,  fat: 0.6,  fiber: 0.0 },
  { id: "f043", name: "Whey Protein Shake",          category: "Dairy", serving: 30,  unit: "g scoop", calories: 110, protein: 24.0, carbs: 3.5,  fat: 1.0,  fiber: 0.0 },
  { id: "f130", name: "Paneer Bhurji",               category: "Dairy", serving: 100, unit: "g",       calories: 260, protein: 17.0, carbs: 5.0,  fat: 19.0, fiber: 0.5 },
  { id: "f131", name: "Lassi (sweet, 250ml)",        category: "Dairy", serving: 250, unit: "ml",      calories: 185, protein: 7.0,  carbs: 28.0, fat: 5.5,  fiber: 0.0 },
  { id: "f132", name: "Buttermilk / Chaas (250ml)",  category: "Dairy", serving: 250, unit: "ml",      calories: 60,  protein: 4.0,  carbs: 6.5,  fat: 1.5,  fiber: 0.0 },
  { id: "f136", name: "Mango Lassi (300ml)",         category: "Dairy", serving: 300, unit: "ml",      calories: 240, protein: 7.5,  carbs: 38.0, fat: 5.5,  fiber: 1.0 },
  { id: "f137", name: "Shrikhand (100g)",            category: "Dairy", serving: 100, unit: "g",       calories: 240, protein: 7.5,  carbs: 35.0, fat: 8.0,  fiber: 0.0 },

  // ─────────────────────────────────────────────────────────────────────────
  // INDIAN — BREAKFAST
  // ─────────────────────────────────────────────────────────────────────────
  { id: "f080", name: "Oats (cooked, 200g)",         category: "Breakfast", serving: 200, unit: "g",     calories: 136, protein: 5.0,  carbs: 24.0, fat: 2.8, fiber: 3.4 },
  { id: "f081", name: "Oats with Milk & Banana",     category: "Breakfast", serving: 1,   unit: "bowl",  calories: 320, protein: 12.0, carbs: 52.0, fat: 6.5, fiber: 5.0 },
  { id: "f082", name: "Whole Wheat Bread (2 slices)",category: "Breakfast", serving: 2,   unit: "slice", calories: 138, protein: 7.2,  carbs: 24.0, fat: 2.2, fiber: 3.8 },
  { id: "f083", name: "Peanut Butter (1 tbsp)",      category: "Breakfast", serving: 16,  unit: "g",     calories: 94,  protein: 4.0,  carbs: 3.2,  fat: 8.0, fiber: 0.9 },
  { id: "f210", name: "Poha with Peanuts",           category: "Breakfast", serving: 200, unit: "g",     calories: 280, protein: 7.5,  carbs: 44.0, fat: 8.0, fiber: 3.0 },
  { id: "f211", name: "Besan Chilla (2 pieces)",     category: "Breakfast", serving: 2,   unit: "piece", calories: 210, protein: 11.0, carbs: 22.0, fat: 8.0, fiber: 5.0 },
  { id: "f212", name: "Moong Dal Chilla",            category: "Breakfast", serving: 2,   unit: "piece", calories: 180, protein: 12.0, carbs: 20.0, fat: 6.0, fiber: 5.5 },
  { id: "f213", name: "Masala Omelette (2 eggs)",    category: "Breakfast", serving: 1,   unit: "plate", calories: 240, protein: 16.0, carbs: 4.0,  fat: 18.0, fiber: 0.5 },
  { id: "f214", name: "Fruit Salad (200g)",          category: "Breakfast", serving: 200, unit: "g",     calories: 120, protein: 1.8,  carbs: 28.0, fat: 0.4,  fiber: 3.5 },
  { id: "f215", name: "Muesli with Milk",            category: "Breakfast", serving: 1,   unit: "bowl",  calories: 310, protein: 10.0, carbs: 52.0, fat: 6.5,  fiber: 4.5 },
  { id: "f216", name: "Rava Upma",                   category: "Breakfast", serving: 200, unit: "g",     calories: 280, protein: 7.0,  carbs: 42.0, fat: 8.5,  fiber: 3.5 },

  // ─────────────────────────────────────────────────────────────────────────
  // INDIAN — SNACKS & BEVERAGES
  // ─────────────────────────────────────────────────────────────────────────
  { id: "f050", name: "Sprouts Salad",               category: "Snacks", serving: 100, unit: "g",     calories: 62,  protein: 4.3, carbs: 10.0, fat: 0.4, fiber: 3.5 },
  { id: "f051", name: "Roasted Chana",               category: "Snacks", serving: 40,  unit: "g",     calories: 145, protein: 9.3, carbs: 19.3, fat: 3.3, fiber: 6.7 },
  { id: "f052", name: "Peanuts",                     category: "Snacks", serving: 30,  unit: "g",     calories: 171, protein: 7.3, carbs: 5.0,  fat: 14.5, fiber: 2.4 },
  { id: "f053", name: "Banana",                      category: "Snacks", serving: 1,   unit: "medium",calories: 89,  protein: 1.1, carbs: 23.0, fat: 0.3,  fiber: 2.6 },
  { id: "f054", name: "Apple",                       category: "Snacks", serving: 1,   unit: "medium",calories: 72,  protein: 0.4, carbs: 19.0, fat: 0.2,  fiber: 2.4 },
  { id: "f055", name: "Mixed Nuts",                  category: "Snacks", serving: 30,  unit: "g",     calories: 183, protein: 4.5, carbs: 6.5,  fat: 16.0, fiber: 2.0 },
  { id: "f140", name: "Makhana (Foxnuts)",           category: "Snacks", serving: 30,  unit: "g",     calories: 100, protein: 3.8, carbs: 19.5, fat: 0.5,  fiber: 0.8 },
  { id: "f141", name: "Rice Cakes (2 pieces)",       category: "Snacks", serving: 2,   unit: "piece", calories: 70,  protein: 1.4, carbs: 14.5, fat: 0.5,  fiber: 0.3 },
  { id: "f142", name: "Dark Chocolate (25g)",        category: "Snacks", serving: 25,  unit: "g",     calories: 135, protein: 2.0, carbs: 13.5, fat: 8.5,  fiber: 2.5 },
  { id: "f143", name: "Orange",                      category: "Snacks", serving: 1,   unit: "medium",calories: 62,  protein: 1.2, carbs: 15.4, fat: 0.2,  fiber: 3.1 },
  { id: "f144", name: "Watermelon (200g)",           category: "Snacks", serving: 200, unit: "g",     calories: 60,  protein: 1.2, carbs: 15.2, fat: 0.2,  fiber: 0.8 },
  { id: "f145", name: "Papaya (200g)",               category: "Snacks", serving: 200, unit: "g",     calories: 78,  protein: 1.2, carbs: 19.8, fat: 0.3,  fiber: 3.6 },
  { id: "f146", name: "Protein Bar",                 category: "Snacks", serving: 1,   unit: "bar",   calories: 200, protein: 20.0, carbs: 21.0, fat: 7.0,  fiber: 2.5 },
  { id: "f147", name: "Coconut Water (300ml)",       category: "Snacks", serving: 300, unit: "ml",    calories: 57,  protein: 0.9, carbs: 14.0, fat: 0.3,  fiber: 0.0 },
  { id: "f148", name: "Masala Chai",                 category: "Snacks", serving: 1,   unit: "cup",   calories: 55,  protein: 2.0, carbs: 8.0,  fat: 1.5,  fiber: 0.0 },

  // ─────────────────────────────────────────────────────────────────────────
  // INDIAN — STREET FOOD & CHAAT
  // ─────────────────────────────────────────────────────────────────────────
  { id: "f190", name: "Vada Pav",                    category: "FastFood", serving: 1, unit: "piece",  calories: 296, protein: 6.5,  carbs: 40.0, fat: 12.5, fiber: 3.5 },
  { id: "f191", name: "Pav Bhaji",                   category: "FastFood", serving: 1, unit: "plate",  calories: 390, protein: 9.0,  carbs: 58.0, fat: 14.0, fiber: 5.0 },
  { id: "f192", name: "Chole Bhature",               category: "FastFood", serving: 1, unit: "plate",  calories: 460, protein: 12.0, carbs: 62.0, fat: 18.0, fiber: 6.0 },
  { id: "f193", name: "Samosa (2 pieces)",           category: "FastFood", serving: 2, unit: "piece",  calories: 524, protein: 7.0,  carbs: 50.0, fat: 34.0, fiber: 4.0 },
  { id: "f194", name: "Chicken Biryani (250g)",      category: "FastFood", serving: 250, unit: "g",    calories: 435, protein: 22.0, carbs: 52.0, fat: 15.0, fiber: 2.5 },
  { id: "f195", name: "Pani Puri (6 pieces)",        category: "FastFood", serving: 6, unit: "piece",  calories: 150, protein: 2.5,  carbs: 25.0, fat: 5.5,  fiber: 1.5 },
  { id: "f196", name: "Bhel Puri",                   category: "FastFood", serving: 1, unit: "plate",  calories: 180, protein: 4.5,  carbs: 32.0, fat: 4.5,  fiber: 3.0 },
  { id: "f197", name: "Dahi Puri (6 pieces)",        category: "FastFood", serving: 6, unit: "piece",  calories: 210, protein: 5.0,  carbs: 30.0, fat: 7.5,  fiber: 2.5 },
  { id: "f198", name: "Masala Dosa",                 category: "FastFood", serving: 1, unit: "piece",  calories: 260, protein: 5.5,  carbs: 42.0, fat: 8.5,  fiber: 3.0 },
  { id: "f230", name: "Aloo Tikki (2 pieces)",       category: "FastFood", serving: 2, unit: "piece",  calories: 290, protein: 5.5,  carbs: 38.0, fat: 13.0, fiber: 3.5 },
  { id: "f231", name: "Papdi Chaat",                 category: "FastFood", serving: 1, unit: "plate",  calories: 280, protein: 6.5,  carbs: 38.0, fat: 11.0, fiber: 3.0 },
  { id: "f232", name: "Raj Kachori",                 category: "FastFood", serving: 1, unit: "piece",  calories: 320, protein: 8.0,  carbs: 42.0, fat: 13.5, fiber: 4.0 },
  { id: "f233", name: "Sev Puri",                    category: "FastFood", serving: 1, unit: "plate",  calories: 200, protein: 5.0,  carbs: 28.0, fat: 8.0,  fiber: 2.5 },
  { id: "f234", name: "Dabeli",                      category: "FastFood", serving: 1, unit: "piece",  calories: 250, protein: 5.5,  carbs: 36.0, fat: 9.5,  fiber: 3.0 },
  { id: "f235", name: "Kachori (2 pieces)",          category: "FastFood", serving: 2, unit: "piece",  calories: 340, protein: 7.0,  carbs: 40.0, fat: 17.0, fiber: 3.5 },
  { id: "f236", name: "Hyderabadi Biryani (250g)",   category: "FastFood", serving: 250, unit: "g",    calories: 480, protein: 24.0, carbs: 55.0, fat: 17.0, fiber: 2.5 },
  { id: "f237", name: "Veg Biryani (250g)",          category: "FastFood", serving: 250, unit: "g",    calories: 350, protein: 8.5,  carbs: 58.0, fat: 10.0, fiber: 4.0 },
  { id: "f238", name: "Mutton Biryani (250g)",       category: "FastFood", serving: 250, unit: "g",    calories: 520, protein: 28.0, carbs: 54.0, fat: 20.0, fiber: 2.5 },

  // ─────────────────────────────────────────────────────────────────────────
  // INDIAN — SWEETS & DESSERTS
  // ─────────────────────────────────────────────────────────────────────────
  { id: "f205", name: "Gulab Jamun (2 pieces)",      category: "FastFood", serving: 2,   unit: "piece", calories: 300, protein: 6.0,  carbs: 50.0, fat: 10.0, fiber: 0.0 },
  { id: "f206", name: "Kheer (150g)",                category: "FastFood", serving: 150, unit: "g",     calories: 213, protein: 5.5,  carbs: 32.0, fat: 7.5,  fiber: 0.0 },
  { id: "f207", name: "Besan Halwa (100g)",          category: "FastFood", serving: 100, unit: "g",     calories: 320, protein: 6.0,  carbs: 38.0, fat: 16.0, fiber: 2.0 },
  { id: "f239", name: "Rasgulla (2 pieces)",         category: "FastFood", serving: 2,   unit: "piece", calories: 180, protein: 4.5,  carbs: 38.0, fat: 1.5,  fiber: 0.0 },
  { id: "f240", name: "Jalebi (100g)",               category: "FastFood", serving: 100, unit: "g",     calories: 380, protein: 3.5,  carbs: 68.0, fat: 11.0, fiber: 0.5 },
  { id: "f241", name: "Gajar Halwa (100g)",          category: "FastFood", serving: 100, unit: "g",     calories: 310, protein: 5.5,  carbs: 40.0, fat: 14.0, fiber: 2.5 },
  { id: "f242", name: "Sooji Halwa (100g)",          category: "FastFood", serving: 100, unit: "g",     calories: 290, protein: 5.0,  carbs: 42.0, fat: 12.0, fiber: 1.5 },
  { id: "f243", name: "Ladoo (Besan, 2 pieces)",     category: "FastFood", serving: 2,   unit: "piece", calories: 320, protein: 6.5,  carbs: 38.0, fat: 16.0, fiber: 2.0 },
  { id: "f244", name: "Barfi (2 pieces)",            category: "FastFood", serving: 2,   unit: "piece", calories: 260, protein: 5.5,  carbs: 34.0, fat: 12.0, fiber: 0.5 },

  // ─────────────────────────────────────────────────────────────────────────
  // SOUTH INDIAN — DOSA & IDLI VARIETIES
  // ─────────────────────────────────────────────────────────────────────────
  { id: "f300", name: "Rava Dosa",                   category: "SouthIndian", serving: 1, unit: "piece",  calories: 165, protein: 4.0,  carbs: 26.0, fat: 5.0,  fiber: 1.0 },
  { id: "f301", name: "Egg Dosa",                    category: "SouthIndian", serving: 1, unit: "piece",  calories: 215, protein: 11.0, carbs: 22.0, fat: 9.5,  fiber: 0.8 },
  { id: "f302", name: "Set Dosa (3 pieces)",         category: "SouthIndian", serving: 3, unit: "piece",  calories: 270, protein: 7.0,  carbs: 44.0, fat: 7.0,  fiber: 2.0 },
  { id: "f303", name: "Neer Dosa (2 pieces)",        category: "SouthIndian", serving: 2, unit: "piece",  calories: 120, protein: 2.5,  carbs: 22.0, fat: 2.5,  fiber: 0.5 },
  { id: "f304", name: "Pesarattu (2 pieces)",        category: "SouthIndian", serving: 2, unit: "piece",  calories: 200, protein: 12.0, carbs: 26.0, fat: 5.0,  fiber: 4.5 },
  { id: "f305", name: "Paper Roast Dosa",            category: "SouthIndian", serving: 1, unit: "piece",  calories: 150, protein: 3.5,  carbs: 25.0, fat: 4.0,  fiber: 0.8 },
  { id: "f306", name: "Ghee Roast Dosa",             category: "SouthIndian", serving: 1, unit: "piece",  calories: 240, protein: 4.0,  carbs: 28.0, fat: 11.5, fiber: 0.8 },
  { id: "f307", name: "Onion Dosa",                  category: "SouthIndian", serving: 1, unit: "piece",  calories: 155, protein: 4.0,  carbs: 24.0, fat: 4.5,  fiber: 1.5 },
  { id: "f308", name: "Mysore Masala Dosa",          category: "SouthIndian", serving: 1, unit: "piece",  calories: 310, protein: 6.5,  carbs: 48.0, fat: 10.5, fiber: 3.5 },
  { id: "f309", name: "Rava Idli (3 pieces)",        category: "SouthIndian", serving: 3, unit: "piece",  calories: 180, protein: 5.5,  carbs: 29.0, fat: 4.5,  fiber: 2.0 },
  { id: "f310", name: "Mini Idli with Sambhar",      category: "SouthIndian", serving: 10, unit: "piece", calories: 220, protein: 7.5,  carbs: 38.0, fat: 3.5,  fiber: 3.5 },
  { id: "f311", name: "Kanchipuram Idli (2 pieces)", category: "SouthIndian", serving: 2, unit: "piece",  calories: 165, protein: 5.0,  carbs: 27.0, fat: 4.0,  fiber: 2.5 },
  { id: "f312", name: "Idli with Coconut Chutney",   category: "SouthIndian", serving: 3, unit: "piece",  calories: 190, protein: 6.0,  carbs: 30.0, fat: 5.5,  fiber: 2.0 },

  // ─────────────────────────────────────────────────────────────────────────
  // SOUTH INDIAN — VADA
  // ─────────────────────────────────────────────────────────────────────────
  { id: "f313", name: "Medu Vada (2 pieces)",        category: "SouthIndian", serving: 2, unit: "piece",  calories: 290, protein: 10.0, carbs: 32.0, fat: 13.0, fiber: 3.0 },
  { id: "f314", name: "Masala Vada (2 pieces)",      category: "SouthIndian", serving: 2, unit: "piece",  calories: 310, protein: 11.5, carbs: 30.0, fat: 16.0, fiber: 5.0 },
  { id: "f315", name: "Dahi Vada (2 pieces)",        category: "SouthIndian", serving: 2, unit: "piece",  calories: 280, protein: 10.0, carbs: 36.0, fat: 9.0,  fiber: 2.5 },
  { id: "f316", name: "Rava Vada (2 pieces)",        category: "SouthIndian", serving: 2, unit: "piece",  calories: 260, protein: 7.0,  carbs: 32.0, fat: 11.5, fiber: 2.0 },
  { id: "f317", name: "Parippu Vada (2 pieces)",     category: "SouthIndian", serving: 2, unit: "piece",  calories: 295, protein: 12.0, carbs: 28.0, fat: 14.0, fiber: 5.0 },

  // ─────────────────────────────────────────────────────────────────────────
  // SOUTH INDIAN — RICE DISHES
  // ─────────────────────────────────────────────────────────────────────────
  { id: "f318", name: "Lemon Rice",                  category: "SouthIndian", serving: 200, unit: "g",    calories: 290, protein: 5.0,  carbs: 50.0, fat: 7.5,  fiber: 2.0 },
  { id: "f319", name: "Tamarind Rice (Puliyodarai)", category: "SouthIndian", serving: 200, unit: "g",    calories: 310, protein: 5.5,  carbs: 54.0, fat: 8.5,  fiber: 2.5 },
  { id: "f320", name: "Curd Rice",                   category: "SouthIndian", serving: 200, unit: "g",    calories: 240, protein: 7.0,  carbs: 38.0, fat: 6.0,  fiber: 1.0 },
  { id: "f321", name: "Coconut Rice",                category: "SouthIndian", serving: 200, unit: "g",    calories: 330, protein: 5.5,  carbs: 52.0, fat: 11.0, fiber: 2.5 },
  { id: "f322", name: "Tomato Rice",                 category: "SouthIndian", serving: 200, unit: "g",    calories: 270, protein: 5.0,  carbs: 48.0, fat: 6.5,  fiber: 2.5 },
  { id: "f323", name: "Bisi Bele Bath",              category: "SouthIndian", serving: 250, unit: "g",    calories: 380, protein: 12.0, carbs: 58.0, fat: 10.5, fiber: 6.0 },
  { id: "f324", name: "Ven Pongal",                  category: "SouthIndian", serving: 200, unit: "g",    calories: 300, protein: 8.0,  carbs: 48.0, fat: 8.5,  fiber: 3.0 },
  { id: "f325", name: "Khara Pongal",                category: "SouthIndian", serving: 200, unit: "g",    calories: 320, protein: 8.5,  carbs: 50.0, fat: 9.5,  fiber: 3.5 },
  { id: "f326", name: "Vangi Bath (Brinjal Rice)",   category: "SouthIndian", serving: 200, unit: "g",    calories: 280, protein: 5.5,  carbs: 48.0, fat: 7.5,  fiber: 3.5 },
  { id: "f327", name: "Sambar Rice",                 category: "SouthIndian", serving: 250, unit: "g",    calories: 320, protein: 9.5,  carbs: 55.0, fat: 7.0,  fiber: 5.0 },
  { id: "f328", name: "Rasam Rice",                  category: "SouthIndian", serving: 250, unit: "g",    calories: 260, protein: 6.0,  carbs: 48.0, fat: 5.0,  fiber: 2.5 },
  { id: "f329", name: "Ghee Rice",                   category: "SouthIndian", serving: 200, unit: "g",    calories: 380, protein: 5.0,  carbs: 52.0, fat: 16.0, fiber: 1.0 },

  // ─────────────────────────────────────────────────────────────────────────
  // SOUTH INDIAN — KERALA DISHES
  // ─────────────────────────────────────────────────────────────────────────
  { id: "f330", name: "Appam (2 pieces)",            category: "SouthIndian", serving: 2, unit: "piece",  calories: 170, protein: 4.0,  carbs: 30.0, fat: 3.5,  fiber: 1.0 },
  { id: "f331", name: "Puttu with Kadala Curry",     category: "SouthIndian", serving: 1, unit: "plate",  calories: 400, protein: 13.5, carbs: 62.0, fat: 10.0, fiber: 8.0 },
  { id: "f332", name: "Kerala Parotta (2 pieces)",   category: "SouthIndian", serving: 2, unit: "piece",  calories: 420, protein: 8.5,  carbs: 58.0, fat: 18.0, fiber: 2.5 },
  { id: "f333", name: "Idiyappam (2 pieces)",        category: "SouthIndian", serving: 2, unit: "piece",  calories: 140, protein: 3.0,  carbs: 28.0, fat: 1.5,  fiber: 0.8 },
  { id: "f334", name: "Kerala Fish Curry",           category: "SouthIndian", serving: 150, unit: "g",    calories: 210, protein: 24.0, carbs: 7.5,  fat: 9.5,  fiber: 1.5 },
  { id: "f335", name: "Karimeen Pollichathu",        category: "SouthIndian", serving: 1, unit: "piece",  calories: 290, protein: 28.0, carbs: 5.5,  fat: 17.0, fiber: 1.5 },
  { id: "f336", name: "Kerala Beef Fry",             category: "SouthIndian", serving: 150, unit: "g",    calories: 340, protein: 30.0, carbs: 5.0,  fat: 22.0, fiber: 1.5 },
  { id: "f337", name: "Kerala Prawn Curry",          category: "SouthIndian", serving: 150, unit: "g",    calories: 220, protein: 27.0, carbs: 8.0,  fat: 9.0,  fiber: 1.5 },
  { id: "f338", name: "Mutton Stew (Kerala)",        category: "SouthIndian", serving: 150, unit: "g",    calories: 280, protein: 26.0, carbs: 8.5,  fat: 15.0, fiber: 2.0 },
  { id: "f339", name: "Aviyal",                      category: "SouthIndian", serving: 150, unit: "g",    calories: 145, protein: 3.5,  carbs: 14.0, fat: 8.5,  fiber: 4.0 },
  { id: "f340", name: "Erissery (Pumpkin)",          category: "SouthIndian", serving: 150, unit: "g",    calories: 165, protein: 4.5,  carbs: 20.0, fat: 7.5,  fiber: 5.0 },
  { id: "f341", name: "Thoran (Cabbage)",            category: "SouthIndian", serving: 100, unit: "g",    calories: 105, protein: 2.5,  carbs: 9.0,  fat: 6.5,  fiber: 4.0 },
  { id: "f342", name: "Olan (Ash Gourd Curry)",      category: "SouthIndian", serving: 150, unit: "g",    calories: 120, protein: 3.0,  carbs: 12.0, fat: 7.0,  fiber: 3.0 },
  { id: "f343", name: "Sadya Meal (1 plate)",        category: "SouthIndian", serving: 1,  unit: "plate", calories: 680, protein: 16.0, carbs: 110.0, fat: 18.0, fiber: 10.0 },

  // ─────────────────────────────────────────────────────────────────────────
  // SOUTH INDIAN — ANDHRA & TELANGANA
  // ─────────────────────────────────────────────────────────────────────────
  { id: "f344", name: "Gongura Mutton",              category: "SouthIndian", serving: 150, unit: "g",    calories: 350, protein: 29.0, carbs: 6.5,  fat: 23.0, fiber: 2.0 },
  { id: "f345", name: "Andhra Chicken Curry",        category: "SouthIndian", serving: 150, unit: "g",    calories: 295, protein: 27.0, carbs: 6.0,  fat: 17.5, fiber: 1.5 },
  { id: "f346", name: "Pulihora (Andhra)",           category: "SouthIndian", serving: 200, unit: "g",    calories: 310, protein: 5.5,  carbs: 54.0, fat: 8.5,  fiber: 2.5 },
  { id: "f347", name: "Gutti Vankaya Curry",         category: "SouthIndian", serving: 150, unit: "g",    calories: 175, protein: 4.0,  carbs: 18.0, fat: 10.0, fiber: 4.5 },
  { id: "f348", name: "Sarva Pindi",                 category: "SouthIndian", serving: 150, unit: "g",    calories: 250, protein: 8.0,  carbs: 34.0, fat: 9.5,  fiber: 3.5 },
  { id: "f349", name: "Chepa Pulusu (Fish Curry)",   category: "SouthIndian", serving: 150, unit: "g",    calories: 195, protein: 22.0, carbs: 8.0,  fat: 8.5,  fiber: 1.5 },

  // ─────────────────────────────────────────────────────────────────────────
  // SOUTH INDIAN — CHETTINAD & TAMIL DISHES
  // ─────────────────────────────────────────────────────────────────────────
  { id: "f350", name: "Chettinad Chicken Curry",     category: "SouthIndian", serving: 150, unit: "g",    calories: 315, protein: 28.0, carbs: 7.0,  fat: 19.0, fiber: 2.0 },
  { id: "f351", name: "Chettinad Fish Fry",          category: "SouthIndian", serving: 150, unit: "g",    calories: 265, protein: 28.0, carbs: 5.0,  fat: 14.5, fiber: 1.0 },
  { id: "f352", name: "Kuzhambu (Curry)",            category: "SouthIndian", serving: 150, unit: "g",    calories: 120, protein: 4.0,  carbs: 12.0, fat: 6.5,  fiber: 3.0 },
  { id: "f353", name: "Rasam",                       category: "SouthIndian", serving: 200, unit: "ml",   calories: 50,  protein: 2.0,  carbs: 8.0,  fat: 1.5,  fiber: 1.5 },
  { id: "f354", name: "Poriyal (Mixed Veg)",         category: "SouthIndian", serving: 100, unit: "g",    calories: 100, protein: 2.5,  carbs: 11.0, fat: 5.5,  fiber: 3.5 },
  { id: "f355", name: "Kootu (Veg & Lentil)",        category: "SouthIndian", serving: 150, unit: "g",    calories: 145, protein: 6.5,  carbs: 18.0, fat: 5.0,  fiber: 5.5 },
  { id: "f356", name: "Keerai Masiyal (Spinach)",    category: "SouthIndian", serving: 150, unit: "g",    calories: 90,  protein: 5.0,  carbs: 9.0,  fat: 3.5,  fiber: 4.5 },
  { id: "f357", name: "Molagootal",                  category: "SouthIndian", serving: 150, unit: "g",    calories: 165, protein: 7.5,  carbs: 18.0, fat: 7.5,  fiber: 5.0 },
  { id: "f358", name: "Meen Kulambu (Fish Curry)",   category: "SouthIndian", serving: 150, unit: "g",    calories: 205, protein: 22.0, carbs: 9.0,  fat: 9.5,  fiber: 2.0 },

  // ─────────────────────────────────────────────────────────────────────────
  // SOUTH INDIAN — SWEETS & SNACKS
  // ─────────────────────────────────────────────────────────────────────────
  { id: "f359", name: "Payasam / Kheer",             category: "SouthIndian", serving: 150, unit: "g",    calories: 250, protein: 5.5,  carbs: 38.0, fat: 9.0,  fiber: 0.5 },
  { id: "f360", name: "Rava Kesari (100g)",          category: "SouthIndian", serving: 100, unit: "g",    calories: 280, protein: 3.5,  carbs: 44.0, fat: 10.0, fiber: 1.0 },
  { id: "f361", name: "Mysore Pak (2 pieces)",       category: "SouthIndian", serving: 2,  unit: "piece", calories: 420, protein: 6.0,  carbs: 45.0, fat: 24.0, fiber: 1.5 },
  { id: "f362", name: "Sweet Pongal",                category: "SouthIndian", serving: 200, unit: "g",    calories: 325, protein: 6.5,  carbs: 54.0, fat: 9.5,  fiber: 2.0 },
  { id: "f363", name: "Kozhukattai (2 pieces)",      category: "SouthIndian", serving: 2,  unit: "piece", calories: 185, protein: 3.5,  carbs: 36.0, fat: 3.0,  fiber: 1.5 },
  { id: "f364", name: "Murukku (40g)",               category: "SouthIndian", serving: 40, unit: "g",     calories: 220, protein: 4.5,  carbs: 28.0, fat: 10.0, fiber: 1.5 },
  { id: "f365", name: "Mixture Snack (50g)",         category: "SouthIndian", serving: 50, unit: "g",     calories: 245, protein: 6.0,  carbs: 28.0, fat: 12.0, fiber: 2.0 },
  { id: "f366", name: "Sundal (Chickpea)",           category: "SouthIndian", serving: 100, unit: "g",    calories: 155, protein: 8.5,  carbs: 22.0, fat: 4.0,  fiber: 6.0 },
  { id: "f367", name: "Ribbon Pakoda (30g)",         category: "SouthIndian", serving: 30, unit: "g",     calories: 160, protein: 3.5,  carbs: 18.0, fat: 8.5,  fiber: 1.0 },
  { id: "f368", name: "Banana Chips (30g)",          category: "SouthIndian", serving: 30, unit: "g",     calories: 165, protein: 1.0,  carbs: 20.0, fat: 9.0,  fiber: 1.5 },

  // ─────────────────────────────────────────────────────────────────────────
  // ITALIAN — PASTA
  // ─────────────────────────────────────────────────────────────────────────
  { id: "f500", name: "Spaghetti Bolognese",         category: "Italian", serving: 1, unit: "plate", calories: 480, protein: 26.0, carbs: 55.0, fat: 16.0, fiber: 4.0 },
  { id: "f501", name: "Pasta Carbonara",             category: "Italian", serving: 1, unit: "plate", calories: 520, protein: 22.0, carbs: 52.0, fat: 24.0, fiber: 2.5 },
  { id: "f502", name: "Pasta Aglio e Olio",          category: "Italian", serving: 1, unit: "plate", calories: 380, protein: 11.0, carbs: 56.0, fat: 13.0, fiber: 3.0 },
  { id: "f503", name: "Pasta al Pesto",              category: "Italian", serving: 1, unit: "plate", calories: 430, protein: 14.0, carbs: 54.0, fat: 17.0, fiber: 3.5 },
  { id: "f504", name: "Pasta Arrabiata",             category: "Italian", serving: 1, unit: "plate", calories: 360, protein: 12.0, carbs: 58.0, fat: 8.0,  fiber: 4.0 },
  { id: "f505", name: "Pasta Alfredo",               category: "Italian", serving: 1, unit: "plate", calories: 510, protein: 16.0, carbs: 52.0, fat: 26.0, fiber: 2.0 },
  { id: "f506", name: "Spaghetti & Meatballs",       category: "Italian", serving: 1, unit: "plate", calories: 560, protein: 30.0, carbs: 56.0, fat: 22.0, fiber: 4.5 },
  { id: "f507", name: "Cacio e Pepe",                category: "Italian", serving: 1, unit: "plate", calories: 450, protein: 16.0, carbs: 54.0, fat: 18.0, fiber: 2.5 },
  { id: "f508", name: "Penne Vodka",                 category: "Italian", serving: 1, unit: "plate", calories: 450, protein: 14.0, carbs: 54.0, fat: 18.0, fiber: 3.0 },
  { id: "f509", name: "Lasagna",                     category: "Italian", serving: 1, unit: "slice", calories: 460, protein: 24.0, carbs: 38.0, fat: 22.0, fiber: 3.0 },
  { id: "f510", name: "Penne Primavera",             category: "Italian", serving: 1, unit: "plate", calories: 380, protein: 13.0, carbs: 58.0, fat: 10.0, fiber: 5.0 },
  { id: "f511", name: "Tortellini in Cream Sauce",   category: "Italian", serving: 1, unit: "plate", calories: 490, protein: 20.0, carbs: 52.0, fat: 22.0, fiber: 2.5 },
  { id: "f512", name: "Pasta e Fagioli",             category: "Italian", serving: 1, unit: "bowl",  calories: 320, protein: 14.0, carbs: 50.0, fat: 7.0,  fiber: 8.0 },
  { id: "f513", name: "Orecchiette with Broccoli",   category: "Italian", serving: 1, unit: "plate", calories: 360, protein: 13.0, carbs: 56.0, fat: 9.5,  fiber: 5.5 },

  // ─────────────────────────────────────────────────────────────────────────
  // ITALIAN — PIZZA
  // ─────────────────────────────────────────────────────────────────────────
  { id: "f520", name: "Pizza Margherita (1 slice)",  category: "Italian", serving: 1, unit: "slice", calories: 250, protein: 10.0, carbs: 30.0, fat: 9.5,  fiber: 2.0 },
  { id: "f521", name: "Pizza Quattro Formaggi (1 slice)", category: "Italian", serving: 1, unit: "slice", calories: 295, protein: 13.5, carbs: 28.0, fat: 14.5, fiber: 1.5 },
  { id: "f522", name: "Pizza Pepperoni (1 slice)",   category: "Italian", serving: 1, unit: "slice", calories: 305, protein: 13.0, carbs: 29.0, fat: 15.0, fiber: 1.5 },
  { id: "f523", name: "Pizza Prosciutto (1 slice)",  category: "Italian", serving: 1, unit: "slice", calories: 275, protein: 14.0, carbs: 28.0, fat: 12.0, fiber: 1.5 },
  { id: "f524", name: "Pizza Vegetariana (1 slice)", category: "Italian", serving: 1, unit: "slice", calories: 230, protein: 9.0,  carbs: 30.0, fat: 8.0,  fiber: 3.0 },
  { id: "f525", name: "Calzone",                     category: "Italian", serving: 1, unit: "piece", calories: 580, protein: 26.0, carbs: 60.0, fat: 24.0, fiber: 3.5 },

  // ─────────────────────────────────────────────────────────────────────────
  // ITALIAN — RISOTTO
  // ─────────────────────────────────────────────────────────────────────────
  { id: "f530", name: "Mushroom Risotto",            category: "Italian", serving: 1, unit: "plate", calories: 420, protein: 11.0, carbs: 58.0, fat: 14.0, fiber: 3.0 },
  { id: "f531", name: "Seafood Risotto",             category: "Italian", serving: 1, unit: "plate", calories: 455, protein: 24.0, carbs: 54.0, fat: 13.0, fiber: 2.5 },
  { id: "f532", name: "Porcini Risotto",             category: "Italian", serving: 1, unit: "plate", calories: 440, protein: 12.0, carbs: 56.0, fat: 15.0, fiber: 3.5 },

  // ─────────────────────────────────────────────────────────────────────────
  // ITALIAN — STARTERS, SOUPS & SALADS
  // ─────────────────────────────────────────────────────────────────────────
  { id: "f540", name: "Minestrone Soup",             category: "Italian", serving: 1, unit: "bowl",  calories: 180, protein: 7.0,  carbs: 28.0, fat: 4.5,  fiber: 6.0 },
  { id: "f541", name: "Caprese Salad",               category: "Italian", serving: 1, unit: "plate", calories: 225, protein: 12.5, carbs: 6.0,  fat: 17.0, fiber: 1.5 },
  { id: "f542", name: "Bruschetta (2 pieces)",       category: "Italian", serving: 2, unit: "piece", calories: 185, protein: 5.5,  carbs: 27.0, fat: 6.0,  fiber: 2.5 },
  { id: "f543", name: "Caesar Salad",                category: "Italian", serving: 1, unit: "plate", calories: 310, protein: 9.0,  carbs: 18.0, fat: 22.0, fiber: 3.0 },
  { id: "f544", name: "Arancini (2 pieces)",         category: "Italian", serving: 2, unit: "piece", calories: 320, protein: 10.0, carbs: 40.0, fat: 13.0, fiber: 2.0 },

  // ─────────────────────────────────────────────────────────────────────────
  // ITALIAN — MAINS & BREAD
  // ─────────────────────────────────────────────────────────────────────────
  { id: "f550", name: "Chicken Parmesan",            category: "Italian", serving: 1, unit: "plate", calories: 525, protein: 42.0, carbs: 30.0, fat: 24.0, fiber: 2.5 },
  { id: "f551", name: "Osso Buco",                   category: "Italian", serving: 1, unit: "plate", calories: 460, protein: 38.0, carbs: 12.0, fat: 26.0, fiber: 2.0 },
  { id: "f552", name: "Italian Meatballs (3 pieces)",category: "Italian", serving: 3, unit: "piece", calories: 315, protein: 22.0, carbs: 12.0, fat: 20.0, fiber: 1.5 },
  { id: "f553", name: "Focaccia (1 slice)",          category: "Italian", serving: 1, unit: "slice", calories: 185, protein: 5.0,  carbs: 28.0, fat: 6.0,  fiber: 2.0 },
  { id: "f554", name: "Garlic Bread (2 slices)",     category: "Italian", serving: 2, unit: "slice", calories: 210, protein: 5.5,  carbs: 28.0, fat: 9.0,  fiber: 1.5 },
  { id: "f555", name: "Ciabatta Roll",               category: "Italian", serving: 1, unit: "piece", calories: 175, protein: 6.0,  carbs: 30.0, fat: 3.5,  fiber: 1.5 },

  // ─────────────────────────────────────────────────────────────────────────
  // ITALIAN — DESSERTS
  // ─────────────────────────────────────────────────────────────────────────
  { id: "f560", name: "Tiramisu",                    category: "Italian", serving: 1, unit: "slice", calories: 385, protein: 6.5,  carbs: 38.0, fat: 22.0, fiber: 0.5 },
  { id: "f561", name: "Gelato (2 scoops)",           category: "Italian", serving: 2, unit: "scoop", calories: 260, protein: 5.0,  carbs: 38.0, fat: 10.0, fiber: 0.5 },
  { id: "f562", name: "Panna Cotta",                 category: "Italian", serving: 1, unit: "piece", calories: 285, protein: 4.5,  carbs: 28.0, fat: 17.0, fiber: 0.0 },
  { id: "f563", name: "Cannoli (1 piece)",           category: "Italian", serving: 1, unit: "piece", calories: 225, protein: 5.5,  carbs: 28.0, fat: 11.0, fiber: 0.5 },
  { id: "f564", name: "Affogato",                    category: "Italian", serving: 1, unit: "cup",   calories: 185, protein: 4.0,  carbs: 22.0, fat: 9.0,  fiber: 0.0 },

  // ─────────────────────────────────────────────────────────────────────────
  // AMERICAN — BURGERS & SANDWICHES
  // ─────────────────────────────────────────────────────────────────────────
  { id: "f600", name: "Classic Beef Burger",         category: "American", serving: 1, unit: "burger", calories: 540, protein: 28.0, carbs: 42.0, fat: 28.0, fiber: 2.5 },
  { id: "f601", name: "Double Cheeseburger",         category: "American", serving: 1, unit: "burger", calories: 680, protein: 40.0, carbs: 42.0, fat: 38.0, fiber: 2.5 },
  { id: "f602", name: "BBQ Bacon Burger",            category: "American", serving: 1, unit: "burger", calories: 720, protein: 38.0, carbs: 50.0, fat: 38.0, fiber: 3.0 },
  { id: "f603", name: "Turkey Burger",               category: "American", serving: 1, unit: "burger", calories: 450, protein: 32.0, carbs: 36.0, fat: 18.0, fiber: 2.5 },
  { id: "f604", name: "Veggie Burger",               category: "American", serving: 1, unit: "burger", calories: 380, protein: 16.0, carbs: 44.0, fat: 14.0, fiber: 6.0 },
  { id: "f605", name: "Mushroom Swiss Burger",       category: "American", serving: 1, unit: "burger", calories: 580, protein: 32.0, carbs: 40.0, fat: 30.0, fiber: 2.5 },
  { id: "f606", name: "Hot Dog",                     category: "American", serving: 1, unit: "piece",  calories: 310, protein: 12.0, carbs: 24.0, fat: 18.0, fiber: 1.0 },
  { id: "f607", name: "Corn Dog",                    category: "American", serving: 1, unit: "piece",  calories: 280, protein: 9.0,  carbs: 32.0, fat: 13.0, fiber: 1.5 },
  { id: "f608", name: "Club Sandwich",               category: "American", serving: 1, unit: "sandwich",calories: 490, protein: 28.0, carbs: 40.0, fat: 22.0, fiber: 3.0 },
  { id: "f609", name: "BLT Sandwich",                category: "American", serving: 1, unit: "sandwich",calories: 380, protein: 18.0, carbs: 34.0, fat: 18.0, fiber: 2.5 },
  { id: "f610", name: "Grilled Cheese Sandwich",     category: "American", serving: 1, unit: "sandwich",calories: 350, protein: 14.0, carbs: 32.0, fat: 19.0, fiber: 2.0 },
  { id: "f611", name: "Philly Cheesesteak",          category: "American", serving: 1, unit: "sandwich",calories: 580, protein: 32.0, carbs: 46.0, fat: 28.0, fiber: 2.5 },
  { id: "f612", name: "Reuben Sandwich",             category: "American", serving: 1, unit: "sandwich",calories: 555, protein: 28.0, carbs: 44.0, fat: 26.0, fiber: 3.5 },
  { id: "f613", name: "Pulled Pork Sandwich",        category: "American", serving: 1, unit: "sandwich",calories: 520, protein: 30.0, carbs: 50.0, fat: 20.0, fiber: 2.5 },

  // ─────────────────────────────────────────────────────────────────────────
  // AMERICAN — BBQ & COMFORT FOOD
  // ─────────────────────────────────────────────────────────────────────────
  { id: "f620", name: "BBQ Ribs (2 ribs)",           category: "American", serving: 2, unit: "rib",    calories: 420, protein: 30.0, carbs: 12.0, fat: 28.0, fiber: 0.5 },
  { id: "f621", name: "Pulled Pork (150g)",          category: "American", serving: 150, unit: "g",    calories: 380, protein: 28.0, carbs: 18.0, fat: 22.0, fiber: 1.0 },
  { id: "f622", name: "Beef Brisket (150g)",         category: "American", serving: 150, unit: "g",    calories: 350, protein: 32.0, carbs: 0.0,  fat: 24.0, fiber: 0.0 },
  { id: "f623", name: "BBQ Chicken (150g)",          category: "American", serving: 150, unit: "g",    calories: 340, protein: 34.0, carbs: 12.0, fat: 16.0, fiber: 0.5 },
  { id: "f624", name: "Mac & Cheese",                category: "American", serving: 1,  unit: "bowl",  calories: 420, protein: 16.0, carbs: 50.0, fat: 18.0, fiber: 2.0 },
  { id: "f625", name: "Fried Chicken (2 pieces)",    category: "American", serving: 2,  unit: "piece", calories: 520, protein: 38.0, carbs: 24.0, fat: 30.0, fiber: 1.0 },
  { id: "f626", name: "Chicken Wings (6 pieces)",    category: "American", serving: 6,  unit: "piece", calories: 480, protein: 34.0, carbs: 12.0, fat: 32.0, fiber: 0.5 },
  { id: "f627", name: "Buffalo Chicken Wings (6pc)", category: "American", serving: 6,  unit: "piece", calories: 510, protein: 36.0, carbs: 8.0,  fat: 36.0, fiber: 0.5 },
  { id: "f628", name: "Chicken Tenders (3 pieces)",  category: "American", serving: 3,  unit: "piece", calories: 390, protein: 28.0, carbs: 28.0, fat: 18.0, fiber: 1.0 },
  { id: "f629", name: "Fish & Chips",                category: "American", serving: 1,  unit: "plate", calories: 580, protein: 30.0, carbs: 60.0, fat: 24.0, fiber: 4.0 },
  { id: "f630", name: "Corn on the Cob (with butter)",category: "American",serving: 1,  unit: "cob",   calories: 190, protein: 4.5,  carbs: 28.0, fat: 7.5,  fiber: 3.0 },
  { id: "f631", name: "Onion Rings",                 category: "American", serving: 1,  unit: "serving",calories: 280, protein: 4.0,  carbs: 34.0, fat: 14.0, fiber: 2.5 },
  { id: "f632", name: "Coleslaw",                    category: "American", serving: 100, unit: "g",    calories: 150, protein: 1.5,  carbs: 12.0, fat: 11.0, fiber: 2.0 },
  { id: "f633", name: "Loaded Baked Potato",         category: "American", serving: 1,  unit: "piece", calories: 490, protein: 14.0, carbs: 64.0, fat: 20.0, fiber: 6.0 },
  { id: "f634", name: "French Fries (large)",        category: "American", serving: 1,  unit: "serving",calories: 400, protein: 5.5,  carbs: 52.0, fat: 19.0, fiber: 4.5 },

  // ─────────────────────────────────────────────────────────────────────────
  // AMERICAN — BREAKFAST
  // ─────────────────────────────────────────────────────────────────────────
  { id: "f640", name: "Pancakes (3 medium)",         category: "American", serving: 3, unit: "piece",  calories: 350, protein: 9.0,  carbs: 58.0, fat: 9.0,  fiber: 2.0 },
  { id: "f641", name: "Waffles (2 pieces)",          category: "American", serving: 2, unit: "piece",  calories: 315, protein: 8.0,  carbs: 42.0, fat: 12.0, fiber: 1.5 },
  { id: "f642", name: "French Toast (2 slices)",     category: "American", serving: 2, unit: "slice",  calories: 340, protein: 11.0, carbs: 44.0, fat: 13.0, fiber: 2.0 },
  { id: "f643", name: "Eggs Benedict",               category: "American", serving: 1, unit: "plate",  calories: 455, protein: 20.0, carbs: 26.0, fat: 28.0, fiber: 1.5 },
  { id: "f644", name: "Bagel with Cream Cheese",     category: "American", serving: 1, unit: "piece",  calories: 380, protein: 12.0, carbs: 54.0, fat: 12.0, fiber: 2.5 },
  { id: "f645", name: "American Breakfast Plate",    category: "American", serving: 1, unit: "plate",  calories: 580, protein: 28.0, carbs: 36.0, fat: 32.0, fiber: 2.5 },
  { id: "f646", name: "Breakfast Burrito",           category: "American", serving: 1, unit: "piece",  calories: 470, protein: 22.0, carbs: 44.0, fat: 22.0, fiber: 4.0 },

  // ─────────────────────────────────────────────────────────────────────────
  // AMERICAN — SOUPS & SALADS
  // ─────────────────────────────────────────────────────────────────────────
  { id: "f650", name: "Clam Chowder",                category: "American", serving: 1, unit: "bowl",   calories: 295, protein: 12.0, carbs: 28.0, fat: 15.0, fiber: 1.5 },
  { id: "f651", name: "Chicken Noodle Soup",         category: "American", serving: 1, unit: "bowl",   calories: 180, protein: 14.0, carbs: 18.0, fat: 5.0,  fiber: 1.5 },
  { id: "f652", name: "Tomato Soup",                 category: "American", serving: 1, unit: "bowl",   calories: 150, protein: 4.0,  carbs: 18.0, fat: 7.0,  fiber: 3.0 },
  { id: "f653", name: "Cobb Salad",                  category: "American", serving: 1, unit: "plate",  calories: 385, protein: 26.0, carbs: 14.0, fat: 24.0, fiber: 4.0 },
  { id: "f654", name: "Buffalo Chicken Salad",       category: "American", serving: 1, unit: "plate",  calories: 420, protein: 32.0, carbs: 18.0, fat: 24.0, fiber: 4.5 },
  { id: "f655", name: "Potato Salad",                category: "American", serving: 150, unit: "g",    calories: 220, protein: 3.5,  carbs: 28.0, fat: 11.0, fiber: 2.5 },

  // ─────────────────────────────────────────────────────────────────────────
  // AMERICAN — DESSERTS & DRINKS
  // ─────────────────────────────────────────────────────────────────────────
  { id: "f660", name: "Apple Pie (1 slice)",         category: "American", serving: 1, unit: "slice",  calories: 410, protein: 4.0,  carbs: 58.0, fat: 18.0, fiber: 2.5 },
  { id: "f661", name: "NY Cheesecake (1 slice)",     category: "American", serving: 1, unit: "slice",  calories: 485, protein: 8.0,  carbs: 44.0, fat: 30.0, fiber: 0.5 },
  { id: "f662", name: "Brownie (1 piece)",           category: "American", serving: 1, unit: "piece",  calories: 290, protein: 4.0,  carbs: 42.0, fat: 13.0, fiber: 2.0 },
  { id: "f663", name: "Chocolate Chip Cookies (2pc)",category: "American", serving: 2, unit: "piece",  calories: 285, protein: 3.5,  carbs: 38.0, fat: 13.5, fiber: 1.5 },
  { id: "f664", name: "Chocolate Milkshake (400ml)",  category: "American", serving: 400, unit: "ml", calories: 525, protein: 12.0, carbs: 70.0, fat: 22.0, fiber: 1.5 },
  { id: "f665", name: "Banana Split",               category: "American", serving: 1, unit: "bowl",   calories: 650, protein: 9.0,  carbs: 92.0, fat: 26.0, fiber: 3.5 },
  { id: "f666", name: "Glazed Donut",               category: "American", serving: 1, unit: "piece",  calories: 270, protein: 4.0,  carbs: 34.0, fat: 13.0, fiber: 1.0 },
  { id: "f667", name: "Cinnamon Roll",              category: "American", serving: 1, unit: "piece",  calories: 385, protein: 6.0,  carbs: 56.0, fat: 15.0, fiber: 2.0 },
  { id: "f668", name: "Iced Tea (400ml)",           category: "American", serving: 400, unit: "ml",   calories: 95,  protein: 0.0,  carbs: 25.0, fat: 0.0,  fiber: 0.0 },
  { id: "f669", name: "Lemonade (400ml)",           category: "American", serving: 400, unit: "ml",   calories: 130, protein: 0.5,  carbs: 33.0, fat: 0.0,  fiber: 0.0 },

  // ─────────────────────────────────────────────────────────────────────────
  // FAST FOOD CHAINS (existing + new)
  // ─────────────────────────────────────────────────────────────────────────
  { id: "f150", name: "McDonald's McAloo Tikki",     category: "FastFood", serving: 1, unit: "burger", calories: 338, protein: 7.5,  carbs: 40.0, fat: 16.0, fiber: 3.0 },
  { id: "f151", name: "McDonald's McSpicy Paneer",   category: "FastFood", serving: 1, unit: "burger", calories: 381, protein: 14.0, carbs: 40.0, fat: 18.5, fiber: 2.5 },
  { id: "f152", name: "McDonald's McChicken",        category: "FastFood", serving: 1, unit: "burger", calories: 380, protein: 18.0, carbs: 37.0, fat: 17.0, fiber: 2.0 },
  { id: "f153", name: "McDonald's McSpicy Chicken",  category: "FastFood", serving: 1, unit: "burger", calories: 396, protein: 20.0, carbs: 38.0, fat: 18.0, fiber: 2.5 },
  { id: "f154", name: "McDonald's Big Mac",          category: "FastFood", serving: 1, unit: "burger", calories: 509, protein: 25.0, carbs: 43.0, fat: 26.0, fiber: 3.0 },
  { id: "f155", name: "McDonald's McNuggets (6pc)",  category: "FastFood", serving: 6, unit: "piece",  calories: 268, protein: 15.0, carbs: 15.0, fat: 16.0, fiber: 0.0 },
  { id: "f156", name: "McDonald's French Fries (medium)", category: "FastFood", serving: 1, unit: "pack", calories: 320, protein: 4.5, carbs: 43.0, fat: 14.5, fiber: 3.5 },
  { id: "f157", name: "McDonald's McFlurry (Oreo)",  category: "FastFood", serving: 1, unit: "cup",    calories: 340, protein: 8.0,  carbs: 52.0, fat: 11.0, fiber: 0.5 },
  { id: "f160", name: "KFC Chicken Zinger Burger",   category: "FastFood", serving: 1, unit: "burger", calories: 450, protein: 22.0, carbs: 42.0, fat: 20.0, fiber: 2.0 },
  { id: "f161", name: "KFC Hot & Crispy Chicken",    category: "FastFood", serving: 1, unit: "piece",  calories: 280, protein: 18.0, carbs: 14.0, fat: 16.5, fiber: 0.5 },
  { id: "f162", name: "KFC Popcorn Chicken",         category: "FastFood", serving: 1, unit: "cup",    calories: 300, protein: 17.0, carbs: 22.0, fat: 15.0, fiber: 0.5 },
  { id: "f163", name: "KFC Veg Zinger",              category: "FastFood", serving: 1, unit: "burger", calories: 370, protein: 10.0, carbs: 45.0, fat: 17.0, fiber: 3.0 },
  { id: "f164", name: "KFC Rice Bowl",               category: "FastFood", serving: 1, unit: "bowl",   calories: 490, protein: 22.0, carbs: 58.0, fat: 17.0, fiber: 2.5 },
  { id: "f165", name: "Domino's Peppy Paneer (1 slice)", category: "FastFood", serving: 1, unit: "slice", calories: 190, protein: 8.5, carbs: 24.0, fat: 6.5, fiber: 1.5 },
  { id: "f166", name: "Domino's Chicken Dominator (1 slice)", category: "FastFood", serving: 1, unit: "slice", calories: 215, protein: 11.0, carbs: 23.0, fat: 8.5, fiber: 1.0 },
  { id: "f167", name: "Domino's Farmhouse (1 slice)",category: "FastFood", serving: 1, unit: "slice",  calories: 185, protein: 8.0,  carbs: 24.0, fat: 6.0,  fiber: 2.0 },
  { id: "f168", name: "Domino's Garlic Bread (2pc)", category: "FastFood", serving: 2, unit: "piece",  calories: 200, protein: 5.5,  carbs: 32.0, fat: 5.5,  fiber: 1.5 },
  { id: "f169", name: "Pizza Hut Margherita (1 slice)", category: "FastFood", serving: 1, unit: "slice", calories: 170, protein: 7.5, carbs: 22.0, fat: 5.5, fiber: 1.0 },
  { id: "f170", name: "Pizza Hut Chicken Supreme (1 slice)", category: "FastFood", serving: 1, unit: "slice", calories: 210, protein: 11.0, carbs: 22.0, fat: 9.0, fiber: 1.0 },
  { id: "f171", name: "Burger King Whopper",         category: "FastFood", serving: 1, unit: "burger", calories: 660, protein: 31.0, carbs: 51.0, fat: 37.0, fiber: 2.0 },
  { id: "f172", name: "Burger King BK Veggie",       category: "FastFood", serving: 1, unit: "burger", calories: 340, protein: 10.0, carbs: 46.0, fat: 12.0, fiber: 4.0 },
  { id: "f173", name: "Burger King Chicken Crispy",  category: "FastFood", serving: 1, unit: "burger", calories: 450, protein: 22.0, carbs: 42.0, fat: 20.0, fiber: 2.0 },
  { id: "f174", name: "Subway Veggie Delite 6\"",    category: "FastFood", serving: 1, unit: "sub",    calories: 230, protein: 9.0,  carbs: 41.0, fat: 3.0,  fiber: 4.0 },
  { id: "f175", name: "Subway Chicken Teriyaki 6\"", category: "FastFood", serving: 1, unit: "sub",    calories: 330, protein: 22.0, carbs: 43.0, fat: 6.5,  fiber: 4.0 },
  { id: "f176", name: "Subway Aloo Patty 6\"",       category: "FastFood", serving: 1, unit: "sub",    calories: 290, protein: 9.5,  carbs: 46.0, fat: 7.0,  fiber: 5.0 },

  // ─────────────────────────────────────────────────────────────────────────
  // BEVERAGES
  // ─────────────────────────────────────────────────────────────────────────
  { id: "f200", name: "Coca-Cola (330ml)",           category: "FastFood", serving: 330, unit: "ml",   calories: 139, protein: 0.0, carbs: 35.0, fat: 0.0, fiber: 0.0 },
  { id: "f201", name: "Cold Coffee (medium)",        category: "FastFood", serving: 1,   unit: "glass",calories: 240, protein: 6.0, carbs: 30.0, fat: 10.0, fiber: 0.0 },
  { id: "f202", name: "Nimbu Pani",                  category: "Snacks",   serving: 1,   unit: "glass",calories: 40,  protein: 0.3, carbs: 10.0, fat: 0.0, fiber: 0.0 },
  { id: "f203", name: "Black Coffee",                category: "Snacks",   serving: 1,   unit: "cup",  calories: 5,   protein: 0.3, carbs: 1.0,  fat: 0.0, fiber: 0.0 },
  { id: "f204", name: "Protein Coffee",              category: "Snacks",   serving: 1,   unit: "cup",  calories: 140, protein: 24.5, carbs: 5.0, fat: 2.0, fiber: 0.0 },
];

function searchFoods(query, limit = 30) {
  const q = query.toLowerCase().trim();
  const results = FOODS.filter(f =>
    f.name.toLowerCase().includes(q) ||
    f.category.toLowerCase().includes(q)
  );
  // Exact name matches first, then starts-with, then contains
  results.sort((a, b) => {
    const an = a.name.toLowerCase();
    const bn = b.name.toLowerCase();
    if (an === q) return -1;
    if (bn === q) return 1;
    if (an.startsWith(q) && !bn.startsWith(q)) return -1;
    if (bn.startsWith(q) && !an.startsWith(q)) return 1;
    return 0;
  });
  return results.slice(0, limit);
}

function getFoodById(id) {
  return FOODS.find(f => f.id === id) || null;
}

function getFoodsByCategory(category) {
  return FOODS.filter(f => f.category.toLowerCase() === category.toLowerCase());
}

module.exports = { FOODS, searchFoods, getFoodById, getFoodsByCategory };
