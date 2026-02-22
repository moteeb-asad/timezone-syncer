import {
  collection,
  addDoc,
  updateDoc,
  doc,
  query,
  where,
  orderBy,
  getDocs,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import type {
  CreateMeetingData,
  Meeting,
  MeetingStatus,
} from "../types/meeting";

const MEETINGS_COLLECTION = "meetings";

/**
 * Meeting service for Firestore operations
 */
export const meetingService = {
  /**
   * Create a new meeting document
   */
  async createMeeting(data: CreateMeetingData): Promise<string> {
    if (!db) {
      throw new Error("Firebase not initialized");
    }

    const meetingData = {
      ...data,
      status: "calendar_opened" as MeetingStatus,
      calendarOpened: true,
      userConfirmedSent: false,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    const docRef = await addDoc(
      collection(db, MEETINGS_COLLECTION),
      meetingData
    );

    return docRef.id;
  },

  /**
   * Update meeting status to confirmed
   */
  async confirmMeetingSent(meetingId: string): Promise<void> {
    if (!db) {
      throw new Error("Firebase not initialized");
    }

    const meetingRef = doc(db, MEETINGS_COLLECTION, meetingId);
    await updateDoc(meetingRef, {
      status: "user_confirmed_sent",
      userConfirmedSent: true,
      confirmedAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  },

  /**
   * Cancel a meeting
   */
  async cancelMeeting(meetingId: string): Promise<void> {
    if (!db) {
      throw new Error("Firebase not initialized");
    }

    const meetingRef = doc(db, MEETINGS_COLLECTION, meetingId);
    await updateDoc(meetingRef, {
      status: "cancelled",
      updatedAt: serverTimestamp(),
    });
  },

  /**
   * Delete a meeting
   */
  async deleteMeeting(meetingId: string): Promise<void> {
    if (!db) {
      throw new Error("Firebase not initialized");
    }

    const meetingRef = doc(db, MEETINGS_COLLECTION, meetingId);
    await updateDoc(meetingRef, {
      status: "cancelled",
      deletedAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  },

  /**
   * Get all meetings for a user
   */
  async getUserMeetings(userId: string): Promise<Meeting[]> {
    if (!db) {
      throw new Error("Firebase not initialized");
    }

    const q = query(
      collection(db, MEETINGS_COLLECTION),
      where("userId", "==", userId),
      orderBy("createdAt", "desc")
    );

    const querySnapshot = await getDocs(q);
    const meetings: Meeting[] = [];

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      meetings.push({
        id: doc.id,
        ...data,
      } as Meeting);
    });

    return meetings;
  },

  /**
   * Get upcoming meetings (confirmed and in the future)
   */
  async getUpcomingMeetings(userId: string): Promise<Meeting[]> {
    const allMeetings = await this.getUserMeetings(userId);

    return allMeetings.filter((meeting) => {
      if (meeting.status !== "user_confirmed_sent") return false;

      // Use meeting start time for comparison (previous logic)
      const now = new Date();
      const meetingStart = this.parseMeetingDateTime(meeting);
      return meetingStart > now;
    });
  },

  /**
   * Get draft meetings (calendar opened but not confirmed)
   */
  async getDraftMeetings(userId: string): Promise<Meeting[]> {
    const allMeetings = await this.getUserMeetings(userId);
    return allMeetings.filter(
      (meeting) => meeting.status === "calendar_opened"
    );
  },

  /**
   * Get past meetings (confirmed and time has passed)
   */
  async getPastMeetings(userId: string): Promise<Meeting[]> {
    const allMeetings = await this.getUserMeetings(userId);

    return allMeetings.filter((meeting) => {
      if (meeting.status !== "user_confirmed_sent") return false;

      // Use meeting end time for comparison
      const now = new Date();
      const meetingStart = this.parseMeetingDateTime(meeting);
      // Calculate end time from start + duration
      const durationMinutes =
        meeting.meetingSlot &&
        meeting.meetingSlot.endTime &&
        meeting.meetingSlot.startTime
          ? parseInt(meeting.meetingSlot.endTime.split(":")[0], 10) * 60 +
            parseInt(meeting.meetingSlot.endTime.split(":")[1], 10) -
            (parseInt(meeting.meetingSlot.startTime.split(":")[0], 10) * 60 +
              parseInt(meeting.meetingSlot.startTime.split(":")[1], 10))
          : 60;
      const meetingEnd = new Date(
        meetingStart.getTime() + durationMinutes * 60 * 1000
      );

      // Show meeting if it has ended
      return meetingEnd <= now;
    });
  },

  /**
   * Parse meeting date/time from stored data
   * Assumes meeting is scheduled for today at the stored time
   * If created date + meeting time is in the past, assumes it was for today
   */
  parseMeetingDateTime(meeting: Meeting): Date {
    const createdDate = (meeting.createdAt as Timestamp).toDate();
    const [hours, minutes] = meeting.meetingSlot.startTime
      .split(":")
      .map(Number);

    // Create date object for meeting time on the creation date
    const meetingDateTime = new Date(createdDate);
    meetingDateTime.setHours(hours, minutes, 0, 0);

    return meetingDateTime;
  },
};
