// ...existing code...
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { getUserWorkingHours } from "@/features/user/services/workingHours.service";
import { WorkingHoursModal } from "../../components/WorkingHours/WorkingHoursModal";
import type { RootState } from "@/store";
import { MeetingInvitationModal } from "../SendMeetingInvitation/MeetingInvitationModal";
import { Toast } from "@/components/ui/Toast";
import { meetingService } from "../../services/meeting.service";
import type { MeetingTimeSlot } from "../../types";
import GoldenWindowCard from "./GoldenWindowCard";
import SecondaryOptionCard from "./SecondaryOptionCard";
import { useWorkingHours } from "@/features/user/hooks/useWorkingHours";

export const MeetingTimeSuggestions = () => {
  const userState = useSelector((state: RootState) => state.user);
  const timezoneState = useSelector((state: RootState) => state.timezone);

  const user = userState.user;
  const baseTime = timezoneState.baseTime;
  const timezoneSettings = timezoneState.timezoneSettings;

  const { workingHoursPrefs, setWorkingHoursPrefs, handleSaveWorkingHours } =
    useWorkingHours(user);
  const [isWHModalOpen, setIsWHModalOpen] = useState(false);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<MeetingTimeSlot | null>(
    null
  );
  const [showToast, setShowToast] = useState(false);
  const [currentMeetingId, setCurrentMeetingId] = useState<string | null>(null);

  const timezoneStateInRedux = useSelector(
    (state: RootState) => state.timezone
  );
  console.log("Timezone In Redux slice:", timezoneStateInRedux);

  // Load working hours preferences from Firestore
  useEffect(() => {
    if (!user?.uid) return;
    getUserWorkingHours(user.uid).then((prefs) => setWorkingHoursPrefs(prefs));
  }, [user?.uid, setWorkingHoursPrefs]);

  // ...existing code...
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            {/* Golden Window Card */}
            <GoldenWindowCard />

            {/* Secondary Option Card */}
            <SecondaryOptionCard />
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

      <MeetingInvitationModal
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
