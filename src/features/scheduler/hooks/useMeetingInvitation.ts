import { useState, useCallback } from "react";
import { openGoogleCalendar, formatTimezoneInfo } from "@/utils/calendarUtils";
import {
  isValidEmail,
  validateMeetingInvitation,
} from "../validation/meetingInvitation.schema";
import {
  calculateTimeRange,
  formatTimeRange,
} from "../utils/timezoneTimeCalculator";
import { meetingService } from "../services/meeting.service";
import type { MeetingTimeSlot } from "../types";

interface UseMeetingInvitationProps {
  meetingSlot: MeetingTimeSlot | null;
  baseTimezone: string;
  onSuccess?: (meetingId: string) => void;
}

interface UseMeetingInvitationReturn {
  recipients: string[];
  newRecipient: string;
  subject: string;
  personalNote: string;
  errors: {
    recipients?: string;
    subject?: string;
    personalNote?: string;
  };
  addRecipient: (email: string) => void;
  removeRecipient: (email: string) => void;
  setNewRecipient: (email: string) => void;
  setSubject: (subject: string) => void;
  setPersonalNote: (note: string) => void;
  handleSubmit: (userId: string) => Promise<boolean>;
  clearError: (field: keyof UseMeetingInvitationReturn["errors"]) => void;
}

/**
 * Hook for managing meeting invitation form state and logic
 */
export const useMeetingInvitation = ({
  meetingSlot,
  baseTimezone,
  onSuccess,
}: UseMeetingInvitationProps): UseMeetingInvitationReturn => {
  const [recipients, setRecipients] = useState<string[]>([]);
  const [newRecipient, setNewRecipient] = useState("");
  const [subject, setSubject] = useState("");
  const [personalNote, setPersonalNote] = useState("");
  const [errors, setErrors] = useState<{
    recipients?: string;
    subject?: string;
    personalNote?: string;
  }>({});

  const addRecipient = useCallback(
    (email: string) => {
      const trimmedEmail = email.trim();

      if (!trimmedEmail) return;

      if (!isValidEmail(trimmedEmail)) {
        setErrors((prev) => ({ ...prev, recipients: "Invalid email address" }));
        return;
      }

      if (recipients.includes(trimmedEmail)) {
        setErrors((prev) => ({ ...prev, recipients: "Email already added" }));
        return;
      }

      if (recipients.length >= 50) {
        setErrors((prev) => ({
          ...prev,
          recipients: "Maximum 50 recipients allowed",
        }));
        return;
      }

      setRecipients((prev) => [...prev, trimmedEmail]);
      setNewRecipient("");
      setErrors((prev) => ({ ...prev, recipients: undefined }));
    },
    [recipients]
  );

  const removeRecipient = useCallback((email: string) => {
    setRecipients((prev) => prev.filter((r) => r !== email));
    setErrors((prev) => ({ ...prev, recipients: undefined }));
  }, []);

  const clearError = useCallback(
    (field: keyof UseMeetingInvitationReturn["errors"]) => {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    },
    []
  );

  const handleSubmit = useCallback(
    async (userId: string) => {
      if (!meetingSlot) {
        return false;
      }

      // Validate form data
      const validation = validateMeetingInvitation({
        recipients,
        subject,
        personalNote,
      });

      if (!validation.success) {
        const fieldErrors: typeof errors = {};
        validation.error.issues.forEach((issue) => {
          const field = issue.path[0] as keyof typeof errors;
          fieldErrors[field] = issue.message;
        });
        setErrors(fieldErrors);
        return false;
      }

      try {
        // Save meeting to Firestore first
        const meetingId = await meetingService.createMeeting({
          userId,
          meetingSlot,
          baseTimezone,
          recipients,
          subject,
          personalNote: personalNote || undefined,
        });

        // Calculate meeting times
        const today = new Date();
        const [startHour, startMinute] = meetingSlot.startTime
          .split(":")
          .map(Number);
        const [endHour, endMinute] = meetingSlot.endTime.split(":").map(Number);

        const startTime = new Date(today);
        startTime.setHours(startHour, startMinute, 0, 0);

        const endTime = new Date(today);
        endTime.setHours(endHour, endMinute, 0, 0);

        // Format timezone information for description
        const timezoneInfo = formatTimezoneInfo(
          meetingSlot.timezoneDetails.map((detail) => {
            const endTime = calculateTimeRange(
              detail.localTime,
              meetingSlot.startTime,
              meetingSlot.endTime
            );
            const timeRange = formatTimeRange(detail.localTime, endTime);
            return {
              name: detail.timezone,
              time: timeRange,
            };
          })
        );

        const description = personalNote
          ? `${personalNote}\n\n--- Meeting Times by Timezone ---\n${timezoneInfo}`
          : `--- Meeting Times by Timezone ---\n${timezoneInfo}`;

        // Open Google Calendar
        openGoogleCalendar({
          title: subject,
          startTime: startTime.toISOString(),
          endTime: endTime.toISOString(),
          description,
          attendees: recipients,
        });

        // Call success callback with meeting ID
        onSuccess?.(meetingId);
        return true;
      } catch (error: unknown) {
        console.error("Error creating meeting:", error);
        const firebaseError = error as { code?: string; message?: string };

        // Provide more specific error messages
        let errorMessage = "Failed to save meeting. ";
        if (firebaseError?.code === "permission-denied") {
          errorMessage +=
            "Firestore permissions not configured. Please check Firebase Console → Firestore → Rules.";
        } else if (firebaseError?.message) {
          errorMessage += firebaseError.message;
        } else {
          errorMessage += "Please try again.";
        }

        setErrors({ recipients: errorMessage });
        return false;
      }
    },
    [meetingSlot, baseTimezone, recipients, subject, personalNote, onSuccess]
  );

  return {
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
  };
};
