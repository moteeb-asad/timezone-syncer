import { useState } from "react";
import { useMeetingSuggestions } from "../hooks/useMeetingSuggestions";
import { SendMeetingInvitation } from "./SendMeetingInvitation";

interface MeetingTimeSuggestionsProps {
  timezoneCount: number;
}

export const MeetingTimeSuggestions = ({
  timezoneCount,
}: MeetingTimeSuggestionsProps) => {
  const { goldenWindow, secondaryOptions, hasEnoughData } =
    useMeetingSuggestions();
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (!hasEnoughData) {
    return null;
  }

  return (
    <div className="space-y-4 animate-fadeIn">
      <div className="flex items-center justify-between px-2">
        <div className="flex items-center gap-4">
          <h2 className="text-sm font-bold uppercase tracking-widest text-slate-500">
            Smart Scheduler
          </h2>
          <span className="text-[10px] px-2 py-0.5 bg-primary-accent/10 text-primary-accent rounded font-bold uppercase">
            Premium Feature
          </span>
        </div>
      </div>
      <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-6">
        <div>
          <h3 className="text-sm font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <span className="material-symbols-outlined text-primary-accent">
              auto_awesome
            </span>
            Meeting Time Suggestions
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Golden Window Card */}
            {goldenWindow ? (
              <div className="border border-slate-100 bg-slate-50/50 rounded-lg p-4 flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">
                      Golden Window
                    </p>
                    <p className="text-xl font-bold text-slate-900">
                      {goldenWindow.startTime} - {goldenWindow.endTime}
                    </p>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center">
                    <span className="material-symbols-outlined text-emerald-600">
                      done_all
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-[10px] font-medium text-slate-500">
                  <span className="material-symbols-outlined text-sm">
                    groups
                  </span>
                  100% Availability across {timezoneCount} timezones
                </div>
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="w-full bg-primary-accent hover:bg-[#ef5a46] text-white py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-2 shadow-sm shadow-primary-accent/20"
                >
                  <span className="material-symbols-outlined text-sm">
                    calendar_add_on
                  </span>
                  Send Calendar Invite
                </button>
              </div>
            ) : (
              <div className="border border-slate-100 bg-slate-50/50 rounded-lg p-4 flex flex-col gap-4 items-center justify-center min-h-[180px]">
                <span className="material-symbols-outlined text-slate-300 text-4xl">
                  event_busy
                </span>
                <p className="text-xs text-slate-500 text-center">
                  No perfect overlap found. Check secondary options.
                </p>
              </div>
            )}

            {/* Secondary Option Card */}
            {secondaryOptions[0] ? (
              <div className="border border-slate-100 bg-slate-50/50 rounded-lg p-4 flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">
                      Secondary Option
                    </p>
                    <p className="text-xl font-bold text-slate-900">
                      {secondaryOptions[0].startTime} -{" "}
                      {secondaryOptions[0].endTime}
                    </p>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center">
                    <span className="material-symbols-outlined text-amber-600">
                      event_repeat
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-[10px] font-medium text-slate-500">
                  <span className="material-symbols-outlined text-sm">
                    info
                  </span>
                  {Math.round(secondaryOptions[0].availabilityPercentage)}%
                  availability
                  {secondaryOptions[0].participantsInEarlyMorning > 0 &&
                    " • Early start for some"}
                </div>
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="w-full bg-slate-800 hover:bg-slate-900 text-white py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-2 shadow-sm"
                >
                  <span className="material-symbols-outlined text-sm">
                    calendar_add_on
                  </span>
                  Send Calendar Invite
                </button>
              </div>
            ) : (
              <div className="border border-slate-100 bg-slate-50/50 rounded-lg p-4 flex flex-col gap-4 items-center justify-center min-h-[180px]">
                <span className="material-symbols-outlined text-slate-300 text-4xl">
                  schedule
                </span>
                <p className="text-xs text-slate-500 text-center">
                  Limited overlap available. Consider flexible hours.
                </p>
              </div>
            )}
          </div>
        </div>
        <div className="pt-4 border-t border-slate-100 flex flex-col md:flex-row items-start md:items-center justify-between gap-2">
          <p className="text-[11px] text-slate-500 font-medium">
            Suggestions are calculated based on a 9:00 AM - 6:00 PM working
            window.
          </p>
          <button className="text-xs font-bold text-primary-accent hover:underline whitespace-nowrap">
            Customize Working Hours
          </button>
        </div>
      </div>

      <SendMeetingInvitation
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};
