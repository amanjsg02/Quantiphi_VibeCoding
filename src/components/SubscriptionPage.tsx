import React, { useState } from 'react';
import {
  Crown,
  Check,
  Zap,
  Sparkles,
  TrendingUp,
  Calendar,
  Shield,
  ArrowRight,
  HelpCircle,
  FileSpreadsheet,
  Users,
  Clock,
  Flame,
} from 'lucide-react';
import { UserProfile, SubscriptionTier } from '../types';

interface SubscriptionPageProps {
  currentUser: UserProfile;
  onUpdateSubscription: (tier: SubscriptionTier) => void;
  onNavigateToWeeklyIntake: () => void;
  onBackToDashboard: () => void;
}

export const SubscriptionPage: React.FC<SubscriptionPageProps> = ({
  currentUser,
  onUpdateSubscription,
  onNavigateToWeeklyIntake,
  onBackToDashboard,
}) => {
  const currentTier = currentUser.subscriptionTier || 'free';
  const [selectedBilling, setSelectedBilling] = useState<'monthly' | 'yearly'>('monthly');
  const [upgradedToast, setUpgradedToast] = useState(false);

  const handleSelectPlan = (tier: SubscriptionTier) => {
    onUpdateSubscription(tier);
    setUpgradedToast(true);
    setTimeout(() => {
      setUpgradedToast(false);
    }, 2500);
  };

  return (
    <div id="subscription-pricing-page" className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-200">
      {/* Top Hero Banner */}
      <div className="text-center space-y-3 py-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-950/80 border border-red-800/80 text-red-400 text-xs font-black uppercase tracking-widest">
          <Crown className="w-3.5 h-3.5" />
          <span>Membership & Analytics Plans</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
          Level Up Your Nutrition & Macro Precision
        </h1>
        <p className="text-sm text-zinc-400 max-w-2xl mx-auto leading-relaxed">
          Choose between our standard daily tracker or upgrade to the <strong className="text-white">Pro $20/month</strong> plan to unlock full <strong className="text-red-400">Weekly Intake Tracking</strong>, long-term analytics, and advanced athlete tools.
        </p>

        {upgradedToast && (
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-950 border border-emerald-800 text-emerald-300 text-xs font-bold rounded-xl animate-in zoom-in-95 duration-150">
            <Check className="w-4 h-4 text-emerald-400" />
            <span>Plan successfully updated for {currentUser.name}!</span>
          </div>
        )}
      </div>

      {/* Plan Cards Grid (2 Options: Free Tier vs $20/Month Pro Tier) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        {/* Plan 1: Free Tier */}
        <div
          id="plan-card-free"
          className={`rounded-3xl p-6 sm:p-8 bg-zinc-900 border transition-all flex flex-col justify-between relative shadow-xl ${
            currentTier === 'free'
              ? 'border-zinc-650 ring-1 ring-zinc-700'
              : 'border-zinc-800 opacity-90'
          }`}
        >
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <span className="text-xs font-black uppercase tracking-wider text-zinc-400">
                  Starter Plan
                </span>
                <h2 className="text-2xl font-black text-white mt-0.5">Free Tier</h2>
              </div>
              {currentTier === 'free' && (
                <span className="px-3 py-1 bg-zinc-800 border border-zinc-700 text-zinc-200 text-[11px] font-extrabold rounded-full">
                  Current Plan
                </span>
              )}
            </div>

            <div className="flex items-baseline gap-1 my-4">
              <span className="text-4xl font-black text-white">$0</span>
              <span className="text-xs font-bold text-zinc-400">/ forever free</span>
            </div>

            <p className="text-xs text-zinc-400 leading-relaxed mb-6">
              Essential daily meal logging and caloric tracking for everyday fitness enthusiasts.
            </p>

            {/* Features List */}
            <div className="space-y-3 pt-4 border-t border-zinc-800 text-xs text-zinc-300">
              <div className="flex items-start gap-2.5">
                <Check className="w-4 h-4 text-zinc-400 shrink-0 mt-0.5" />
                <span><strong>Daily Calorie Budget Bar:</strong> Live intake vs target budget</span>
              </div>
              <div className="flex items-start gap-2.5">
                <Check className="w-4 h-4 text-zinc-400 shrink-0 mt-0.5" />
                <span><strong>Macronutrient Meters:</strong> Real-time Protein, Carbs, and Fats</span>
              </div>
              <div className="flex items-start gap-2.5">
                <Check className="w-4 h-4 text-zinc-400 shrink-0 mt-0.5" />
                <span><strong>Common Food Database:</strong> 40+ USDA nutritional items</span>
              </div>
              <div className="flex items-start gap-2.5">
                <Check className="w-4 h-4 text-zinc-400 shrink-0 mt-0.5" />
                <span><strong>Instant Budget Warning Modal:</strong> Triggers when limit is exceeded</span>
              </div>
              <div className="flex items-start gap-2.5">
                <Check className="w-4 h-4 text-zinc-400 shrink-0 mt-0.5" />
                <span><strong>Goal Presets:</strong> Weight Loss, Maintenance, and Muscle Gain</span>
              </div>
              <div className="flex items-start gap-2.5 text-zinc-500">
                <span className="w-4 h-4 flex items-center justify-center font-black">✕</span>
                <span className="line-through">Weekly Intake & 7-Day Trend Analysis</span>
              </div>
              <div className="flex items-start gap-2.5 text-zinc-500">
                <span className="w-4 h-4 flex items-center justify-center font-black">✕</span>
                <span className="line-through">Exportable Nutrition Reports & Logs</span>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-4 border-t border-zinc-800">
            {currentTier === 'free' ? (
              <button
                disabled
                className="w-full py-3 px-4 rounded-xl bg-zinc-800 text-zinc-400 font-bold text-xs cursor-default text-center"
              >
                Active On Free Tier
              </button>
            ) : (
              <button
                onClick={() => handleSelectPlan('free')}
                className="w-full py-3 px-4 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-bold text-xs border border-zinc-700 transition-colors cursor-pointer text-center"
              >
                Switch to Free Tier
              </button>
            )}
          </div>
        </div>

        {/* Plan 2: Pro Athlete Plan ($20 / Month) */}
        <div
          id="plan-card-pro"
          className={`rounded-3xl p-6 sm:p-8 bg-gradient-to-b from-zinc-900 via-zinc-900 to-black border-2 transition-all flex flex-col justify-between relative shadow-2xl ${
            currentTier === 'pro'
              ? 'border-red-600 shadow-red-600/20 ring-2 ring-red-600/40'
              : 'border-red-600/80 shadow-lg hover:border-red-500'
          }`}
        >
          {/* Top highlight ribbon */}
          <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-red-600 to-red-700 text-white text-[10px] font-black uppercase tracking-widest px-4 py-1 rounded-full shadow-lg shadow-red-600/40 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Recommended for Serious Athletes</span>
          </div>

          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <span className="text-xs font-black uppercase tracking-wider text-red-400">
                  Pro Performance
                </span>
                <h2 className="text-2xl font-black text-white mt-0.5 flex items-center gap-2">
                  <span>Pro Athlete</span>
                  <Crown className="w-5 h-5 text-red-500" />
                </h2>
              </div>
              {currentTier === 'pro' && (
                <span className="px-3 py-1 bg-red-950 border border-red-800 text-red-300 text-[11px] font-extrabold rounded-full">
                  Active Subscription
                </span>
              )}
            </div>

            <div className="flex items-baseline gap-1.5 my-4">
              <span className="text-4xl font-black text-white">$20</span>
              <span className="text-xs font-bold text-zinc-400">/ month</span>
              <span className="text-[10px] font-bold text-red-400 bg-red-950/80 px-2 py-0.5 rounded border border-red-800/60 ml-2">
                Cancel Anytime
              </span>
            </div>

            <p className="text-xs text-zinc-300 leading-relaxed mb-6">
              Complete nutrition command center with <strong className="text-white">Weekly Intake Tracking</strong>, historical averages, macro cycling, and data synchronization.
            </p>

            {/* Features List */}
            <div className="space-y-3 pt-4 border-t border-zinc-800 text-xs text-zinc-200">
              <div className="flex items-start gap-2.5">
                <div className="w-4 h-4 rounded-full bg-red-600/20 text-red-500 flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-3 h-3 text-red-500" />
                </div>
                <span>
                  <strong className="text-white">Weekly Intake Tracker:</strong> 7-day caloric average, deficit/surplus graphs, and compliance scores
                </span>
              </div>
              <div className="flex items-start gap-2.5">
                <div className="w-4 h-4 rounded-full bg-red-600/20 text-red-500 flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-3 h-3 text-red-500" />
                </div>
                <span>
                  <strong className="text-white">Macro Cycling & Timing:</strong> Target training days vs rest days
                </span>
              </div>
              <div className="flex items-start gap-2.5">
                <div className="w-4 h-4 rounded-full bg-red-600/20 text-red-500 flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-3 h-3 text-red-500" />
                </div>
                <span>
                  <strong className="text-white">Seamless Cloud Data Synchronization:</strong> Live real-time record synchronization
                </span>
              </div>
              <div className="flex items-start gap-2.5">
                <div className="w-4 h-4 rounded-full bg-red-600/20 text-red-500 flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-3 h-3 text-red-500" />
                </div>
                <span>
                  <strong className="text-white">Multi-Athlete Profile Tracking:</strong> Separate isolated trackers for team/family
                </span>
              </div>
              <div className="flex items-start gap-2.5">
                <div className="w-4 h-4 rounded-full bg-red-600/20 text-red-500 flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-3 h-3 text-red-500" />
                </div>
                <span>
                  <strong className="text-white">Export Nutrition Logs:</strong> CSV & PDF data reports
                </span>
              </div>
              <div className="flex items-start gap-2.5">
                <div className="w-4 h-4 rounded-full bg-red-600/20 text-red-500 flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-3 h-3 text-red-500" />
                </div>
                <span>
                  <strong className="text-white">Everything in Free Tier included</strong>
                </span>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-4 border-t border-zinc-800 space-y-2">
            {currentTier === 'pro' ? (
              <>
                <button
                  onClick={onNavigateToWeeklyIntake}
                  className="w-full py-3 px-4 rounded-xl bg-red-600 hover:bg-red-700 text-white font-black text-xs shadow-lg shadow-red-600/40 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <TrendingUp className="w-4 h-4" />
                  <span>Open Weekly Intake Tracker & Trends</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <div className="text-center text-[11px] text-zinc-400 pt-1">
                  Active Subscription • $20.00 billed monthly
                </div>
              </>
            ) : (
              <button
                onClick={() => handleSelectPlan('pro')}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-black text-xs shadow-lg shadow-red-600/40 hover:shadow-red-600/60 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Zap className="w-4 h-4" />
                <span>Upgrade to Pro — $20 / month</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Feature Comparison Table */}
      <div className="bg-zinc-900 rounded-3xl p-6 sm:p-8 border border-zinc-800 shadow-xl max-w-4xl mx-auto space-y-4">
        <h3 className="text-lg font-black text-white flex items-center gap-2">
          <Shield className="w-5 h-5 text-red-500" />
          <span>Detailed Tier Comparison</span>
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-zinc-800 text-zinc-400 font-extrabold">
                <th className="pb-3">Feature</th>
                <th className="pb-3 text-center">Free Tier</th>
                <th className="pb-3 text-center text-red-400">Pro Athlete ($20/mo)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/70 text-zinc-300 font-medium">
              <tr>
                <td className="py-3 font-semibold text-white">Daily Calorie & Macro Tracking</td>
                <td className="py-3 text-center text-emerald-400 font-bold">✓ Included</td>
                <td className="py-3 text-center text-emerald-400 font-bold">✓ Included</td>
              </tr>
              <tr>
                <td className="py-3 font-semibold text-white">Weekly Intake 7-Day Trend Analysis</td>
                <td className="py-3 text-center text-zinc-500">✕</td>
                <td className="py-3 text-center text-red-400 font-bold">✓ Full Analytics</td>
              </tr>
              <tr>
                <td className="py-3 font-semibold text-white">Weekly Caloric Deficit / Surplus Graphs</td>
                <td className="py-3 text-center text-zinc-500">✕</td>
                <td className="py-3 text-center text-red-400 font-bold">✓ Included</td>
              </tr>
              <tr>
                <td className="py-3 font-semibold text-white">Dynamic Budget Exceeded Alerts</td>
                <td className="py-3 text-center text-emerald-400 font-bold">✓ Included</td>
                <td className="py-3 text-center text-emerald-400 font-bold">✓ Included</td>
              </tr>
              <tr>
                <td className="py-3 font-semibold text-white">Multi-User Profiles Syncing</td>
                <td className="py-3 text-center text-zinc-400">Up to 3 Users</td>
                <td className="py-3 text-center text-red-400 font-bold">Unlimited Users</td>
              </tr>
              <tr>
                <td className="py-3 font-semibold text-white">40+ Common Food Database</td>
                <td className="py-3 text-center text-emerald-400 font-bold">✓ Included</td>
                <td className="py-3 text-center text-emerald-400 font-bold">✓ Included</td>
              </tr>
              <tr>
                <td className="py-3 font-semibold text-white">Data Export (CSV / Reports)</td>
                <td className="py-3 text-center text-zinc-500">✕</td>
                <td className="py-3 text-center text-red-400 font-bold">✓ Unlimited</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
