// apps/api/src/modules/academics/exam_results.schema.ts
import { pgTable, uuid, varchar, numeric, timestamp } from 'drizzle-orm/pg-core';
import { tenants } from '../tenant/tenant.schema.js';
import { exams } from './exams.schema.js';
import { subjects } from './subjects.schema.js';
import { streams } from './academics.schema.js';
import { students } from '../students/students.schema.js';

export const examResults = pgTable('exam_results', {
  id: uuid('id').defaultRandom().primaryKey(),
  tenantId: uuid('tenant_id').references(() => tenants.id, { onDelete: 'cascade' }).notNull(),

  // Relations
  studentId: uuid('student_id').references(() => students.id, { onDelete: 'cascade' }).notNull(),
  examId: uuid('exam_id').references(() => exams.id, { onDelete: 'cascade' }).notNull(),
  subjectId: uuid('subject_id').references(() => subjects.id, { onDelete: 'cascade' }).notNull(),
  streamId: uuid('stream_id').references(() => streams.id, { onDelete: 'cascade' }).notNull(),

  // Grading Data
  marksObtained: numeric('marks_obtained', { precision: 5, scale: 2 }).notNull(),
  totalMarks: numeric('total_marks', { precision: 5, scale: 2 }).notNull().default('100'),

  // Supports KNEC (A, A-, B+, B, B-, C+, C, C-, D+, D, D-, E) & CBC (EE, ME, AE, BE)
  grade: varchar('grade', { length: 10 }).notNull(),
  status: varchar('status', { length: 50 }).notNull().default('Passed'), // 'Passed' | 'Failed' | 'Pending Review'

  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});