import React from 'react';
import {
  Trash2,
  Utensils,
  Clock,
  Flame,
  Dumbbell,
  Wheat,
  Droplets,
  Plus,
  Inbox,
} from 'lucide-react';
import { LoggedMeal, MealCategory } from '../types';

interface MealListProps {
  meals: LoggedMeal[];
  onDeleteMeal: (id: string) => void;
  onQuickAddForCategory: (cat: MealCategory) => void;
}

export const MealList: React.FC<MealListProps> = ({
  meals,
  onDeleteMeal,
  onQuickAddForCategory,
}) => {
  const categories: {
    id: MealCategory;
    title: string;
    icon: string;
    recommendedKcalShare: string;
  }[] = [
    { id: 'breakfast', title: 'Breakfast', icon: '🌅', recommendedKcalShare: '~25-30%' },
    { id: 'lunch', title: 'Lunch', icon: '☀️', recommendedKcalShare: '~35-40%' },
    { id: 'dinner', title: 'Dinner', icon: '🌙', recommendedKcalShare: '~25-30%' },
    { id: 'snack', title: 'Snacks & Supplements', icon: '🍎', recommendedKcalShare: '~10-15%' },
  ];

  return (
    <div id="meal-history-section" className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-bold text-white text-lg flex items-center gap-2">
            <Utensils className="w-5 h-5 text-red-500" />
            <span>Daily Meal History & Breakdown</span>
          </h3>
          <p className="text-xs text-zinc-400">
            Categorized intake with instant live metric updates
          </p>
        </div>
        <span className="text-xs font-bold text-zinc-300 bg-zinc-900 px-3 py-1 rounded-full border border-zinc-800">
          {meals.length} {meals.length === 1 ? 'item logged' : 'items logged'}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {categories.map((cat) => {
          const categoryMeals = meals.filter((m) => m.mealCategory === cat.id);
          const totalCalories = categoryMeals.reduce((sum, m) => sum + m.calories, 0);
          const totalProtein = Math.round(categoryMeals.reduce((sum, m) => sum + m.protein, 0) * 10) / 10;
          const totalCarbs = Math.round(categoryMeals.reduce((sum, m) => sum + m.carbs, 0) * 10) / 10;
          const totalFat = Math.round(categoryMeals.reduce((sum, m) => sum + m.fat, 0) * 10) / 10;

          return (
            <div
              key={cat.id}
              id={`meal-card-group-${cat.id}`}
              className="bg-zinc-900 rounded-2xl border border-zinc-800 shadow-xl p-4 flex flex-col justify-between"
            >
              {/* Category Header */}
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{cat.icon}</span>
                    <div>
                      <h4 className="font-bold text-white text-sm">{cat.title}</h4>
                      <span className="text-[10px] text-zinc-500 font-medium">{cat.recommendedKcalShare} budget</span>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="font-black text-white text-sm">
                      {totalCalories}{' '}
                      <span className="text-[10px] font-bold text-zinc-500">kcal</span>
                    </div>
                    <div className="text-[10px] text-zinc-400 font-medium">
                      P: {totalProtein}g • C: {totalCarbs}g • F: {totalFat}g
                    </div>
                  </div>
                </div>

                {/* Meal Items List */}
                <div className="divide-y divide-zinc-800/80 mt-2 min-h-[90px]">
                  {categoryMeals.length === 0 ? (
                    <div className="py-6 flex flex-col items-center justify-center text-center">
                      <Inbox className="w-5 h-5 text-zinc-600 mb-1" />
                      <p className="text-xs text-zinc-500">No items logged yet</p>
                      <button
                        onClick={() => onQuickAddForCategory(cat.id)}
                        className="mt-2 inline-flex items-center gap-1 text-[11px] font-bold text-red-400 hover:text-white bg-zinc-950 px-2.5 py-1 rounded-lg border border-zinc-800 hover:border-red-600 transition-colors cursor-pointer"
                      >
                        <Plus className="w-3 h-3 text-red-500" />
                        <span>Log for {cat.title}</span>
                      </button>
                    </div>
                  ) : (
                    categoryMeals.map((meal) => (
                      <div
                        key={meal.id}
                        id={`logged-meal-row-${meal.id}`}
                        className="py-2.5 flex items-center justify-between group hover:bg-zinc-800/60 px-2 rounded-xl transition-colors"
                      >
                        <div className="flex-1 pr-2">
                          <div className="flex items-baseline gap-2">
                            <span className="font-bold text-xs text-white">{meal.name}</span>
                            <span className="text-[10px] font-medium text-zinc-500">
                              ({meal.grams}g)
                            </span>
                          </div>

                          <div className="flex items-center gap-3 text-[10px] text-zinc-400 mt-0.5 font-medium">
                            <span className="flex items-center gap-0.5 text-red-400">
                              <Dumbbell className="w-2.5 h-2.5" />
                              {meal.protein}g P
                            </span>
                            <span className="flex items-center gap-0.5 text-amber-400">
                              <Wheat className="w-2.5 h-2.5" />
                              {meal.carbs}g C
                            </span>
                            <span className="flex items-center gap-0.5 text-emerald-400">
                              <Droplets className="w-2.5 h-2.5" />
                              {meal.fat}g F
                            </span>
                            <span className="text-zinc-500">@{meal.loggedAt}</span>
                          </div>
                        </div>

                        {/* Calories & Delete Button */}
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-xs text-white bg-zinc-950 px-2 py-1 rounded-md border border-zinc-800">
                            {meal.calories} kcal
                          </span>

                          <button
                            id={`delete-meal-btn-${meal.id}`}
                            onClick={() => onDeleteMeal(meal.id)}
                            title="Delete meal (instantly restores budget)"
                            className="p-1.5 rounded-lg text-zinc-500 hover:text-red-400 hover:bg-red-950/60 transition-colors focus:outline-none focus:ring-1 focus:ring-red-500 cursor-pointer"
                            aria-label={`Delete ${meal.name}`}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Add Meal Quick Button in Category Footer if items exist */}
              {categoryMeals.length > 0 && (
                <div className="pt-2 border-t border-zinc-800 flex justify-end">
                  <button
                    onClick={() => onQuickAddForCategory(cat.id)}
                    className="text-[11px] font-bold text-red-400 hover:text-red-300 flex items-center gap-1 hover:underline cursor-pointer"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Add another item</span>
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
