import {z} from 'zod';

export const studentSchema = z.object({
    name: z
        .string()
        .min(3,"Name must contain at least 3 characters"),
    
    email: z
        .email("Invalid email format")
        // .refine(
        //     (email) => email.endsWith('@gmail.com'),
        //     'Only Gmail addresses are allowed'
        // )
        .transform((email) => email.toLocaleLowerCase().trim()),
    
    phone: z
        .string()
        .trim()
        .regex(/^\d{10}$/,"Phone number must be exactly 10 digits"),
    
    college: z
        .string()
        .min(3, "College must contain at least 3 characters")
        .max(50, "College must not exceed 50 characters"),
});

export type StudentFormInput = z.infer<typeof studentSchema>;