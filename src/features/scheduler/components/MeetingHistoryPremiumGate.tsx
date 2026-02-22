import { useNavigate } from "react-router-dom";

export const MeetingHistoryPremiumGate = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-8">
      <div className="mb-8">
        <h2 className="text-lg font-bold text-slate-900">Meeting History</h2>
        <p className="text-sm text-slate-500">
          Track your scheduled meetings and invitations.
        </p>
      </div>

      <div className="flex flex-col items-center justify-center py-12 px-4">
        <div className="w-16 h-16 bg-primary-accent/10 rounded-full flex items-center justify-center mb-4">
          <span className="material-symbols-outlined text-primary-accent text-3xl">
            history
          </span>
        </div>
        <h3 className="text-xl font-bold text-slate-900 mb-2">
          Pro Feature: Meeting History
        </h3>
        <p className="text-sm text-slate-500 text-center max-w-md mb-6">
          Keep track of all your scheduled meetings, view past invitations, and
          manage drafts. Upgrade to Pro to unlock Meeting History.
        </p>
        <button
          onClick={() => navigate("/premium")}
          className="px-6 py-3 bg-primary-accent hover:bg-[#ef5a46] text-white rounded-lg font-semibold transition-colors flex items-center gap-2"
        >
          <span className="material-symbols-outlined text-lg">
            workspace_premium
          </span>
          Upgrade to Pro
        </button>
      </div>
    </div>
  );
};
