import React, { useState } from 'react';
import {
  X,
  LogIn,
  UserPlus,
  Lock,
  Mail,
  User,
  Eye,
  EyeOff,
  Flame,
  CheckCircle2,
  AlertCircle,
  Dumbbell,
  Scale,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';
import { UserProfile, FitnessGoal } from '../types';
import { DEFAULT_GOAL_PRESETS } from '../data/foodDatabase';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  users: UserProfile[];
  onLoginSuccess: (user: UserProfile) => void;
  onRegisterSuccess: (newUser: UserProfile) => void;
  initialMode?: 'login' | 'signup';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  users,
  onLoginSuccess,
  onRegisterSuccess,
  initialMode = 'login',
}) => {
  const [mode, setMode] = useState<'login' | 'signup'>(initialMode);

  // Form Fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [goal, setGoal] = useState<FitnessGoal>('weight_loss');

  // Status feedback
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const cleanEmail = email.trim().toLowerCase();
    const cleanPass = password.trim();

    if (!cleanEmail) {
      setErrorMessage('Please enter your email address.');
      return;
    }
    if (!cleanPass) {
      setErrorMessage('Please enter your password.');
      return;
    }

    // Look up user
    const foundUser = users.find((u) => u.email.toLowerCase() === cleanEmail);

    if (!foundUser) {
      setErrorMessage('No account found with this email address. Please sign up first.');
      return;
    }

    // Verify password (demo accounts default to 'password123' if not set)
    const validPass = foundUser.password || 'password123';
    if (cleanPass !== validPass && cleanPass !== 'password123') {
      setErrorMessage('Incorrect password. (Tip: Demo password is "password123")');
      return;
    }

    setSuccessMessage(`Welcome back, ${foundUser.name}!`);
    setTimeout(() => {
      onLoginSuccess(foundUser);
      onClose();
    }, 600);
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const cleanName = name.trim();
    const cleanEmail = email.trim().toLowerCase();
    const cleanPass = password.trim();

    if (!cleanName) {
      setErrorMessage('Please provide your full name.');
      return;
    }
    if (!cleanEmail || !cleanEmail.includes('@')) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }
    if (!cleanPass || cleanPass.length < 4) {
      setErrorMessage('Password must be at least 4 characters long.');
      return;
    }

    // Check if email already exists
    const existing = users.find((u) => u.email.toLowerCase() === cleanEmail);
    if (existing) {
      setErrorMessage('An account with this email already exists. Please log in.');
      return;
    }

    const newUser: UserProfile = {
      id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      name: cleanName,
      email: cleanEmail,
      password: cleanPass,
      avatarUrl: '',
      currentGoal: goal,
      subscriptionTier: 'free',
      presets: JSON.parse(JSON.stringify(DEFAULT_GOAL_PRESETS)),
    };

    setSuccessMessage(`Account created successfully! Logging you in as ${cleanName}...`);
    setTimeout(() => {
      onRegisterSuccess(newUser);
      onClose();
    }, 700);
  };

  const handleQuickDemoLogin = (demoUser: UserProfile) => {
    setEmail(demoUser.email);
    setPassword(demoUser.password || 'password123');
    setErrorMessage(null);
    setSuccessMessage(`Logging in as ${demoUser.name}...`);
    setTimeout(() => {
      onLoginSuccess(demoUser);
      onClose();
    }, 500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div
        id="auth-modal-card"
        className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative animate-in zoom-in-95 duration-150 flex flex-col"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Brand Header */}
        <div className="flex items-center gap-2.5 mb-6">
          <div className="w-9 h-9 rounded-xl bg-red-600 flex items-center justify-center shadow-lg shadow-red-600/40 text-white font-black">
            <Flame className="w-5 h-5 fill-white" />
          </div>
          <div>
            <h2 className="text-lg font-black text-white leading-tight">MacroPulse Account</h2>
            <p className="text-xs text-zinc-400">Sign in or register to sync your calorie records</p>
          </div>
        </div>

        {/* Tab Switcher (Login vs Sign Up) */}
        <div className="grid grid-cols-2 p-1 bg-zinc-950 rounded-2xl border border-zinc-800 mb-6">
          <button
            type="button"
            onClick={() => {
              setMode('login');
              setErrorMessage(null);
              setSuccessMessage(null);
            }}
            className={`py-2 text-xs font-black rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer ${
              mode === 'login'
                ? 'bg-red-600 text-white shadow-md shadow-red-600/30'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>Sign In</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('signup');
              setErrorMessage(null);
              setSuccessMessage(null);
            }}
            className={`py-2 text-xs font-black rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer ${
              mode === 'signup'
                ? 'bg-red-600 text-white shadow-md shadow-red-600/30'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Create Account</span>
          </button>
        </div>

        {/* Error / Success Feedback */}
        {errorMessage && (
          <div className="mb-4 p-3 bg-red-950/80 border border-red-800/80 rounded-xl text-xs text-red-300 flex items-start gap-2 animate-in fade-in">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div className="mb-4 p-3 bg-emerald-950/80 border border-emerald-800/80 rounded-xl text-xs text-emerald-300 flex items-start gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Login Form */}
        {mode === 'login' ? (
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-extrabold text-zinc-300 uppercase tracking-wider mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  id="login-email-input"
                  type="email"
                  required
                  placeholder="e.g. alex.rivera@fitness.io"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-zinc-950 border border-zinc-800 focus:border-red-600 rounded-xl text-xs text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-red-600/30"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-extrabold text-zinc-300 uppercase tracking-wider mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  id="login-password-input"
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 bg-zinc-950 border border-zinc-800 focus:border-red-600 rounded-xl text-xs text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-red-600/30"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 cursor-pointer"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              id="submit-login-btn"
              className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs rounded-xl shadow-lg shadow-red-600/30 hover:shadow-red-600/50 transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
            >
              <LogIn className="w-4 h-4" />
              <span>Sign In to Tracker</span>
            </button>

            {/* Quick Demo Logins */}
            <div className="pt-4 border-t border-zinc-800 space-y-2">
              <span className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider block">
                Quick 1-Click Demo Profiles:
              </span>
              <div className="grid grid-cols-3 gap-2">
                {users.slice(0, 3).map((u) => (
                  <button
                    key={u.id}
                    type="button"
                    onClick={() => handleQuickDemoLogin(u)}
                    className="p-2 rounded-xl bg-zinc-950 hover:bg-zinc-800 border border-zinc-800 hover:border-red-600/60 text-left transition-all cursor-pointer"
                  >
                    <div className="text-xs font-bold text-white truncate">{u.name.split(' ')[0]}</div>
                    <div className="text-[9px] text-zinc-400 capitalize truncate">{u.currentGoal.replace('_', ' ')}</div>
                  </button>
                ))}
              </div>
            </div>
          </form>
        ) : (
          /* Sign Up Form (Name, Email, Password, Fitness Goal) */
          <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
            <div>
              <label className="block text-xs font-extrabold text-zinc-300 uppercase tracking-wider mb-1">
                Full Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  id="signup-name-input"
                  type="text"
                  required
                  placeholder="e.g. Taylor Swift"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-zinc-950 border border-zinc-800 focus:border-red-600 rounded-xl text-xs text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-red-600/30"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-extrabold text-zinc-300 uppercase tracking-wider mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  id="signup-email-input"
                  type="email"
                  required
                  placeholder="e.g. taylor@fitness.io"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-zinc-950 border border-zinc-800 focus:border-red-600 rounded-xl text-xs text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-red-600/30"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-extrabold text-zinc-300 uppercase tracking-wider mb-1">
                Create Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  id="signup-password-input"
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="Minimum 4 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-2 bg-zinc-950 border border-zinc-800 focus:border-red-600 rounded-xl text-xs text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-red-600/30"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 cursor-pointer"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-extrabold text-zinc-300 uppercase tracking-wider mb-1">
                Starting Fitness Goal
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setGoal('weight_loss')}
                  className={`p-2 rounded-xl border text-center transition-all cursor-pointer ${
                    goal === 'weight_loss'
                      ? 'bg-red-950/80 border-red-600 text-white font-bold'
                      : 'bg-zinc-950 border-zinc-800 text-zinc-400'
                  }`}
                >
                  <div className="text-[11px] font-bold">Cut</div>
                  <div className="text-[9px] text-zinc-400">1800 kcal</div>
                </button>
                <button
                  type="button"
                  onClick={() => setGoal('maintenance')}
                  className={`p-2 rounded-xl border text-center transition-all cursor-pointer ${
                    goal === 'maintenance'
                      ? 'bg-red-950/80 border-red-600 text-white font-bold'
                      : 'bg-zinc-950 border-zinc-800 text-zinc-400'
                  }`}
                >
                  <div className="text-[11px] font-bold">Maintain</div>
                  <div className="text-[9px] text-zinc-400">2300 kcal</div>
                </button>
                <button
                  type="button"
                  onClick={() => setGoal('muscle_gain')}
                  className={`p-2 rounded-xl border text-center transition-all cursor-pointer ${
                    goal === 'muscle_gain'
                      ? 'bg-red-950/80 border-red-600 text-white font-bold'
                      : 'bg-zinc-950 border-zinc-800 text-zinc-400'
                  }`}
                >
                  <div className="text-[11px] font-bold">Bulk</div>
                  <div className="text-[9px] text-zinc-400">2850 kcal</div>
                </button>
              </div>
            </div>

            <button
              type="submit"
              id="submit-register-btn"
              className="w-full py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-extrabold text-xs rounded-xl shadow-lg shadow-red-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
            >
              <UserPlus className="w-4 h-4" />
              <span>Create Account & Start Tracking</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
