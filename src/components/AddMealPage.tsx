import React, { useState, useMemo } from 'react';
import {
  PlusCircle,
  Search,
  Check,
  Scale,
  Clock,
  User,
  UtensilsCrossed,
  ArrowLeft,
  Flame,
  Dumbbell,
  Wheat,
  Droplets,
  AlertTriangle,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';
import {
  FoodItem,
  MealCategory,
  LoggedMeal,
  UserProfile,
  GoalPreset,
} from '../types';
import { COMMON_FOOD_DATABASE } from '../data/foodDatabase';

interface AddMealPageProps {
  users: UserProfile[];
  activeUserId: string;
  onSelectUser: (userId: string) => void;
  onAddMealForUser: (userId: string, meal: Omit<LoggedMeal, 'id' | 'loggedAt' | 'userId'>) => void;
  onBackToDashboard: () => void;
  getUserTotalCalories: (userId: string) => number;
  presets: Record<string, GoalPreset>;
}

export const AddMealPage: React.FC<AddMealPageProps> = ({
  users,
  activeUserId,
  onSelectUser,
  onAddMealForUser,
  onBackToDashboard,
  getUserTotalCalories,
}) => {
  const selectedUser = users.find((u) => u.id === activeUserId) || users[0];
  const userCurrentPreset = selectedUser.presets[selectedUser.currentGoal];
  const currentConsumedCalories = getUserTotalCalories(selectedUser.id);

  // Form State
  const [mealCategory, setMealCategory] = useState<MealCategory>('breakfast');
  const [mealTime, setMealTime] = useState<string>(() => {
    const now = new Date();
    return now.toTimeString().slice(0, 5); // "HH:MM"
  });
  const [foodName, setFoodName] = useState('');
  const [grams, setGrams] = useState<number | ''>(150);
  const [selectedFood, setSelectedFood] = useState<FoodItem | null>(null);
  const [dbSearch, setDbSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [isCustomMode, setIsCustomMode] = useState(false);
  const [notes, setNotes] = useState('');

  // Custom macro values (per 100g)
  const [customCaloriesPer100g, setCustomCaloriesPer100g] = useState<number | ''>(150);
  const [customProteinPer100g, setCustomProteinPer100g] = useState<number | ''>(20);
  const [customCarbsPer100g, setCustomCarbsPer100g] = useState<number | ''>(10);
  const [customFatPer100g, setCustomFatPer100g] = useState<number | ''>(3);

  const [justSaved, setJustSaved] = useState(false);

  const categories: { id: MealCategory; label: string; icon: string; timeHint: string }[] = [
    { id: 'breakfast', label: 'Breakfast', icon: '🌅', timeHint: '06:00 - 10:30' },
    { id: 'lunch', label: 'Lunch', icon: '☀️', timeHint: '12:00 - 15:00' },
    { id: 'dinner', label: 'Dinner', icon: '🌙', timeHint: '18:00 - 21:30' },
    { id: 'snack', label: 'Snacks & Bites', icon: '🍎', timeHint: 'Anytime' },
  ];

  // Filtered Food Database
  const filteredFoods = useMemo(() => {
    return COMMON_FOOD_DATABASE.filter((item) => {
      const matchName = item.name.toLowerCase().includes(dbSearch.toLowerCase());
      const matchCat = categoryFilter === 'all' || item.category === categoryFilter;
      return matchName && matchCat;
    });
  }, [dbSearch, categoryFilter]);

  // Handle food selection
  const handleSelectFood = (item: FoodItem) => {
    setSelectedFood(item);
    setFoodName(item.name);
    setIsCustomMode(false);
    if (item.standardGrams) {
      setGrams(item.standardGrams);
    }
  };

  // Calculated Live Macros
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

  const newTotalCaloriesForUser = currentConsumedCalories + currentCalculations.calories;
  const willExceedBudget = newTotalCaloriesForUser > userCurrentPreset.calories;

  const handleSubmit = (e: React.FormEvent, continueLogging = false) => {
    e.preventDefault();
    if (!foodName.trim()) return;
    const weight = typeof grams === 'number' && grams > 0 ? grams : 100;

    onAddMealForUser(selectedUser.id, {
      foodId: selectedFood?.id,
      name: foodName.trim(),
      mealCategory,
      grams: weight,
      calories: currentCalculations.calories,
      protein: currentCalculations.protein,
      carbs: currentCalculations.carbs,
      fat: currentCalculations.fat,
      mealTime,
      notes: notes.trim(),
    });

    setJustSaved(true);

    if (continueLogging) {
      setTimeout(() => {
        setJustSaved(false);
        setFoodName('');
        setSelectedFood(null);
        setGrams(150);
        setNotes('');
      }, 500);
    } else {
      setTimeout(() => {
        onBackToDashboard();
      }, 500);
    }
  };

  return (
    <div id="add-meal-dedicated-page" className="max-w-5xl mx-auto space-y-6 animate-in fade-in duration-150">
      {/* Top Header with Back Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-zinc-900 p-5 rounded-2xl border border-zinc-800 shadow-xl">
        <div className="flex items-center gap-3">
          <button
            onClick={onBackToDashboard}
            className="p-2.5 rounded-xl bg-zinc-950 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-800 transition-colors cursor-pointer"
            aria-label="Back to dashboard"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-widest text-red-500 bg-red-950/80 px-2 py-0.5 rounded border border-red-800/60">
                Log Intake
              </span>
              <h1 className="text-xl font-extrabold text-white">Add Meal & Portion</h1>
            </div>
            <p className="text-xs text-zinc-400 mt-0.5">
              Specify meal time, food consumed, portion grams, and immediately update this user's calories.
            </p>
          </div>
        </div>

        {/* User Selection Pill Switcher */}
        <div className="flex items-center gap-2 bg-zinc-950 p-1.5 rounded-xl border border-zinc-800">
          <User className="w-4 h-4 text-red-500 ml-2 shrink-0" />
          <span className="text-xs font-bold text-zinc-400">User:</span>
          <select
            id="add-meal-user-select"
            value={selectedUser.id}
            onChange={(e) => onSelectUser(e.target.value)}
            className="bg-zinc-900 border border-zinc-700 text-white font-bold text-xs px-3 py-1.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 cursor-pointer"
          >
            {users.map((u) => (
              <option key={u.id} value={u.id}>
                {u.name} ({u.currentGoal.replace('_', ' ')})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Grid: Left Form & Right Food Database + User Impact Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 7 Columns: Meal Info & Portion Form */}
        <div className="lg:col-span-7 bg-zinc-900 p-6 rounded-2xl border border-zinc-800 shadow-xl space-y-5">
          {/* Step 1: Category & Time of Meal */}
          <div>
            <label className="text-xs font-black uppercase tracking-wider text-zinc-400 block mb-2">
              1. Category & Time of Meal Taken
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setMealCategory(cat.id)}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                    mealCategory === cat.id
                      ? 'bg-red-600 text-white border-red-500 shadow-lg shadow-red-600/30 ring-2 ring-red-500/40 font-bold'
                      : 'bg-zinc-950 text-zinc-300 border-zinc-800 hover:bg-zinc-800 hover:text-white'
                  }`}
                >
                  <div className="text-base mb-1">{cat.icon}</div>
                  <div className="text-xs font-bold leading-tight">{cat.label}</div>
                  <div className={`text-[10px] mt-0.5 ${mealCategory === cat.id ? 'text-red-100' : 'text-zinc-500'}`}>
                    {cat.timeHint}
                  </div>
                </button>
              ))}
            </div>

            {/* Time Stamp Picker */}
            <div className="flex items-center gap-2 bg-zinc-950 p-2.5 rounded-xl border border-zinc-800">
              <Clock className="w-4 h-4 text-red-500 shrink-0" />
              <span className="text-xs font-semibold text-zinc-400">Time Taken:</span>
              <input
                type="time"
                value={mealTime}
                onChange={(e) => setMealTime(e.target.value)}
                className="bg-zinc-900 border border-zinc-700 text-white text-xs font-bold px-2 py-1 rounded-lg focus:outline-none focus:ring-1 focus:ring-red-600"
              />
              <span className="text-[11px] text-zinc-500 ml-auto">Logged under today's history</span>
            </div>
          </div>

          {/* Step 2: Food Name & Portion Weight */}
          <div className="space-y-3.5 pt-2 border-t border-zinc-800">
            <div className="flex items-center justify-between">
              <label className="text-xs font-black uppercase tracking-wider text-zinc-400">
                2. Food Item & Quantity Taken
              </label>
              <button
                type="button"
                onClick={() => {
                  setIsCustomMode(!isCustomMode);
                  if (!isCustomMode) setSelectedFood(null);
                }}
                className="text-xs text-red-400 hover:text-red-300 font-bold hover:underline cursor-pointer"
              >
                {isCustomMode ? '← Pick from Food DB' : '+ Custom Macronutrients'}
              </button>
            </div>

            <div>
              <label className="text-xs font-bold text-zinc-300 block mb-1">
                Food Name / Description <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g., Grilled Chicken Breast & Jasmine Rice"
                value={foodName}
                onChange={(e) => setFoodName(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-700 rounded-xl text-sm font-semibold text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-red-600"
              />
            </div>

            {/* Portion Weight in Grams */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-zinc-300 flex items-center gap-1.5">
                  <Scale className="w-4 h-4 text-red-500" />
                  Portion Weight (grams) <span className="text-red-500">*</span>
                </label>
                <span className="text-xs font-black text-red-400">{grams || 0} grams</span>
              </div>
              <input
                type="number"
                min="1"
                max="5000"
                required
                value={grams}
                onChange={(e) => setGrams(e.target.value ? Number(e.target.value) : '')}
                className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-700 rounded-xl text-sm font-extrabold text-white focus:outline-none focus:ring-2 focus:ring-red-600"
              />

              {/* Quick Weight Selector Buttons */}
              <div className="grid grid-cols-5 gap-1.5 mt-2">
                {[50, 100, 150, 200, 300].map((w) => (
                  <button
                    key={w}
                    type="button"
                    onClick={() => setGrams(w)}
                    className={`py-1.5 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                      grams === w
                        ? 'bg-red-600 text-white border-red-500 shadow-md shadow-red-600/30'
                        : 'bg-zinc-950 text-zinc-400 border-zinc-800 hover:bg-zinc-800 hover:text-white'
                    }`}
                  >
                    {w}g
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Mode Inputs if enabled */}
            {isCustomMode && (
              <div className="p-4 bg-zinc-950 border border-zinc-800 rounded-xl space-y-2">
                <div className="text-xs font-bold text-white">Custom Nutrition Density (per 100g):</div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <div>
                    <label className="text-[10px] font-bold text-zinc-400">Calories (kcal)</label>
                    <input
                      type="number"
                      value={customCaloriesPer100g}
                      onChange={(e) => setCustomCaloriesPer100g(e.target.value ? Number(e.target.value) : '')}
                      className="w-full mt-1 p-1.5 bg-zinc-900 border border-zinc-700 rounded-lg text-xs font-bold text-white"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-zinc-400">Protein (g)</label>
                    <input
                      type="number"
                      value={customProteinPer100g}
                      onChange={(e) => setCustomProteinPer100g(e.target.value ? Number(e.target.value) : '')}
                      className="w-full mt-1 p-1.5 bg-zinc-900 border border-zinc-700 rounded-lg text-xs font-bold text-white"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-zinc-400">Carbs (g)</label>
                    <input
                      type="number"
                      value={customCarbsPer100g}
                      onChange={(e) => setCustomCarbsPer100g(e.target.value ? Number(e.target.value) : '')}
                      className="w-full mt-1 p-1.5 bg-zinc-900 border border-zinc-700 rounded-lg text-xs font-bold text-white"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-zinc-400">Fat (g)</label>
                    <input
                      type="number"
                      value={customFatPer100g}
                      onChange={(e) => setCustomFatPer100g(e.target.value ? Number(e.target.value) : '')}
                      className="w-full mt-1 p-1.5 bg-zinc-900 border border-zinc-700 rounded-lg text-xs font-bold text-white"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Action Submission Buttons */}
          <div className="pt-3 border-t border-zinc-800 space-y-2">
            <button
              id="confirm-add-meal-btn"
              type="button"
              disabled={!foodName.trim() || !grams}
              onClick={(e) => handleSubmit(e, false)}
              className="w-full py-3 px-4 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-extrabold text-sm rounded-xl shadow-lg shadow-red-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              {justSaved ? <Check className="w-5 h-5" /> : <PlusCircle className="w-5 h-5" />}
              <span>
                {justSaved
                  ? `Saved! Updating ${selectedUser.name}'s Tracker...`
                  : `Add to ${selectedUser.name}'s ${mealCategory.toUpperCase()} & Update Tracker`}
              </span>
            </button>

            <button
              type="button"
              disabled={!foodName.trim() || !grams}
              onClick={(e) => handleSubmit(e, true)}
              className="w-full py-2.5 px-3 bg-zinc-950 hover:bg-zinc-800 disabled:opacity-50 text-zinc-300 hover:text-white font-bold text-xs rounded-xl border border-zinc-800 transition-colors cursor-pointer"
            >
              + Log Meal & Keep Logging Another
            </button>
          </div>
        </div>

        {/* Right 5 Columns: Live Tracker Impact & Quick Food Database */}
        <div className="lg:col-span-5 space-y-5">
          {/* User Tracker Impact Preview Card */}
          <div className="bg-zinc-900 p-5 rounded-2xl border border-zinc-800 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-red-600 text-white font-bold text-xs flex items-center justify-center shadow-md shadow-red-600/30">
                  {selectedUser.name.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <h3 className="text-xs font-bold text-white">{selectedUser.name}'s Live Tracker Impact</h3>
                  <span className="text-[10px] text-zinc-400">Goal: {userCurrentPreset.name}</span>
                </div>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-zinc-950 text-zinc-300 border border-zinc-800">
                Budget: {userCurrentPreset.calories} kcal
              </span>
            </div>

            {/* Calculated nutrients for this meal */}
            <div className="p-3.5 bg-zinc-950 rounded-xl border border-zinc-800 space-y-2">
              <div className="flex justify-between items-baseline">
                <span className="text-xs text-zinc-400 font-semibold">Meal Energy Intake:</span>
                <span className="text-lg font-black text-red-400">+{currentCalculations.calories} kcal</span>
              </div>

              <div className="grid grid-cols-3 gap-1.5 pt-2 border-t border-zinc-850 text-center text-xs">
                <div className="p-1.5 bg-zinc-900 rounded border border-zinc-800">
                  <div className="text-[10px] text-red-400 font-bold">Protein</div>
                  <div className="font-extrabold text-white">+{currentCalculations.protein}g</div>
                </div>
                <div className="p-1.5 bg-zinc-900 rounded border border-zinc-800">
                  <div className="text-[10px] text-amber-400 font-bold">Carbs</div>
                  <div className="font-extrabold text-white">+{currentCalculations.carbs}g</div>
                </div>
                <div className="p-1.5 bg-zinc-900 rounded border border-zinc-800">
                  <div className="text-[10px] text-emerald-400 font-bold">Fat</div>
                  <div className="font-extrabold text-white">+{currentCalculations.fat}g</div>
                </div>
              </div>
            </div>

            {/* Impact on Day's Total */}
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between text-zinc-400">
                <span>Before meal:</span>
                <span className="font-bold text-zinc-300">{currentConsumedCalories} kcal</span>
              </div>
              <div className="flex justify-between text-white font-bold">
                <span>After logging:</span>
                <span className={willExceedBudget ? 'text-red-400 font-extrabold' : 'text-white'}>
                  {newTotalCaloriesForUser} / {userCurrentPreset.calories} kcal
                </span>
              </div>

              {/* Bar preview */}
              <div className="h-2 w-full bg-zinc-950 rounded-full overflow-hidden border border-zinc-800 mt-2">
                <div
                  className={`h-full transition-all duration-300 ${
                    willExceedBudget ? 'bg-red-500 shadow-sm shadow-red-500' : 'bg-red-600'
                  }`}
                  style={{ width: `${Math.min(100, (newTotalCaloriesForUser / userCurrentPreset.calories) * 100)}%` }}
                />
              </div>

              {willExceedBudget && (
                <div className="flex items-center gap-1.5 text-[11px] text-red-400 font-bold pt-1">
                  <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                  <span>Warning: This will push {selectedUser.name} +{newTotalCaloriesForUser - userCurrentPreset.calories} kcal over budget.</span>
                </div>
              )}
            </div>
          </div>

          {/* Quick Select Food Database Box */}
          <div className="bg-zinc-900 p-5 rounded-2xl border border-zinc-800 shadow-xl space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-black uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
                <UtensilsCrossed className="w-3.5 h-3.5 text-red-500" />
                <span>1-Click Food Database Pick</span>
              </h3>
              <span className="text-[10px] text-zinc-500">40+ items</span>
            </div>

            <div className="relative">
              <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search food item..."
                value={dbSearch}
                onChange={(e) => setDbSearch(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 bg-zinc-950 border border-zinc-800 rounded-lg text-xs text-white placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-red-600"
              />
            </div>

            {/* Food items mini list */}
            <div className="max-h-60 overflow-y-auto space-y-1 pr-1 divide-y divide-zinc-800/60">
              {filteredFoods.slice(0, 15).map((item) => {
                const isSelected = selectedFood?.id === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleSelectFood(item)}
                    className={`w-full p-2 rounded-lg text-left transition-colors flex items-center justify-between cursor-pointer ${
                      isSelected
                        ? 'bg-red-950/80 border border-red-800 text-white'
                        : 'hover:bg-zinc-950 text-zinc-300'
                    }`}
                  >
                    <div className="pr-2">
                      <div className="text-xs font-bold text-white flex items-center gap-1">
                        {item.name}
                        {isSelected && <Check className="w-3 h-3 text-red-400" />}
                      </div>
                      <div className="text-[10px] text-zinc-400 mt-0.5">
                        {item.caloriesPer100g} kcal/100g • P: {item.proteinPer100g}g • C: {item.carbsPer100g}g • F: {item.fatPer100g}g
                      </div>
                    </div>
                    <span className="text-[10px] bg-zinc-800 text-zinc-400 px-1.5 py-0.5 rounded shrink-0">
                      {item.standardGrams || 100}g
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
