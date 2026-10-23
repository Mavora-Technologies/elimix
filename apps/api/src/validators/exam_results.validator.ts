// apps/api/src/validators/exam_results.validator.ts
import { z } from 'zod';

export const createExamResultSchema = z.object({
  studentId: z.string().uuid('Invalid Student ID format'),
  examId: z.string().uuid('Invalid Exam ID format'),
  subjectId: z.string().uuid('Invalid Subject ID format'),
  streamId: z.string().uuid('Invalid Stream ID format'),
  marksObtained: z.number().min(0, 'Marks obtained cannot be negative'),
  totalMarks: z.number().min(1, 'Total marks must be at least 1').default(100),
  grade: z.enum(['A+', 'A', 'B', 'C', 'D', 'F']),
  status: z.enum(['Passed', 'Failed', 'Pending Review']).default('Passed'),
});