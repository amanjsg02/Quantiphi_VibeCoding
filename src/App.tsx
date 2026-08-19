import React, { useState, useEffect, useMemo } from 'react';
import {
  FitnessGoal,
  MealCategory,
  LoggedMeal,
  GoalPreset,
  UserProfile,
  NotificationItem,
} from './types';
import { DEFAULT_GOAL_PRESETS, INITIAL_SAMPLE_MEALS } from './data/foodDatabase';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { GoalToggle } from './components/GoalToggle';
import { CalorieBudgetBar } from './components/CalorieBudgetBar';
import { MacroMeters } from './components/MacroMeters';
import { LoggingPanel } from './components/LoggingPanel';
import { MealList } from './components/MealList';
import { WarningModal } from './components/WarningModal';
import { GoalConfigModal } from './components/GoalConfigModal';
import { FoodDatabaseView } from './components/FoodDatabaseView';
import { UserLoginModal } from './components/UserLoginModal';

export default function App() {
  // Navigation State
  const [activeTab, setActiveTab] = useState<'dashboard' | 'food_db' | 'goals' | 'history'>('dashboard');

  // Search filter
  const [searchQuery, setSearchQuery] = useState('');

  // Selected Category for logging
  const [activeLoggingCategory, setActiveLoggingCategory] = useState<MealCategory>('breakfast');

  // User Profile & Presets
  const [user, setUser] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('nutritrack_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return {
      name: 'Alex Rivera',
      email: 'alex.rivera@fitness.io',
      avatarUrl: '',
      currentGoal: 'weight_loss',
      presets: DEFAULT_GOAL_PRESETS,
    };
  });

  // Current Fitness Goal
  const [currentGoal, setCurrentGoal] = useState<FitnessGoal>(user.currentGoal || 'weight_loss');

  // Goal Presets
  const [presets, setPresets] = useState<Record<FitnessGoal, GoalPreset>>(user.presets || DEFAULT_GOAL_PRESETS);

  // Logged Meals
  const [meals, setMeals] = useState<LoggedMeal[]>(() => {
    const saved = localStorage.getItem('nutritrack_meals');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return INITIAL_SAMPLE_MEALS;
  });

  // Notifications State
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: 'notif_1',
      title: 'Welcome to NutriTrack',
      message: 'Your daily targets are active. Log meals or switch goals seamlessly.',
      time: 'Just now',
      type: 'info',
      read: false,
    },
  ]);

  // Modals
  const [isWarningModalOpen, setIsWarningModalOpen] = useState(false);
  const [isGoalConfigModalOpen, setIsGoalConfigModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  // Active preset
  const activePreset = presets[currentGoal] || DEFAULT_GOAL_PRESETS[currentGoal];

  // Calculated Aggregate Nutrition
  const aggregates = useMemo(() => {
    const totalCalories = meals.reduce((sum, m) => sum + m.calories, 0);
    const totalProtein = Math.round(meals.reduce((sum, m) => sum + m.protein, 0) * 10) / 10;
    const totalCarbs = Math.round(meals.reduce((sum, m) => sum + m.carbs, 0) * 10) / 10;
    const totalFat = Math.round(meals.reduce((sum, m) => sum + m.fat, 0) * 10) / 10;

    return {
      calories: totalCalories,
      protein: totalProtein,
      carbs: totalCarbs,
      fat: totalFat,
    };
  }, [meals]);

  const isOverBudget = aggregates.calories > activePreset.calories;

  // Persist State to LocalStorage
  useEffect(() => {
    localStorage.setItem(
      'nutritrack_user',
      JSON.stringify({ ...user, currentGoal, presets })
    );
  }, [user, currentGoal, presets]);

  useEffect(() => {
    localStorage.setItem('nutritrack_meals', JSON.stringify(meals));
  }, [meals]);

  // Goal Switch Handler (Feature A)
  const handleSelectGoal = (newGoal: FitnessGoal) => {
    setCurrentGoal(newGoal);
    const newPreset = presets[newGoal];

    // Add Notification
    setNotifications((prev) => [
      {
        id: `notif_${Date.now()}`,
        title: `Goal Switched to ${newPreset.name}`,
        message: `Daily budget updated to ${newPreset.calories} kcal (P: ${newPreset.protein}g, C: ${newPreset.carbs}g, F: ${newPreset.fat}g).`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        type: 'info',
        read: false,
      },
      ...prev,
    ]);

    // Check if new goal makes intake exceeded
    if (aggregates.calories > newPreset.calories) {
      setIsWarningModalOpen(true);
    }
  };

  // Add Logged Meal (Feature C & Dynamic Feedback Trigger)
  const handleAddMeal = (mealData: Omit<LoggedMeal, 'id' | 'loggedAt'>) => {
    const newMeal: LoggedMeal = {
      ...mealData,
      id: `meal_${Date.now()}`,
      loggedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const nextTotalCalories = aggregates.calories + newMeal.calories;
    const wasAlreadyOver = aggregates.calories > activePreset.calories;

    setMeals((prev) => [newMeal, ...prev]);

    // Trigger Warning Modal if this addition breaches the threshold
    if (nextTotalCalories > activePreset.calories && !wasAlreadyOver) {
      setIsWarningModalOpen(true);
      setNotifications((prev) => [
        {
          id: `notif_${Date.now()}`,
          title: 'Daily Budget Exceeded!',
          message: `Your aggregate intake (${nextTotalCalories} kcal) exceeded your target limit of ${activePreset.calories} kcal.`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          type: 'warning',
          read: false,
        },
        ...prev,
      ]);
    }
  };

  // Delete Meal (Feature D)
  const handleDeleteMeal = (id: string) => {
    const itemToDelete = meals.find((m) => m.id === id);
    setMeals((prev) => prev.filter((m) => m.id !== id));

    if (itemToDelete) {
      setNotifications((prev) => [
        {
          id: `notif_${Date.now()}`,
          title: 'Meal Deleted',
          message: `Removed ${itemToDelete.name} (-${itemToDelete.calories} kcal). Restored remaining budget.`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          type: 'success',
          read: false,
        },
        ...prev,
      ]);
    }
  };

  // Undo the last logged meal
  const handleUndoLastMeal = () => {
    if (meals.length > 0) {
      handleDeleteMeal(meals[0].id);
    }
  };

  // Filtered Meals by Header Search Query
  const displayedMeals = useMemo(() => {
    if (!searchQuery.trim()) return meals;
    const q = searchQuery.toLowerCase();
    return meals.filter(
      (m) =>
        m.name.toLowerCase().includes(q) ||
        m.mealCategory.toLowerCase().includes(q) ||
        m.calories.toString().includes(q)
    );
  }, [meals, searchQuery]);

  return (
    <div className="min-h-screen bg-[#141414] flex flex-col md:flex-row text-zinc-100 antialiased font-sans selection:bg-red-600 selection:text-white">
      {/* Left Navigation Bar (Netflix Dark Theme) */}
      <Sidebar
        activeTab={activeTab}
        onSelectTab={(tab) => {
          if (tab === 'goals') {
            setIsGoalConfigModalOpen(true);
          } else {
            setActiveTab(tab);
          }
        }}
        currentGoal={currentGoal}
        activePreset={activePreset}
        consumedCalories={aggregates.calories}
        isOverBudget={isOverBudget}
        onOpenGoalModal={() => setIsGoalConfigModalOpen(true)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <Header
          user={user}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          notifications={notifications}
          onClearNotifications={() => setNotifications([])}
          onOpenLoginModal={() => setIsLoginModalOpen(true)}
          onOpenGoalModal={() => setIsGoalConfigModalOpen(true)}
        />

        {/* Dynamic Page Container */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-6">
          {activeTab === 'dashboard' || activeTab === 'history' ? (
            <>
              {/* Feature A: Fitness Goal Switcher */}
              <GoalToggle
                currentGoal={currentGoal}
                presets={presets}
                onSelectGoal={handleSelectGoal}
                onOpenConfigModal={() => setIsGoalConfigModalOpen(true)}
              />

              {/* Feature B: Visual Dashboard & Dynamic Feedback */}
              <div className="grid grid-cols-1 gap-6">
                {/* 1. Calorie Budget Bar */}
                <CalorieBudgetBar
                  consumedCalories={aggregates.calories}
                  activePreset={activePreset}
                />

                {/* 2. Macro Meters */}
                <MacroMeters
                  consumedMacros={aggregates}
                  activePreset={activePreset}
                />
              </div>

              {/* Search active notice */}
              {searchQuery && (
                <div className="p-3.5 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-zinc-300 flex items-center justify-between shadow-lg">
                  <span>
                    Filtering logs matching: <strong className="text-white">"{searchQuery}"</strong> ({displayedMeals.length} found)
                  </span>
                  <button
                    onClick={() => setSearchQuery('')}
                    className="font-bold text-red-400 hover:text-red-300 hover:underline cursor-pointer"
                  >
                    Clear Filter
                  </button>
                </div>
              )}

              {/* Feature C: Food Logging Panel */}
              <LoggingPanel
                onAddMeal={handleAddMeal}
                selectedCategory={activeLoggingCategory}
                onSelectCategory={setActiveLoggingCategory}
              />

              {/* Feature D: Daily History & Meal Management */}
              <MealList
                meals={displayedMeals}
                onDeleteMeal={handleDeleteMeal}
                onQuickAddForCategory={(cat) => {
                  setActiveLoggingCategory(cat);
                  document.getElementById('logging-panel-card')?.scrollIntoView({ behavior: 'smooth' });
                }}
              />
            </>
          ) : (
            /* Food Database View Tab */
            <FoodDatabaseView
              onQuickLog={(meal) => {
                handleAddMeal(meal);
                setActiveTab('dashboard');
              }}
              activeMealCategory={activeLoggingCategory}
            />
          )}
        </main>
      </div>

      {/* Warning Modal (Budget Exceeded) */}
      <WarningModal
        isOpen={isWarningModalOpen}
        onClose={() => setIsWarningModalOpen(false)}
        consumedCalories={aggregates.calories}
        activePreset={activePreset}
        onOpenGoalConfig={() => {
          setIsWarningModalOpen(false);
          setIsGoalConfigModalOpen(true);
        }}
        onUndoLastMeal={handleUndoLastMeal}
      />

      {/* Goal Configuration Modal */}
      <GoalConfigModal
        isOpen={isGoalConfigModalOpen}
        onClose={() => setIsGoalConfigModalOpen(false)}
        presets={presets}
        onSavePresets={(newPresets) => {
          setPresets(newPresets);
          setUser((prev) => ({ ...prev, presets: newPresets }));
        }}
        currentGoal={currentGoal}
      />

      {/* User Login & Account Switcher Modal */}
      <UserLoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        currentUser={user}
        onUpdateUser={(updated) => {
          setUser((prev) => ({ ...prev, ...updated }));
        }}
      />
    </div>
  );
}
