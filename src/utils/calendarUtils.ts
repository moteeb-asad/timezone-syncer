/**
 * Utility functions for calendar integrations
 */

export interface CalendarEvent {
  title: string;
  startTime: string; // ISO format with timezone
  endTime: string; // ISO format with timezone
  description?: string;
  location?: string;
  attendees?: string[];
}

/**
 * Generates a Google Calendar URL with pre-filled event details
 * Opens in a new tab, allowing user to send invites directly from Google Calendar
 */
export function openGoogleCalendar(event: CalendarEvent): void {
  const baseUrl = "https://calendar.google.com/calendar/render";

  // Format dates for Google Calendar (YYYYMMDDTHHMMSSZ format)
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
  };

  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: event.title,
    dates: `${formatDate(event.startTime)}/${formatDate(event.endTime)}`,
  });

  // Add optional parameters
  if (event.description) {
    params.append("details", event.description);
  }

  if (event.location) {
    params.append("location", event.location);
  }

  if (event.attendees && event.attendees.length > 0) {
    params.append("add", event.attendees.join(","));
  }

  const url = `${baseUrl}?${params.toString()}`;
  window.open(url, "_blank");
}

/**
 * Formats timezone information as a readable string for event description
 */
export function formatTimezoneInfo(
  timezones: Array<{ name: string; time: string }>
): string {
  return timezones.map((tz) => `${tz.name}: ${tz.time}`).join("\n");
}
