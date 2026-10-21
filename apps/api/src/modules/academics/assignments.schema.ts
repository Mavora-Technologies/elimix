// apps/api/src/modules/academics/assignments.schema.ts
import { pgTable, uuid, varchar, text, timestamp, integer } from 'drizzle-orm/pg-core';
import { tenants } from '../tenant/tenant.schema.js';
import { subjects } from './subjects.schema.js';
import { streams } from './academics.schema.js';
import { teachers } from '../teachers/teachers.schema.js';
import { students } from '../students/students.schema.js';

export const assignments = pgTable('assignments', {
  id: uuid('id').defaultRandom().primaryKey(),
  tenantId: uuid('tenant_id').references(() => tenants.id, { onDelete: 'cascade' }).notNull(),
  title: varchar('title', { length: 255 }).notNull(),
  subjectId: uuid('subject_id').references(() => subjects.id, { onDelete: 'cascade' }).notNull(),
  streamId: uuid('stream_id').references(() => streams.id, { onDelete: 'cascade' }).notNull(),
  teacherId: uuid('teacher_id').references(() => teachers.id, { onDelete: 'cascade' }).notNull(),
  instructions: text('instructions').notNull(),
  dueDate: timestamp('due_date').notNull(),
  status: varchar('status', { length: 50 }).default('Active').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// NEW: Student Coursework Submissions & Grading Table
export const assignmentSubmissions = pgTable('assignment_submissions', {
  id: uuid('id').defaultRandom().primaryKey(),
  tenantId: uuid('tenant_id').references(() => tenants.id, { onDelete: 'cascade' }).notNull(),
  assignmentId: uuid('assignment_id').references(() => assignments.id, { onDelete: 'cascade' }).notNull(),
  studentId: uuid('student_id').references(() => students.id, { onDelete: 'cascade' }).notNull(),
  submissionStatus: varchar('submission_status', { length: 50 }).default('Submitted').notNull(), // 'Pending' | 'Submitted' | 'Late' | 'Graded'
  score: integer('score'), // Marks / Percentage (0 - 100)
  remarks: text('remarks'),
  submittedAt: timestamp('submitted_at').defaultNow(),
  gradedAt: timestamp('graded_at'),
});