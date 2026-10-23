// apps/api/src/modules/academics/elearning.schema.ts
import { pgTable, uuid, varchar, text, integer, timestamp, jsonb } from 'drizzle-orm/pg-core';
import { tenants } from '../tenant/tenant.schema.js';
import { subjects } from './subjects.schema.js';
import { streams } from './academics.schema.js';
import { teachers } from '../teachers/teachers.schema.js';
import { students } from '../students/students.schema.js';

// 1. E-Learning Courses
export const eLearningCourses = pgTable('e_learning_courses', {
  id: uuid('id').defaultRandom().primaryKey(),
  tenantId: uuid('tenant_id').references(() => tenants.id, { onDelete: 'cascade' }).notNull(),
  title: varchar('title', { length: 255 }).notNull(),
  subjectId: uuid('subject_id').references(() => subjects.id, { onDelete: 'cascade' }).notNull(),
  teacherId: uuid('teacher_id').references(() => teachers.id, { onDelete: 'cascade' }).notNull(),
  streamId: uuid('stream_id').references(() => streams.id, { onDelete: 'set null' }),
  description: text('description').notNull(),
  enrolledStudents: integer('enrolled_students').default(0).notNull(),
  modulesCount: integer('modules_count').default(0).notNull(),
  status: varchar('status', { length: 50 }).default('Active').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// 2. Chapters / Lessons inside a Course
export const eLearningLessons = pgTable('e_learning_lessons', {
  id: uuid('id').defaultRandom().primaryKey(),
  tenantId: uuid('tenant_id').references(() => tenants.id, { onDelete: 'cascade' }).notNull(),
  courseId: uuid('course_id').references(() => eLearningCourses.id, { onDelete: 'cascade' }).notNull(),
  chapterNumber: integer('chapter_number').default(1).notNull(),
  title: varchar('title', { length: 255 }).notNull(),
  contentType: varchar('content_type', { length: 50 }).default('Video').notNull(),
  contentUrl: text('content_url'),
  notes: text('notes'),
  durationMinutes: integer('duration_minutes').default(40).notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

// 3. E-Learning Quizzes & Assessments
export const eLearningQuizzes = pgTable('e_learning_quizzes', {
  id: uuid('id').defaultRandom().primaryKey(),
  tenantId: uuid('tenant_id').references(() => tenants.id, { onDelete: 'cascade' }).notNull(),
  courseId: uuid('course_id').references(() => eLearningCourses.id, { onDelete: 'set null' }),
  subjectId: uuid('subject_id').references(() => subjects.id, { onDelete: 'cascade' }).notNull(),
  teacherId: uuid('teacher_id').references(() => teachers.id, { onDelete: 'cascade' }).notNull(),
  streamId: uuid('stream_id').references(() => streams.id, { onDelete: 'set null' }),
  title: varchar('title', { length: 255 }).notNull(),
  instructions: text('instructions').notNull(),
  timeLimitMinutes: integer('time_limit_minutes').default(30).notNull(),
  passingScore: integer('passing_score').default(50).notNull(),
  questionsCount: integer('questions_count').default(0).notNull(),
  status: varchar('status', { length: 50 }).default('Active').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// 4. Auto-Marked Quiz Questions Bank
export const eLearningQuizQuestions = pgTable('e_learning_quiz_questions', {
  id: uuid('id').defaultRandom().primaryKey(),
  tenantId: uuid('tenant_id').references(() => tenants.id, { onDelete: 'cascade' }).notNull(),
  quizId: uuid('quiz_id').references(() => eLearningQuizzes.id, { onDelete: 'cascade' }).notNull(),
  questionNumber: integer('question_number').default(1).notNull(),
  questionText: text('question_text').notNull(),
  questionType: varchar('question_type', { length: 50 }).default('MCQ').notNull(),
  options: jsonb('options').default([]).notNull(),
  correctAnswer: text('correct_answer').notNull(),
  points: integer('points').default(1).notNull(),
  explanation: text('explanation'),
  createdAt: timestamp('created_at').defaultNow(),
});

// 5. Student Quiz Attempts & Auto-Grading Log
export const eLearningQuizAttempts = pgTable('e_learning_quiz_attempts', {
  id: uuid('id').defaultRandom().primaryKey(),
  tenantId: uuid('tenant_id').references(() => tenants.id, { onDelete: 'cascade' }).notNull(),
  quizId: uuid('quiz_id').references(() => eLearningQuizzes.id, { onDelete: 'cascade' }).notNull(),
  studentId: uuid('student_id').references(() => students.id, { onDelete: 'cascade' }).notNull(),
  answers: jsonb('answers').default({}).notNull(),
  earnedPoints: integer('earned_points').default(0).notNull(),
  totalPoints: integer('total_points').default(0).notNull(),
  scorePercentage: integer('score_percentage').default(0).notNull(),
  passed: varchar('passed', { length: 20 }).default('Pass').notNull(),
  submittedAt: timestamp('submitted_at').defaultNow(),
});

// 6. Persisted Student Course Progress & Lesson Completion Tracking
export const eLearningStudentProgress = pgTable('e_learning_student_progress', {
  id: uuid('id').defaultRandom().primaryKey(),
  tenantId: uuid('tenant_id').references(() => tenants.id, { onDelete: 'cascade' }).notNull(),
  studentId: uuid('student_id').references(() => students.id, { onDelete: 'cascade' }).notNull(),
  courseId: uuid('course_id').references(() => eLearningCourses.id, { onDelete: 'cascade' }).notNull(),
  completedLessonIds: jsonb('completed_lesson_ids').default([]).notNull(), // string[] of completed lesson UUIDs
  modulesCompleted: integer('modules_completed').default(0).notNull(),
  timeSpentMinutes: integer('time_spent_minutes').default(0).notNull(),
  status: varchar('status', { length: 50 }).default('On Track').notNull(), // 'Completed' | 'On Track' | 'Behind' | 'At Risk'
  facultyNotes: text('faculty_notes'),
  updatedAt: timestamp('updated_at').defaultNow(),
});