import type { MeetingTimeSlot } from "../../../features/scheduler/types";
import type { Timestamp } from "firebase/firestore";

/**
 * Meeting status types
 */
export type MeetingStatus =
  | "calendar_opened" // User opened Google Calendar
  | "user_confirmed_sent" // User confirmed they sent the invite
  | "cancelled"; // User cancelled the meeting

/**
 * Meeting document stored in Firestore
 */
export interface Meeting {
  id: string;
  userId: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  status: MeetingStatus;

  // Meeting details
  meetingSlot: MeetingTimeSlot;
  baseTimezone: string;

  // Invitation details
  recipients: string[];
  subject: string;
  personalNote?: string;

  // Tracking
  calendarOpened: boolean;
  userConfirmedSent: boolean;
  confirmedAt?: Timestamp;
  deletedAt?: Timestamp;
}

/**
 * Data to create a new meeting
 */
export interface CreateMeetingData {
  userId: string;
  meetingSlot: MeetingTimeSlot;
  baseTimezone: string;
  recipients: string[];
  subject: string;
  personalNote?: string;
}

/**
 * Meeting list item for display
 */
export interface MeetingListItem {
  id: string;
  subject: string;
  startTime: string;
  endTime: string;
  baseTimezone: string;
  recipients: string[];
  status: MeetingStatus;
  createdAt: Date;
  confirmedAt?: Date;
}

export interface MeetingCardProps {
  meeting: Meeting;
  isExpanded: boolean;
  onToggleExpand: (meetingId: string) => void;
  onConfirmSent: (meetingId: string) => void;
  onDelete: (meetingId: string) => void;
}
