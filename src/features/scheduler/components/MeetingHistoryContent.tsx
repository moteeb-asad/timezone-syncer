import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { meetingService } from "../services/meeting.service";
import type { Meeting } from "../types/meeting";
import type { RootState } from "@/store";
import { auth } from "@/lib/firebase";
import { MeetingCard } from "./MeetingCard";

type MeetingCategory = "upcoming" | "past" | "drafts";

export const MeetingHistoryContent = () => {
  const [activeCategory, setActiveCategory] =
    useState<MeetingCategory>("upcoming");
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedMeetingId, setExpandedMeetingId] = useState<string | null>(
    null
  );
  const { user } = useSelector((state: RootState) => state.user);

  const loadMeetings = async () => {
    const userId = auth?.currentUser?.uid || user?.uid;
    if (!userId) {
      setLoading(false);
      console.error("No userId found for meeting history.");
      return;
    }

    setLoading(true);
    try {
      let data: Meeting[] = [];
      if (activeCategory === "upcoming") {
        data = await meetingService.getUpcomingMeetings(userId);
      } else if (activeCategory === "past") {
        data = await meetingService.getPastMeetings(userId);
      } else {
        data = await meetingService.getDraftMeetings(userId);
      }
      setMeetings(data);
    } catch (error) {
      console.error("Error loading meetings:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMeetings();
    // Only depend on activeCategory and user to avoid infinite loop
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeCategory, user]);

  const handleToggleExpand = (meetingId: string) => {
    setExpandedMeetingId((prev) => (prev === meetingId ? null : meetingId));
  };

  const handleConfirmSent = async (meetingId: string) => {
    try {
      await meetingService.confirmMeetingSent(meetingId);
      setActiveCategory("upcoming");
    } catch (error) {
      console.error("Error confirming meeting:", error);
    }
  };

  const handleDeleteMeeting = async (meetingId: string) => {
    if (!confirm("Are you sure you want to delete this meeting?")) {
      return;
    }

    try {
      await meetingService.deleteMeeting(meetingId);
      await loadMeetings();
    } catch (error) {
      console.error("Error deleting meeting:", error);
      alert("Failed to delete meeting. Please try again.");
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-8">
      <div className="mb-8">
        <h2 className="text-lg font-bold text-slate-900">Meeting History</h2>
        <p className="text-sm text-slate-500">
          Track your scheduled meetings and invitations.
        </p>
      </div>

      {/* Category Tabs */}
      <div className="flex gap-2 mb-6 border-b border-slate-200">
        <button
          onClick={() => setActiveCategory("upcoming")}
          className={`px-4 py-2 text-sm font-semibold transition-colors ${
            activeCategory === "upcoming"
              ? "text-primary border-b-2 border-primary"
              : "text-slate-500 hover:text-slate-700"
          }`}
        >
          Upcoming
        </button>
        <button
          onClick={() => setActiveCategory("past")}
          className={`px-4 py-2 text-sm font-semibold transition-colors ${
            activeCategory === "past"
              ? "text-primary border-b-2 border-primary"
              : "text-slate-500 hover:text-slate-700"
          }`}
        >
          Past
        </button>
        <button
          onClick={() => setActiveCategory("drafts")}
          className={`px-4 py-2 text-sm font-semibold transition-colors ${
            activeCategory === "drafts"
              ? "text-primary border-b-2 border-primary"
              : "text-slate-500 hover:text-slate-700"
          }`}
        >
          Drafts
        </button>
      </div>

      {/* Meetings List */}
      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-primary border-t-transparent"></div>
            <p className="text-sm text-slate-500 mt-4">
              Loading meetingssss...
            </p>
          </div>
        ) : meetings.length === 0 ? (
          <div className="text-center py-12">
            <span className="material-symbols-outlined text-5xl text-slate-300 mb-4">
              event_busy
            </span>
            <p className="text-sm text-slate-500">
              {activeCategory === "upcoming"
                ? "No upcoming meetings scheduled."
                : activeCategory === "past"
                  ? "No past meetings found."
                  : "No draft invitations."}
            </p>
            <p className="text-xs text-red-500 mt-2">
              Meetings not found. Please check your account or try again later.
              <br />
              If you believe meetings should be shown, contact support or check
              the console for debug info.
            </p>
          </div>
        ) : (
          meetings.map((meeting) => (
            <MeetingCard
              key={meeting.id}
              meeting={meeting}
              isExpanded={expandedMeetingId === meeting.id}
              onToggleExpand={handleToggleExpand}
              onConfirmSent={handleConfirmSent}
              onDelete={handleDeleteMeeting}
            />
          ))
        )}
      </div>
    </div>
  );
};
