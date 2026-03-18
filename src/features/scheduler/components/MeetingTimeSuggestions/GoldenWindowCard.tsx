export default function GoldenWindowCard() {
  return (
    <div className="scale-[1.05] md:scale-[1.08] origin-top bg-emerald-50/40 border-2 border-emerald-500/30 rounded-2xl p-5 flex flex-col gap-4 group relative shadow-xl shadow-emerald-500/10 ring-4 ring-emerald-500/5">
      <div className="absolute -top-3.5 left-6 px-3 py-1 bg-emerald-500 text-white text-[10px] font-bold uppercase tracking-widest rounded-full flex items-center gap-1.5 shadow-md">
        <span className="material-symbols-outlined text-xs font-bold">
          check_circle
        </span>
        Recommended
      </div>
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-emerald-700 uppercase tracking-wide">
              14:00 - 16:00
            </span>
          </div>
          <p className="text-2xl font-bold text-slate-900 tracking-tight">
            3 of 3 participants available
          </p>
          <div className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-600">
            <span className="material-symbols-outlined text-[14px]">
              arrow_upward
            </span>
            <span>Improves availability by 1</span>
          </div>
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 mt-2">
            <span className="material-symbols-outlined text-lg">
              celebration
            </span>
            <span>No trade-offs required</span>
          </div>
        </div>
        <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
          <span className="material-symbols-outlined text-emerald-600 text-2xl font-bold">
            verified
          </span>
        </div>
      </div>
      <div className="space-y-3">
        <p className="text-[10px] font-medium text-slate-500 pl-6">
          Best possible overlap for selected timezones
        </p>
        <div className="pt-1">
          <button
            type="button"
            className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 hover:text-slate-600 transition-colors"
          >
            <span>See who is affected</span>
            <span className="material-symbols-outlined text-sm">
              expand_more
            </span>
          </button>
          <div className="mt-2 text-xs text-slate-600">
            <div>
              <span className="font-bold">Early:</span> Europe/Berlin
            </div>
            <div>
              <span className="font-bold">Late:</span> Asia/Kolkata
            </div>
            <div>
              <span className="font-bold">Night:</span> America/New_York
            </div>
          </div>
        </div>
      </div>
      <button
        type="button"
        className="w-full bg-primary-accent hover:bg-primary-accent-vibrant text-white py-3.5 rounded-xl text-xs font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary-accent/20"
      >
        <span className="material-symbols-outlined text-lg">
          calendar_add_on
        </span>
        Send Calendar Invite
      </button>
    </div>
  );
}
