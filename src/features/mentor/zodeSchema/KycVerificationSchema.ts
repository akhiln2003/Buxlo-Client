import { z } from "zod";

// Enhanced Zod schema with image validation
export const KycVerificationSchema = z.object({
  fullName: z.string().min(2, { message: "Full name is required" }),
  aadhaarNumber: z.string().regex(/^\d{12}$/, { message: "Aadhaar number must be 12 digits" }),
  frontImage: z.instanceof(File)
    .refine(file => file.size > 0, { message: "Front image is required" })
    .refine(file => file.size <= 5 * 1024 * 1024, { message: "Image must be less than 5MB" })
    .refine(
      file => ['image/jpeg', 'image/png', 'image/webp'].includes(file.type), 
      { message: "Only JPEG, PNG, and WebP images are allowed" }
    ),
  backImage: z.instanceof(File)
    .refine(file => file.size > 0, { message: "Back image is required" })
    .refine(file => file.size <= 5 * 1024 * 1024, { message: "Image must be less than 5MB" })
    .refine(
      file => ['image/jpeg', 'image/png', 'image/webp'].includes(file.type), 
      { message: "Only JPEG, PNG, and WebP images are allowed" }
    ),
});