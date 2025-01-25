import { z } from "zod";

export const subscriptionSchema = z.object({
    type: z.string().min(2, "Type must be at least 2 characters"),
    price: z.coerce.number().positive("Price must be positive"),
    offer: z.coerce
        .number()
        .min(0, "Offer must be 0 or greater")
        .max(100, "Offer cannot exceed 100%"),
});