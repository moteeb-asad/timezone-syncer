/**
 * Meeting time slot with availability score
 */
export interface MeetingTimeSlot {
  startTime: string; // "14:00"
  endTime: string; // "16:00"
  availabilityPercentage: number; // 0-100
  participantsAvailable: number;
  participantsInNightTime: number;
  participantsInEarlyMorning: number;
  score: number; // Weighted score for sorting
  timezoneDetails: Array<{
    timezone: string;
    localTime: string;
    isWorkingHours: boolean;
    isOptimalTime: boolean; // 10am-4pm
  }>;
}

/**
 * Working hours configuration per timezone
 */
export interface WorkingHours {
  start: string; // "09:00"
  end: string; // "18:00"
  timezone?: string; // Optional: specific timezone override
}

/**
 * User's custom working hours preferences
 */
export interface UserWorkingHoursPreference {
  enabled: boolean;
  defaultHours: WorkingHours;
  timezoneOverrides?: Record<string, WorkingHours>; // Timezone-specific hours
}

/**
 * Meeting suggestion result
 */
export interface MeetingSuggestion {
  goldenWindow: MeetingTimeSlot | null; // 100% availability
  secondaryOptions: MeetingTimeSlot[]; // 75%+ availability, sorted by score
  allSlots: MeetingTimeSlot[]; // For advanced UI (heatmap, etc.)
}

/**
 * Input for calculating meeting suggestions
 */
export interface MeetingSuggestionInput {
  baseTimezone: string;
  selectedTimezones: string[];
  workingHours?: UserWorkingHoursPreference;
  meetingDuration?: number; // minutes, default 60
  slotIncrement?: number; // minutes, default 30
}
