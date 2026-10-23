// apps/api/src/modules/academics/exams.schema.ts
import { pgTable, uuid, varchar, timestamp, date, integer } from 'drizzle-orm/pg-core';
import { tenants } from '../tenant/tenant.schema.js';
import { academicYears } from './academics.schema.js';
import { subjects } from './subjects.schema.js';

export const exams = pgTable('exams', {
  id: uuid('id').defaultRandom().primaryKey(),
  tenantId: uuid('tenant_id').references(() => tenants.id, { onDelete: 'cascade' }).notNull(),
  title: varchar('title', { length: 255 }).notNull(),
  academicYearId: uuid('academic_year_id').references(() => academicYears.id, { onDelete: 'cascade' }).notNull(),
  term: varchar('term', { length: 50 }).notNull(),
  startDate: date('start_date').notNull(),
  endDate: date('end_date').notNull(),
  status: varchar('status', { length: 50 }).notNull().default('Upcoming'), // 'Upcoming' | 'Ongoing' | 'Grading' | 'Published' | 'Archived'
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Scheduled Subject Papers belonging to an Exam
export const examPapers = pgTable('exam_papers', {
  id: uuid('id').defaultRandom().primaryKey(),
  tenantId: uuid('tenant_id').references(() => tenants.id, { onDelete: 'cascade' }).notNull(),
  examId: uuid('exam_id').references(() => exams.id, { onDelete: 'cascade' }).notNull(),
  subjectId: uuid('subject_id').references(() => subjects.id, { onDelete: 'cascade' }).notNull(),
  paperCode: varchar('paper_code', { length: 50 }).default('Paper 1').notNull(), // e.g., 'Paper 1', 'Paper 2', 'Practical'
  paperDate: date('paper_date').notNull(),
  startTime: varchar('start_time', { length: 20 }).default('08:30').notNull(),
  durationMinutes: integer('duration_minutes').default(120).notNull(),
  maxMarks: integer('max_marks').default(100).notNull(),
  room: varchar('room', { length: 100 }).default('Main Hall'),
  createdAt: timestamp('created_at').defaultNow(),
});