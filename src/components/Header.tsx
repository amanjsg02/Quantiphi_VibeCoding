import React, { useState, useRef, useEffect } from 'react';
import {
  Search,
  Bell,
  User,
  Sliders,
  ChevronDown,
  Sparkles,
  Flame,
  CheckCircle2,
  AlertTriangle,
  LogIn,
  LogOut,
  PanelLeft,
  Users,
  Crown,
  TrendingUp,
  X,
  Activity,
} from 'lucide-react';
import { UserProfile, NotificationItem, FitnessGoal } from '../types';

interface HeaderProps {
  users: UserProfile[];
  currentUser: UserProfile | null;
  isLoggedIn: boolean;
  onSelectUser: (userId: string) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  notifications: NotificationItem[];
  onClearNotifications: () => void;
  onOpenLoginModal: () => void;
  onOpenGoalModal: () => void;
  onOpenSubscriptionPage: () => void;
  onToggleSidebar: () => void;
  onLogout: () => void;
  isSidebarOpen: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  users,
  currentUser,
  isLoggedIn,
  onSelectUser,
  searchQuery,
  onSearchChange,
  notifications,
  onClearNotifications,
  onOpenLoginModal,
  onOpenGoalModal,
  onOpenSubscriptionPage,
  onToggleSidebar,
  onLogout,
  isSidebarOpen,
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);

  const searchInputRef = useRef<HTMLInputElement>(null);

  const unreadCount = notifications.filter((n) => !n.read).length;
  const isPro = currentUser?.subscriptionTier === 'pro';

  // Auto-focus search input when expanded
  useEffect(() => {
    if (isSearchExpanded && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchExpanded]);

  return (
    <header className="sticky top-0 z-30 bg-[#141414]/95 backdrop-blur-md border-b border-zinc-800/90 px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between gap-3 shadow-md">
      {/* Left: Sidebar Slide Toggle & MacroPulse Brand Name */}
      <div className="flex items-center gap-3">
        {/* Toggle Sidebar Button */}
        <button
          id="toggle-sidebar-btn"
          onClick={onToggleSidebar}
          className="p-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-750 hover:border-red-600/60 transition-all flex items-center gap-1.5 shrink-0 shadow-sm cursor-pointer"
          title={isSidebarOpen ? 'Slide out navigation bar' : 'Slide in navigation bar'}
          aria-label="Toggle navigation bar"
        >
          <PanelLeft className={`w-4 h-4 ${isSidebarOpen ? 'text-red-500' : 'text-zinc-400'}`} />
          <span className="text-xs font-bold hidden sm:inline">
            {isSidebarOpen ? 'Hide' : 'Menu'}
          </span>
        </button>

        {/* MacroPulse Brand Beside Menu Option */}
        <div id="macropulse-header-brand" className="flex items-center gap-2 select-none group cursor-pointer">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-red-600 to-red-700 flex items-center justify-center shadow-lg shadow-red-600/30 text-white transition-transform group-hover:scale-105">
            <Activity className="w-4 h-4 text-white animate-pulse" />
          </div>
          <div className="flex flex-col">
            <span className="text-base sm:text-lg font-black tracking-tight leading-none text-white font-sans flex items-center">
              Macro<span className="text-red-500 font-black">Pulse</span>
            </span>
            <span className="text-[9px] font-extrabold uppercase tracking-widest text-zinc-400 hidden sm:block">
              Precision Nutrition
            </span>
          </div>
        </div>
      </div>

      {/* Right Controls: Expandable Search Icon, Subscription Icon, Notifications & User Auth */}
      <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
        {/* Search Icon & Expandable Bar */}
        <div className="relative flex items-center">
          {isSearchExpanded ? (
            <div className="relative flex items-center animate-in fade-in zoom-in-95 duration-150">
              <input
                ref={searchInputRef}
                id="header-expanded-search-input"
                type="text"
                placeholder="Search meals, macros, categories..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-48 sm:w-72 pl-8 pr-7 py-1.5 bg-zinc-900 border border-red-600/80 rounded-xl text-xs text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-red-600/30 shadow-lg"
              />
              <Search className="w-3.5 h-3.5 text-red-500 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <button
                type="button"
                onClick={() => {
                  setIsSearchExpanded(false);
                  onSearchChange('');
                }}
                className="p-1 text-zinc-400 hover:text-white absolute right-1.5 top-1/2 -translate-y-1/2 cursor-pointer"
                title="Close Search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              id="header-search-icon-btn"
              onClick={() => setIsSearchExpanded(true)}
              className={`p-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 border transition-all relative cursor-pointer ${
                searchQuery
                  ? 'border-red-600 text-red-400'
                  : 'border-zinc-800 text-zinc-300 hover:text-white'
              }`}
              title="Search logged meals"
              aria-label="Open search bar"
            >
              <Search className="w-4 h-4" />
              {searchQuery && (
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-600 rounded-full" />
              )}
            </button>
          )}
        </div>

        {/* Subscription Icon / Button in Header */}
        <button
          id="header-subscription-btn"
          onClick={onOpenSubscriptionPage}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-extrabold transition-all cursor-pointer shadow-sm ${
            isPro
              ? 'bg-gradient-to-r from-red-950 to-zinc-900 text-red-400 border-red-800 hover:border-red-600'
              : 'bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border-zinc-750 hover:border-red-600'
          }`}
          title="Manage Subscription & Pricing Plans"
        >
          <Crown className={`w-4 h-4 ${isPro ? 'text-red-500 fill-red-500/30' : 'text-zinc-400 hover:text-red-400'}`} />
          <span className="hidden md:inline">{isPro ? 'Pro $20/mo' : 'Plans'}</span>
        </button>

        {/* Notification Bell */}
        <div className="relative">
          <button
            id="notification-bell-btn"
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowUserMenu(false);
            }}
            className="p-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-800 transition-colors relative cursor-pointer"
            aria-label="View notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-600 text-white text-[10px] font-black rounded-full flex items-center justify-center animate-pulse shadow-sm shadow-red-600/60">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <div
              id="notifications-dropdown"
              className="absolute right-0 mt-2 w-80 sm:w-96 bg-zinc-900 rounded-2xl shadow-2xl border border-zinc-800 p-4 z-50 animate-in fade-in zoom-in-95 duration-150"
            >
              <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
                <div className="flex items-center gap-2">
                  <Bell className="w-4 h-4 text-red-500" />
                  <span className="font-bold text-sm text-white">Live Activity Notifications</span>
                </div>
                {notifications.length > 0 && (
                  <button
                    onClick={onClearNotifications}
                    className="text-[11px] font-bold text-red-400 hover:text-red-300 hover:underline cursor-pointer"
                  >
                    Clear All
                  </button>
                )}
              </div>

              <div className="max-h-72 overflow-y-auto divide-y divide-zinc-800 mt-2">
                {notifications.length === 0 ? (
                  <div className="py-6 text-center text-xs text-zinc-500">
                    No active notifications right now.
                  </div>
                ) : (
                  notifications.map((n) => (
                    <div key={n.id} className="py-3 text-xs space-y-1">
                      <div className="flex items-start justify-between gap-2">
                        <span className="font-bold text-white flex items-center gap-1.5">
                          {n.type === 'warning' && <AlertTriangle className="w-3.5 h-3.5 text-red-500" />}
                          {n.type === 'success' && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                          {n.type === 'info' && <Flame className="w-3.5 h-3.5 text-red-500" />}
                          {n.title}
                        </span>
                        <span className="text-[10px] text-zinc-500">{n.time}</span>
                      </div>
                      <p className="text-[11px] text-zinc-400 leading-relaxed">{n.message}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Authentication & Profile / Login-Logout Controls */}
        {isLoggedIn && currentUser ? (
          <div className="relative">
            <button
              id="user-profile-menu-btn"
              onClick={() => {
                setShowUserMenu(!showUserMenu);
                setShowNotifications(false);
              }}
              className="flex items-center gap-2 pl-2 pr-3 py-1.5 bg-zinc-900 hover:bg-zinc-800 rounded-xl border border-zinc-800 text-left transition-colors cursor-pointer"
              aria-label="User profile and switcher"
            >
              <div className="w-7 h-7 rounded-lg bg-red-600 text-white font-black text-xs flex items-center justify-center shadow-md shadow-red-600/30">
                {currentUser.name.slice(0, 2).toUpperCase()}
              </div>
              <div className="hidden sm:block">
                <div className="text-xs font-bold text-white leading-tight">{currentUser.name}</div>
                <div className="text-[10px] text-red-400 font-bold capitalize">
                  {currentUser.currentGoal.replace('_', ' ')}
                </div>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-zinc-400" />
            </button>

            {/* User Switcher & Logout Dropdown */}
            {showUserMenu && (
              <div
                id="user-profile-dropdown"
                className="absolute right-0 mt-2 w-72 bg-zinc-900 rounded-2xl shadow-2xl border border-zinc-800 p-3.5 z-50 animate-in fade-in zoom-in-95 duration-150 space-y-3"
              >
                <div className="pb-2.5 border-b border-zinc-800 flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-white">{currentUser.name}</div>
                    <div className="text-[11px] text-zinc-400 truncate max-w-[160px]">{currentUser.email}</div>
                  </div>
                  <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded ${isPro ? 'bg-red-950 text-red-400 border border-red-800' : 'bg-zinc-800 text-zinc-400'}`}>
                    {isPro ? 'PRO $20' : 'FREE'}
                  </span>
                </div>

                {/* Multi-User Switcher List */}
                <div className="space-y-1">
                  <div className="text-[10px] font-extrabold uppercase tracking-wider text-zinc-400 px-2 flex items-center gap-1">
                    <Users className="w-3 h-3 text-red-500" />
                    <span>Switch Active Account</span>
                  </div>
                  {users.map((u) => {
                    const isSelected = u.id === currentUser.id;
                    return (
                      <button
                        key={u.id}
                        onClick={() => {
                          onSelectUser(u.id);
                          setShowUserMenu(false);
                        }}
                        className={`w-full p-2 rounded-xl text-left text-xs flex items-center justify-between transition-colors cursor-pointer ${
                          isSelected
                            ? 'bg-red-950/80 border border-red-800 text-white font-bold'
                            : 'hover:bg-zinc-850 text-zinc-300'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-md bg-zinc-800 text-red-400 flex items-center justify-center font-bold text-[10px]">
                            {u.name.slice(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <div className="text-xs text-white">{u.name}</div>
                            <div className="text-[10px] text-zinc-400">{u.currentGoal.replace('_', ' ')}</div>
                          </div>
                        </div>
                        {isSelected && (
                          <span className="text-[10px] font-extrabold text-red-400 bg-red-950 px-1.5 py-0.5 rounded border border-red-800">
                            Active
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>

                <div className="pt-2 border-t border-zinc-800 space-y-1">
                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      onOpenSubscriptionPage();
                    }}
                    className="w-full p-2 text-xs font-bold text-red-400 hover:text-red-300 hover:bg-zinc-800 rounded-xl flex items-center gap-2 transition-colors cursor-pointer"
                  >
                    <Crown className="w-3.5 h-3.5 text-red-500" />
                    <span>Subscription Plans ($20/mo Pro)</span>
                  </button>
                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      onOpenLoginModal();
                    }}
                    className="w-full p-2 text-xs font-bold text-zinc-300 hover:text-white hover:bg-zinc-800 rounded-xl flex items-center gap-2 transition-colors cursor-pointer"
                  >
                    <User className="w-3.5 h-3.5 text-zinc-400" />
                    <span>Manage / Register New Account</span>
                  </button>
                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      onOpenGoalModal();
                    }}
                    className="w-full p-2 text-xs font-bold text-zinc-300 hover:text-white hover:bg-zinc-800 rounded-xl flex items-center gap-2 transition-colors cursor-pointer"
                  >
                    <Sliders className="w-3.5 h-3.5 text-red-400" />
                    <span>Configure User Targets</span>
                  </button>

                  {/* Explicit Logout Button */}
                  <button
                    id="header-logout-menu-btn"
                    onClick={() => {
                      setShowUserMenu(false);
                      onLogout();
                    }}
                    className="w-full p-2 text-xs font-bold text-red-400 hover:text-white hover:bg-red-950/80 rounded-xl flex items-center gap-2 transition-colors cursor-pointer border border-transparent hover:border-red-800 mt-1"
                  >
                    <LogOut className="w-3.5 h-3.5 text-red-500" />
                    <span>Log Out of MacroPulse</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* When logged out: Prominent Login Button */
          <button
            id="header-login-btn"
            onClick={onOpenLoginModal}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs rounded-xl shadow-lg shadow-red-600/30 transition-all cursor-pointer"
          >
            <LogIn className="w-4 h-4" />
            <span>Sign In / Register</span>
          </button>
        )}
      </div>
    </header>
  );
};
