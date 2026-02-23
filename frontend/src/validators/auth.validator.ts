import { z } from 'zod';

// email validation schema
const emailSchema = z
  .string()
  .email('Invalid email format')
  .refine(
    (email) => email.endsWith('@gmail.com'),
    'Only Gmail addresses are allowed'
  )
  .transform((email) => email.toLowerCase().trim());

// password validation schema
const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .max(32, 'Password must not exceed 32 characters')
  .refine(
    (password) => /[A-Za-z]/.test(password),
    'Password must contain at least one letter'
  )
  .refine(
    (password) => /\d/.test(password),
    'Password must contain at least one number'
  );

// OTP validation schema - exactly 6 digits
const otpSchema = z
  .string()
  .length(6, 'OTP must be exactly 6 digits')
  .refine(/^\d+$/.test.bind(/^\d+$/), 'OTP must contain only numbers');

// Login Schema
export const loginSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

// Forgot Password Schema
export const forgotPasswordSchema = z.object({
  email: emailSchema,
});

// Verify OTP Schema
export const verifyOtpSchema = z.object({
  email: emailSchema,
  otp: otpSchema,
});

// Reset Password Schema
export const resetPasswordSchema = z.object({
  email: emailSchema,
  newPassword: passwordSchema,
});

// Type inference from schemas
export type LoginInput = z.infer<typeof loginSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type VerifyOtpInput = z.infer<typeof verifyOtpSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
