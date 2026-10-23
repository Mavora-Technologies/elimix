// apps/api/src/validators/exams.validator.ts
import { z } from 'zod';

export const createExamSchema = z
  .object({
    title: z.string().trim().min(3, 'Exam title must be at least 3 characters'),
    academicYearId: z.string().uuid('Please select a valid Academic Year'),
    term: z.string().trim().min(1, 'Term is required'),
    startDate: z
      .string()
      .refine((date) => !isNaN(Date.parse(date)), { message: 'Invalid start date format' }),
    endDate: z
      .string()
      .refine((date) => !isNaN(Date.parse(date)), { message: 'Invalid end date format' }),
    status: z
      .enum(['Upcoming', 'Ongoing', 'Grading', 'Published', 'Archived'])
      .default('Upcoming'),
  })
  .refine((data) => new Date(data.endDate) >= new Date(data.startDate), {
    message: 'End date cannot be earlier than start date',
    path: ['endDate'],
  });

export const updateExamStatusSchema = z.object({
  status: z.enum(['Upcoming', 'Ongoing', 'Grading', 'Published', 'Archived']),
});

export const createExamPaperSchema = z.object({
  subjectId: z.string().uuid('Please select a valid Subject'),
  paperCode: z.string().trim().min(1, 'Paper code is required').default('Paper 1'),
  paperDate: z
    .string()
    .refine((date) => !isNaN(Date.parse(date)), { message: 'Valid paper date is required' }),
  startTime: z.string().trim().default('08:30'),
  durationMinutes: z.number().int().min(15).max(360).default(120),
  maxMarks: z.number().int().min(10).max(500).default(100),
  room: z.string().trim().optional().default('Main Hall'),
});