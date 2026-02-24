import { z } from 'zod';

export const testSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .min(3, 'Title must be at least 3 characters'),
  
  duration: z
    .string()
    .min(1, 'Duration is required')
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
      message: 'Duration must be a positive number',
    }),
  
  day: z
    .string()
    .min(1, 'Day is required')
    .max(2)
    .refine((val) => /^\d+$/.test(val) && Number(val) >= 1 && Number(val) <= 31, {
      message: 'Day must be between 1-31',
    }),
  
  month: z
    .string()
    .min(1, 'Month is required')
    .max(2)
    .refine((val) => /^\d+$/.test(val) && Number(val) >= 1 && Number(val) <= 12, {
      message: 'Month must be between 1-12',
    }),
  
  year: z
    .string()
    .min(4, 'Year must be 4 digits')
    .max(4)
    .refine((val) => /^\d+$/.test(val) && Number(val) >= 2024, {
      message: 'Year must be 2024 or later',
    }),
  
  expiry_time: z
    .string()
    .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format'),
}).refine(
  (data) => {
    const { day, month, year } = data;
    const date = new Date(Number(year), Number(month) - 1, Number(day));
    return (
      date.getFullYear() === Number(year) &&
      date.getMonth() === Number(month) - 1 &&
      date.getDate() === Number(day)
    );
  },
  {
    message: 'Invalid date',
    path: ['day'],
  }
);

export type TestFormInput = z.infer<typeof testSchema>;