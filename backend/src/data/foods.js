const FOODS = [
  // ── Staples ───────────────────────────────────────────────────────────────
  { id: "f001", name: "Cooked Basmati Rice", category: "Staples", serving: 150, unit: "g", calories: 195, protein: 4.1, carbs: 42.3, fat: 0.5, fiber: 0.6 },
  { id: "f002", name: "Roti / Chapati", category: "Staples", serving: 2, unit: "piece", calories: 142, protein: 5.0, carbs: 29.0, fat: 1.8, fiber: 3.8 },
  { id: "f003", name: "Paratha (plain)", category: "Staples", serving: 2, unit: "piece", calories: 320, protein: 7.0, carbs: 44.0, fat: 13.0, fiber: 4.0 },
  { id: "f004", name: "Paratha (aloo)", category: "Staples", serving: 2, unit: "piece", calories: 440, protein: 9.0, carbs: 64.0, fat: 17.0, fiber: 5.0 },
  { id: "f005", name: "Idli (3 pieces)", category: "Staples", serving: 3, unit: "piece", calories: 117, protein: 5.7, carbs: 23.4, fat: 0.6, fiber: 1.5 },
  { id: "f006", name: "Dosa (plain)", category: "Staples", serving: 1, unit: "piece", calories: 133, protein: 3.3, carbs: 22.0, fat: 3.7, fiber: 0.9 },
  { id: "f007", name: "Poha", category: "Staples", serving: 200, unit: "g", calories: 220, protein: 4.2, carbs: 45.0, fat: 2.4, fiber: 2.0 },
  { id: "f008", name: "Upma", category: "Staples", serving: 200, unit: "g", calories: 290, protein: 7.0, carbs: 44.0, fat: 9.0, fiber: 4.0 },
  { id: "f009", name: "Brown Rice (cooked)", category: "Staples", serving: 150, unit: "g", calories: 167, protein: 3.7, carbs: 34.5, fat: 1.3, fiber: 2.4 },
  { id: "f090", name: "Whole Wheat Roti", category: "Staples", serving: 2, unit: "piece", calories: 150, protein: 6.0, carbs: 28.0, fat: 2.4, fiber: 4.5 },
  { id: "f091", name: "Missi Roti", category: "Staples", serving: 2, unit: "piece", calories: 180, protein: 8.0, carbs: 28.0, fat: 4.0, fiber: 5.0 },
  { id: "f092", name: "Quinoa (cooked)", category: "Staples", serving: 150, unit: "g", calories: 180, protein: 6.6, carbs: 30.0, fat: 2.9, fiber: 2.6 },
  { id: "f093", name: "Naan (plain)", category: "Staples", serving: 1, unit: "piece", calories: 262, protein: 8.7, carbs: 45.0, fat: 5.1, fiber: 1.9 },
  { id: "f094", name: "Puri", category: "Staples", serving: 2, unit: "piece", calories: 290, protein: 5.5, carbs: 36.0, fat: 14.0, fiber: 2.0 },
  { id: "f095", name: "Uttapam", category: "Staples", serving: 1, unit: "piece", calories: 158, protein: 4.5, carbs: 24.0, fat: 5.0, fiber: 2.0 },

  // ── Dals & Legumes ────────────────────────────────────────────────────────
  { id: "f010", name: "Dal Tadka", category: "Dals", serving: 150, unit: "g", calories: 143, protein: 8.3, carbs: 21.0, fat: 3.8, fiber: 5.3 },
  { id: "f011", name: "Dal Makhani", category: "Dals", serving: 150, unit: "g", calories: 203, protein: 9.8, carbs: 22.5, fat: 8.3, fiber: 6.0 },
  { id: "f012", name: "Chana Dal", category: "Dals", serving: 150, unit: "g", calories: 150, protein: 9.8, carbs: 23.3, fat: 2.3, fiber: 6.8 },
  { id: "f013", name: "Rajma (cooked)", category: "Dals", serving: 150, unit: "g", calories: 191, protein: 13.1, carbs: 34.2, fat: 0.8, fiber: 9.6 },
  { id: "f014", name: "Chole (cooked)", category: "Dals", serving: 150, unit: "g", calories: 246, protein: 13.4, carbs: 40.5, fat: 3.9, fiber: 11.4 },
  { id: "f015", name: "Moong Dal (cooked)", category: "Dals", serving: 150, unit: "g", calories: 141, protein: 10.5, carbs: 22.5, fat: 0.6, fiber: 6.2 },
  { id: "f100", name: "Sambhar", category: "Dals", serving: 150, unit: "g", calories: 68, protein: 3.2, carbs: 10.5, fat: 1.5, fiber: 3.5 },
  { id: "f101", name: "Masoor Dal", category: "Dals", serving: 150, unit: "g", calories: 138, protein: 10.0, carbs: 22.0, fat: 0.6, fiber: 5.5 },
  { id: "f102", name: "Toor Dal", category: "Dals", serving: 150, unit: "g", calories: 150, protein: 10.5, carbs: 23.5, fat: 0.8, fiber: 5.8 },
  { id: "f103", name: "Soya Chunks (cooked)", category: "Dals", serving: 100, unit: "g", calories: 172, protein: 24.0, carbs: 12.0, fat: 0.8, fiber: 5.0 },

  // ── Vegetables ────────────────────────────────────────────────────────────
  { id: "f020", name: "Palak Paneer", category: "Vegetables", serving: 150, unit: "g", calories: 198, protein: 10.8, carbs: 9.8, fat: 14.3, fiber: 3.0 },
  { id: "f021", name: "Aloo Gobi", category: "Vegetables", serving: 150, unit: "g", calories: 147, protein: 3.8, carbs: 21.0, fat: 6.0, fiber: 3.8 },
  { id: "f022", name: "Baingan Bharta", category: "Vegetables", serving: 150, unit: "g", calories: 120, protein: 3.0, carbs: 14.3, fat: 6.0, fiber: 4.5 },
  { id: "f023", name: "Mixed Veg Sabzi", category: "Vegetables", serving: 150, unit: "g", calories: 113, protein: 3.8, carbs: 15.0, fat: 4.5, fiber: 3.8 },
  { id: "f024", name: "Bhindi Masala", category: "Vegetables", serving: 150, unit: "g", calories: 128, protein: 3.0, carbs: 15.0, fat: 6.8, fiber: 4.5 },
  { id: "f110", name: "Matar Paneer", category: "Vegetables", serving: 150, unit: "g", calories: 225, protein: 11.0, carbs: 14.0, fat: 14.5, fiber: 4.0 },
  { id: "f111", name: "Kadhi Pakora", category: "Vegetables", serving: 150, unit: "g", calories: 170, protein: 5.5, carbs: 18.0, fat: 8.0, fiber: 2.5 },
  { id: "f112", name: "Methi Sabzi", category: "Vegetables", serving: 150, unit: "g", calories: 105, protein: 4.5, carbs: 11.0, fat: 5.5, fiber: 5.5 },
  { id: "f113", name: "Jeera Aloo", category: "Vegetables", serving: 150, unit: "g", calories: 158, protein: 3.0, carbs: 24.0, fat: 5.5, fiber: 3.0 },
  { id: "f114", name: "Raita (100g)", category: "Vegetables", serving: 100, unit: "g", calories: 62, protein: 3.5, carbs: 6.0, fat: 2.5, fiber: 0.5 },

  // ── Proteins ─────────────────────────────────────────────────────────────
  { id: "f030", name: "Chicken Curry", category: "Protein", serving: 150, unit: "g", calories: 248, protein: 27.0, carbs: 6.8, fat: 12.8, fiber: 0.8 },
  { id: "f031", name: "Grilled Chicken Breast", category: "Protein", serving: 150, unit: "g", calories: 248, protein: 46.5, carbs: 0.0, fat: 5.4, fiber: 0.0 },
  { id: "f032", name: "Egg (whole, boiled)", category: "Protein", serving: 2, unit: "piece", calories: 154, protein: 12.6, carbs: 1.2, fat: 10.6, fiber: 0.0 },
  { id: "f033", name: "Egg White (boiled)", category: "Protein", serving: 4, unit: "piece", calories: 68, protein: 14.4, carbs: 0.8, fat: 0.4, fiber: 0.0 },
  { id: "f034", name: "Paneer (raw)", category: "Protein", serving: 100, unit: "g", calories: 265, protein: 18.0, carbs: 1.2, fat: 20.0, fiber: 0.0 },
  { id: "f035", name: "Fish Curry", category: "Protein", serving: 150, unit: "g", calories: 222, protein: 25.5, carbs: 6.0, fat: 10.5, fiber: 0.8 },
  { id: "f036", name: "Tandoori Chicken", category: "Protein", serving: 150, unit: "g", calories: 261, protein: 40.5, carbs: 6.0, fat: 8.3, fiber: 0.8 },
  { id: "f120", name: "Egg Bhurji (2 eggs)", category: "Protein", serving: 1, unit: "plate", calories: 220, protein: 14.0, carbs: 4.0, fat: 16.0, fiber: 0.5 },
  { id: "f121", name: "Chicken Tikka", category: "Protein", serving: 150, unit: "g", calories: 270, protein: 39.0, carbs: 5.0, fat: 10.0, fiber: 0.5 },
  { id: "f122", name: "Mutton Curry", category: "Protein", serving: 150, unit: "g", calories: 315, protein: 28.5, carbs: 4.5, fat: 20.0, fiber: 0.8 },
  { id: "f123", name: "Prawns Masala", category: "Protein", serving: 150, unit: "g", calories: 195, protein: 28.5, carbs: 6.0, fat: 6.8, fiber: 0.5 },
  { id: "f124", name: "Tofu Bhurji", category: "Protein", serving: 150, unit: "g", calories: 152, protein: 12.8, carbs: 6.5, fat: 8.5, fiber: 1.5 },
  { id: "f125", name: "Paneer Tikka", category: "Protein", serving: 150, unit: "g", calories: 360, protein: 22.5, carbs: 6.0, fat: 27.0, fiber: 1.0 },
  { id: "f126", name: "Chicken Keema", category: "Protein", serving: 150, unit: "g", calories: 285, protein: 33.0, carbs: 5.5, fat: 14.0, fiber: 1.0 },

  // ── Dairy ────────────────────────────────────────────────────────────────
  { id: "f040", name: "Whole Milk (250ml)", category: "Dairy", serving: 250, unit: "ml", calories: 150, protein: 8.5, carbs: 12.0, fat: 8.0, fiber: 0.0 },
  { id: "f041", name: "Curd / Dahi", category: "Dairy", serving: 150, unit: "g", calories: 92, protein: 5.3, carbs: 6.8, fat: 4.8, fiber: 0.0 },
  { id: "f042", name: "Greek Yogurt", category: "Dairy", serving: 150, unit: "g", calories: 89, protein: 15.0, carbs: 5.4, fat: 0.6, fiber: 0.0 },
  { id: "f043", name: "Whey Protein Shake", category: "Dairy", serving: 30, unit: "g scoop", calories: 110, protein: 24.0, carbs: 3.5, fat: 1.0, fiber: 0.0 },
  { id: "f130", name: "Paneer Bhurji", category: "Dairy", serving: 100, unit: "g", calories: 260, protein: 17.0, carbs: 5.0, fat: 19.0, fiber: 0.5 },
  { id: "f131", name: "Lassi (sweet, 250ml)", category: "Dairy", serving: 250, unit: "ml", calories: 185, protein: 7.0, carbs: 28.0, fat: 5.5, fiber: 0.0 },
  { id: "f132", name: "Buttermilk / Chaas (250ml)", category: "Dairy", serving: 250, unit: "ml", calories: 60, protein: 4.0, carbs: 6.5, fat: 1.5, fiber: 0.0 },

  // ── Breakfast ─────────────────────────────────────────────────────────────
  { id: "f080", name: "Oats (cooked, 200g)", category: "Breakfast", serving: 200, unit: "g", calories: 136, protein: 5.0, carbs: 24.0, fat: 2.8, fiber: 3.4 },
  { id: "f081", name: "Oats with Milk & Banana", category: "Breakfast", serving: 1, unit: "bowl", calories: 320, protein: 12.0, carbs: 52.0, fat: 6.5, fiber: 5.0 },
  { id: "f082", name: "Whole Wheat Bread (2 slices)", category: "Breakfast", serving: 2, unit: "slice", calories: 138, protein: 7.2, carbs: 24.0, fat: 2.2, fiber: 3.8 },
  { id: "f083", name: "Peanut Butter (1 tbsp)", category: "Breakfast", serving: 16, unit: "g", calories: 94, protein: 4.0, carbs: 3.2, fat: 8.0, fiber: 0.9 },
  { id: "f210", name: "Poha with Peanuts", category: "Breakfast", serving: 200, unit: "g", calories: 280, protein: 7.5, carbs: 44.0, fat: 8.0, fiber: 3.0 },
  { id: "f211", name: "Besan Chilla (2 pieces)", category: "Breakfast", serving: 2, unit: "piece", calories: 210, protein: 11.0, carbs: 22.0, fat: 8.0, fiber: 5.0 },
  { id: "f212", name: "Moong Dal Chilla", category: "Breakfast", serving: 2, unit: "piece", calories: 180, protein: 12.0, carbs: 20.0, fat: 6.0, fiber: 5.5 },
  { id: "f213", name: "Masala Omelette (2 eggs)", category: "Breakfast", serving: 1, unit: "plate", calories: 240, protein: 16.0, carbs: 4.0, fat: 18.0, fiber: 0.5 },
  { id: "f214", name: "Fruit Salad (200g)", category: "Breakfast", serving: 200, unit: "g", calories: 120, protein: 1.8, carbs: 28.0, fat: 0.4, fiber: 3.5 },
  { id: "f215", name: "Muesli with Milk", category: "Breakfast", serving: 1, unit: "bowl", calories: 310, protein: 10.0, carbs: 52.0, fat: 6.5, fiber: 4.5 },
  { id: "f216", name: "Rava Upma", category: "Breakfast", serving: 200, unit: "g", calories: 280, protein: 7.0, carbs: 42.0, fat: 8.5, fiber: 3.5 },

  // ── Snacks ───────────────────────────────────────────────────────────────
  { id: "f050", name: "Sprouts Salad", category: "Snacks", serving: 100, unit: "g", calories: 62, protein: 4.3, carbs: 10.0, fat: 0.4, fiber: 3.5 },
  { id: "f051", name: "Roasted Chana", category: "Snacks", serving: 40, unit: "g", calories: 145, protein: 9.3, carbs: 19.3, fat: 3.3, fiber: 6.7 },
  { id: "f052", name: "Peanuts", category: "Snacks", serving: 30, unit: "g", calories: 171, protein: 7.3, carbs: 5.0, fat: 14.5, fiber: 2.4 },
  { id: "f053", name: "Banana", category: "Snacks", serving: 1, unit: "medium", calories: 89, protein: 1.1, carbs: 23.0, fat: 0.3, fiber: 2.6 },
  { id: "f054", name: "Apple", category: "Snacks", serving: 1, unit: "medium", calories: 72, protein: 0.4, carbs: 19.0, fat: 0.2, fiber: 2.4 },
  { id: "f055", name: "Mixed Nuts", category: "Snacks", serving: 30, unit: "g", calories: 183, protein: 4.5, carbs: 6.5, fat: 16.0, fiber: 2.0 },
  { id: "f140", name: "Makhana (Foxnuts)", category: "Snacks", serving: 30, unit: "g", calories: 100, protein: 3.8, carbs: 19.5, fat: 0.5, fiber: 0.8 },
  { id: "f141", name: "Rice Cakes (2 pieces)", category: "Snacks", serving: 2, unit: "piece", calories: 70, protein: 1.4, carbs: 14.5, fat: 0.5, fiber: 0.3 },
  { id: "f142", name: "Dark Chocolate (25g)", category: "Snacks", serving: 25, unit: "g", calories: 135, protein: 2.0, carbs: 13.5, fat: 8.5, fiber: 2.5 },
  { id: "f143", name: "Orange", category: "Snacks", serving: 1, unit: "medium", calories: 62, protein: 1.2, carbs: 15.4, fat: 0.2, fiber: 3.1 },
  { id: "f144", name: "Watermelon (200g)", category: "Snacks", serving: 200, unit: "g", calories: 60, protein: 1.2, carbs: 15.2, fat: 0.2, fiber: 0.8 },
  { id: "f145", name: "Papaya (200g)", category: "Snacks", serving: 200, unit: "g", calories: 78, protein: 1.2, carbs: 19.8, fat: 0.3, fiber: 3.6 },
  { id: "f146", name: "Protein Bar", category: "Snacks", serving: 1, unit: "bar", calories: 200, protein: 20.0, carbs: 21.0, fat: 7.0, fiber: 2.5 },
  { id: "f147", name: "Coconut Water (300ml)", category: "Snacks", serving: 300, unit: "ml", calories: 57, protein: 0.9, carbs: 14.0, fat: 0.3, fiber: 0.0 },
  { id: "f148", name: "Masala Chai (1 cup)", category: "Snacks", serving: 1, unit: "cup", calories: 55, protein: 2.0, carbs: 8.0, fat: 1.5, fiber: 0.0 },

  // ── Fast Food — McDonald's India ──────────────────────────────────────────
  { id: "f150", name: "McDonald's McAloo Tikki", category: "FastFood", serving: 1, unit: "burger", calories: 338, protein: 7.5, carbs: 40.0, fat: 16.0, fiber: 3.0 },
  { id: "f151", name: "McDonald's McSpicy Paneer", category: "FastFood", serving: 1, unit: "burger", calories: 381, protein: 14.0, carbs: 40.0, fat: 18.5, fiber: 2.5 },
  { id: "f152", name: "McDonald's McChicken", category: "FastFood", serving: 1, unit: "burger", calories: 380, protein: 18.0, carbs: 37.0, fat: 17.0, fiber: 2.0 },
  { id: "f153", name: "McDonald's McSpicy Chicken", category: "FastFood", serving: 1, unit: "burger", calories: 396, protein: 20.0, carbs: 38.0, fat: 18.0, fiber: 2.5 },
  { id: "f154", name: "McDonald's Big Mac", category: "FastFood", serving: 1, unit: "burger", calories: 509, protein: 25.0, carbs: 43.0, fat: 26.0, fiber: 3.0 },
  { id: "f155", name: "McDonald's McNuggets (6pc)", category: "FastFood", serving: 6, unit: "piece", calories: 268, protein: 15.0, carbs: 15.0, fat: 16.0, fiber: 0.0 },
  { id: "f156", name: "McDonald's French Fries (medium)", category: "FastFood", serving: 1, unit: "pack", calories: 320, protein: 4.5, carbs: 43.0, fat: 14.5, fiber: 3.5 },
  { id: "f157", name: "McDonald's McFlurry (Oreo)", category: "FastFood", serving: 1, unit: "cup", calories: 340, protein: 8.0, carbs: 52.0, fat: 11.0, fiber: 0.5 },

  // ── Fast Food — KFC India ─────────────────────────────────────────────────
  { id: "f160", name: "KFC Chicken Zinger Burger", category: "FastFood", serving: 1, unit: "burger", calories: 450, protein: 22.0, carbs: 42.0, fat: 20.0, fiber: 2.0 },
  { id: "f161", name: "KFC Hot & Crispy Chicken (1pc)", category: "FastFood", serving: 1, unit: "piece", calories: 280, protein: 18.0, carbs: 14.0, fat: 16.5, fiber: 0.5 },
  { id: "f162", name: "KFC Popcorn Chicken (regular)", category: "FastFood", serving: 1, unit: "cup", calories: 300, protein: 17.0, carbs: 22.0, fat: 15.0, fiber: 0.5 },
  { id: "f163", name: "KFC Veg Zinger", category: "FastFood", serving: 1, unit: "burger", calories: 370, protein: 10.0, carbs: 45.0, fat: 17.0, fiber: 3.0 },
  { id: "f164", name: "KFC Rice Bowl (chicken)", category: "FastFood", serving: 1, unit: "bowl", calories: 490, protein: 22.0, carbs: 58.0, fat: 17.0, fiber: 2.5 },

  // ── Fast Food — Domino's India ────────────────────────────────────────────
  { id: "f165", name: "Domino's Peppy Paneer (1 slice)", category: "FastFood", serving: 1, unit: "slice", calories: 190, protein: 8.5, carbs: 24.0, fat: 6.5, fiber: 1.5 },
  { id: "f166", name: "Domino's Chicken Dominator (1 slice)", category: "FastFood", serving: 1, unit: "slice", calories: 215, protein: 11.0, carbs: 23.0, fat: 8.5, fiber: 1.0 },
  { id: "f167", name: "Domino's Farmhouse Pizza (1 slice)", category: "FastFood", serving: 1, unit: "slice", calories: 185, protein: 8.0, carbs: 24.0, fat: 6.0, fiber: 2.0 },
  { id: "f168", name: "Domino's Garlic Bread (2pc)", category: "FastFood", serving: 2, unit: "piece", calories: 200, protein: 5.5, carbs: 32.0, fat: 5.5, fiber: 1.5 },

  // ── Fast Food — Pizza Hut India ───────────────────────────────────────────
  { id: "f169", name: "Pizza Hut Margherita (1 slice)", category: "FastFood", serving: 1, unit: "slice", calories: 170, protein: 7.5, carbs: 22.0, fat: 5.5, fiber: 1.0 },
  { id: "f170", name: "Pizza Hut Chicken Supreme (1 slice)", category: "FastFood", serving: 1, unit: "slice", calories: 210, protein: 11.0, carbs: 22.0, fat: 9.0, fiber: 1.0 },

  // ── Fast Food — Burger King India ─────────────────────────────────────────
  { id: "f171", name: "Burger King Whopper", category: "FastFood", serving: 1, unit: "burger", calories: 660, protein: 31.0, carbs: 51.0, fat: 37.0, fiber: 2.0 },
  { id: "f172", name: "Burger King BK Veggie Burger", category: "FastFood", serving: 1, unit: "burger", calories: 340, protein: 10.0, carbs: 46.0, fat: 12.0, fiber: 4.0 },
  { id: "f173", name: "Burger King Chicken Crispy", category: "FastFood", serving: 1, unit: "burger", calories: 450, protein: 22.0, carbs: 42.0, fat: 20.0, fiber: 2.0 },

  // ── Fast Food — Subway India ──────────────────────────────────────────────
  { id: "f174", name: "Subway Veggie Delite 6\"", category: "FastFood", serving: 1, unit: "sub", calories: 230, protein: 9.0, carbs: 41.0, fat: 3.0, fiber: 4.0 },
  { id: "f175", name: "Subway Chicken Teriyaki 6\"", category: "FastFood", serving: 1, unit: "sub", calories: 330, protein: 22.0, carbs: 43.0, fat: 6.5, fiber: 4.0 },
  { id: "f176", name: "Subway Aloo Patty 6\"", category: "FastFood", serving: 1, unit: "sub", calories: 290, protein: 9.5, carbs: 46.0, fat: 7.0, fiber: 5.0 },

  // ── Indian Street Food ────────────────────────────────────────────────────
  { id: "f190", name: "Vada Pav", category: "FastFood", serving: 1, unit: "piece", calories: 296, protein: 6.5, carbs: 40.0, fat: 12.5, fiber: 3.5 },
  { id: "f191", name: "Pav Bhaji (1 plate)", category: "FastFood", serving: 1, unit: "plate", calories: 390, protein: 9.0, carbs: 58.0, fat: 14.0, fiber: 5.0 },
  { id: "f192", name: "Chole Bhature", category: "FastFood", serving: 1, unit: "plate", calories: 460, protein: 12.0, carbs: 62.0, fat: 18.0, fiber: 6.0 },
  { id: "f193", name: "Samosa (2 pieces)", category: "FastFood", serving: 2, unit: "piece", calories: 524, protein: 7.0, carbs: 50.0, fat: 34.0, fiber: 4.0 },
  { id: "f194", name: "Biryani Chicken (250g)", category: "FastFood", serving: 250, unit: "g", calories: 435, protein: 22.0, carbs: 52.0, fat: 15.0, fiber: 2.5 },
  { id: "f195", name: "Pani Puri (6 pieces)", category: "FastFood", serving: 6, unit: "pieces", calories: 150, protein: 2.5, carbs: 25.0, fat: 5.5, fiber: 1.5 },
  { id: "f196", name: "Bhel Puri", category: "FastFood", serving: 1, unit: "plate", calories: 180, protein: 4.5, carbs: 32.0, fat: 4.5, fiber: 3.0 },
  { id: "f197", name: "Dahi Puri (6 pieces)", category: "FastFood", serving: 6, unit: "pieces", calories: 210, protein: 5.0, carbs: 30.0, fat: 7.5, fiber: 2.5 },
  { id: "f198", name: "Masala Dosa", category: "FastFood", serving: 1, unit: "piece", calories: 260, protein: 5.5, carbs: 42.0, fat: 8.5, fiber: 3.0 },

  // ── Beverages ─────────────────────────────────────────────────────────────
  { id: "f200", name: "Coca-Cola (330ml)", category: "FastFood", serving: 330, unit: "ml", calories: 139, protein: 0.0, carbs: 35.0, fat: 0.0, fiber: 0.0 },
  { id: "f201", name: "Cold Coffee (medium)", category: "FastFood", serving: 1, unit: "glass", calories: 240, protein: 6.0, carbs: 30.0, fat: 10.0, fiber: 0.0 },
  { id: "f202", name: "Nimbu Pani (1 glass)", category: "Snacks", serving: 1, unit: "glass", calories: 40, protein: 0.3, carbs: 10.0, fat: 0.0, fiber: 0.0 },
  { id: "f203", name: "Black Coffee", category: "Snacks", serving: 1, unit: "cup", calories: 5, protein: 0.3, carbs: 1.0, fat: 0.0, fiber: 0.0 },
  { id: "f204", name: "Protein Coffee (with whey)", category: "Snacks", serving: 1, unit: "cup", calories: 140, protein: 24.5, carbs: 5.0, fat: 2.0, fiber: 0.0 },

  // ── Sweets ────────────────────────────────────────────────────────────────
  { id: "f205", name: "Gulab Jamun (2 pieces)", category: "FastFood", serving: 2, unit: "piece", calories: 300, protein: 6.0, carbs: 50.0, fat: 10.0, fiber: 0.0 },
  { id: "f206", name: "Kheer (150g)", category: "FastFood", serving: 150, unit: "g", calories: 213, protein: 5.5, carbs: 32.0, fat: 7.5, fiber: 0.0 },
  { id: "f207", name: "Halwa (besan, 100g)", category: "FastFood", serving: 100, unit: "g", calories: 320, protein: 6.0, carbs: 38.0, fat: 16.0, fiber: 2.0 },
];

function searchFoods(query, limit = 25) {
  const q = query.toLowerCase();
  return FOODS
    .filter(f => f.name.toLowerCase().includes(q) || f.category.toLowerCase().includes(q))
    .slice(0, limit);
}

function getFoodById(id) {
  return FOODS.find(f => f.id === id) || null;
}

function getFoodsByCategory(category) {
  return FOODS.filter(f => f.category.toLowerCase() === category.toLowerCase());
}

module.exports = { FOODS, searchFoods, getFoodById, getFoodsByCategory };
