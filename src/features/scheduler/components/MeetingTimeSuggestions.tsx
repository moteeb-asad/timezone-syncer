import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import {
  getUserWorkingHours,
  saveUserWorkingHours,
} from "@/features/user/services/workingHours.service";
import { WorkingHoursModal } from "./WorkingHoursModal";
import type { WorkingHoursPreferences } from "./WorkingHoursModal";
import type { RootState } from "@/store";
import { useMeetingSuggestions } from "../hooks/useMeetingSuggestions";
import { SendMeetingInvitation } from "./SendMeetingInvitation";
import { Toast } from "@/components/ui/Toast";
import { meetingService } from "../services/meeting.service";
import { convertTo12HourFormat } from "../utils/timezoneTimeCalculator";
import type { MeetingTimeSlot } from "../types";

interface MeetingTimeSuggestionsProps {
  // timezoneCount is derived from timezoneSettings.length in the hook, but we can pass it as a prop for clarity in the UI layer
  timezoneCount: number;
}
export const MeetingTimeSuggestions = ({
// ...existing code...
}: Omit<MeetingTimeSuggestionsProps, 'timezoneCount'>) => {
  const userState = useSelector((state: RootState) => state.user);
  const timezoneState = useSelector((state: RootState) => state.timezone);

  const user = userState.user;
  const baseTime = timezoneState.baseTime;
  const timezoneSettings = timezoneState.timezoneSettings;

  const [workingHoursPrefs, setWorkingHoursPrefs] =
    useState<WorkingHoursPreferences | null>(null);
  const [isWHModalOpen, setIsWHModalOpen] = useState(false);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<MeetingTimeSlot | null>(
    null
  );
  const [showToast, setShowToast] = useState(false);
  const [currentMeetingId, setCurrentMeetingId] = useState<string | null>(null);

  // Load working hours preferences from Firestore
  useEffect(() => {
    if (!user?.uid) return;
    getUserWorkingHours(user.uid).then((prefs) => setWorkingHoursPrefs(prefs));
  }, [user?.uid]);

  // Meeting suggestions with working hours
  const { goldenWindow, secondaryOptions, hasEnoughData } =
    useMeetingSuggestions(workingHoursPrefs || undefined);

  const handleOpenInviteModal = (slot: MeetingTimeSlot) => {
    setSelectedSlot(slot);
    setIsInviteModalOpen(true);
  };
  const handleCloseInviteModal = () => {
    setIsInviteModalOpen(false);
    setSelectedSlot(null);
  };
  const handleMeetingCreated = (meetingId: string) => {
    handleCloseInviteModal();
    setTimeout(() => {
      setCurrentMeetingId(meetingId);
      setShowToast(true);
    }, 500);
  };
  const handleToastConfirm = async () => {
    if (currentMeetingId) {
      try {
        await meetingService.confirmMeetingSent(currentMeetingId);
        setShowToast(false);
        setCurrentMeetingId(null);
      } catch (error) {
        console.error("Error confirming meeting:", error);
      }
    }
  };
  const handleToastDismiss = () => {
    setShowToast(false);
    setCurrentMeetingId(null);
  };

  // Save working hours preferences
  const handleSaveWorkingHours = async (prefs: WorkingHoursPreferences) => {
    if (!user?.uid) return;
    await saveUserWorkingHours(user.uid, prefs);
    setWorkingHoursPrefs(prefs);
  };

  if (!hasEnoughData) return null;

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
                      {convertTo12HourFormat(goldenWindow.startTime)} -{" "}
                      {convertTo12HourFormat(goldenWindow.endTime)}
                    </p>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center">
                    <span className="material-symbols-outlined text-emerald-600">
                      done_all
                    </span>
                  </div>
                </div>
                {/* <div className="flex items-center gap-2 text-[10px] font-medium text-slate-500">
                  <span className="material-symbols-outlined text-sm">
                    groups
                  </span>
                  {goldenWindow.participantsAvailable} of {timezoneCount}{" "}
                  participants available
                  <br />
                  <span>
                    Available: {goldenWindow.explanation?.available.join(", ")}
                  </span>
                  {goldenWindow.explanation?.unavailable.early.length > 0 && (
                    <span>
                      {" "}
                      • Early:{" "}
                      {goldenWindow.explanation.unavailable.early.join(", ")}
                    </span>
                  )}
                  {goldenWindow.explanation?.unavailable.late.length > 0 && (
                    <span>
                      {" "}
                      • Late:{" "}
                      {goldenWindow.explanation.unavailable.late.join(", ")}
                    </span>
                  )}
                  {goldenWindow.explanation?.unavailable.night.length > 0 && (
                    <span>
                      {" "}
                      • Night:{" "}
                      {goldenWindow.explanation.unavailable.night.join(", ")}
                    </span>
                  )}
                </div> */}
                <button
                  onClick={() => handleOpenInviteModal(goldenWindow)}
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
                      {convertTo12HourFormat(secondaryOptions[0].startTime)} -{" "}
                      {convertTo12HourFormat(secondaryOptions[0].endTime)}
                    </p>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center">
                    <span className="material-symbols-outlined text-amber-600">
                      event_repeat
                    </span>
                  </div>
                </div>
                {/* <div className="flex items-center gap-2 text-[10px] font-medium text-slate-500">
                  <span className="material-symbols-outlined text-sm">
                    info
                  </span>
                  {secondaryOptions[0].participantsAvailable} of {timezoneCount}{" "}
                  participants available
                  <br />
                  <span>
                    Available:{" "}
                    {secondaryOptions[0].explanation &&
                    Array.isArray(secondaryOptions[0].explanation.available)
                      ? secondaryOptions[0].explanation.available.join(", ")
                      : "-"}
                  </span>
                  {secondaryOptions[0].explanation &&
                    secondaryOptions[0].explanation.unavailable &&
                    Array.isArray(
                      secondaryOptions[0].explanation.unavailable.early
                    ) &&
                    secondaryOptions[0].explanation.unavailable.early.length >
                      0 && (
                      <span>
                        {" "}
                        • Early:{" "}
                        {secondaryOptions[0].explanation.unavailable.early.join(
                          ", "
                        )}
                      </span>
                    )}
                  {secondaryOptions[0].explanation &&
                    secondaryOptions[0].explanation.unavailable &&
                    Array.isArray(
                      secondaryOptions[0].explanation.unavailable.late
                    ) &&
                    secondaryOptions[0].explanation.unavailable.late.length >
                      0 && (
                      <span>
                        {" "}
                        • Late:{" "}
                        {secondaryOptions[0].explanation.unavailable.late.join(
                          ", "
                        )}
                      </span>
                    )}
                  {secondaryOptions[0].explanation &&
                    secondaryOptions[0].explanation.unavailable &&
                    Array.isArray(
                      secondaryOptions[0].explanation.unavailable.night
                    ) &&
                    secondaryOptions[0].explanation.unavailable.night.length >
                      0 && (
                      <span>
                        {" "}
                        • Night:{" "}
                        {secondaryOptions[0].explanation.unavailable.night.join(
                          ", "
                        )}
                      </span>
                    )}
                  {typeof secondaryOptions[0].improvement === "number" && (
                    <span>
                      {" "}
                      • Improves availability by{" "}
                      {secondaryOptions[0].improvement}
                    </span>
                  )}
                </div> */}
                <button
                  onClick={() => handleOpenInviteModal(secondaryOptions[0])}
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
            Suggestions are calculated based on{" "}
            {workingHoursPrefs?.defaultHours.start ?? "09:00"} -{" "}
            {workingHoursPrefs?.defaultHours.end ?? "18:00"} working window.
          </p>
          <button
            className="text-xs font-bold text-primary-accent hover:underline whitespace-nowrap"
            onClick={() => setIsWHModalOpen(true)}
          >
            Customize Working Hours
          </button>
        </div>
      </div>

      <SendMeetingInvitation
        isOpen={isInviteModalOpen}
        onClose={handleCloseInviteModal}
        meetingSlot={selectedSlot}
        baseTimezone={baseTime.timezone}
        onMeetingCreated={handleMeetingCreated}
      />

      {/* Working Hours Modal */}
      <WorkingHoursModal
        isOpen={isWHModalOpen}
        onClose={() => setIsWHModalOpen(false)}
        onSave={handleSaveWorkingHours}
        initial={workingHoursPrefs || undefined}
        timezones={timezoneSettings.map((tz) => tz.timezone.name)}
      />

      {/* Toast Notification */}
      <Toast
        message="Calendar opened. Did you send the invite?"
        isVisible={showToast}
        onConfirm={handleToastConfirm}
        onDismiss={handleToastDismiss}
        confirmLabel="Yes, I sent it"
        dismissLabel="I'll send later"
      />
    </div>
  );
};
