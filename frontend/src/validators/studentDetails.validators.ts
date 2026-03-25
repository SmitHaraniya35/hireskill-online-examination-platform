import { z } from "zod";

export const studentDetailsSchema = z.object({
  name: z.string().nonempty("Name is required"),
  phone: z.string()
    .nonempty("Phone is required")
    .min(10, "Phone number must be at least 10 digits")
    .max(15, "Phone number too long")
    .regex(/^[0-9+\-\s]+$/, "Invalid phone number format"),
  college: z.string().nonempty("College name is required"),
  degree: z.string().nonempty("Degree is required"),
  graduation_year: z.string()
    .nonempty("Graduation year is required")
    .regex(/^\d{4}$/, "Please enter a valid year")
    .refine((year) => {
      const currentYear = new Date().getFullYear();
      const inputYear = parseInt(year);
      return inputYear >= 1900 && inputYear <= currentYear + 10;
    }, "Please enter a valid graduation year"),
  skills: z.string().nonempty("Skills are required"),
  branch: z.string().nonempty("Branch is required")
});

export type StudentDetailsInput = z.infer<typeof studentDetailsSchema>;