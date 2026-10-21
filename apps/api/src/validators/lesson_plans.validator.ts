// apps/api/src/validators/lesson_plans.validator.ts
import { z } from 'zod';

export const createLessonPlanSchema = z.object({
  title: z.string().trim().min(3, 'Lesson title must be at least 3 characters'),
  teacherId: z.string().uuid('Please select a valid Teacher'),
  subjectId: z.string().uuid('Please select a valid Subject'),
  streamId: z.string().uuid('Please select a valid Class / Stream'),
  objectives: z.string().trim().min(3, 'Curriculum objectives must be at least 3 characters'),
  status: z.enum(['Draft', 'Pending Review', 'Approved', 'Needs Revision']).default('Pending Review'),
});

export const updateLessonPlanStatusSchema = z.object({
  status: z.enum(['Draft', 'Pending Review', 'Approved', 'Needs Revision']),
});