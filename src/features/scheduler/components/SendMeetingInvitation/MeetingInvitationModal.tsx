import { useSelector } from "react-redux";
import { Modal } from "../../../../components/ui/Modal";
import { Button } from "../../../../components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { useMeetingInvitation } from "../../hooks/useMeetingInvitation";
import {
  calculateTimeRange,
  formatTimeRange,
  convertTo12HourFormat,
} from "../../../../utils/timeUtils";
import type { SendMeetingInvitationProps } from "../../types/meetingInvitation";
import type { RootState } from "@/store";
import { auth } from "@/lib/firebase";

export const MeetingInvitationModal = ({
  isOpen,
  onClose,
  meetingSlot,
  baseTimezone,
  onMeetingCreated,
}: SendMeetingInvitationProps) => {
  const { user } = useSelector((state: RootState) => state.user);

  const {
    recipients,
    newRecipient,
    subject,
    personalNote,
    errors,
    addRecipient,
    removeRecipient,
    setNewRecipient,
    setSubject,
    setPersonalNote,
    handleSubmit,
    clearError,
  } = useMeetingInvitation({
    meetingSlot,
    baseTimezone,
    onSuccess: onMeetingCreated,
  });

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addRecipient(newRecipient);
    }
  };

  const handleCreateInvite = async () => {
    const userId = auth?.currentUser?.uid || user?.uid;
    if (!userId) {
      console.error("User not authenticated");
      return;
    }

    await handleSubmit(userId);
  };

  if (!meetingSlot) {
    return null;
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Send Meeting Invitation">
      <div className="p-6 space-y-5">
        {/* Recipients Input */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Recipients
          </label>
          <div className="flex flex-wrap gap-2 p-2 border border-slate-200 rounded-lg focus-within:ring-1 focus-within:ring-primary-accent focus-within:border-primary-accent min-h-[42px] bg-slate-50/50">
            {recipients.map((email) => (
              <div
                key={email}
                className="flex items-center gap-1.5 px-2.5 py-1 bg-white border border-slate-200 rounded-full text-xs font-medium text-slate-600"
              >
                <span>{email}</span>
                <span
                  className="material-symbols-outlined text-sm cursor-pointer hover:text-rose-500"
                  onClick={() => removeRecipient(email)}
                >
                  close
                </span>
              </div>
            ))}
            <input
              className="flex-1 bg-transparent border-none focus-visible:outline-none text-sm p-0 h-6 min-w-[100px]"
              placeholder="Add email..."
              type="email"
              value={newRecipient}
              onChange={(e) => {
                setNewRecipient(e.target.value);
                if (errors.recipients) clearError("recipients");
              }}
              onKeyDown={handleKeyDown}
              onBlur={() => addRecipient(newRecipient)}
            />
          </div>
          {errors.recipients && (
            <p className="text-xs text-rose-500 font-medium">
              {errors.recipients}
            </p>
          )}
        </div>

        {/* Subject Input */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Subject
          </label>
          <Input
            className="py-2 px-3 focus:ring-primary-accent focus:border-primary-accent"
            type="text"
            placeholder="e.g., Team Sync - Timezone Overlap"
            value={subject}
            onChange={(e) => {
              setSubject(e.target.value);
              if (errors.subject) clearError("subject");
            }}
          />
          {errors.subject && (
            <p className="text-xs text-rose-500 font-medium">
              {errors.subject}
            </p>
          )}
        </div>

        {/* Meeting Window Display */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Meeting Window
          </label>
          <div className="bg-slate-900 text-white rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-bold text-slate-300">
                {convertTo12HourFormat(meetingSlot.startTime)} -{" "}
                {convertTo12HourFormat(meetingSlot.endTime)} ({baseTimezone})
              </span>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary-accent text-sm">
                  schedule
                </span>
                {meetingSlot.availabilityPercentage === 100 && (
                  <span className="text-[10px] px-2 py-0.5 bg-emerald-500/20 text-emerald-300 rounded-full font-bold">
                    100% Available
                  </span>
                )}
              </div>
            </div>
            <div className="space-y-2 border-t border-slate-800 pt-3">
              <p className="text-[10px] text-slate-500 uppercase tracking-wide font-semibold mb-2">
                Local Times in Each Timezone
              </p>
              <div className="grid grid-cols-1 gap-2 max-h-[180px] overflow-y-auto">
                {meetingSlot.timezoneDetails.map((detail, index) => {
                  const endTime = calculateTimeRange(
                    detail.localTime,
                    meetingSlot.startTime,
                    meetingSlot.endTime
                  );
                  const timeRange = formatTimeRange(detail.localTime, endTime);

                  return (
                    <div
                      key={index}
                      className="flex justify-between items-center"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] text-slate-400 font-medium">
                          {detail.timezone}
                        </span>
                      </div>
                      <span
                        className={`text-xs font-bold ${
                          detail.isWorkingHours
                            ? "text-white"
                            : "text-amber-400"
                        }`}
                        title={
                          detail.isWorkingHours
                            ? "Working hours"
                            : "Outside working hours"
                        }
                      >
                        {timeRange}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Personal Note Textarea */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Personal Note
          </label>
          <Textarea
            className="py-2 px-3 focus:ring-primary-accent focus:border-primary-accent"
            placeholder="Add a short message for the participants..."
            rows={3}
            value={personalNote}
            onChange={(e) => {
              setPersonalNote(e.target.value);
              if (errors.personalNote) clearError("personalNote");
            }}
          />
          {errors.personalNote && (
            <p className="text-xs text-rose-500 font-medium">
              {errors.personalNote}
            </p>
          )}
          <p className="text-[10px] text-slate-400">
            This message will be included in the calendar invite description
          </p>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="px-6 py-4 bg-slate-50/50 border-t border-slate-100">
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-end gap-3 w-full">
            <Button
              variant="outline"
              onClick={onClose}
              className="px-4 py-2 text-xs uppercase tracking-wider"
            >
              Cancel
            </Button>
            <Button
              className="px-6 py-2.5 bg-primary-accent hover:bg-[#ef5a46] text-white text-xs uppercase tracking-wider"
              onClick={handleCreateInvite}
            >
              <span className="material-symbols-outlined text-sm">event</span>
              Create Calendar Invite
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};
