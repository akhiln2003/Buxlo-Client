import { z } from "zod";

export const KycVerificationSchema = z.object({
  fullName: z.string({
    required_error: "Aadhaar Name is required",
  })
    .min(3, "Aadhaar Name cannot be less than 3 characters")
    .regex(/^[a-zA-Z\s]+$/, "Aadhaar Name must contain only alphabets and spaces"),
  aadhaarNumber: z.string().regex(/^\d{12}$/, { message: "Aadhaar number must be 12 digits" }),
  frontImage: z.custom<File>((val) => val instanceof File, "Must be a file")
    .optional()
    .refine((file) => {
      if (!file) return false;
      return file.size > 0;
    }, { message: "Front image is required" })
    .refine((file) => {
      if (!file) return false;
      return file.size <= 5 * 1024 * 1024;
    }, { message: "Image must be less than 5MB" })
    .refine(
      (file) => {
        if (!file) return false;
        return ['image/jpeg', 'image/png', 'image/webp'].includes(file.type);
      },
      { message: "Only JPEG, PNG, and WebP images are allowed" }
    ),
  backImage: z.custom<File>((val) => val instanceof File, "Must be a file")
    .optional()
    .refine((file) => {
      if (!file) return false;
      return file.size > 0;
    }, { message: "Back image is required" })
    .refine((file) => {
      if (!file) return false;
      return file.size <= 5 * 1024 * 1024;
    }, { message: "Image must be less than 5MB" })
    .refine(
      (file) => {
        if (!file) return false;
        return ['image/jpeg', 'image/png', 'image/webp'].includes(file.type);
      },
      { message: "Only JPEG, PNG, and WebP images are allowed" }
    ),
});

// This will help TypeScript understand the shape of your form data
export type KycVerificationData = z.infer<typeof KycVerificationSchema>;