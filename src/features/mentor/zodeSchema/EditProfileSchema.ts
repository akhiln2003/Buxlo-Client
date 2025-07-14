import { z } from "zod";

export const EditProfileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters long"),
  email: z.string().email("Invalid email address"),
  bio: z.string().optional(),
  expertise: z.string().optional(),
  yearsOfExperience: z
    .number()
    .min(0, "Years of experience cannot be negative")
    .max(50, "Are you sure you've worked for more than 50 years?"),
  salary: z.number().min(0, "Salary cannot be negative"),
});
