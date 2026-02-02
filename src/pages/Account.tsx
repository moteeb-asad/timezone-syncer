import { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../store";
import { FREE_TIER_LIMIT } from "../types/timezone";
import { auth } from "../lib/firebase";

export const Account = () => {
  const { user } = useSelector((state: RootState) => state.user);
  const { timezoneSettings } = useSelector(
    (state: RootState) => state.timezone
  );
  const [activeTab, setActiveTab] = useState<"profile" | "subscription">(
    "profile"
  );

  // Compute provider status from current user
  const { hasGoogleLinked, hasPasswordAuth } = useMemo(() => {
    const currentUser = auth?.currentUser;
    if (!currentUser) return { hasGoogleLinked: false, hasPasswordAuth: false };

    const providerIds = currentUser.providerData.map((p) => p.providerId);
    return {
      hasGoogleLinked: providerIds.includes("google.com"),
      hasPasswordAuth: providerIds.includes("password"),
    };
  }, [user]);

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

              {/* Provider Status Section */}
              <div className="mt-8 pt-8 border-t border-slate-200">
                <div className="mb-6">
                  <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                    Connected Accounts
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    View and manage your authentication methods
                  </p>
                </div>

                <div className="space-y-3">
                  {/* Email/Password Provider */}
                  <div className="flex items-center justify-between p-4 bg-slate-50 border border-slate-200 rounded-lg">
                    <div className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-xl text-slate-500">
                        lock
                      </span>
                      <div>
                        <p className="text-sm font-semibold text-slate-900">
                          Email & Password
                        </p>
                        <p className="text-xs text-slate-500">
                          {hasPasswordAuth ? "Connected" : "Not connected"}
                        </p>
                      </div>
                    </div>
                    <div
                      className={`w-2.5 h-2.5 rounded-full ${
                        hasPasswordAuth ? "bg-emerald-500" : "bg-slate-300"
                      }`}
                    ></div>
                  </div>

                  {/* Google Provider */}
                  <div className="flex items-center justify-between p-4 bg-slate-50 border border-slate-200 rounded-lg">
                    <div className="flex items-center gap-3">
                      <svg
                        className="w-5 h-5 text-slate-500"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M12.48 10.92v3.28h7.84c-.24 1.84-.909 3.292-2.09 4.213-1.217.956-2.909 1.787-5.75 1.787-4.434 0-8.036-3.602-8.036-8.037 0-4.434 3.602-8.036 8.036-8.036 2.422 0 4.19.95 5.58 2.27l2.29-2.29C18.28 2.02 15.64 1 12.48 1 6.36 1 1.5 5.86 1.5 12s4.86 11 10.98 11c3.31 0 5.8-1.09 7.79-3.15 2-2.07 2.63-4.96 2.63-7.29 0-.46-.04-.9-.11-1.29h-8.32z"
                          fill="currentColor"
                        ></path>
                      </svg>
                      <div>
                        <p className="text-sm font-semibold text-slate-900">
                          Google
                        </p>
                        <p className="text-xs text-slate-500">
                          {hasGoogleLinked ? "Connected" : "Not connected"}
                        </p>
                      </div>
                    </div>
                    <div
                      className={`w-2.5 h-2.5 rounded-full ${
                        hasGoogleLinked ? "bg-emerald-500" : "bg-slate-300"
                      }`}
                    ></div>
                  </div>
                </div>

                {!hasGoogleLinked && hasPasswordAuth && (
                  <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-xs text-blue-700">
                      <strong>Tip:</strong> Link your Google account to quickly
                      sign in without entering your password. Go to the Login
                      page and click "Google" to link.
                    </p>
                  </div>
                )}
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
