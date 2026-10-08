// apps/api/src/validators/assignments.validator.ts
import { z } from 'zod';

export const createAssignmentSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  teacherId: z.string().uuid('Invalid Teacher ID'),
  subjectId: z.string().uuid('Invalid Subject ID'),
  streamId: z.string().uuid('Invalid Stream ID'),
  instructions: z.string().min(5, 'Instructions are required'),
  dueDate: z.string().refine((date) => !isNaN(Date.parse(date)), { message: "Invalid date format" }),
  status: z.enum(['Active', 'Grading', 'Closed', 'Draft']).default('Active'),
});

export const updateAssignmentStatusSchema = z.object({
  status: z.enum(['Active', 'Grading', 'Closed', 'Draft']),
});