import { z } from "zod";

const passwordValidation = z
  .string()
  .min(6, "Password must be at least 6 characters long")
  .regex(
    /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]+$/,
    "Password must contain at least one letter, one number, and one special character"
  );

// Zod validation schema for signUp
export const signUpFormSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(3, "Username must be at least 3 characters")
      .max(20, "Enter a valid username"),
    email: z.string().email({
      message: "Email must be valid",
    }),
    password: passwordValidation,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords must match",
  });

// Zod validation schema for set New password
export const NewPasswordFormSchema = z
  .object({
    password: passwordValidation,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords must match",
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
  password: passwordValidation,
});


// Zod validation schema for forgot password
export const ForgotPasswordFormSchema = z.object({
  email: z.string().email({
    message: "Email must be valid",
  }),
});