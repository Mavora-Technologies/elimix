// apps/api/src/validators/elearning.validator.ts
import { z } from 'zod';

export const createCourseSchema = z.object({
  title: z.string().trim().min(3, 'Course title must be at least 3 characters'),
  subjectId: z.string().uuid('Please select a valid Subject'),
  teacherId: z.string().uuid('Please select a valid Lead Instructor'),
  streamId: z.string().uuid().optional().nullable().or(z.literal('')),
  description: z.string().trim().min(5, 'Course description must be at least 5 characters'),
  status: z.enum(['Active', 'Draft', 'Archived']).default('Active'),
});

export const createCourseLessonSchema = z.object({
  chapterNumber: z.number().int().min(1).optional().default(1),
  title: z.string().trim().min(2, 'Chapter / Lesson title is required'),
  contentType: z.enum(['Video', 'PDF / Document', 'Study Notes', 'Live Session']).default('Video'),
  contentUrl: z.string().trim().optional().nullable(),
  notes: z.string().trim().optional().nullable(),
  durationMinutes: z.number().int().min(1).max(600).optional().default(40),
});

export const createQuizSchema = z.object({
  title: z.string().trim().min(3, 'Quiz title must be at least 3 characters'),
  courseId: z.string().uuid().optional().nullable().or(z.literal('')),
  subjectId: z.string().uuid('Please select a valid Subject'),
  teacherId: z.string().uuid('Please select a valid Instructor'),
  streamId: z.string().uuid().optional().nullable().or(z.literal('')),
  instructions: z.string().trim().min(5, 'Instructions must be at least 5 characters'),
  timeLimitMinutes: z.number().int().min(5).max(300).default(30),
  passingScore: z.number().int().min(1).max(100).default(50),
  status: z.enum(['Active', 'Draft', 'Closed']).default('Active'),
});

export const createQuizQuestionSchema = z.object({
  questionNumber: z.number().int().min(1).optional(),
  questionText: z.string().trim().min(3, 'Question text is required'),
  questionType: z.enum(['MCQ', 'TrueFalse']).default('MCQ'),
  options: z.array(z.string().trim().min(1)).min(2, 'At least 2 options are required'),
  correctAnswer: z.string().trim().min(1, 'Correct answer is required'),
  points: z.number().int().min(1).max(100).default(1),
  explanation: z.string().trim().optional().nullable(),
});

export const submitQuizAttemptSchema = z.object({
  studentId: z.string().uuid('Please select a valid Student'),
  answers: z.record(z.string(), z.string()), // { [questionId]: selectedAnswer }
});