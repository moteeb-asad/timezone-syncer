import type { Timestamp } from "firebase/firestore";
import { convertTo12HourFormat } from "../utils/timezoneTimeCalculator";
import type { Meeting } from "../types/meeting";

interface MeetingCardProps {
  meeting: Meeting;
  isExpanded: boolean;
  onToggleExpand: (meetingId: string) => void;
  onConfirmSent: (meetingId: string) => void;
  onDelete: (meetingId: string) => void;
}

const getStatusBadge = (status: string) => {
  switch (status) {
    case "user_confirmed_sent":
      return (
        <span className="px-2 py-1 text-xs font-semibold bg-emerald-100 text-emerald-700 rounded-full">
          Confirmed
        </span>
      );
    case "calendar_opened":
      return (
        <span className="px-2 py-1 text-xs font-semibold bg-amber-100 text-amber-700 rounded-full">
          Draft
        </span>
      );
    case "cancelled":
      return (
        <span className="px-2 py-1 text-xs font-semibold bg-slate-100 text-slate-600 rounded-full">
          Cancelled
        </span>
      );
    default:
      return null;
  }
};

const formatDate = (timestamp: Timestamp | Date | undefined) => {
  if (!timestamp) return "";
  const date =
    timestamp instanceof Date ? timestamp : (timestamp as Timestamp).toDate();
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
};

export const MeetingCard = ({
  meeting,
  isExpanded,
  onToggleExpand,
  onConfirmSent,
  onDelete,
}: MeetingCardProps) => {
  return (
    <div className="border border-slate-200 rounded-lg hover:border-primary/30 hover:shadow-sm transition-all">
      <div className="p-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="font-semibold text-slate-900">
                {meeting.subject}
              </h3>
              {getStatusBadge(meeting.status)}
            </div>

            <div className="space-y-1 text-sm text-slate-600">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-base">
                  schedule
                </span>
                <span>
                  {convertTo12HourFormat(meeting.meetingSlot.startTime)} -{" "}
                  {convertTo12HourFormat(meeting.meetingSlot.endTime)} (
                  {meeting.baseTimezone})
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-base">
                  person
                </span>
                <span>
                  {meeting.recipients.length} participant
                  {meeting.recipients.length !== 1 ? "s" : ""}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-base">
                  calendar_today
                </span>
                <span className="text-xs text-slate-500">
                  Created {formatDate(meeting.createdAt)}
                </span>
              </div>
            </div>

            {!isExpanded && meeting.personalNote && (
              <div className="mt-3 p-2 bg-slate-50 rounded text-xs text-slate-600 line-clamp-2">
                {meeting.personalNote}
              </div>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <button
              onClick={() => onToggleExpand(meeting.id)}
              className="px-3 py-1.5 text-xs font-semibold text-primary hover:bg-primary/5 rounded transition-colors flex items-center gap-1"
            >
              {isExpanded ? "Hide Details" : "View Details"}
              <span className="material-symbols-outlined text-sm">
                {isExpanded ? "expand_less" : "expand_more"}
              </span>
            </button>
            {meeting.status === "calendar_opened" && (
              <button
                onClick={() => onConfirmSent(meeting.id)}
                className="px-3 py-1.5 text-xs font-semibold text-emerald-600 hover:bg-emerald-50 rounded transition-colors"
              >
                Mark as Sent
              </button>
            )}
            <button
              onClick={() => onDelete(meeting.id)}
              className="px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50 rounded transition-colors"
              title="Delete meeting"
            >
              Delete
            </button>
          </div>
        </div>

        {/* Expanded Details */}
        {isExpanded && (
          <div className="mt-4 pt-4 border-t border-slate-100 space-y-4">
            {/* Participants Section */}
            <div>
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                Participants ({meeting.recipients.length})
              </h4>
              <div className="space-y-1">
                {meeting.recipients.map((email, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-2 bg-slate-50 rounded text-sm"
                  >
                    <span className="text-slate-700">{email}</span>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(email);
                      }}
                      className="text-xs text-slate-500 hover:text-primary transition-colors"
                      title="Copy email"
                    >
                      <span className="material-symbols-outlined text-base">
                        content_copy
                      </span>
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Timezone Breakdown */}
            <div>
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                Local Times in Each Timezone
              </h4>
              <div className="space-y-1">
                {meeting.meetingSlot.timezoneDetails.map((detail, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-2 bg-slate-50 rounded text-sm"
                  >
                    <span className="font-medium text-slate-700">
                      {detail.timezone}
                    </span>
                    <span
                      className={`font-semibold ${detail.isWorkingHours ? "text-slate-900" : "text-amber-600"}`}
                    >
                      {convertTo12HourFormat(detail.localTime)}
                    </span>
                  </div>
                ))}
              </div>
              <p className="text-xs text-slate-500 mt-2">
                <span className="text-amber-600">●</span> Amber = Outside
                working hours
              </p>
            </div>

            {/* Personal Note */}
            {meeting.personalNote && (
              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Personal Note
                </h4>
                <div className="p-3 bg-slate-50 rounded text-sm text-slate-600">
                  {meeting.personalNote}
                </div>
              </div>
            )}

            {/* Metadata */}
            <div className="pt-3 border-t border-slate-100">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>Created: {formatDate(meeting.createdAt)}</span>
                {meeting.confirmedAt && (
                  <span>Confirmed: {formatDate(meeting.confirmedAt)}</span>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
