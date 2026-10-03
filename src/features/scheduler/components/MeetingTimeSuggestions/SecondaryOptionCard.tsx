export default function SecondaryOptionCard() {
  return (
    <div className="border border-slate-200 bg-slate-50/50 rounded-xl p-5 flex flex-col gap-4 group hover:bg-white hover:border-slate-300 transition-all relative">
      <div className="absolute -top-2.5 left-4 px-2 py-0.5 bg-slate-200 text-slate-600 text-[9px] font-bold uppercase tracking-widest rounded flex items-center gap-1">
        <span className="material-symbols-outlined text-[10px]">info</span>
        Alternative
      </div>
      <div className="flex items-start justify-between">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">
              12:00 - 13:00
            </span>
          </div>
          <p className="text-lg font-bold text-slate-800">2 of 3 available</p>
          <div className="flex items-center gap-1.5 text-[10px] font-medium text-slate-400">
            <span className="material-symbols-outlined text-sm">
              trending_up
            </span>
            <span>Improves availability by 1</span>
          </div>
        </div>
        <div className="w-9 h-9 rounded-full bg-slate-200/50 flex items-center justify-center shrink-0">
          <span className="material-symbols-outlined text-slate-500">
            event_repeat
          </span>
        </div>
      </div>
      <div className="space-y-3">
        <div className="bg-amber-50/50 border border-amber-200/50 p-3 rounded-lg space-y-1.5">
          <div className="flex items-center gap-2 text-[11px] font-extrabold text-amber-700">
            <span>⚠️ 1 participant outside working hours</span>
          </div>
          <div className="pl-0">
            <p className="text-[9px] font-semibold text-amber-600/80 leading-tight">
              <span className="font-bold">Early:</span> Europe/Berlin
            </p>
            <p className="text-[9px] font-semibold text-amber-600/80 leading-tight">
              <span className="font-bold">Late:</span> Asia/Kolkata
            </p>
            <p className="text-[9px] font-semibold text-amber-600/80 leading-tight">
              <span className="font-bold">Night:</span> America/New_York
            </p>
          </div>
        </div>
        <div className="pt-0.5">
          <button
            type="button"
            className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 hover:text-slate-500"
            tabIndex={0}
          >
            <span>See who is affected</span>
            <span className="material-symbols-outlined text-sm">
              expand_more
            </span>
          </button>
        </div>
      </div>
      <button
        type="button"
        className="w-full bg-[#2D3748] hover:bg-slate-900 text-white py-2.5 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-colors flex items-center justify-center gap-2"
        tabIndex={0}
      >
        <span className="material-symbols-outlined text-sm">
          calendar_add_on
        </span>
        Send Invite
      </button>
    </div>
  );
}
