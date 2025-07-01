import { z } from "zod";

export const ChangePasswordSchema = z
  .object({
    currentPassword: z
      .string()
      .trim()
      .min(6, "Password should be at least 6 characters"),
    newPassword: z
      .string()
      .trim()
      .min(6, "New password should be at least 6 characters"),
    confirmNewPassword: z
      .string()
      .trim()
      .min(6, "Confirm password should be at least 6 characters"),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    path: ["confirmNewPassword"], 
    message: "Passwords do not match",
  });
