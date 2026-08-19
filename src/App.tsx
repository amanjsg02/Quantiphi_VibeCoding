import React, { useState, useEffect, useMemo } from 'react';
import {
  FitnessGoal,
  MealCategory,
  LoggedMeal,
  GoalPreset,
  UserProfile,
  NotificationItem,
  SubscriptionTier,
} from './types';
import { DEFAULT_GOAL_PRESETS, INITIAL_USERS, INITIAL_SAMPLE_MEALS } from './data/foodDatabase';
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
import { AddMealPage } from './components/AddMealPage';
import { SubscriptionPage } from './components/SubscriptionPage';
import { WeeklyIntakeView } from './components/WeeklyIntakeView';

export default function App() {
  // Navigation Tabs: dashboard, add_meal, weekly_intake, food_db, goals, history, subscription
  const [activeTab, setActiveTab] = useState<
    'dashboard' | 'add_meal' | 'weekly_intake' | 'food_db' | 'goals' | 'history' | 'subscription'
  >('dashboard');

  // Sliding Sidebar State
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Search filter
  const [searchQuery, setSearchQuery] = useState('');

  // Selected Category for quick logging
  const [activeLoggingCategory, setActiveLoggingCategory] = useState<MealCategory>('breakfast');

  // Multi-User Management with local persistence
  const [users, setUsers] = useState<UserProfile[]>(() => {
    const saved = localStorage.getItem('nutritrack_users_list');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return INITIAL_USERS;
  });

  const [activeUserId, setActiveUserId] = useState<string>(() => {
    const savedId = localStorage.getItem('nutritrack_active_user_id');
    if (savedId && users.some((u) => u.id === savedId)) {
      return savedId;
    }
    return users[0]?.id || 'user_alex';
  });

  // Current active user object
  const currentUser = useMemo(() => {
    return users.find((u) => u.id === activeUserId) || users[0];
  }, [users, activeUserId]);

  // Current Fitness Goal & Presets for active user
  const currentGoal = currentUser.currentGoal || 'weight_loss';
  const presets = currentUser.presets || DEFAULT_GOAL_PRESETS;
  const activePreset = presets[currentGoal] || DEFAULT_GOAL_PRESETS[currentGoal];

  // Logged Meals across all users
  const [meals, setMeals] = useState<LoggedMeal[]>(() => {
    const saved = localStorage.getItem('nutritrack_all_meals');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return INITIAL_SAMPLE_MEALS;
  });

  // Filter meals specifically for the currently active user
  const currentUserMeals = useMemo(() => {
    return meals.filter((m) => m.userId === currentUser.id);
  }, [meals, currentUser.id]);

  // Helper to calculate total calories for any user
  const getUserTotalCalories = (userId: string) => {
    return meals
      .filter((m) => m.userId === userId)
      .reduce((sum, m) => sum + m.calories, 0);
  };

  // Notifications State
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: 'notif_welcome',
      title: 'Welcome to NutriTrack',
      message: `Active profile: ${currentUser.name}. Tracker calibrated to ${activePreset.name}.`,
      time: 'Just now',
      type: 'info',
      read: false,
    },
  ]);

  // Modals
  const [isWarningModalOpen, setIsWarningModalOpen] = useState(false);
  const [isGoalConfigModalOpen, setIsGoalConfigModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  // Calculated Aggregate Nutrition for the Active User (Auto-synced across all actions)
  const aggregates = useMemo(() => {
    const totalCalories = currentUserMeals.reduce((sum, m) => sum + m.calories, 0);
    const totalProtein = Math.round(currentUserMeals.reduce((sum, m) => sum + m.protein, 0) * 10) / 10;
    const totalCarbs = Math.round(currentUserMeals.reduce((sum, m) => sum + m.carbs, 0) * 10) / 10;
    const totalFat = Math.round(currentUserMeals.reduce((sum, m) => sum + m.fat, 0) * 10) / 10;

    return {
      calories: totalCalories,
      protein: totalProtein,
      carbs: totalCarbs,
      fat: totalFat,
    };
  }, [currentUserMeals]);

  const isOverBudget = aggregates.calories > activePreset.calories;

  // Persist State to LocalStorage synchronously
  useEffect(() => {
    localStorage.setItem('nutritrack_users_list', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem('nutritrack_active_user_id', activeUserId);
  }, [activeUserId]);

  useEffect(() => {
    localStorage.setItem('nutritrack_all_meals', JSON.stringify(meals));
  }, [meals]);

  // Goal Switch Handler for active user
  const handleSelectGoal = (newGoal: FitnessGoal) => {
    const updatedUsers = users.map((u) => {
      if (u.id === currentUser.id) {
        return { ...u, currentGoal: newGoal };
      }
      return u;
    });
    setUsers(updatedUsers);

    const newPreset = presets[newGoal];

    // Notification
    setNotifications((prev) => [
      {
        id: `notif_${Date.now()}`,
        title: `${currentUser.name}: Goal Switched to ${newPreset.name}`,
        message: `Daily budget updated to ${newPreset.calories} kcal (P: ${newPreset.protein}g, C: ${newPreset.carbs}g, F: ${newPreset.fat}g).`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        type: 'info',
        read: false,
      },
      ...prev,
    ]);

    if (aggregates.calories > newPreset.calories) {
      setIsWarningModalOpen(true);
    }
  };

  // Add Logged Meal for a specific user with immediate reactive synchronization
  const handleAddMealForUser = (targetUserId: string, mealData: Omit<LoggedMeal, 'id' | 'loggedAt' | 'userId'>) => {
    const targetUser = users.find((u) => u.id === targetUserId) || currentUser;
    const newMeal: LoggedMeal = {
      ...mealData,
      userId: targetUserId,
      id: `meal_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      loggedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const targetUserMeals = meals.filter((m) => m.userId === targetUserId);
    const priorTotal = targetUserMeals.reduce((sum, m) => sum + m.calories, 0);
    const targetUserPreset = targetUser.presets[targetUser.currentGoal];
    const nextTotal = priorTotal + newMeal.calories;

    // Immediately update global meals list
    setMeals((prev) => [newMeal, ...prev]);

    // Check if target user is currently viewed and if limit breached
    if (nextTotal > targetUserPreset.calories) {
      if (targetUserId === currentUser.id) {
        setIsWarningModalOpen(true);
      }
      setNotifications((prev) => [
        {
          id: `notif_${Date.now()}`,
          title: `Budget Exceeded for ${targetUser.name}!`,
          message: `Intake reached ${nextTotal} kcal (Target limit: ${targetUserPreset.calories} kcal).`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          type: 'warning',
          read: false,
        },
        ...prev,
      ]);
    } else {
      setNotifications((prev) => [
        {
          id: `notif_${Date.now()}`,
          title: `Meal Synced: ${newMeal.name}`,
          message: `Logged to ${newMeal.mealCategory.toUpperCase()} (+${newMeal.calories} kcal). Live tracker updated.`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          type: 'success',
          read: false,
        },
        ...prev,
      ]);
    }
  };

  // Delete Meal
  const handleDeleteMeal = (id: string) => {
    const itemToDelete = meals.find((m) => m.id === id);
    setMeals((prev) => prev.filter((m) => m.id !== id));

    if (itemToDelete) {
      setNotifications((prev) => [
        {
          id: `notif_${Date.now()}`,
          title: 'Record Updated',
          message: `Removed ${itemToDelete.name} (-${itemToDelete.calories} kcal). Tracker restored.`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          type: 'success',
          read: false,
        },
        ...prev,
      ]);
    }
  };

  const handleUndoLastMeal = () => {
    if (currentUserMeals.length > 0) {
      handleDeleteMeal(currentUserMeals[0].id);
    }
  };

  // Subscription upgrade/switch handler
  const handleUpdateSubscription = (tier: SubscriptionTier) => {
    const updatedUsers = users.map((u) => {
      if (u.id === currentUser.id) {
        return { ...u, subscriptionTier: tier };
      }
      return u;
    });
    setUsers(updatedUsers);

    setNotifications((prev) => [
      {
        id: `notif_${Date.now()}`,
        title: tier === 'pro' ? 'Upgraded to Pro Athlete ($20/mo)!' : 'Switched to Free Tier',
        message:
          tier === 'pro'
            ? 'Weekly Intake Tracking, 7-day trend analytics, and unlimited athlete sync unlocked.'
            : 'Plan updated to Free Tier.',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        type: 'success',
        read: false,
      },
      ...prev,
    ]);
  };

  // Filtered meals by search query
  const displayedMeals = useMemo(() => {
    if (!searchQuery.trim()) return currentUserMeals;
    const q = searchQuery.toLowerCase();
    return currentUserMeals.filter(
      (m) =>
        m.name.toLowerCase().includes(q) ||
        m.mealCategory.toLowerCase().includes(q) ||
        m.calories.toString().includes(q)
    );
  }, [currentUserMeals, searchQuery]);

  return (
    <div className="min-h-screen bg-[#141414] flex text-zinc-100 antialiased font-sans selection:bg-red-600 selection:text-white">
      {/* Sliding & Collapsible Navigation Bar */}
      <Sidebar
        isOpen={isSidebarOpen}
        onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
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
        currentUserName={currentUser.name}
        subscriptionTier={currentUser.subscriptionTier}
      />

      {/* Main App Canvas */}
      <div className="flex-1 flex flex-col min-w-0 transition-all duration-300">
        {/* Sticky Header with Subscription Icon, Sidebar Slide Toggle, Search, + Add Meal, User Switcher */}
        <Header
          users={users}
          currentUser={currentUser}
          onSelectUser={(newUserId) => setActiveUserId(newUserId)}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          notifications={notifications}
          onClearNotifications={() => setNotifications([])}
          onOpenLoginModal={() => setIsLoginModalOpen(true)}
          onOpenGoalModal={() => setIsGoalConfigModalOpen(true)}
          onOpenAddMealPage={() => setActiveTab('add_meal')}
          onOpenSubscriptionPage={() => setActiveTab('subscription')}
          onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
          isSidebarOpen={isSidebarOpen}
        />

        {/* Dynamic Page Container */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-6">
          {activeTab === 'subscription' ? (
            /* Subscription Page: Free Tier vs $20/Month Pro */
            <SubscriptionPage
              currentUser={currentUser}
              onUpdateSubscription={handleUpdateSubscription}
              onNavigateToWeeklyIntake={() => setActiveTab('weekly_intake')}
              onBackToDashboard={() => setActiveTab('dashboard')}
            />
          ) : activeTab === 'weekly_intake' ? (
            /* Weekly Intake & Historical Trends View (Pro Feature) */
            <WeeklyIntakeView
              currentUser={currentUser}
              meals={currentUserMeals}
              activePreset={activePreset}
              onOpenSubscription={() => setActiveTab('subscription')}
            />
          ) : activeTab === 'add_meal' ? (
            /* Dedicated Add Meal Page for every user */
            <AddMealPage
              users={users}
              activeUserId={activeUserId}
              onSelectUser={setActiveUserId}
              onAddMealForUser={handleAddMealForUser}
              onBackToDashboard={() => setActiveTab('dashboard')}
              getUserTotalCalories={getUserTotalCalories}
              presets={presets}
            />
          ) : activeTab === 'dashboard' || activeTab === 'history' ? (
            <>
              {/* Active User Quick Switch & Plan Status Banner */}
              <div className="bg-zinc-900/90 rounded-2xl p-4 border border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-red-600 text-white font-black flex items-center justify-center shadow-lg shadow-red-600/30">
                    {currentUser.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-base font-extrabold text-white">{currentUser.name}'s Calorie Tracker</h2>
                      <span className="text-[10px] font-black uppercase tracking-wider text-red-400 bg-red-950 px-2 py-0.5 rounded border border-red-800/60">
                        {currentUser.currentGoal.replace('_', ' ')}
                      </span>
                      <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded border ${
                        currentUser.subscriptionTier === 'pro'
                          ? 'bg-red-950 text-red-400 border-red-800'
                          : 'bg-zinc-800 text-zinc-400 border-zinc-700'
                      }`}>
                        {currentUser.subscriptionTier === 'pro' ? 'Pro $20' : 'Free Plan'}
                      </span>
                    </div>
                    <p className="text-xs text-zinc-400">
                      Live sync active for {currentUser.email} • {currentUserMeals.length} records logged today
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setActiveTab('weekly_intake')}
                    className="px-3.5 py-2 bg-zinc-800 hover:bg-zinc-750 text-zinc-200 hover:text-white font-bold text-xs rounded-xl border border-zinc-700 transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>Weekly Trends</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('add_meal')}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs rounded-xl shadow-md shadow-red-600/30 transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>+ Add Meal for {currentUser.name.split(' ')[0]}</span>
                  </button>
                </div>
              </div>

              {/* Feature A: Fitness Goal Toggle */}
              <GoalToggle
                currentGoal={currentGoal}
                presets={presets}
                onSelectGoal={handleSelectGoal}
                onOpenConfigModal={() => setIsGoalConfigModalOpen(true)}
              />

              {/* Feature B: Visual Dashboard & Dynamic Live Feedback */}
              <div className="grid grid-cols-1 gap-6">
                <CalorieBudgetBar
                  consumedCalories={aggregates.calories}
                  activePreset={activePreset}
                />

                <MacroMeters
                  consumedMacros={aggregates}
                  activePreset={activePreset}
                />
              </div>

              {/* Search active notice */}
              {searchQuery && (
                <div className="p-3.5 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-zinc-300 flex items-center justify-between shadow-lg">
                  <span>
                    Filtering logs for {currentUser.name} matching: <strong className="text-white">"{searchQuery}"</strong> ({displayedMeals.length} found)
                  </span>
                  <button
                    onClick={() => setSearchQuery('')}
                    className="font-bold text-red-400 hover:text-red-300 hover:underline cursor-pointer"
                  >
                    Clear Filter
                  </button>
                </div>
              )}

              {/* Feature C: Food Logging Panel (Quick Inline with instant tracker synchronization) */}
              <LoggingPanel
                onAddMeal={(m) => handleAddMealForUser(currentUser.id, m)}
                selectedCategory={activeLoggingCategory}
                onSelectCategory={setActiveLoggingCategory}
              />

              {/* Feature D: Daily History & Meal Management for Current User */}
              <MealList
                meals={displayedMeals}
                onDeleteMeal={handleDeleteMeal}
                onQuickAddForCategory={(cat) => {
                  setActiveLoggingCategory(cat);
                  setActiveTab('add_meal');
                }}
              />
            </>
          ) : (
            /* Food Database View Tab */
            <FoodDatabaseView
              onQuickLog={(meal) => {
                handleAddMealForUser(currentUser.id, meal);
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
          const updatedUsers = users.map((u) => {
            if (u.id === currentUser.id) {
              return { ...u, presets: newPresets };
            }
            return u;
          });
          setUsers(updatedUsers);
        }}
        currentGoal={currentGoal}
      />

      {/* User Profiles & Account Switcher Modal */}
      <UserLoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        users={users}
        currentUser={currentUser}
        onUpdateUser={(updated) => {
          const updatedUsers = users.map((u) => {
            if (u.id === currentUser.id) {
              return { ...u, ...updated };
            }
            return u;
          });
          setUsers(updatedUsers);
        }}
        onAddNewUser={(newUser) => {
          setUsers((prev) => [...prev, newUser]);
        }}
        onSelectUser={(newUserId) => setActiveUserId(newUserId)}
      />
    </div>
  );
}
