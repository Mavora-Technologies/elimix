// apps/api/src/validators/subjects.validator.ts
import { z } from 'zod';

export const createSubjectSchema = z.object({
  name: z.string().min(1, 'Subject name is required'),
  code: z.string().min(1, 'Subject code is required'),
  departmentId: z.preprocess(
    (val) => (!val || val === '' ? null : val),
    z.string().uuid().nullable().optional()
  ),
  teacherIds: z.array(z.string().uuid()).default([]),
});

export const allocateSubjectSchema = z.object({
  subjectId: z.string().min(1, 'Subject is required'),
  streamId: z.string().min(1, 'Stream is required'),
  teacherId: z.string().min(1, 'Teacher is required'),
});