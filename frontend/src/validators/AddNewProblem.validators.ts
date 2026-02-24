import { z } from 'zod';

const testCaseSchema = z.object({
  id: z.string().optional(),
  input: z.string().min(1, 'Input is required'),
  expected_output: z.string().min(1, 'Expected output is required'),
  is_hidden: z.boolean(),
});

export const problemSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .min(3, 'Title must be at least 3 characters')
    .max(200, 'Title must not exceed 200 characters'),
  
  difficulty: z.enum(['easy', 'medium', 'hard'], {
    message: 'Please select a difficulty level',
  }),
  
  topic: z
    .string()
    .min(1, 'Topic is required')
    .refine(
      (val) => val.split(',').every((t) => t.trim().length > 0),
      'Invalid topic format'
    ),
  
  problemDescription: z
    .string()
    .min(1, 'Problem description is required')
    .refine(
      (val) => val.replace(/<[^>]*>/g, '').trim().length >= 10,
      'Problem description must be at least 10 characters (excluding HTML tags)'
    ),
  
  constraint: z
    .string()
    .min(1, 'Constraints are required')
    .refine(
      (val) => val.replace(/<[^>]*>/g, '').trim().length >= 1,
      'Constraints must contain text content'
    ),
  
  inputFormat: z
    .string()
    .min(1, 'Input format is required')
    .refine(
      (val) => val.replace(/<[^>]*>/g, '').trim().length >= 1,
      'Input format must contain text content'
    ),
  
  outputFormat: z
    .string()
    .min(1, 'Output format is required')
    .refine(
      (val) => val.replace(/<[^>]*>/g, '').trim().length >= 1,
      'Output format must contain text content'
    ),
  
  basicCodeLayout: z
    .string()
    .min(1, 'Code template is required'),
  
  testCases: z
  .array(testCaseSchema)
  .min(1, 'At least one test case is required')
  .refine(
    (cases) => cases.some((tc) => tc.is_hidden === false),
    {
      message: 'At least one test case must be visible',
    }
  ),
});

export type ProblemFormInput = z.infer<typeof problemSchema>;