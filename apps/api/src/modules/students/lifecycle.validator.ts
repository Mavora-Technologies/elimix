// apps/api/src/modules/students/lifecycle.validator.ts
import { z } from 'zod';

export const upsertMedicalProfileSchema = z.object({
  studentId: z.string().uuid('Valid Student ID is required'),
  bloodGroup: z.string().max(10).optional().default('Unknown'),
  allergies: z.string().optional().default('None'),
  chronicConditions: z.string().optional().default('None'),
  currentMedications: z.string().optional().default('None'),
  dietaryRestrictions: z.string().max(255).optional().default('Standard'),
  emergencyContactName: z.string().max(255).optional().nullable(),
  emergencyContactPhone: z.string().max(50).optional().nullable(),
  insuranceProvider: z.string().max(255).optional().nullable(),
  insurancePolicyNumber: z.string().max(100).optional().nullable(),
});

export const createClinicVisitSchema = z.object({
  studentId: z.string().uuid('Valid Student ID is required'),
  symptoms: z.string().min(2, 'Symptoms are required'),
  diagnosis: z.string().optional().nullable(),
  treatmentGiven: z.string().min(2, 'Treatment details are required'),
  medicationPrescribed: z.string().optional().nullable(),
  severity: z.enum(['Minor', 'Moderate', 'Emergency', 'Referral']).default('Minor'),
  parentNotified: z.boolean().default(false),
  attendedBy: z.string().min(2, 'Attending nurse/doctor name is required'),
});

export const createTransferSchema = z.object({
  studentId: z.string().uuid('Valid Student ID is required'),
  transferType: z.enum(['Outgoing', 'Incoming', 'Internal']).default('Outgoing'),
  destinationSchool: z.string().min(2, 'Destination institution is required'),
  reason: z.string().min(3, 'Transfer reason is required'),
  effectiveDate: z.string().min(4, 'Effective date is required'),
});

export const updateTransferClearanceSchema = z.object({
  academicCleared: z.boolean().optional(),
  financeCleared: z.boolean().optional(),
  libraryCleared: z.boolean().optional(),
  boardingCleared: z.boolean().optional(),
  status: z.enum(['Pending Clearance', 'Approved', 'Completed', 'Rejected']).optional(),
});

export const createWithdrawalSchema = z.object({
  studentId: z.string().uuid('Valid Student ID is required'),
  withdrawalDate: z.string().min(4, 'Withdrawal date is required'),
  reason: z.string().min(2, 'Reason is required'),
  detailedNotes: z.string().optional().nullable(),
  outstandingBalance: z.union([z.string(), z.number()]).optional().default('0.00'),
  clearanceStatus: z.enum(['In Progress', 'Cleared', 'Hold - Balance Due']).default('In Progress'),
});

export const updateWithdrawalSchema = z.object({
  clearanceStatus: z.enum(['In Progress', 'Cleared', 'Hold - Balance Due']).optional(),
  finalStatus: z.enum(['Pending', 'Withdrawn', 'Archived', 'Cancelled']).optional(),
  outstandingBalance: z.union([z.string(), z.number()]).optional(),
});