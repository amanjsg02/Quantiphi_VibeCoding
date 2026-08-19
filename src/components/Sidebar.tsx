import React from 'react';
import {
  LayoutDashboard,
  UtensilsCrossed,
  SlidersHorizontal,
  History,
  Target,
  Flame,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { FitnessGoal, GoalPreset } from '../types';

interface SidebarProps {
  activeTab: 'dashboard' | 'food_db' | 'goals' | 'history';
  onSelectTab: (tab: 'dashboard' | 'food_db' | 'goals' | 'history') => void;
  currentGoal: FitnessGoal;
  activePreset: GoalPreset;
  consumedCalories: number;
  isOverBudget: boolean;
  onOpenGoalModal: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  currentGoal,
  activePreset,
  consumedCalories,
  isOverBudget,
  onOpenGoalModal,
}) => {
  const navItems = [
    {
      id: 'dashboard' as const,
      label: 'Dashboard',
      icon: LayoutDashboard,
      badge: 'Live',
    },
    {
      id: 'food_db' as const,
      label: 'Food Database',
      icon: UtensilsCrossed,
      badge: '40+ Foods',
    },
    {
      id: 'goals' as const,
      label: 'Goal Settings',
      icon: SlidersHorizontal,
      badge: null,
    },
    {
      id: 'history' as const,
      label: 'Daily Logs',
      icon: History,
      badge: null,
    },
  ];

  const calPercent = Math.min(100, Math.round((consumedCalories / (activePreset.calories || 1)) * 100));

  return (
    <aside
      id="app-sidebar"
      className="w-64 bg-[#141414] border-r border-zinc-800/80 flex flex-col shrink-0 min-h-screen select-none text-zinc-100"
    >
      {/* Brand Header */}
      <div className="p-6 border-b border-zinc-800/80 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-red-600 flex items-center justify-center text-white shadow-lg shadow-red-600/30">
          <Flame className="w-5 h-5 fill-white" />
        </div>
        <div>
          <div className="font-extrabold text-white text-lg tracking-wider flex items-center gap-1.5 uppercase font-sans">
            <span className="text-red-600">Nutri</span>Track
            <span className="text-[9px] uppercase font-black tracking-widest px-1.5 py-0.5 rounded bg-red-950/80 text-red-400 border border-red-800/50">
              PRO
            </span>
          </div>
          <p className="text-[11px] text-zinc-400 font-medium">Macro & Calorie Engine</p>
        </div>
      </div>

      {/* Navigation Links */}
      <div className="p-4 flex-1 space-y-1">
        <div className="px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-zinc-500">
          Menu
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              id={`nav-btn-${item.id}`}
              onClick={() => onSelectTab(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all duration-150 ${
                isActive
                  ? 'bg-red-600 text-white shadow-md shadow-red-600/25 font-bold'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-900/80'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-zinc-400'}`} />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    isActive
                      ? 'bg-red-950 text-red-200 border border-red-700/50'
                      : 'bg-zinc-800 text-zinc-400 border border-zinc-700/50'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Active Goal Quick Status Card */}
      <div className="p-4 border-t border-zinc-800/80">
        <div className="p-3.5 rounded-2xl bg-zinc-900/90 border border-zinc-800 space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-zinc-300">
              <Target className="w-3.5 h-3.5 text-red-500" />
              <span>Target Mode</span>
            </div>
            <button
              onClick={onOpenGoalModal}
              className="text-[11px] font-bold text-red-500 hover:text-red-400 hover:underline"
            >
              Edit
            </button>
          </div>

          <div>
            <div className="text-xs font-bold text-white truncate">{activePreset.name}</div>
            <div className="text-[11px] text-zinc-400 truncate">
              {consumedCalories} / {activePreset.calories} kcal
            </div>
          </div>

          {/* Mini progress bar */}
          <div className="space-y-1">
            <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-300 ${
                  isOverBudget ? 'bg-red-500 shadow-sm shadow-red-500' : 'bg-red-600'
                }`}
                style={{ width: `${Math.min(100, (consumedCalories / activePreset.calories) * 100)}%` }}
              />
            </div>
            <div className="flex justify-between text-[10px] text-zinc-500 font-medium">
              <span>{calPercent}% consumed</span>
              <span className={isOverBudget ? 'text-red-400 font-bold' : 'text-zinc-400'}>
                {isOverBudget ? 'Exceeded' : 'On Track'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Sidebar Footer info */}
      <div className="p-4 border-t border-zinc-800/80 text-[11px] text-zinc-500 text-center font-medium">
        <span>Real-time Macro Calculator</span>
      </div>
    </aside>
  );
};
