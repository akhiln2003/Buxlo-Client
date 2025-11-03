import { z } from "zod";

export const feedbackSchema = z.object({
  star: z
    .number()
    .min(1, "Please select a star rating")
    .max(5, "Star rating cannot exceed 5"),
  message: z
    .string()
    .trim()
    .min(10, "Feedback must be at least 10 characters")
    .max(500, "Feedback must not exceed 500 characters"),
});
