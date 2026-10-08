// apps/api/src/validators/lesson_plans.validator.ts
import { z } from 'zod';

export const createLessonPlanSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  teacherId: z.string().uuid('Invalid Teacher ID'),
  subjectId: z.string().uuid('Invalid Subject ID'),
  streamId: z.string().uuid('Invalid Stream ID'),
  objectives: z.string().min(10, 'Objectives must be at least 10 characters'),
  status: z.enum(['Draft', 'Pending Review', 'Approved', 'Needs Revision']).default('Pending Review'),
});

export const updateLessonPlanStatusSchema = z.object({
  status: z.enum(['Draft', 'Pending Review', 'Approved', 'Needs Revision']),
});