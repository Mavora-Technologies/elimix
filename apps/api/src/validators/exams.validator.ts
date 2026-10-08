// apps/api/src/validators/exams.validator.ts
import { z } from 'zod';

export const createExamSchema = z.object({
  title: z.string().min(3, 'Exam title must be at least 3 characters'),
  academicYearId: z.string().uuid('Invalid Academic Year ID'),
  term: z.string().min(1, 'Term is required'),
  startDate: z.string().refine((date) => !isNaN(Date.parse(date)), { message: "Invalid start date format" }),
  endDate: z.string().refine((date) => !isNaN(Date.parse(date)), { message: "Invalid end date format" }),
  status: z.enum(['Upcoming', 'Ongoing', 'Grading', 'Published', 'Archived']).default('Upcoming'),
});

export const updateExamStatusSchema = z.object({
  status: z.enum(['Upcoming', 'Ongoing', 'Grading', 'Published', 'Archived']),
});