import { z } from "zod";


// Zode validation schema for signUp
export const signUpFormSchema = z.object({
  name: z.string().trim().min(3, "Username must be at least 3 characters").max(20, "Enter a valid username"),
  email: z.string().email({
    message: "Email must be valid",
  }),
  password: z.string().trim().min(6, "Password should be at least 6 characters"),
  confirmPassword: z.string().min(6, "Confirm Password should be at least 6 characters"),
})
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });





// Zod validation schema for otp
export const otpFormSchema = z.object({
  otpOne: z.string().regex(/^\d$/, "Each field must be a single digit (0-9)"),
  otpTwo: z.string().regex(/^\d$/, "Each field must be a single digit (0-9)"),
  otpThree: z.string().regex(/^\d$/, "Each field must be a single digit (0-9)"),
  otpFour: z.string().regex(/^\d$/, "Each field must be a single digit (0-9)"),
});









// Zod validation schema for signIn
export const signInFormSchema = z.object({
  email: z.string().email({
    message: "Email must be valid",
  }),
  password: z.string().min(6, "Password should be at least 6 characters"),
});