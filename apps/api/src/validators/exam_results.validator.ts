// apps/api/src/validators/exam_results.validator.ts
import { z } from 'zod';

export interface AutoGradeEvaluation {
  percentage: number;
  knecGrade: string;
  knecPoints: number;
  cbcRubric: 'EE' | 'ME' | 'AE' | 'BE';
  cbcLabel: string;
  remarks: string;
  status: 'Passed' | 'Failed';
}

export function computeKnecAndCbcGrade(
  marksObtained: number,
  totalMarks: number
): AutoGradeEvaluation {
  const safeTotal = totalMarks > 0 ? totalMarks : 100;
  const rawPct = (marksObtained / safeTotal) * 100;
  const percentage = Math.max(0, Math.min(100, Math.round(rawPct * 10) / 10));

  let knecGrade = 'E';
  let knecPoints = 1;
  let cbcRubric: 'EE' | 'ME' | 'AE' | 'BE' = 'BE';
  let cbcLabel = 'Below Expectations';
  let remarks = 'Requires immediate academic intervention';

  if (percentage >= 80) {
    knecGrade = 'A';
    knecPoints = 12;
    cbcRubric = 'EE';
    cbcLabel = 'Exceeding Expectations';
    remarks = 'Exemplary mastery of subject competencies';
  } else if (percentage >= 75) {
    knecGrade = 'A-';
    knecPoints = 11;
    cbcRubric = 'ME';
    cbcLabel = 'Meeting Expectations (High)';
    remarks = 'Very good mastery of learning outcomes';
  } else if (percentage >= 70) {
    knecGrade = 'B+';
    knecPoints = 10;
    cbcRubric = 'ME';
    cbcLabel = 'Meeting Expectations';
    remarks = 'Commendable performance; keep aiming higher';
  } else if (percentage >= 65) {
    knecGrade = 'B';
    knecPoints = 9;
    cbcRubric = 'ME';
    cbcLabel = 'Meeting Expectations';
    remarks = 'Good understanding of core concepts';
  } else if (percentage >= 60) {
    knecGrade = 'B-';
    knecPoints = 8;
    cbcRubric = 'ME';
    cbcLabel = 'Meeting Expectations';
    remarks = 'Satisfactory progress; revise weak topics';
  } else if (percentage >= 55) {
    knecGrade = 'C+';
    knecPoints = 7;
    cbcRubric = 'ME';
    cbcLabel = 'Meeting Expectations';
    remarks = 'Fairly good effort; room for improvement';
  } else if (percentage >= 50) {
    knecGrade = 'C';
    knecPoints = 6;
    cbcRubric = 'ME';
    cbcLabel = 'Meeting Expectations';
    remarks = 'Average performance; more practice needed';
  } else if (percentage >= 45) {
    knecGrade = 'C-';
    knecPoints = 5;
    cbcRubric = 'AE';
    cbcLabel = 'Approaching Expectations';
    remarks = 'Below average; requires guided revision';
  } else if (percentage >= 40) {
    knecGrade = 'D+';
    knecPoints = 4;
    cbcRubric = 'AE';
    cbcLabel = 'Approaching Expectations';
    remarks = 'Marginal pass; closer remedial follow-up needed';
  } else if (percentage >= 35) {
    knecGrade = 'D';
    knecPoints = 3;
    cbcRubric = 'AE';
    cbcLabel = 'Approaching Expectations';
    remarks = 'Weak performance; remedial support required';
  } else if (percentage >= 30) {
    knecGrade = 'D-';
    knecPoints = 2;
    cbcRubric = 'AE';
    cbcLabel = 'Approaching Expectations';
    remarks = 'Low mastery; structured tutoring recommended';
  }

  const status: 'Passed' | 'Failed' = percentage >= 40 ? 'Passed' : 'Failed';

  return {
    percentage,
    knecGrade,
    knecPoints,
    cbcRubric,
    cbcLabel,
    remarks,
    status,
  };
}

export const createExamResultSchema = z
  .object({
    studentId: z.string().uuid('Please select a valid Student'),
    examId: z.string().uuid('Please select a valid Exam'),
    subjectId: z.string().uuid('Please select a valid Subject'),
    streamId: z.string().uuid('Please select a valid Class / Stream'),
    marksObtained: z.coerce.number().min(0, 'Marks obtained cannot be negative'),
    totalMarks: z.coerce.number().min(1, 'Total marks must be at least 1').default(100),
    gradingSystem: z.enum(['KNEC', 'CBC']).optional().default('KNEC'),
    grade: z.string().trim().max(10).optional(),
    status: z.enum(['Passed', 'Failed', 'Pending Review']).optional(),
  })
  .refine((data) => data.marksObtained <= data.totalMarks, {
    message: 'Marks obtained cannot exceed total marks',
    path: ['marksObtained'],
  });

export const bulkExamResultsSchema = z.object({
  examId: z.string().uuid('Please select a valid Exam'),
  subjectId: z.string().uuid('Please select a valid Subject'),
  streamId: z.string().uuid('Please select a valid Class / Stream'),
  totalMarks: z.coerce.number().min(1).default(100),
  gradingSystem: z.enum(['KNEC', 'CBC']).default('KNEC'),
  entries: z
    .array(
      z.object({
        studentId: z.string().uuid(),
        marksObtained: z.coerce.number().min(0),
      })
    )
    .min(1, 'Provide at least one student score'),
});