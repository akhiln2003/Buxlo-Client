import { z } from "zod";

export const EditProfileSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters long")
    .max(10, "Name must be lesdan 10 characters long"),
  email: z.string().email("Invalid email address"),
});
