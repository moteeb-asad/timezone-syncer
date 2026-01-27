import { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../store";
import { FREE_TIER_LIMIT } from "../types/timezone";

export const Account = () => {
  const { user } = useSelector((state: RootState) => state.user);
  const { timezoneSettings } = useSelector(
    (state: RootState) => state.timezone
  );
  const [activeTab, setActiveTab] = useState<"profile" | "subscription">(
    "profile"
  );

  const planLabel = useMemo(() => (user?.isPremium ? "Pro" : "Free"), [user]);
  const planPrice = user?.isPremium ? "$9" : "$0";
  const planCaption = user?.isPremium ? "per month" : "/mo";

  const currentTimezones = timezoneSettings.length;
  const usageLabel = user?.isPremium
    ? "Unlimited"
    : `${currentTimezones} / ${FREE_TIER_LIMIT} Used`;
  const usagePercent = user?.isPremium
    ? 100
    : Math.min(100, (currentTimezones / FREE_TIER_LIMIT) * 100);

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row gap-8" aria-live="polite">
        <aside
          className="w-full md:w-64 shrink-0"
          aria-label="Account navigation"
        >
          <nav className="space-y-1" aria-label="Account tabs">
            <button
              onClick={() => setActiveTab("profile")}
              className={`flex w-full items-center gap-3 px-4 py-2.5 rounded-lg border text-left transition-colors ${
                activeTab === "profile"
                  ? "bg-white border-slate-200 text-primary font-semibold shadow-sm"
                  : "border-transparent text-slate-600 hover:bg-slate-100"
              }`}
            >
              <span className="material-symbols-outlined text-xl">person</span>
              <span>Profile</span>
            </button>
            <button
              onClick={() => setActiveTab("subscription")}
              className={`flex w-full items-center gap-3 px-4 py-2.5 rounded-lg border text-left transition-colors ${
                activeTab === "subscription"
                  ? "bg-white border-slate-200 text-primary font-semibold shadow-sm"
                  : "border-transparent text-slate-600 hover:bg-slate-100"
              }`}
            >
              <span className="material-symbols-outlined text-xl">
                payments
              </span>
              <span>Subscription</span>
            </button>
          </nav>
        </aside>

        <div className="flex-1 space-y-8">
          {activeTab === "profile" && (
            <div className="bg-white border border-slate-200 rounded-xl p-8">
              <div className="mb-8">
                <h2 className="text-lg font-bold text-slate-900">
                  Profile Settings
                </h2>
                <p className="text-sm text-slate-500">
                  Manage your personal information and how it appears to others.
                </p>
              </div>

              <div className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      Full Name
                    </label>
                    <input
                      className="w-full text-sm font-medium border-none border-slate-200 bg-slate-50/50 rounded-lg focus:ring-1 focus:ring-primary-accent px-4 py-2.5 outline-none"
                      type="text"
                      defaultValue={
                        `${user?.firstName ?? ""} ${user?.lastName ?? ""}`.trim() ||
                        "Your name"
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      Email Address
                    </label>
                    <input
                      className="w-full text-sm font-medium border-none border-slate-200 bg-slate-50/50 rounded-lg focus:ring-1 focus:ring-primary-accent px-4 py-2.5 outline-none"
                      type="email"
                      defaultValue={user?.email ?? "you@example.com"}
                    />
                  </div>
                </div>
                <div className="pt-4 flex justify-end">
                  <button className="px-6 py-2.5 bg-primary text-white text-sm font-bold rounded-lg hover:bg-primary-dark transition-all shadow-sm">
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === "subscription" && (
            <div className="bg-white border border-slate-200 rounded-xl p-8">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-4 flex-1">
                  <div>
                    <h2 className="text-lg font-bold text-slate-900">
                      Current Plan
                    </h2>
                    <p className="text-sm text-slate-500">
                      {user?.isPremium
                        ? "You are enjoying unlimited timezone tracking and premium support."
                        : "You are currently using the limited version of Timezone Syncer."}
                    </p>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider">
                      <span className="text-slate-400">Timezone Slots</span>
                      <span className="text-slate-700">{usageLabel}</span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${
                          user?.isPremium ? "bg-emerald-500" : "bg-primary"
                        } rounded-full`}
                        style={{ width: `${usagePercent}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-slate-400">
                      {user?.isPremium
                        ? "Thank you for being a Pro member."
                        : "Upgrade to Pro for unlimited timezone tracking and calendar syncing."}
                    </p>
                    <p className="text-xs font-semibold text-slate-500">
                      {user?.isPremium
                        ? "Unlimited timezone slots"
                        : `Free tier includes ${FREE_TIER_LIMIT} slots`}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col gap-3 min-w-[200px]">
                  <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 text-center">
                    <span className="text-xs font-bold text-slate-400 uppercase">
                      {planLabel} Plan
                    </span>
                    <div className="text-2xl font-bold text-slate-900 mt-1">
                      {planPrice}
                      <span className="text-sm font-medium text-slate-400">
                        {planCaption}
                      </span>
                    </div>
                  </div>
                  <button
                    className="w-full px-6 py-3 border border-primary text-primary hover:bg-primary hover:text-white text-sm font-bold rounded-lg transition-all flex items-center justify-center gap-2"
                    aria-label={
                      user?.isPremium
                        ? "Manage subscription plan"
                        : "Upgrade to Pro plan"
                    }
                  >
                    <span className="material-symbols-outlined text-lg">
                      upgrade
                    </span>
                    {user?.isPremium ? "Manage Plan" : "Upgrade to Pro"}
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="pt-4 border-t border-slate-200">
            <button className="text-xs font-bold text-rose-500 hover:text-rose-600 transition-colors uppercase tracking-widest">
              Delete Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
