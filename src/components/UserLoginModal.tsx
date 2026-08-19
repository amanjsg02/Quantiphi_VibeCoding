import React, { useState } from 'react';
import { User, X, Check, Mail, LogIn, UserPlus, Users } from 'lucide-react';
import { UserProfile, FitnessGoal } from '../types';
import { DEFAULT_GOAL_PRESETS } from '../data/foodDatabase';

interface UserLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  users: UserProfile[];
  currentUser: UserProfile;
  onUpdateUser: (updated: Partial<UserProfile>) => void;
  onAddNewUser: (newUser: UserProfile) => void;
  onSelectUser: (userId: string) => void;
}

export const UserLoginModal: React.FC<UserLoginModalProps> = ({
  isOpen,
  onClose,
  users,
  currentUser,
  onUpdateUser,
  onAddNewUser,
  onSelectUser,
}) => {
  const [tab, setTab] = useState<'switch_edit' | 'create_new'>('switch_edit');
  const [name, setName] = useState(currentUser.name);
  const [email, setEmail] = useState(currentUser.email);
  const [isSaved, setIsSaved] = useState(false);

  // New user form state
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserGoal, setNewUserGoal] = useState<FitnessGoal>('maintenance');

  if (!isOpen) return null;

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateUser({ name: name.trim() || 'Athlete', email: email.trim() });
    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
      onClose();
    }, 500);
  };

  const handleCreateNew = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserName.trim()) return;

    const newUser: UserProfile = {
      id: `user_${Date.now()}`,
      name: newUserName.trim(),
      email: newUserEmail.trim() || `${newUserName.toLowerCase().replace(/\s+/g, '')}@fitness.io`,
      avatarUrl: '',
      currentGoal: newUserGoal,
      subscriptionTier: 'free',
      presets: JSON.parse(JSON.stringify(DEFAULT_GOAL_PRESETS)),
    };

    onAddNewUser(newUser);
    onSelectUser(newUser.id);
    setNewUserName('');
    setNewUserEmail('');
    onClose();
  };

  return (
    <div
      id="user-login-modal-overlay"
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200"
    >
      <div className="bg-zinc-900 rounded-3xl max-w-md w-full p-6 shadow-2xl border border-zinc-800 relative animate-in zoom-in-95 duration-150 text-zinc-100">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-zinc-400 hover:text-white p-1.5 rounded-full hover:bg-zinc-800 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-red-600 text-white flex items-center justify-center shadow-lg shadow-red-600/30">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">User Profiles & Accounts</h3>
            <p className="text-xs text-zinc-400">Switch user or create new profile with individual calorie tracker</p>
          </div>
        </div>

        {/* Tab switcher */}
        <div className="flex bg-zinc-950 p-1 rounded-xl mb-4 border border-zinc-800">
          <button
            type="button"
            onClick={() => setTab('switch_edit')}
            className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              tab === 'switch_edit'
                ? 'bg-red-600 text-white shadow-md'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            Active Profile
          </button>
          <button
            type="button"
            onClick={() => setTab('create_new')}
            className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              tab === 'create_new'
                ? 'bg-red-600 text-white shadow-md'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            + Add New User
          </button>
        </div>

        {tab === 'switch_edit' ? (
          <form onSubmit={handleUpdate} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-zinc-300 block mb-1">
                Display Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your Name"
                  className="w-full pl-9 pr-3 py-2 bg-zinc-950 border border-zinc-700 rounded-xl text-xs font-bold text-white focus:outline-none focus:ring-2 focus:ring-red-600"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-zinc-300 block mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="athlete@example.com"
                  className="w-full pl-9 pr-3 py-2 bg-zinc-950 border border-zinc-700 rounded-xl text-xs font-bold text-white focus:outline-none focus:ring-2 focus:ring-red-600"
                />
              </div>
            </div>

            <div className="p-3 bg-zinc-950 rounded-xl border border-zinc-800 text-[11px] text-zinc-400">
              <strong className="text-zinc-200">Current Target Budget:</strong> {currentUser.presets[currentUser.currentGoal].calories} kcal ({currentUser.currentGoal.replace('_', ' ')})
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2 text-xs font-bold text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-xl transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-2 bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs rounded-xl shadow-lg shadow-red-600/30 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                {isSaved ? <Check className="w-4 h-4" /> : <LogIn className="w-4 h-4" />}
                <span>{isSaved ? 'Updated!' : 'Save Changes'}</span>
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleCreateNew} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-zinc-300 block mb-1">
                New User Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={newUserName}
                onChange={(e) => setNewUserName(e.target.value)}
                placeholder="e.g. Taylor Smith"
                className="w-full px-3 py-2 bg-zinc-950 border border-zinc-700 rounded-xl text-xs font-bold text-white focus:outline-none focus:ring-2 focus:ring-red-600"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-zinc-300 block mb-1">
                Email Address
              </label>
              <input
                type="email"
                value={newUserEmail}
                onChange={(e) => setNewUserEmail(e.target.value)}
                placeholder="taylor@example.com"
                className="w-full px-3 py-2 bg-zinc-950 border border-zinc-700 rounded-xl text-xs font-bold text-white focus:outline-none focus:ring-2 focus:ring-red-600"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-zinc-300 block mb-1">
                Initial Fitness Goal
              </label>
              <select
                value={newUserGoal}
                onChange={(e) => setNewUserGoal(e.target.value as FitnessGoal)}
                className="w-full px-3 py-2 bg-zinc-950 border border-zinc-700 rounded-xl text-xs font-bold text-white focus:outline-none focus:ring-2 focus:ring-red-600 cursor-pointer"
              >
                <option value="weight_loss">Weight Loss (Cut - 1,800 kcal)</option>
                <option value="maintenance">Maintenance (Balanced - 2,300 kcal)</option>
                <option value="muscle_gain">Muscle Gain (Surplus - 2,850 kcal)</option>
              </select>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2 text-xs font-bold text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-xl transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-2 bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs rounded-xl shadow-lg shadow-red-600/30 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <UserPlus className="w-4 h-4" />
                <span>Create & Switch</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
