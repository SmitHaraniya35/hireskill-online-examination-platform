import { z } from "zod";

export const emailSchema = z.object({
  email: z.string()
    .email("Please enter a valid email address")
    .min(5, "Email is too short")
    .max(100, "Email is too long")
});

export type EmailInput = z.infer<typeof emailSchema>;