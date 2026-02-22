import type { MeetingTimeSlot } from "../types";

/**
 * Meeting invitation form data
 */
export interface MeetingInvitationData {
  recipients: string[];
  subject: string;
  personalNote: string;
  meetingSlot: MeetingTimeSlot;
  baseTimezone: string;
}

/**
 * Props for SendMeetingInvitation component
 */
export interface SendMeetingInvitationProps {
  isOpen: boolean;
  onClose: () => void;
  meetingSlot: MeetingTimeSlot | null;
  baseTimezone: string;
  onMeetingCreated?: (meetingId: string) => void;
}

/**
 * Timezone detail for display in invitation
 */
export interface TimezoneDisplayInfo {
  name: string;
  time: string;
  isWorkingHours: boolean;
}
