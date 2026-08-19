import React, { useState, useMemo } from 'react';
import {
  UtensilsCrossed,
  Search,
  Plus,
  Flame,
  Dumbbell,
  Wheat,
  Droplets,
  Filter,
  Check,
} from 'lucide-react';
import { FoodItem, MealCategory, LoggedMeal } from '../types';
import { COMMON_FOOD_DATABASE } from '../data/foodDatabase';

interface FoodDatabaseViewProps {
  onQuickLog: (meal: Omit<LoggedMeal, 'id' | 'loggedAt'>) => void;
  activeMealCategory: MealCategory;
}

export const FoodDatabaseView: React.FC<FoodDatabaseViewProps> = ({
  onQuickLog,
  activeMealCategory,
}) => {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<string>('all');
  const [selectedServingCategory, setSelectedServingCategory] = useState<MealCategory>(activeMealCategory);
  const [justLoggedId, setJustLoggedId] = useState<string | null>(null);

  const categories = [
    { id: 'all', label: 'All Items' },
    { id: 'protein', label: 'Proteins' },
    { id: 'carbs', label: 'Complex Carbs' },
    { id: 'dairy', label: 'Dairy & Alternatives' },
    { id: 'fats', label: 'Healthy Fats' },
    { id: 'fruits_veggies', label: 'Fruits & Veggies' },
  ];

  const filteredFoods = useMemo(() => {
    return COMMON_FOOD_DATABASE.filter((item) => {
      const matchText = item.name.toLowerCase().includes(search.toLowerCase());
      const matchCat = category === 'all' || item.category === category;
      return matchText && matchCat;
    });
  }, [search, category]);

  const handleQuickAdd = (food: FoodItem) => {
    const standardGrams = food.standardGrams || 100;
    const factor = standardGrams / 100;

    onQuickLog({
      foodId: food.id,
      name: food.name,
      mealCategory: selectedServingCategory,
      grams: standardGrams,
      calories: Math.round(food.caloriesPer100g * factor),
      protein: Math.round(food.proteinPer100g * factor * 10) / 10,
      carbs: Math.round(food.carbsPer100g * factor * 10) / 10,
      fat: Math.round(food.fatPer100g * factor * 10) / 10,
    });

    setJustLoggedId(food.id);
    setTimeout(() => setJustLoggedId(null), 1200);
  };

  return (
    <div id="food-database-view" className="space-y-6">
      {/* Top Banner */}
      <div className="bg-zinc-900 rounded-2xl p-6 border border-zinc-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-red-950/80 text-red-500 border border-red-800/40">
              <UtensilsCrossed className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold text-white">Standard Fitness Food Database</h2>
          </div>
          <p className="text-xs text-zinc-400 mt-1">
            Verified standard USDA nutritional values per 100g with 1-click quick logging.
          </p>
        </div>

        {/* Target Category for 1-click add */}
        <div className="flex items-center gap-2 bg-zinc-950 p-2 rounded-xl border border-zinc-800">
          <span className="text-xs font-semibold text-zinc-400">Target Category:</span>
          <select
            value={selectedServingCategory}
            onChange={(e) => setSelectedServingCategory(e.target.value as MealCategory)}
            className="text-xs font-bold text-red-400 bg-zinc-900 px-3 py-1.5 rounded-lg border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-red-600 cursor-pointer"
          >
            <option value="breakfast">🌅 Breakfast</option>
            <option value="lunch">☀️ Lunch</option>
            <option value="dinner">🌙 Dinner</option>
            <option value="snack">🍎 Snack</option>
          </select>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search foods, ingredients, meats, grains, fruits..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-red-600"
          />
        </div>

        <div className="flex gap-1.5 overflow-x-auto pb-1">
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setCategory(c.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-colors cursor-pointer ${
                category === c.id
                  ? 'bg-red-600 text-white shadow-md shadow-red-600/30'
                  : 'bg-zinc-900 text-zinc-400 border border-zinc-800 hover:bg-zinc-800 hover:text-white'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* Food Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredFoods.map((item) => {
          const isJustAdded = justLoggedId === item.id;

          return (
            <div
              key={item.id}
              className="bg-zinc-900 rounded-2xl p-4 border border-zinc-800 shadow-xl flex flex-col justify-between hover:border-red-600/60 transition-all group"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="font-bold text-sm text-white leading-snug group-hover:text-red-400 transition-colors">
                    {item.name}
                  </h3>
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-zinc-950 text-zinc-400 border border-zinc-800 shrink-0">
                    {item.category.replace('_', ' ')}
                  </span>
                </div>

                <div className="text-xs text-zinc-400 mb-3">
                  Standard serving: <strong className="text-zinc-200">{item.servingUnit || '100g'}</strong>
                </div>

                {/* Per 100g Nutrient Pill Breakdown */}
                <div className="grid grid-cols-4 gap-1.5 text-center p-2 rounded-xl bg-zinc-950 border border-zinc-800/80 text-[11px] mb-4">
                  <div>
                    <div className="text-[10px] text-zinc-500 font-semibold">Calories</div>
                    <div className="font-bold text-white">{item.caloriesPer100g}</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-red-400 font-semibold">Protein</div>
                    <div className="font-bold text-red-400">{item.proteinPer100g}g</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-amber-400 font-semibold">Carbs</div>
                    <div className="font-bold text-amber-400">{item.carbsPer100g}g</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-emerald-400 font-semibold">Fat</div>
                    <div className="font-bold text-emerald-400">{item.fatPer100g}g</div>
                  </div>
                </div>
              </div>

              {/* Quick Log Button */}
              <button
                onClick={() => handleQuickAdd(item)}
                className={`w-full py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  isJustAdded
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'bg-zinc-800 text-red-400 hover:bg-red-600 hover:text-white border border-zinc-700 hover:border-red-600'
                }`}
              >
                {isJustAdded ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Logged to {selectedServingCategory}!</span>
                  </>
                ) : (
                  <>
                    <Plus className="w-3.5 h-3.5" />
                    <span>
                      Log Serving ({item.standardGrams || 100}g)
                    </span>
                  </>
                )}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
