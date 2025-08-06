import { z } from "zod";

export const oneTimeSlotSchema = z.object({
  date: z.string().nonempty("Date is required"),
  startTime: z.string().nonempty("Start time is required"),
  duration: z.number().min(1, "Duration is required"),
  salary: z
    .number({
      required_error: "Salary is required",
      invalid_type_error: "Salary must be a number",
    })
    .min(50, "Salary must be at least 50"),
  description: z.string().optional(),
});
