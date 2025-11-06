import { z } from "zod";

export const EditProfileSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters long")
    .max(10, "Name must be lesdan 10 characters long"),
  email: z.string().email("Invalid email address"),
  bio: z.string().optional(),
  expertise: z.string().optional(),
  yearsOfExperience: z
    .number()
    .min(0, "Years of experience cannot be negative")
    .max(50, "Are you sure you've worked for more than 50 years?"),
});
