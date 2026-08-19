import React from 'react';
import { Flame, AlertCircle, CheckCircle2, Zap } from 'lucide-react';
import { GoalPreset } from '../types';

interface CalorieBudgetBarProps {
  consumedCalories: number;
  activePreset: GoalPreset;
}

export const CalorieBudgetBar: React.FC<CalorieBudgetBarProps> = ({
  consumedCalories,
  activePreset,
}) => {
  const target = activePreset.calories;
  const isOverBudget = consumedCalories > target;
  const excess = isOverBudget ? consumedCalories - target : 0;
  const remaining = isOverBudget ? 0 : target - consumedCalories;
  const percentage = Math.round((consumedCalories / (target || 1)) * 100);
  const visualBarWidth = Math.min(100, (consumedCalories / target) * 100);

  return (
    <div
      id="calorie-budget-card"
      className={`rounded-2xl p-6 bg-zinc-900 border transition-all duration-300 shadow-xl ${
        isOverBudget
          ? 'border-red-600/80 ring-2 ring-red-600/30 bg-gradient-to-b from-red-950/40 via-zinc-900 to-zinc-900'
          : 'border-zinc-800'
      }`}
    >
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
        <div className="flex items-center gap-3">
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center ${
              isOverBudget
                ? 'bg-red-600 text-white shadow-lg shadow-red-600/40 animate-pulse'
                : 'bg-gradient-to-br from-red-600 to-red-700 text-white shadow-md shadow-red-600/30'
            }`}
          >
            <Flame className="w-5 h-5 fill-white" />
          </div>
          <div>
            <h3 className="font-bold text-white text-base flex items-center gap-2">
              Daily Calorie Budget
              {isOverBudget ? (
                <span className="inline-flex items-center gap-1 text-[11px] font-extrabold px-2 py-0.5 rounded-md bg-red-950 text-red-300 border border-red-700">
                  <AlertCircle className="w-3 h-3 text-red-400" />
                  Budget Exceeded
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-md bg-zinc-800 text-zinc-300 border border-zinc-700">
                  <CheckCircle2 className="w-3 h-3 text-red-500" />
                  Within Target
                </span>
              )}
            </h3>
            <p className="text-xs text-zinc-400">
              Aggregated live intake vs. {activePreset.name} threshold
            </p>
          </div>
        </div>

        {/* Big Numbers Counter */}
        <div className="text-left sm:text-right">
          <div className="flex items-baseline sm:justify-end gap-1.5">
            <span
              id="consumed-calories-display"
              className={`text-2xl sm:text-3xl font-black tracking-tight ${
                isOverBudget ? 'text-red-500' : 'text-white'
              }`}
            >
              {consumedCalories.toLocaleString()}
            </span>
            <span className="text-xs font-bold text-zinc-400">
              / {target.toLocaleString()} kcal
            </span>
          </div>
          <div className="text-xs font-medium">
            {isOverBudget ? (
              <span className="text-red-400 font-extrabold">+{excess.toLocaleString()} kcal over budget</span>
            ) : (
              <span className="text-red-500 font-bold">{remaining.toLocaleString()} kcal remaining</span>
            )}
          </div>
        </div>
      </div>

      {/* Main Dynamic Calorie Progress Bar */}
      <div className="space-y-2 mt-2">
        <div className="h-5 w-full bg-zinc-950 rounded-full overflow-hidden p-0.5 border border-zinc-800 relative">
          <div
            id="calorie-progress-bar-fill"
            className={`h-full rounded-full transition-all duration-500 ease-out relative ${
              isOverBudget
                ? 'bg-gradient-to-r from-red-600 to-red-500 shadow-lg shadow-red-600/50'
                : 'bg-gradient-to-r from-red-700 to-red-600 shadow-md shadow-red-600/30'
            }`}
            style={{ width: `${visualBarWidth}%` }}
          >
            {/* Subtle gloss line */}
            <div className="absolute inset-0 bg-white/20 rounded-full" />
          </div>
        </div>

        {/* Milestone Marks */}
        <div className="flex justify-between items-center text-[11px] text-zinc-400 font-medium px-1">
          <span>0 kcal (0%)</span>
          <span className="hidden sm:inline">50% ({Math.round(target / 2)} kcal)</span>
          <span className={isOverBudget ? 'text-red-400 font-extrabold' : 'text-white font-bold'}>
            {percentage}% {isOverBudget ? '(Limit Breached)' : 'Target'}
          </span>
        </div>
      </div>
    </div>
  );
};
