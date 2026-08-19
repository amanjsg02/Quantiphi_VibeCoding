import React from 'react';
import { Target, TrendingDown, Scale, Dumbbell, Sliders, ShieldCheck } from 'lucide-react';
import { FitnessGoal, GoalPreset } from '../types';

interface GoalToggleProps {
  currentGoal: FitnessGoal;
  presets: Record<FitnessGoal, GoalPreset>;
  onSelectGoal: (goal: FitnessGoal) => void;
  onOpenConfigModal: () => void;
}

export const GoalToggle: React.FC<GoalToggleProps> = ({
  currentGoal,
  presets,
  onSelectGoal,
  onOpenConfigModal,
}) => {
  const goals: { id: FitnessGoal; title: string; icon: React.ElementType; badge: string }[] = [
    {
      id: 'weight_loss',
      title: 'Weight Loss',
      icon: TrendingDown,
      badge: 'Deficit',
    },
    {
      id: 'maintenance',
      title: 'Maintenance',
      icon: Scale,
      badge: 'Balanced',
    },
    {
      id: 'muscle_gain',
      title: 'Muscle Gain',
      icon: Dumbbell,
      badge: 'Surplus',
    },
  ];

  return (
    <div
      id="fitness-goal-toggle-card"
      className="bg-zinc-900 rounded-2xl p-5 border border-zinc-800 shadow-xl"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-red-950/80 text-red-500 border border-red-800/40">
              <Target className="w-4 h-4" />
            </span>
            <h2 className="text-base font-bold text-white tracking-wide">Fitness Goal (The Vibe Check)</h2>
          </div>
          <p className="text-xs text-zinc-400 mt-0.5">
            Switching goals instantly updates your caloric budget and macro thresholds without affecting logged meals.
          </p>
        </div>

        <button
          id="custom-preset-btn"
          onClick={onOpenConfigModal}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-red-400 hover:text-white bg-zinc-800 hover:bg-red-600 rounded-xl border border-zinc-700 hover:border-red-600 transition-all self-start sm:self-auto shadow-sm"
        >
          <Sliders className="w-3.5 h-3.5" />
          <span>Customize Presets</span>
        </button>
      </div>

      {/* Goal Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {goals.map((item) => {
          const Icon = item.icon;
          const isSelected = currentGoal === item.id;
          const preset = presets[item.id];

          return (
            <button
              key={item.id}
              id={`goal-toggle-${item.id}`}
              onClick={() => onSelectGoal(item.id)}
              className={`relative p-4 rounded-xl text-left border transition-all duration-200 flex flex-col justify-between cursor-pointer ${
                isSelected
                  ? 'bg-gradient-to-b from-red-600 to-red-700 text-white border-red-500 shadow-xl shadow-red-600/30 ring-2 ring-red-500/50'
                  : 'bg-zinc-950/70 text-zinc-300 border-zinc-800 hover:bg-zinc-800/70 hover:border-zinc-700'
              }`}
            >
              <div className="flex items-start justify-between w-full">
                <div className="flex items-center gap-2.5">
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                      isSelected ? 'bg-white/20 text-white' : 'bg-zinc-900 text-red-500 border border-zinc-800'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <div className={`font-bold text-sm leading-tight ${isSelected ? 'text-white' : 'text-zinc-100'}`}>
                      {item.title}
                    </div>
                    <span
                      className={`text-[10px] font-extrabold uppercase tracking-wider ${
                        isSelected ? 'text-red-100' : 'text-zinc-500'
                      }`}
                    >
                      {item.badge}
                    </span>
                  </div>
                </div>

                {isSelected && (
                  <span className="w-5 h-5 rounded-full bg-white text-red-600 flex items-center justify-center shadow-sm">
                    <ShieldCheck className="w-3.5 h-3.5" />
                  </span>
                )}
              </div>

              {/* Target Numbers */}
              <div className={`mt-3 pt-2.5 border-t text-xs ${isSelected ? 'border-white/20' : 'border-zinc-800/90'}`}>
                <div className="flex items-baseline justify-between">
                  <span className={isSelected ? 'text-red-100 font-medium' : 'text-zinc-400'}>Target:</span>
                  <span className={`font-extrabold ${isSelected ? 'text-white' : 'text-zinc-100'}`}>
                    {preset.calories} <span className="text-[10px] font-normal">kcal</span>
                  </span>
                </div>

                <div className="flex items-center justify-between text-[11px] mt-1 text-zinc-400">
                  <span className={isSelected ? 'text-red-100' : ''}>P: {preset.protein}g</span>
                  <span className={isSelected ? 'text-red-100' : ''}>C: {preset.carbs}g</span>
                  <span className={isSelected ? 'text-red-100' : ''}>F: {preset.fat}g</span>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
