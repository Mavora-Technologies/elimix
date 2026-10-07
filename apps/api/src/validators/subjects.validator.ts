import { z } from 'zod';

export const createSubjectSchema = z.object({
  name: z.string().min(2, 'Subject name must be at least 2 characters'),
  code: z.string().min(2, 'Subject code is required'),
  departmentId: z.string().optional().nullable(),
});

export const allocateSubjectSchema = z.object({
  subjectId: z.string().min(1, 'Subject is required'),
  streamId: z.string().min(1, 'Stream is required'),
  teacherId: z.string().min(1, 'Teacher is required'),
});