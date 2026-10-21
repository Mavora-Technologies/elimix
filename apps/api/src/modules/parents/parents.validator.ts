// apps/api/src/modules/parents/parents.validator.ts
import { z } from 'zod';

export const createParentSchema = z.object({
  firstName: z.string().min(1, 'First name is required').max(100),
  lastName: z.string().min(1, 'Last name is required').max(100),
  email: z.string().email('Valid email is required'),
  phone: z.string().min(5, 'Phone number is required').max(20),
  relationship: z.enum(['Father', 'Mother', 'Guardian', 'Sponsor']),
  occupation: z.string().max(255).optional().nullable(),
  familyId: z.string().uuid().optional().nullable(),
  familyName: z.string().max(255).optional().nullable(),
  emergencyContact: z.string().max(50).optional().nullable(),
  studentIds: z.array(z.string().uuid()).optional().default([]),
  isPrimaryContact: z.boolean().optional().default(true),
  financialResponsibility: z.boolean().optional().default(true),
  portalActive: z.boolean().optional().default(true),
});

export const updateParentSchema = z.object({
  firstName: z.string().min(1).max(100).optional(),
  lastName: z.string().min(1).max(100).optional(),
  email: z.string().email().optional(),
  phone: z.string().min(5).max(20).optional(),
  relationship: z.enum(['Father', 'Mother', 'Guardian', 'Sponsor']).optional(),
  occupation: z.string().max(255).optional().nullable(),
  portalActive: z.boolean().optional(),
  studentIds: z.array(z.string().uuid()).optional(),
});

export const linkStudentSchema = z.object({
  studentId: z.string().uuid('Valid student ID is required'),
  isPrimaryContact: z.boolean().optional().default(false),
  financialResponsibility: z.boolean().optional().default(true),
});