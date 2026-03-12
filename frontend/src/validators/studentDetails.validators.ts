import { z } from "zod";

export const studentDetailsSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  phone: z.string()
    .min(10, "Phone number must be at least 10 digits")
    .max(15, "Phone number too long")
    .regex(/^[0-9+\-\s]+$/, "Invalid phone number format"),
  college: z.string().min(2, "College name is required"),
  degree: z.string().min(2, "Degree is required"),
  graduation_year: z.string()
    .regex(/^\d{4}$/, "Please enter a valid year")
    .refine((year) => {
      const currentYear = new Date().getFullYear();
      const inputYear = parseInt(year);
      return inputYear >= 1900 && inputYear <= currentYear + 10;
    }, "Please enter a valid graduation year"),
  skills: z.string().min(2, "Please list your skills"),
  branch: z.string().min(2, "Branch is required")
});

export type StudentDetailsInput = z.infer<typeof studentDetailsSchema>;