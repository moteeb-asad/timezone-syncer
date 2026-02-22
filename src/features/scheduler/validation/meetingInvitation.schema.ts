import { z } from "zod";

/**
 * Email validation regex (basic but covers most cases)
 */
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Zod schema for meeting invitation form
 */
export const meetingInvitationSchema = z.object({
  recipients: z
    .array(z.string().email("Invalid email address"))
    .min(1, "At least one recipient is required")
    .max(50, "Maximum 50 recipients allowed"),

  subject: z
    .string()
    .min(1, "Subject is required")
    .max(200, "Subject must be less than 200 characters")
    .trim(),

  personalNote: z
    .string()
    .max(1000, "Personal note must be less than 1000 characters")
    .optional(),
});

/**
 * Type inference from schema
 */
export type MeetingInvitationFormData = z.infer<typeof meetingInvitationSchema>;

/**
 * Validate a single email address
 */
export const isValidEmail = (email: string): boolean => {
  return emailRegex.test(email.trim());
};

/**
 * Validate the entire form and return errors
 */
export const validateMeetingInvitation = (data: unknown) => {
  return meetingInvitationSchema.safeParse(data);
};
