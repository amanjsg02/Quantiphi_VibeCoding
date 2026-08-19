import React, { useState } from 'react';
import { X, Save, RotateCcw, Sliders, CheckCircle, Flame, Dumbbell, Wheat, Droplets } from 'lucide-react';
import { FitnessGoal, GoalPreset } from '../types';
import { DEFAULT_GOAL_PRESETS } from '../data/foodDatabase';

interface GoalConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  presets: Record<FitnessGoal, GoalPreset>;
  onSavePresets: (newPresets: Record<FitnessGoal, GoalPreset>) => void;
  currentGoal: FitnessGoal;
}

export const GoalConfigModal: React.FC<GoalConfigModalProps> = ({
  isOpen,
  onClose,
  presets,
  onSavePresets,
  currentGoal,
}) => {
  const [selectedGoalTab, setSelectedGoalTab] = useState<FitnessGoal>(currentGoal);
  const [tempPresets, setTempPresets] = useState<Record<FitnessGoal, GoalPreset>>(() => JSON.parse(JSON.stringify(presets)));
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const currentConfig = tempPresets[selectedGoalTab];

  const handleFieldChange = (field: keyof GoalPreset, value: number | string) => {
    setTempPresets((prev) => ({
      ...prev,
      [selectedGoalTab]: {
        ...prev[selectedGoalTab],
        [field]: value,
      },
    }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSavePresets(tempPresets);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 600);
  };

  const handleResetToDefaults = () => {
    setTempPresets(JSON.parse(JSON.stringify(DEFAULT_GOAL_PRESETS)));
  };

  // Macro Energy Math
  const proteinKcal = (currentConfig.protein || 0) * 4;
  const carbsKcal = (currentConfig.carbs || 0) * 4;
  const fatKcal = (currentConfig.fat || 0) * 9;
  const calculatedTotalKcal = proteinKcal + carbsKcal + fatKcal;

  return (
    <div
      id="goal-config-modal-overlay"
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200"
    >
      <div className="bg-zinc-900 rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-zinc-800 relative animate-in zoom-in-95 duration-150 text-zinc-100">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-zinc-800 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-red-950/80 text-red-500 border border-red-800/40">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Custom Target Presets</h3>
              <p className="text-xs text-zinc-400">Fine-tune daily calories and macro grams per fitness goal</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-white p-1.5 rounded-full hover:bg-zinc-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Goal Tabs */}
        <div className="flex bg-zinc-950 p-1 rounded-xl mb-4 border border-zinc-800">
          {(['weight_loss', 'maintenance', 'muscle_gain'] as FitnessGoal[]).map((g) => (
            <button
              key={g}
              type="button"
              onClick={() => setSelectedGoalTab(g)}
              className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all text-center cursor-pointer ${
                selectedGoalTab === g
                  ? 'bg-red-600 text-white shadow-md shadow-red-600/30'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
              }`}
            >
              {tempPresets[g].name.split('(')[0].trim()}
            </button>
          ))}
        </div>

        {/* Form */}
        <form onSubmit={handleSave} className="space-y-4">
          <div className="p-3.5 bg-zinc-950/90 rounded-2xl border border-zinc-800">
            <div className="text-xs font-bold text-red-400 mb-1">{currentConfig.name}</div>
            <p className="text-[11px] text-zinc-400">{currentConfig.description}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="text-xs font-bold text-zinc-300 block mb-1 flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 text-red-500" />
                Target Caloric Budget (kcal)
              </label>
              <input
                type="number"
                min="500"
                max="10000"
                required
                value={currentConfig.calories}
                onChange={(e) => handleFieldChange('calories', Number(e.target.value))}
                className="w-full px-3 py-2 bg-zinc-950 border border-zinc-700 rounded-xl text-xs font-bold text-white focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-red-600"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-zinc-300 block mb-1 flex items-center gap-1.5">
                <Dumbbell className="w-3.5 h-3.5 text-red-500" />
                Protein Target (grams)
              </label>
              <input
                type="number"
                min="10"
                max="500"
                required
                value={currentConfig.protein}
                onChange={(e) => handleFieldChange('protein', Number(e.target.value))}
                className="w-full px-3 py-2 bg-zinc-950 border border-zinc-700 rounded-xl text-xs font-bold text-white focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-red-600"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-zinc-300 block mb-1 flex items-center gap-1.5">
                <Wheat className="w-3.5 h-3.5 text-amber-500" />
                Carbohydrates Target (grams)
              </label>
              <input
                type="number"
                min="0"
                max="800"
                required
                value={currentConfig.carbs}
                onChange={(e) => handleFieldChange('carbs', Number(e.target.value))}
                className="w-full px-3 py-2 bg-zinc-950 border border-zinc-700 rounded-xl text-xs font-bold text-white focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-red-600"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-zinc-300 block mb-1 flex items-center gap-1.5">
                <Droplets className="w-3.5 h-3.5 text-emerald-500" />
                Fats Target (grams)
              </label>
              <input
                type="number"
                min="0"
                max="300"
                required
                value={currentConfig.fat}
                onChange={(e) => handleFieldChange('fat', Number(e.target.value))}
                className="w-full px-3 py-2 bg-zinc-950 border border-zinc-700 rounded-xl text-xs font-bold text-white focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-red-600"
              />
            </div>
          </div>

          {/* Macro energy breakdown notice */}
          <div className="p-3 bg-zinc-950 rounded-xl border border-zinc-800 text-xs text-zinc-400 flex items-center justify-between">
            <span>Macro Energy Sum:</span>
            <span className="font-bold text-white">
              {calculatedTotalKcal} kcal ({Math.round((proteinKcal / (calculatedTotalKcal || 1)) * 100)}% P /{' '}
              {Math.round((carbsKcal / (calculatedTotalKcal || 1)) * 100)}% C /{' '}
              {Math.round((fatKcal / (calculatedTotalKcal || 1)) * 100)}% F)
            </span>
          </div>

          {/* Footer buttons */}
          <div className="flex items-center justify-between pt-3 border-t border-zinc-800">
            <button
              type="button"
              onClick={handleResetToDefaults}
              className="text-xs text-zinc-400 hover:text-white flex items-center gap-1 font-semibold cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Defaults</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-bold text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-xl transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs rounded-xl shadow-lg shadow-red-600/30 transition-all flex items-center gap-1.5 cursor-pointer"
              >
                {savedSuccess ? (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    <span>Saved!</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>Save Presets</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
