import { z } from "zod";

export const ContactPageFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters long"),
  email: z.string().email("Invalid email address"),
  subject: z.string().min(2, "Subject must be at least 2 characters long"),
  message: z.string().min(10, "Message must be at least 10 characters long"),

});
