import React, { useState, useMemo } from 'react';
import {
  PlusCircle,
  Search,
  Check,
  Scale,
  Utensils,
  Sparkles,
  Info,
  ChevronRight,
  Flame,
  Dumbbell,
  Wheat,
  Droplets,
} from 'lucide-react';
import { FoodItem, MealCategory, LoggedMeal } from '../types';
import { COMMON_FOOD_DATABASE } from '../data/foodDatabase';

interface LoggingPanelProps {
  onAddMeal: (meal: Omit<LoggedMeal, 'id' | 'loggedAt'>) => void;
  selectedCategory: MealCategory;
  onSelectCategory: (cat: MealCategory) => void;
}

export const LoggingPanel: React.FC<LoggingPanelProps> = ({
  onAddMeal,
  selectedCategory,
  onSelectCategory,
}) => {
  const [foodName, setFoodName] = useState('');
  const [grams, setGrams] = useState<number | ''>(150);
  const [selectedFood, setSelectedFood] = useState<FoodItem | null>(null);
  const [dbSearch, setDbSearch] = useState('');
  const [dbCategoryFilter, setDbCategoryFilter] = useState<string>('all');
  const [isCustomMode, setIsCustomMode] = useState(false);

  // Custom macro overrides
  const [customCaloriesPer100g, setCustomCaloriesPer100g] = useState<number | ''>(150);
  const [customProteinPer100g, setCustomProteinPer100g] = useState<number | ''>(20);
  const [customCarbsPer100g, setCustomCarbsPer100g] = useState<number | ''>(10);
  const [customFatPer100g, setCustomFatPer100g] = useState<number | ''>(3);

  const mealCategories: { id: MealCategory; label: string; icon: string }[] = [
    { id: 'breakfast', label: 'Breakfast', icon: '🌅' },
    { id: 'lunch', label: 'Lunch', icon: '☀️' },
    { id: 'dinner', label: 'Dinner', icon: '🌙' },
    { id: 'snack', label: 'Snacks', icon: '🍎' },
  ];

  // Filtered food list
  const filteredFoods = useMemo(() => {
    return COMMON_FOOD_DATABASE.filter((item) => {
      const matchesSearch = item.name.toLowerCase().includes(dbSearch.toLowerCase());
      const matchesCat = dbCategoryFilter === 'all' || item.category === dbCategoryFilter;
      return matchesSearch && matchesCat;
    });
  }, [dbSearch, dbCategoryFilter]);

  // Handle selecting a predefined food item
  const handleSelectPredefinedFood = (item: FoodItem) => {
    setSelectedFood(item);
    setFoodName(item.name);
    setIsCustomMode(false);
    if (item.standardGrams) {
      setGrams(item.standardGrams);
    }
  };

  // Calculated macros based on current grams
  const currentCalculations = useMemo(() => {
    const weight = typeof grams === 'number' && grams > 0 ? grams : 0;
    const factor = weight / 100;

    if (selectedFood && !isCustomMode) {
      return {
        calories: Math.round(selectedFood.caloriesPer100g * factor),
        protein: Math.round(selectedFood.proteinPer100g * factor * 10) / 10,
        carbs: Math.round(selectedFood.carbsPer100g * factor * 10) / 10,
        fat: Math.round(selectedFood.fatPer100g * factor * 10) / 10,
      };
    } else {
      const c100 = typeof customCaloriesPer100g === 'number' ? customCaloriesPer100g : 0;
      const p100 = typeof customProteinPer100g === 'number' ? customProteinPer100g : 0;
      const carb100 = typeof customCarbsPer100g === 'number' ? customCarbsPer100g : 0;
      const f100 = typeof customFatPer100g === 'number' ? customFatPer100g : 0;

      return {
        calories: Math.round(c100 * factor),
        protein: Math.round(p100 * factor * 10) / 10,
        carbs: Math.round(carb100 * factor * 10) / 10,
        fat: Math.round(f100 * factor * 10) / 10,
      };
    }
  }, [grams, selectedFood, isCustomMode, customCaloriesPer100g, customProteinPer100g, customCarbsPer100g, customFatPer100g]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!foodName.trim()) return;
    const weight = typeof grams === 'number' && grams > 0 ? grams : 100;

    onAddMeal({
      foodId: selectedFood?.id,
      name: foodName.trim(),
      mealCategory: selectedCategory,
      grams: weight,
      calories: currentCalculations.calories,
      protein: currentCalculations.protein,
      carbs: currentCalculations.carbs,
      fat: currentCalculations.fat,
    });

    setFoodName('');
    setSelectedFood(null);
    setGrams(150);
  };

  return (
    <div
      id="logging-panel-card"
      className="bg-zinc-900 rounded-2xl p-6 border border-zinc-800 shadow-xl"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
        <div>
          <h3 className="font-bold text-white text-base flex items-center gap-2">
            <PlusCircle className="w-5 h-5 text-red-500" />
            <span>Log Meal & Portion</span>
          </h3>
          <p className="text-xs text-zinc-400">
            Select category, choose from the food database or enter custom food weight
          </p>
        </div>

        {/* Category Pill Switcher */}
        <div className="flex bg-zinc-950 p-1 rounded-xl border border-zinc-800">
          {mealCategories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => onSelectCategory(cat.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-red-600 text-white shadow-md shadow-red-600/30'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
              }`}
            >
              <span>{cat.icon}</span>
              <span className="hidden sm:inline">{cat.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 7 Columns: Food Selection & Search Database */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-xs font-extrabold uppercase tracking-wider text-zinc-400">
              Quick Pick from Food Database
            </label>
            <button
              type="button"
              onClick={() => {
                setIsCustomMode(!isCustomMode);
                if (!isCustomMode) {
                  setSelectedFood(null);
                }
              }}
              className="text-xs text-red-400 font-bold hover:text-red-300 hover:underline cursor-pointer"
            >
              {isCustomMode ? '← Use Food Database' : '+ Custom Food Values'}
            </button>
          </div>

          {!isCustomMode ? (
            <div className="space-y-3">
              {/* Database Search & Category Filter */}
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search 40+ foods (e.g., Chicken, Rice, Oats, Salmon)..."
                    value={dbSearch}
                    onChange={(e) => setDbSearch(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-red-600"
                  />
                </div>
                <select
                  value={dbCategoryFilter}
                  onChange={(e) => setDbCategoryFilter(e.target.value)}
                  className="px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-xs font-semibold text-zinc-300 focus:outline-none focus:ring-2 focus:ring-red-600 cursor-pointer"
                >
                  <option value="all">All Categories</option>
                  <option value="protein">Proteins</option>
                  <option value="carbs">Carbs</option>
                  <option value="dairy">Dairy</option>
                  <option value="fats">Fats & Oils</option>
                  <option value="fruits_veggies">Fruits & Veggies</option>
                </select>
              </div>

              {/* Scrollable Quick Selection Grid */}
              <div className="max-h-48 overflow-y-auto border border-zinc-800 rounded-xl p-2 bg-zinc-950/60 divide-y divide-zinc-800/80">
                {filteredFoods.length === 0 ? (
                  <div className="py-6 text-center text-xs text-zinc-500">
                    No matching foods found. Click "Custom Food Values" above to enter your own.
                  </div>
                ) : (
                  filteredFoods.map((item) => {
                    const isPicked = selectedFood?.id === item.id;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => handleSelectPredefinedFood(item)}
                        className={`w-full p-2 text-left rounded-lg transition-colors flex items-center justify-between cursor-pointer ${
                          isPicked
                            ? 'bg-red-950/80 border border-red-800/80 text-white font-medium'
                            : 'hover:bg-zinc-900 text-zinc-300'
                        }`}
                      >
                        <div className="flex-1 pr-2">
                          <div className="text-xs font-bold text-white flex items-center gap-1.5">
                            {item.name}
                            {isPicked && <Check className="w-3.5 h-3.5 text-red-400 shrink-0" />}
                          </div>
                          <div className="text-[10px] text-zinc-400 mt-0.5">
                            {item.caloriesPer100g} kcal/100g • P: {item.proteinPer100g}g • C: {item.carbsPer100g}g • F: {item.fatPer100g}g
                          </div>
                        </div>
                        {item.servingUnit && (
                          <span className="text-[10px] bg-zinc-800 text-zinc-300 px-2 py-0.5 rounded-full shrink-0 border border-zinc-700/50">
                            {item.servingUnit.split('(')[0].trim()}
                          </span>
                        )}
                      </button>
                    );
                  })
                )}
              </div>
            </div>
          ) : (
            <div className="p-4 bg-zinc-950 border border-zinc-800 rounded-xl space-y-3">
              <div className="text-xs font-bold text-zinc-200">Custom Nutrition Values (per 100g):</div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <div>
                  <label className="text-[10px] font-bold text-zinc-400">Calories (kcal)</label>
                  <input
                    type="number"
                    value={customCaloriesPer100g}
                    onChange={(e) => setCustomCaloriesPer100g(e.target.value ? Number(e.target.value) : '')}
                    className="w-full mt-1 p-1.5 bg-zinc-900 border border-zinc-700 rounded-lg text-xs font-bold text-white focus:outline-none focus:ring-1 focus:ring-red-500"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-zinc-400">Protein (g)</label>
                  <input
                    type="number"
                    value={customProteinPer100g}
                    onChange={(e) => setCustomProteinPer100g(e.target.value ? Number(e.target.value) : '')}
                    className="w-full mt-1 p-1.5 bg-zinc-900 border border-zinc-700 rounded-lg text-xs font-bold text-white focus:outline-none focus:ring-1 focus:ring-red-500"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-zinc-400">Carbs (g)</label>
                  <input
                    type="number"
                    value={customCarbsPer100g}
                    onChange={(e) => setCustomCarbsPer100g(e.target.value ? Number(e.target.value) : '')}
                    className="w-full mt-1 p-1.5 bg-zinc-900 border border-zinc-700 rounded-lg text-xs font-bold text-white focus:outline-none focus:ring-1 focus:ring-red-500"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-zinc-400">Fat (g)</label>
                  <input
                    type="number"
                    value={customFatPer100g}
                    onChange={(e) => setCustomFatPer100g(e.target.value ? Number(e.target.value) : '')}
                    className="w-full mt-1 p-1.5 bg-zinc-900 border border-zinc-700 rounded-lg text-xs font-bold text-white focus:outline-none focus:ring-1 focus:ring-red-500"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right 5 Columns: Portion Weight & Submission */}
        <div className="lg:col-span-5 bg-zinc-950/80 rounded-xl p-4 border border-zinc-800 flex flex-col justify-between space-y-4">
          <form onSubmit={handleSubmit} className="space-y-3.5">
            <div>
              <label className="text-xs font-bold text-zinc-300 block mb-1">
                Food Name / Description <span className="text-red-500">*</span>
              </label>
              <input
                id="food-name-input"
                type="text"
                required
                placeholder="e.g., Grilled Salmon & Brown Rice"
                value={foodName}
                onChange={(e) => setFoodName(e.target.value)}
                className="w-full px-3 py-2 bg-zinc-900 border border-zinc-700 rounded-xl text-xs font-medium text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-red-600"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-zinc-300 flex items-center gap-1">
                  <Scale className="w-3.5 h-3.5 text-red-500" />
                  Portion Weight (grams) <span className="text-red-500">*</span>
                </label>
                <span className="text-[11px] font-extrabold text-red-400">{grams || 0} g</span>
              </div>
              <input
                id="portion-grams-input"
                type="number"
                min="1"
                max="5000"
                required
                value={grams}
                onChange={(e) => setGrams(e.target.value ? Number(e.target.value) : '')}
                className="w-full px-3 py-2 bg-zinc-900 border border-zinc-700 rounded-xl text-xs font-bold text-white focus:outline-none focus:ring-2 focus:ring-red-600"
              />

              {/* Quick Grams Buttons */}
              <div className="flex gap-1.5 mt-2">
                {[50, 100, 150, 200, 250].map((presetWeight) => (
                  <button
                    key={presetWeight}
                    type="button"
                    onClick={() => setGrams(presetWeight)}
                    className={`flex-1 py-1 rounded-md text-[10px] font-bold border transition-colors cursor-pointer ${
                      grams === presetWeight
                        ? 'bg-red-600 text-white border-red-500'
                        : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:bg-zinc-800 hover:text-white'
                    }`}
                  >
                    {presetWeight}g
                  </button>
                ))}
              </div>
            </div>

            {/* Live Nutrient Preview Box */}
            <div className="p-3 bg-zinc-900 rounded-xl border border-zinc-800 shadow-inner space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-zinc-400 font-medium">Calculated Intake:</span>
                <span className="font-black text-red-500 text-sm">
                  {currentCalculations.calories} kcal
                </span>
              </div>
              <div className="grid grid-cols-3 gap-1 pt-1.5 border-t border-zinc-800 text-[11px]">
                <div className="text-center p-1 bg-zinc-950 rounded border border-zinc-850">
                  <div className="text-[10px] text-zinc-500 font-semibold">Protein</div>
                  <div className="font-bold text-white">{currentCalculations.protein}g</div>
                </div>
                <div className="text-center p-1 bg-zinc-950 rounded border border-zinc-850">
                  <div className="text-[10px] text-zinc-500 font-semibold">Carbs</div>
                  <div className="font-bold text-white">{currentCalculations.carbs}g</div>
                </div>
                <div className="text-center p-1 bg-zinc-950 rounded border border-zinc-850">
                  <div className="text-[10px] text-zinc-500 font-semibold">Fats</div>
                  <div className="font-bold text-white">{currentCalculations.fat}g</div>
                </div>
              </div>
            </div>

            <button
              id="log-meal-submit-btn"
              type="submit"
              disabled={!foodName.trim() || !grams}
              className="w-full py-2.5 px-4 rounded-xl bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-extrabold text-xs shadow-lg shadow-red-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Log to {selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)}</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
