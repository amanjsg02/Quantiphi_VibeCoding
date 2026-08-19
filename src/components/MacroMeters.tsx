import React from 'react';
import { Dumbbell, Wheat, Droplets } from 'lucide-react';
import { GoalPreset } from '../types';

interface MacroMetersProps {
  consumedMacros: {
    protein: number;
    carbs: number;
    fat: number;
  };
  activePreset: GoalPreset;
}

export const MacroMeters: React.FC<MacroMetersProps> = ({
  consumedMacros,
  activePreset,
}) => {
  const macros = [
    {
      id: 'protein',
      name: 'Protein',
      icon: Dumbbell,
      consumed: consumedMacros.protein,
      target: activePreset.protein,
      unit: 'g',
      barColor: 'bg-red-600 shadow-sm shadow-red-600/30',
      badgeBg: 'bg-red-950 text-red-300 border-red-800/60',
      iconColor: 'text-red-500',
      caloriesPerGram: 4,
    },
    {
      id: 'carbs',
      name: 'Carbohydrates',
      icon: Wheat,
      consumed: consumedMacros.carbs,
      target: activePreset.carbs,
      unit: 'g',
      barColor: 'bg-amber-500 shadow-sm shadow-amber-500/30',
      badgeBg: 'bg-amber-950/80 text-amber-300 border-amber-800/60',
      iconColor: 'text-amber-500',
      caloriesPerGram: 4,
    },
    {
      id: 'fat',
      name: 'Fats',
      icon: Droplets,
      consumed: consumedMacros.fat,
      target: activePreset.fat,
      unit: 'g',
      barColor: 'bg-emerald-500 shadow-sm shadow-emerald-500/30',
      badgeBg: 'bg-emerald-950/80 text-emerald-300 border-emerald-800/60',
      iconColor: 'text-emerald-500',
      caloriesPerGram: 9,
    },
  ];

  return (
    <div
      id="macro-meters-card"
      className="bg-zinc-900 rounded-2xl p-6 border border-zinc-800 shadow-xl"
    >
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="font-bold text-white text-base">Macronutrient Distribution</h3>
          <p className="text-xs text-zinc-400">Live breakdown against daily target grams</p>
        </div>
        <div className="text-xs font-semibold text-zinc-500">
          Target: <span className="text-zinc-200">{activePreset.name}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {macros.map((m) => {
          const Icon = m.icon;
          const percentage = Math.round((m.consumed / (m.target || 1)) * 100);
          const barWidth = Math.min(100, (m.consumed / m.target) * 100);
          const isExceeded = m.consumed > m.target;
          const diff = isExceeded ? m.consumed - m.target : m.target - m.consumed;

          return (
            <div
              key={m.id}
              id={`macro-meter-${m.id}`}
              className="p-4 rounded-xl bg-zinc-950/70 border border-zinc-800 flex flex-col justify-between"
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-200">
                    <Icon className={`w-4 h-4 ${m.iconColor}`} />
                  </div>
                  <div>
                    <span className="font-bold text-sm text-white block leading-tight">{m.name}</span>
                    <span className="text-[10px] text-zinc-500 font-medium">
                      {Math.round(m.consumed * m.caloriesPerGram)} kcal total
                    </span>
                  </div>
                </div>
                <span
                  className={`text-[11px] font-bold px-2 py-0.5 rounded-md border ${m.badgeBg}`}
                >
                  {percentage}%
                </span>
              </div>

              {/* Progress Value */}
              <div className="space-y-1.5 my-2">
                <div className="flex justify-between items-baseline">
                  <span className="text-xl font-black text-white">
                    {m.consumed}
                    <span className="text-xs font-bold text-zinc-500 ml-0.5">{m.unit}</span>
                  </span>
                  <span className="text-xs text-zinc-400 font-medium">
                    Goal: <strong className="text-zinc-200">{m.target}{m.unit}</strong>
                  </span>
                </div>

                {/* Meter Bar */}
                <div className="h-2.5 w-full bg-zinc-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${
                      isExceeded ? 'bg-red-500' : m.barColor
                    }`}
                    style={{ width: `${barWidth}%` }}
                  />
                </div>
              </div>

              {/* Footer status */}
              <div className="pt-2 border-t border-zinc-800/80 flex items-center justify-between text-[11px] text-zinc-400">
                <span>{isExceeded ? 'Exceeded' : 'Remaining'}</span>
                <span className={`font-bold ${isExceeded ? 'text-red-400' : 'text-zinc-300'}`}>
                  {isExceeded ? `+${diff}${m.unit} over` : `${diff}${m.unit} left`}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
