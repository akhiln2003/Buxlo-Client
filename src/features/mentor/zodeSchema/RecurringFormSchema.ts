import { z } from "zod";

export const recurringFormSchema = z
  .object({
    startTime: z.string().nonempty("Start time is required"),
    duration: z.number().min(1, "Duration is required"),
    days: z.array(z.string()).min(1, "At least one day must be selected"),
    startDate: z.string().nonempty("Start date is required"),
    endDate: z.string().nonempty("End date is required"),
    salary: z
      .number({
        required_error: "Salary is required",
        invalid_type_error: "Salary must be a number",
      })
      .min(50, "Salary must be at least 50"),
    description: z.string().optional(),
  })
  .refine((data) => new Date(data.endDate) >= new Date(data.startDate), {
    message: "End date must be after start date",
    path: ["endDate"],
  });
