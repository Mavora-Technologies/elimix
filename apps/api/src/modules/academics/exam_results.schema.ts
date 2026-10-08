// apps/api/src/modules/academics/exam_results.schema.ts
import { pgTable, uuid, varchar, numeric, timestamp } from 'drizzle-orm/pg-core';
import { tenants } from '../tenant/tenant.schema.js';
import { exams } from './exams.schema.js';
import { subjects } from './subjects.schema.js';
import { streams } from './academics.schema.js';
// Assuming students schema exists in a students module
import { students } from '../students/students.schema.js'; 

export const examResults = pgTable('exam_results', {
  id: uuid('id').defaultRandom().primaryKey(),
  tenantId: uuid('tenant_id').references(() => tenants.id, { onDelete: 'cascade' }).notNull(),
  
  // Relations
  studentId: uuid('student_id').references(() => students.id, { onDelete: 'cascade' }).notNull(),
  examId: uuid('exam_id').references(() => exams.id, { onDelete: 'cascade' }).notNull(),
  subjectId: uuid('subject_id').references(() => subjects.id, { onDelete: 'cascade' }).notNull(),
  streamId: uuid('stream_id').references(() => streams.id, { onDelete: 'cascade' }).notNull(), // Snapshot of class at time of exam

  // Grading Data
  marksObtained: numeric('marks_obtained', { precision: 5, scale: 2 }).notNull(),
  totalMarks: numeric('total_marks', { precision: 5, scale: 2 }).notNull().default('100'),
  
  grade: varchar('grade', { length: 5 }).notNull(), // A+, A, B, C, D, F
  status: varchar('status', { length: 50 }).notNull().default('Pending Review'), // Passed, Failed, Pending Review
  
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});