import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address."),
  password: z.string().min(6, "Password must be at least 6 characters long."),
});

export type LoginSchema = z.infer<typeof loginSchema>;

export const signupSchema = z.object({
  firstName: z.string().min(1, "First name is required."),
  lastName: z.string().min(1, "Last name is required."),
  email: z.string().email("Please enter a valid email address."),
  password: z.string().min(6, "Password must be at least 6 characters long."),
});

export type SignupSchema = z.infer<typeof signupSchema>;

export const resetPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email address."),
});

export type ResetPasswordSchema = z.infer<typeof resetPasswordSchema>;

export const confirmResetPasswordSchema = z
  .object({
    password: z.string().min(6, "Password must be at least 6 characters long."),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

export type ConfirmResetPasswordSchema = z.infer<
  typeof confirmResetPasswordSchema
>;
