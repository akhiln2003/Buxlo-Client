import { z } from "zod";

export const AdvFormSchema = z.object({
    title: z
      .string()
      .min(3, { message: "Title must be at least 3 characters" })
      .max(100, { message: "Title must be less than 100 characters" }),
    description: z
      .string()
      .min(10, { message: "Description must be at least 10 characters" })
      .max(500, { message: "Description must be less than 500 characters" }),
    image: z
      .instanceof(FileList)
      .refine((files) => files.length > 0, { message: "Image is required" })
      .refine((files) => files[0]?.size <= 5 * 1024 * 1024, {
        message: "Image must be less than 5MB",
      })
      .refine(
        (files) =>
          ["image/jpeg", "image/png", "image/gif"].includes(files[0]?.type),
        { message: "Only JPEG, PNG, and GIF images are allowed" }
      ),
  });
  