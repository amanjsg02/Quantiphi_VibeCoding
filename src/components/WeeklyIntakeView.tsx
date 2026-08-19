import React from 'react';
import {
  TrendingUp,
  Calendar,
  Crown,
  Flame,
  Dumbbell,
  Wheat,
  Droplets,
  CheckCircle2,
  AlertCircle,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles,
  Lock,
} from 'lucide-react';
import { UserProfile, LoggedMeal, GoalPreset } from '../types';

interface WeeklyIntakeViewProps {
  currentUser: UserProfile;
  meals: LoggedMeal[];
  activePreset: GoalPreset;
  onOpenSubscription: () => void;
}

export const WeeklyIntakeView: React.FC<WeeklyIntakeViewProps> = ({
  currentUser,
  meals,
  activePreset,
  onOpenSubscription,
}) => {
  const isPro = currentUser.subscriptionTier === 'pro';

  // Generate 7-day data (simulating / calculating current week)
  const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  
  // Compute today's consumed
  const todayCalories = meals.reduce((sum, m) => sum + m.calories, 0);
  const todayProtein = Math.round(meals.reduce((sum, m) => sum + m.protein, 0) * 10) / 10;
  const todayCarbs = Math.round(meals.reduce((sum, m) => sum + m.carbs, 0) * 10) / 10;
  const todayFat = Math.round(meals.reduce((sum, m) => sum + m.fat, 0) * 10) / 10;

  // Mock historical days for realistic weekly analytics around the active user's preset
  const weeklyData = [
    { day: 'Mon', calories: Math.round(activePreset.calories * 0.96), target: activePreset.calories, p: Math.round(activePreset.protein * 0.95), c: Math.round(activePreset.carbs * 0.98), f: Math.round(activePreset.fat * 0.94) },
    { day: 'Tue', calories: Math.round(activePreset.calories * 1.02), target: activePreset.calories, p: Math.round(activePreset.protein * 1.05), c: Math.round(activePreset.carbs * 1.01), f: Math.round(activePreset.fat * 1.0) },
    { day: 'Wed', calories: Math.round(activePreset.calories * 0.91), target: activePreset.calories, p: Math.round(activePreset.protein * 0.92), c: Math.round(activePreset.carbs * 0.88), f: Math.round(activePreset.fat * 0.92) },
    { day: 'Thu', calories: Math.round(activePreset.calories * 0.99), target: activePreset.calories, p: Math.round(activePreset.protein * 1.0), c: Math.round(activePreset.carbs * 0.97), f: Math.round(activePreset.fat * 0.98) },
    { day: 'Fri', calories: Math.round(activePreset.calories * 1.06), target: activePreset.calories, p: Math.round(activePreset.protein * 1.1), c: Math.round(activePreset.carbs * 1.08), f: Math.round(activePreset.fat * 1.02) },
    { day: 'Sat', calories: Math.round(activePreset.calories * 0.88), target: activePreset.calories, p: Math.round(activePreset.protein * 0.89), c: Math.round(activePreset.carbs * 0.85), f: Math.round(activePreset.fat * 0.9) },
    { day: 'Sun (Today)', calories: todayCalories || Math.round(activePreset.calories * 0.94), target: activePreset.calories, p: todayProtein || activePreset.protein, c: todayCarbs || activePreset.carbs, f: todayFat || activePreset.fat },
  ];

  const weeklyTotalCalories = weeklyData.reduce((sum, d) => sum + d.calories, 0);
  const weeklyTargetCalories = activePreset.calories * 7;
  const weeklyAverage = Math.round(weeklyTotalCalories / 7);
  const weeklyNetDifference = weeklyTotalCalories - weeklyTargetCalories;
  const isWeeklySurplus = weeklyNetDifference > 0;

  const totalWeeklyProtein = weeklyData.reduce((sum, d) => sum + d.p, 0);
  const totalWeeklyCarbs = weeklyData.reduce((sum, d) => sum + d.c, 0);
  const totalWeeklyFat = weeklyData.reduce((sum, d) => sum + d.f, 0);

  const maxDayCalories = Math.max(...weeklyData.map((d) => d.calories), activePreset.calories * 1.2);

  return (
    <div id="weekly-intake-analytics-view" className="space-y-6 animate-in fade-in duration-200">
      {/* Top Banner */}
      <div className="bg-zinc-900 rounded-3xl p-6 border border-zinc-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-red-600 text-white font-black shadow-lg shadow-red-600/30">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-black text-white">Weekly Intake & Historical Trends</h1>
                <span className="text-[10px] font-black uppercase tracking-wider text-red-400 bg-red-950 px-2 py-0.5 rounded border border-red-800/60">
                  $20/mo Pro Feature
                </span>
              </div>
              <p className="text-xs text-zinc-400 mt-0.5">
                Tracking 7-day intake averages and deficit compliance for {currentUser.name}
              </p>
            </div>
          </div>
        </div>

        {!isPro ? (
          <button
            onClick={onOpenSubscription}
            className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-black text-xs rounded-xl shadow-lg shadow-red-600/30 cursor-pointer"
          >
            <Crown className="w-4 h-4" />
            <span>Upgrade to Pro ($20/mo)</span>
          </button>
        ) : (
          <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-bold bg-emerald-950/80 px-3 py-1.5 rounded-xl border border-emerald-800">
            <CheckCircle2 className="w-4 h-4" />
            <span>Pro Subscription Active</span>
          </div>
        )}
      </div>

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-zinc-900 rounded-2xl p-5 border border-zinc-800 shadow-xl space-y-2">
          <div className="flex items-center justify-between text-xs text-zinc-400">
            <span className="font-semibold">7-Day Calorie Average</span>
            <Flame className="w-4 h-4 text-red-500" />
          </div>
          <div className="text-2xl font-black text-white">
            {weeklyAverage.toLocaleString()}{' '}
            <span className="text-xs font-bold text-zinc-400">kcal/day</span>
          </div>
          <div className="text-[11px] text-zinc-400 flex items-center justify-between">
            <span>Target: {activePreset.calories} kcal</span>
            <span className={`font-bold ${weeklyAverage <= activePreset.calories ? 'text-emerald-400' : 'text-red-400'}`}>
              {weeklyAverage <= activePreset.calories ? 'On Track' : 'Slight Surplus'}
            </span>
          </div>
        </div>

        <div className="bg-zinc-900 rounded-2xl p-5 border border-zinc-800 shadow-xl space-y-2">
          <div className="flex items-center justify-between text-xs text-zinc-400">
            <span className="font-semibold">Weekly Net Balance</span>
            {isWeeklySurplus ? (
              <ArrowUpRight className="w-4 h-4 text-red-500" />
            ) : (
              <ArrowDownRight className="w-4 h-4 text-emerald-400" />
            )}
          </div>
          <div className={`text-2xl font-black ${isWeeklySurplus ? 'text-red-400' : 'text-emerald-400'}`}>
            {isWeeklySurplus ? `+${weeklyNetDifference}` : weeklyNetDifference}{' '}
            <span className="text-xs font-bold text-zinc-400">kcal net</span>
          </div>
          <div className="text-[11px] text-zinc-400">
            Total consumed: <strong className="text-zinc-200">{weeklyTotalCalories.toLocaleString()}</strong> / {weeklyTargetCalories.toLocaleString()} kcal
          </div>
        </div>

        <div className="bg-zinc-900 rounded-2xl p-5 border border-zinc-800 shadow-xl space-y-2">
          <div className="flex items-center justify-between text-xs text-zinc-400">
            <span className="font-semibold">Weekly Total Protein</span>
            <Dumbbell className="w-4 h-4 text-red-500" />
          </div>
          <div className="text-2xl font-black text-white">
            {totalWeeklyProtein}{' '}
            <span className="text-xs font-bold text-zinc-400">grams</span>
          </div>
          <div className="text-[11px] text-zinc-400">
            Avg: <strong className="text-zinc-200">{Math.round(totalWeeklyProtein / 7)}g / day</strong>
          </div>
        </div>

        <div className="bg-zinc-900 rounded-2xl p-5 border border-zinc-800 shadow-xl space-y-2">
          <div className="flex items-center justify-between text-xs text-zinc-400">
            <span className="font-semibold">Weekly Adherence Score</span>
            <CheckCircle2 className="w-4 h-4 text-red-500" />
          </div>
          <div className="text-2xl font-black text-white">
            94%
          </div>
          <div className="text-[11px] text-emerald-400 font-bold">
            6 of 7 days strictly within budget
          </div>
        </div>
      </div>

      {/* 7-Day Bar Visualization */}
      <div className="bg-zinc-900 rounded-3xl p-6 sm:p-8 border border-zinc-800 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="font-bold text-white text-base flex items-center gap-2">
              <Calendar className="w-4 h-4 text-red-500" />
              <span>7-Day Caloric Intake vs. Daily Budget</span>
            </h3>
            <p className="text-xs text-zinc-400">Visual comparison against daily {activePreset.calories} kcal budget line</p>
          </div>
          <div className="flex items-center gap-3 text-xs">
            <div className="flex items-center gap-1.5 text-zinc-300">
              <span className="w-3 h-3 rounded bg-red-600" />
              <span>Consumed</span>
            </div>
            <div className="flex items-center gap-1.5 text-zinc-400">
              <span className="w-3 h-0.5 bg-zinc-400" />
              <span>Target ({activePreset.calories} kcal)</span>
            </div>
          </div>
        </div>

        {/* Dynamic Bar Chart */}
        <div className="pt-6 pb-2">
          <div className="grid grid-cols-7 gap-2 sm:gap-4 items-end h-56 border-b border-zinc-800 px-2 relative">
            {/* Target Budget Reference Line */}
            <div
              className="absolute left-0 right-0 border-b border-dashed border-red-500/50 pointer-events-none z-10 flex items-center justify-end pr-2"
              style={{ bottom: `${(activePreset.calories / maxDayCalories) * 100}%` }}
            >
              <span className="text-[10px] font-bold text-red-400 bg-zinc-950 px-1 rounded">
                Target: {activePreset.calories}
              </span>
            </div>

            {weeklyData.map((item, idx) => {
              const heightPercent = Math.min(100, (item.calories / maxDayCalories) * 100);
              const isOver = item.calories > activePreset.calories;

              return (
                <div key={idx} className="flex flex-col items-center gap-2 h-full justify-end group relative">
                  {/* Tooltip on hover */}
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-12 bg-black/90 text-white text-[11px] font-bold px-2 py-1 rounded border border-zinc-700 pointer-events-none whitespace-nowrap z-20 shadow-xl">
                    {item.calories} kcal • {item.p}g P
                  </div>

                  <div className="text-[11px] font-bold text-white mb-1">
                    {item.calories}
                  </div>

                  <div
                    className={`w-full max-w-[42px] rounded-t-xl transition-all duration-500 ease-out relative overflow-hidden ${
                      isOver
                        ? 'bg-gradient-to-t from-red-700 to-red-500 shadow-lg shadow-red-600/40'
                        : 'bg-gradient-to-t from-zinc-800 to-red-600'
                    }`}
                    style={{ height: `${heightPercent}%` }}
                  >
                    <div className="absolute inset-0 bg-white/10" />
                  </div>

                  <span className="text-xs font-bold text-zinc-400 group-hover:text-white transition-colors">
                    {item.day}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Daily Breakdown Table */}
      <div className="bg-zinc-900 rounded-3xl p-6 border border-zinc-800 shadow-xl space-y-4">
        <h3 className="font-bold text-white text-base">Weekly Nutrition Log Summary</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-zinc-800 text-zinc-400 font-extrabold">
                <th className="pb-3">Day</th>
                <th className="pb-3">Calories</th>
                <th className="pb-3">Protein</th>
                <th className="pb-3">Carbs</th>
                <th className="pb-3">Fat</th>
                <th className="pb-3 text-right">Budget Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/70 text-zinc-300 font-medium">
              {weeklyData.map((row, i) => {
                const isOver = row.calories > activePreset.calories;
                return (
                  <tr key={i} className="hover:bg-zinc-850/50">
                    <td className="py-3 font-bold text-white">{row.day}</td>
                    <td className="py-3 font-extrabold text-white">{row.calories} kcal</td>
                    <td className="py-3 text-red-400 font-semibold">{row.p}g</td>
                    <td className="py-3 text-amber-400 font-semibold">{row.c}g</td>
                    <td className="py-3 text-emerald-400 font-semibold">{row.f}g</td>
                    <td className="py-3 text-right">
                      {isOver ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-red-400 bg-red-950 px-2 py-0.5 rounded border border-red-800">
                          +{row.calories - activePreset.calories} kcal over
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
                          ✓ Within Budget
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
