// apps/api/src/validators/assignments.validator.ts
import { z } from 'zod';

export const createAssignmentSchema = z.object({
  title: z.string().trim().min(3, 'Assignment title must be at least 3 characters'),
  teacherId: z.string().uuid('Please select a valid Teacher'),
  subjectId: z.string().uuid('Please select a valid Subject'),
  streamId: z.string().uuid('Please select a valid Class / Stream'),
  instructions: z.string().trim().min(3, 'Instructions must be at least 3 characters'),
  dueDate: z.string().refine((date) => !isNaN(Date.parse(date)), { message: 'Please provide a valid due date' }),
  status: z.enum(['Active', 'Grading', 'Closed', 'Draft']).default('Active'),
});

export const updateAssignmentStatusSchema = z.object({
  status: z.enum(['Active', 'Grading', 'Closed', 'Draft']),
});

export const upsertSubmissionSchema = z.object({
  studentId: z.string().uuid('Valid Student ID is required'),
  submissionStatus: z.enum(['Pending', 'Submitted', 'Late', 'Graded']).default('Submitted'),
  score: z.number().min(0).max(100).nullable().optional(),
  remarks: z.string().optional().nullable(),
});