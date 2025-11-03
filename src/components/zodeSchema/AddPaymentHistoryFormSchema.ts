import { IPaymentHistoryStatus } from "@/@types/IPaymentStatus";
import { IPaymentType } from "@/@types/IPaymentType";
import { z } from "zod";

export const paymentFormSchema = z.object({
  amount: z
    .number()
    .min(0.01, "Amount must be greater than 0")
    .max(999999.99, "Amount must be less than 1,000,000"),
  status: z.nativeEnum(IPaymentHistoryStatus, {
    errorMap: () => ({ message: "Please select a valid status" }),
  }),
  type: z.nativeEnum(IPaymentType, {
    errorMap: () => ({
      message: "Please select payment type (Credit or Debit)",
    }),
  }),
  paymentId: z
    .string()
    .trim()
    .min(1, "Payment ID is required")
    .regex(
      /^[a-zA-Z0-9-_]+$/,
      "Payment ID can only contain letters, numbers, hyphens, and underscores"
    ),
  category: z
    .string()
    .trim()
    .min(1, "Category is required")
    .max(50, "Category must be less than 50 characters"),
  transactionDate: z
    .string()
    .min(1, "Transaction date is required")
    .refine((val) => {
      const date = new Date(val);
      return !isNaN(date.getTime()) && date <= new Date();
    }, "Transaction date must be a valid date and not in the future"),
});
