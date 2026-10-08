// apps/api/src/validators/exam_results.validator.ts
import { z } from 'zod';

export const createExamResultSchema = z.object({
  studentId: z.string().uuid('Invalid Student ID'),
  examId: z.string().uuid('Invalid Exam ID'),
  subjectId: z.string().uuid('Invalid Subject ID'),
  streamId: z.string().uuid('Invalid Stream ID'),
  marksObtained: z.number().min(0),
  totalMarks: z.number().min(1).default(100),
  grade: z.enum(['A+', 'A', 'B', 'C', 'D', 'F']),
  status: z.enum(['Passed', 'Failed', 'Pending Review']).default('Pending Review'),
});