import { z } from 'zod';

export const createTeacherSchema = z.object({
  firstName: z.string().min(2, 'First name is required'),
  lastName: z.string().min(2, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  departmentId: z.string().uuid('Invalid Department ID').optional().nullable(),
  employeeNumber: z.string().min(2, 'Employee number is required'),
  qualifications: z.string().optional(),
  isActive: z.boolean().default(true),
});

export const updateTeacherSchema = z.object({
  firstName: z.string().min(2).optional(),
  lastName: z.string().min(2).optional(),
  email: z.string().email().optional(),
  phone: z.string().optional().nullable(),
  departmentId: z.string().uuid().optional().nullable(),
  employeeNumber: z.string().min(2).optional(),
  qualifications: z.string().optional().nullable(),
  isActive: z.boolean().optional(),
});