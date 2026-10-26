// apps/api/src/validators/exam_reports.validator.ts
import { z } from 'zod';

export const upsertExamReportSchema = z.object({
  studentId: z.string().uuid('Valid Student ID is required'),
  examId: z.string().uuid('Valid Exam ID is required'),
  streamId: z.string().uuid().optional().nullable().or(z.literal('')),
  classTeacherRemarks: z.string().trim().optional().nullable(),
  principalRemarks: z.string().trim().optional().nullable(),
  attendanceDaysPresent: z.coerce.number().int().min(0).max(365).optional().default(60),
  attendanceTotalDays: z.coerce.number().int().min(1).max(365).optional().default(65),
  nextTermBegins: z.string().trim().optional().nullable(),
  status: z.enum(['Draft', 'Published', 'Withheld']).default('Published'),
});