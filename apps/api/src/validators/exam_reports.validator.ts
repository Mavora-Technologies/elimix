// apps/api/src/validators/exam_reports.validator.ts
import { z } from 'zod';

export const createExamReportSchema = z.object({
  title: z.string().min(3, 'Title is required'),
  term: z.string().min(1, 'Term is required'),
  gradeLevel: z.string().min(1, 'Grade Level is required'),
  totalStudents: z.number().min(0).optional(),
  averageGpa: z.number().min(0).max(4.0).optional(),
  passRate: z.number().min(0).max(100).optional(),
  status: z.enum(['Published', 'Pending Approval', 'Draft']).default('Draft'),
});