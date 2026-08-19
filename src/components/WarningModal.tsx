import React from 'react';
import { AlertTriangle, Flame, X, ArrowRight, RotateCcw, Sliders } from 'lucide-react';
import { GoalPreset } from '../types';

interface WarningModalProps {
  isOpen: boolean;
  onClose: () => void;
  consumedCalories: number;
  activePreset: GoalPreset;
  onOpenGoalConfig: () => void;
  onUndoLastMeal?: () => void;
}

export const WarningModal: React.FC<WarningModalProps> = ({
  isOpen,
  onClose,
  consumedCalories,
  activePreset,
  onOpenGoalConfig,
  onUndoLastMeal,
}) => {
  if (!isOpen) return null;

  const excess = consumedCalories - activePreset.calories;

  return (
    <div
      id="daily-budget-warning-modal"
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200"
    >
      <div className="bg-zinc-900 rounded-3xl max-w-md w-full p-6 shadow-2xl border border-red-600/80 relative overflow-hidden animate-in zoom-in-95 duration-150 text-zinc-100">
        {/* Top Warning Accent Bar */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-red-600 shadow-md shadow-red-600/50" />

        {/* Close Icon */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-zinc-400 hover:text-white p-1.5 rounded-full hover:bg-zinc-800 transition-colors cursor-pointer"
          aria-label="Close warning"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Warning Icon & Title */}
        <div className="flex items-center gap-3.5 mb-4 mt-1">
          <div className="w-12 h-12 rounded-2xl bg-red-950/80 border border-red-800/80 text-red-500 flex items-center justify-center shrink-0 shadow-lg shadow-red-950">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-red-400 bg-red-950/80 px-2 py-0.5 rounded-md border border-red-800/60">
              Caloric Limit Warning
            </span>
            <h3 className="text-xl font-black text-white mt-0.5 tracking-tight">
              Daily Budget Exceeded!
            </h3>
          </div>
        </div>

        {/* Body Description */}
        <div className="bg-zinc-950/90 border border-red-900/60 rounded-2xl p-4 mb-5 space-y-2 text-xs text-zinc-300">
          <div className="flex justify-between items-baseline">
            <span className="font-medium text-zinc-400">Total Consumed Today:</span>
            <span className="font-black text-red-400 text-sm">{consumedCalories} kcal</span>
          </div>
          <div className="flex justify-between items-baseline">
            <span className="font-medium text-zinc-400">Active Daily Target ({activePreset.name}):</span>
            <span className="font-bold text-white">{activePreset.calories} kcal</span>
          </div>
          <div className="pt-2 border-t border-zinc-800 flex justify-between items-baseline">
            <span className="font-bold text-red-400">Excess Intake:</span>
            <span className="font-black text-red-500 text-base">+{excess} kcal</span>
          </div>
        </div>

        <p className="text-xs text-zinc-400 mb-6 leading-relaxed">
          Your logged meal pushed your aggregate calorie intake beyond your current{' '}
          <strong className="text-white">{activePreset.name}</strong> threshold. You can keep logging, undo the last item, or increase your calorie target preset.
        </p>

        {/* Action Buttons */}
        <div className="space-y-2">
          <button
            onClick={onClose}
            className="w-full py-3 px-4 bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs rounded-xl shadow-lg shadow-red-600/40 transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Acknowledge & Continue Logging</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <div className="grid grid-cols-2 gap-2 pt-1">
            {onUndoLastMeal && (
              <button
                onClick={() => {
                  onUndoLastMeal();
                  onClose();
                }}
                className="py-2 px-3 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-bold text-xs rounded-xl border border-zinc-700 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Undo Last Meal</span>
              </button>
            )}
            <button
              onClick={() => {
                onClose();
                onOpenGoalConfig();
              }}
              className="py-2 px-3 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-bold text-xs rounded-xl border border-zinc-700 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Sliders className="w-3.5 h-3.5 text-red-400" />
              <span>Adjust Preset</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
