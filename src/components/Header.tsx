import React, { useState, useRef, useEffect } from 'react';
import {
  Search,
  Bell,
  User,
  ChevronDown,
  CheckCircle2,
  AlertTriangle,
  Info,
  Calendar,
  LogOut,
  Settings,
  X,
} from 'lucide-react';
import { UserProfile, NotificationItem } from '../types';

interface HeaderProps {
  user: UserProfile;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  notifications: NotificationItem[];
  onClearNotifications: () => void;
  onOpenLoginModal: () => void;
  onOpenGoalModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  user,
  searchQuery,
  onSearchChange,
  notifications,
  onClearNotifications,
  onOpenLoginModal,
  onOpenGoalModal,
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const notificationRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const todayFormatted = new Date().toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });

  return (
    <header
      id="app-header"
      className="h-18 bg-[#141414]/95 backdrop-blur-md border-b border-zinc-800/80 px-6 flex items-center justify-between sticky top-0 z-30 shadow-md shadow-black/40"
    >
      {/* Left: Search Bar */}
      <div className="flex items-center gap-4 flex-1 max-w-md">
        <div className="relative w-full">
          <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            id="header-search-input"
            type="text"
            placeholder="Search foods, meals, calories, protein..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-9 py-2 bg-zinc-900/90 border border-zinc-700/80 rounded-xl text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-red-600 focus:bg-zinc-900 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-200"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-4">
        {/* Date Stamp */}
        <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 bg-zinc-900 border border-zinc-800 rounded-xl text-xs font-semibold text-zinc-300">
          <Calendar className="w-3.5 h-3.5 text-red-500" />
          <span>{todayFormatted}</span>
        </div>

        {/* Notification Bell with Dropdown */}
        <div className="relative" ref={notificationRef}>
          <button
            id="notification-bell-btn"
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2.5 rounded-xl border border-zinc-800 bg-zinc-900/80 text-zinc-300 hover:text-white hover:border-zinc-700 hover:bg-zinc-800 transition-colors focus:outline-none focus:ring-2 focus:ring-red-600"
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-600 text-white text-[10px] font-extrabold rounded-full flex items-center justify-center ring-2 ring-[#141414] animate-pulse">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Notifications Flyout */}
          {showNotifications && (
            <div
              id="notifications-flyout"
              className="absolute right-0 mt-2 w-80 sm:w-96 bg-zinc-900 rounded-2xl shadow-2xl border border-zinc-800 p-3 z-50 animate-in fade-in zoom-in-95 duration-150 text-zinc-100"
            >
              <div className="flex items-center justify-between px-3 py-2 border-b border-zinc-800">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-white">Notifications</span>
                  <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-red-950 text-red-300 border border-red-800/60">
                    {notifications.length} Total
                  </span>
                </div>
                {notifications.length > 0 && (
                  <button
                    onClick={onClearNotifications}
                    className="text-xs text-red-500 hover:text-red-400 font-bold"
                  >
                    Clear All
                  </button>
                )}
              </div>

              <div className="max-h-72 overflow-y-auto divide-y divide-zinc-800/80 mt-1">
                {notifications.length === 0 ? (
                  <div className="py-8 text-center text-xs text-zinc-500">
                    No new notifications. Everything is on track!
                  </div>
                ) : (
                  notifications.map((n) => (
                    <div key={n.id} className="p-3 hover:bg-zinc-800/60 rounded-xl transition-colors">
                      <div className="flex items-start gap-2.5">
                        {n.type === 'warning' ? (
                          <AlertTriangle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                        ) : n.type === 'success' ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                        ) : (
                          <Info className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                        )}
                        <div className="flex-1">
                          <div className="text-xs font-bold text-white flex items-center justify-between">
                            <span>{n.title}</span>
                            <span className="text-[10px] font-normal text-zinc-500">{n.time}</span>
                          </div>
                          <p className="text-xs text-zinc-400 mt-0.5 leading-relaxed">{n.message}</p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Login / Profile Badge */}
        <div className="relative" ref={userMenuRef}>
          <button
            id="user-profile-menu-btn"
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-2.5 pl-2 pr-3 py-1.5 rounded-xl border border-zinc-800 bg-zinc-900/90 hover:border-zinc-700 hover:bg-zinc-800 transition-colors focus:outline-none focus:ring-2 focus:ring-red-600"
          >
            <div className="w-8 h-8 rounded-lg bg-red-600 text-white font-extrabold text-xs flex items-center justify-center shadow-md shadow-red-600/30">
              {user.name.slice(0, 2).toUpperCase()}
            </div>
            <div className="text-left hidden sm:block">
              <div className="text-xs font-bold text-white leading-tight flex items-center gap-1.5">
                {user.name}
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 inline-block ring-2 ring-red-950" />
              </div>
              <div className="text-[10px] text-zinc-400">{user.email}</div>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-zinc-400" />
          </button>

          {/* User Profile Menu */}
          {showUserMenu && (
            <div
              id="user-profile-flyout"
              className="absolute right-0 mt-2 w-60 bg-zinc-900 rounded-2xl shadow-2xl border border-zinc-800 p-2 z-50 animate-in fade-in zoom-in-95 duration-150 text-zinc-100"
            >
              <div className="p-3 bg-zinc-950 rounded-xl mb-2 border border-zinc-800">
                <div className="text-xs font-bold text-white">{user.name}</div>
                <div className="text-[11px] text-zinc-400 truncate">{user.email}</div>
                <div className="mt-2 text-[10px] font-extrabold uppercase tracking-wider text-red-400 bg-red-950/80 px-2 py-0.5 rounded border border-red-800/50 inline-block">
                  Current: {user.currentGoal.replace('_', ' ')}
                </div>
              </div>

              <button
                onClick={() => {
                  setShowUserMenu(false);
                  onOpenGoalModal();
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-zinc-300 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors"
              >
                <Settings className="w-4 h-4 text-zinc-400" />
                <span>Customize Target Presets</span>
              </button>

              <button
                onClick={() => {
                  setShowUserMenu(false);
                  onOpenLoginModal();
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-zinc-300 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors"
              >
                <User className="w-4 h-4 text-zinc-400" />
                <span>Switch User Account</span>
              </button>

              <div className="border-t border-zinc-800 mt-1 pt-1">
                <button
                  onClick={() => {
                    setShowUserMenu(false);
                    onOpenLoginModal();
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-red-400 hover:bg-red-950/50 hover:text-red-300 rounded-lg transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Log Out / Change Profile</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
