// apps/api/src/validators/auth.validator.ts
import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

// Updated to match the frontend registration payload
export const registerSchema = z.object({
  institutionName: z.string().min(2, 'Institution name is required'),
  adminName: z.string().min(2, 'Admin name is required'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  tier: z.string().optional(),
});