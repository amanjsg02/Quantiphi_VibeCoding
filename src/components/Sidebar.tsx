import React from 'react';
import {
  LayoutDashboard,
  UtensilsCrossed,
  Sliders,
  History,
  Flame,
  User,
  PlusCircle,
  PanelLeftClose,
  TrendingUp,
  Crown,
} from 'lucide-react';
import { FitnessGoal, GoalPreset, SubscriptionTier } from '../types';

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  activeTab: 'dashboard' | 'add_meal' | 'weekly_intake' | 'food_db' | 'goals' | 'history' | 'subscription';
  onSelectTab: (tab: 'dashboard' | 'add_meal' | 'weekly_intake' | 'food_db' | 'goals' | 'history' | 'subscription') => void;
  currentGoal: FitnessGoal;
  activePreset: GoalPreset;
  consumedCalories: number;
  isOverBudget: boolean;
  onOpenGoalModal: () => void;
  currentUserName: string;
  subscriptionTier: SubscriptionTier;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onToggle,
  activeTab,
  onSelectTab,
  currentGoal,
  activePreset,
  consumedCalories,
  isOverBudget,
  onOpenGoalModal,
  currentUserName,
  subscriptionTier,
}) => {
  const isPro = subscriptionTier === 'pro';

  const navItems = [
    {
      id: 'dashboard' as const,
      label: 'Dashboard',
      icon: LayoutDashboard,
      badge: 'Live',
    },
    {
      id: 'add_meal' as const,
      label: 'Add Meal',
      icon: PlusCircle,
      badge: 'New',
      isPrimaryAction: true,
    },
    {
      id: 'weekly_intake' as const,
      label: 'Weekly Intake',
      icon: TrendingUp,
      badge: isPro ? 'Pro Active' : '$20/mo',
      highlight: isPro,
    },
    {
      id: 'food_db' as const,
      label: 'Food Database',
      icon: UtensilsCrossed,
      badge: '40+ Foods',
    },
    {
      id: 'history' as const,
      label: 'Daily Logs',
      icon: History,
      badge: null,
    },
    {
      id: 'goals' as const,
      label: 'Target Presets',
      icon: Sliders,
      badge: null,
    },
    {
      id: 'subscription' as const,
      label: 'Subscription Plans',
      icon: Crown,
      badge: isPro ? 'Pro $20' : 'Free',
    },
  ];

  return (
    <>
      {/* Backdrop overlay for mobile when sidebar is open */}
      {isOpen && (
        <div
          onClick={onToggle}
          className="fixed inset-0 bg-black/70 backdrop-blur-xs z-40 md:hidden transition-opacity"
          aria-hidden="true"
        />
      )}

      {/* Sliding Sidebar Container */}
      <aside
        id="sliding-app-sidebar"
        className={`fixed md:sticky top-0 left-0 h-screen z-50 bg-[#0f0f0f] border-r border-zinc-800/90 flex flex-col justify-between transition-all duration-300 ease-in-out shrink-0 ${
          isOpen
            ? 'w-64 translate-x-0 shadow-2xl shadow-black/80'
            : '-translate-x-full md:translate-x-0 md:w-0 md:border-r-0 md:overflow-hidden md:p-0'
        }`}
      >
        <div className={`flex flex-col h-full ${isOpen ? 'w-64' : 'w-64 opacity-0 pointer-events-none md:w-0'}`}>
          {/* Top Brand & Header */}
          <div className="p-4 sm:p-5 border-b border-zinc-850 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-red-600 to-red-700 flex items-center justify-center shadow-lg shadow-red-600/40 text-white font-black">
                <Flame className="w-5 h-5 fill-white" />
              </div>
              <div>
                <h1 className="text-base font-black tracking-wider text-white flex items-center gap-1">
                  NUTRITRACK
                </h1>
                <span className="text-[10px] uppercase font-extrabold tracking-widest text-red-500">
                  Daily Macro OS
                </span>
              </div>
            </div>

            {/* Close / Hide Button */}
            <button
              onClick={onToggle}
              className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer"
              title="Hide Navigation Bar"
              aria-label="Hide navigation bar"
            >
              <PanelLeftClose className="w-4 h-4" />
            </button>
          </div>

          {/* User Status Bar */}
          <div className="px-4 py-3 bg-zinc-950/90 border-b border-zinc-855 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-red-600/30 text-red-400 border border-red-500/40 flex items-center justify-center font-bold text-[10px]">
                {currentUserName.slice(0, 1).toUpperCase()}
              </div>
              <span className="text-xs font-bold text-zinc-200 truncate max-w-[110px]">
                {currentUserName}
              </span>
            </div>
            <span className={`text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded border ${isPro ? 'bg-red-950 text-red-400 border-red-800' : 'bg-zinc-850 text-zinc-400 border-zinc-750'}`}>
              {isPro ? 'PRO $20' : 'FREE'}
            </span>
          </div>

          {/* Navigation Links */}
          <div className="flex-1 p-3.5 space-y-1.5 overflow-y-auto">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              if (item.isPrimaryAction) {
                return (
                  <button
                    key={item.id}
                    id={`sidebar-nav-${item.id}`}
                    onClick={() => {
                      onSelectTab(item.id);
                    }}
                    className={`w-full my-2 flex items-center justify-between px-3.5 py-2.5 rounded-xl font-black text-xs transition-all cursor-pointer ${
                      isActive
                        ? 'bg-red-600 text-white shadow-lg shadow-red-600/40 ring-2 ring-red-500'
                        : 'bg-gradient-to-r from-red-600 to-red-700 text-white hover:from-red-500 hover:to-red-600 shadow-md shadow-red-600/20'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className="w-4 h-4" />
                      <span>{item.label}</span>
                    </div>
                    <span className="text-[10px] uppercase font-black px-1.5 py-0.5 bg-black/30 rounded">
                      + Add
                    </span>
                  </button>
                );
              }

              return (
                <button
                  key={item.id}
                  id={`sidebar-nav-${item.id}`}
                  onClick={() => {
                    onSelectTab(item.id);
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-zinc-850 text-white border border-red-600/80 shadow-md text-red-400'
                      : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-red-500' : item.id === 'weekly_intake' ? 'text-red-400' : 'text-zinc-400'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span
                      className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                        isActive
                          ? 'bg-red-950 text-red-400 border border-red-800'
                          : item.id === 'weekly_intake' && !isPro
                          ? 'bg-red-950/60 text-red-400 border border-red-900'
                          : 'bg-zinc-900 text-zinc-400'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Quick Active Goal Status Card */}
          <div className="p-3.5 border-t border-zinc-850 bg-zinc-950/80 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-zinc-400">Target Calories:</span>
              <span className="font-extrabold text-white">
                {activePreset.calories} <span className="text-[10px] text-zinc-400">kcal</span>
              </span>
            </div>

            {/* Mini Progress Bar */}
            <div className="space-y-1">
              <div className="flex justify-between text-[11px]">
                <span className="text-zinc-400 font-medium">Logged:</span>
                <span className={isOverBudget ? 'text-red-400 font-bold' : 'text-zinc-200 font-bold'}>
                  {consumedCalories} kcal
                </span>
              </div>
              <div className="h-1.5 w-full bg-zinc-900 rounded-full overflow-hidden border border-zinc-800">
                <div
                  className={`h-full transition-all duration-300 ${
                    isOverBudget ? 'bg-red-500 shadow-sm shadow-red-500' : 'bg-red-600'
                  }`}
                  style={{ width: `${Math.min(100, (consumedCalories / activePreset.calories) * 100)}%` }}
                />
              </div>
            </div>

            <button
              onClick={onOpenGoalModal}
              className="w-full py-1.5 text-[11px] font-bold text-red-400 hover:text-white bg-zinc-900 hover:bg-zinc-800 rounded-lg border border-zinc-800 hover:border-red-600 transition-colors flex items-center justify-center gap-1 cursor-pointer"
            >
              <Sliders className="w-3 h-3 text-red-500" />
              <span>Configure Preset</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
