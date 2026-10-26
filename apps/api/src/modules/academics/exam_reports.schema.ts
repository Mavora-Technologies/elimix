// apps/api/src/modules/academics/exam_reports.schema.ts
import { pgTable, uuid, varchar, text, integer, timestamp } from 'drizzle-orm/pg-core';
import { tenants } from '../tenant/tenant.schema.js';
import { exams } from './exams.schema.js';
import { streams } from './academics.schema.js';
import { students } from '../students/students.schema.js';

export const examReports = pgTable('exam_reports', {
  id: uuid('id').defaultRandom().primaryKey(),
  tenantId: uuid('tenant_id').references(() => tenants.id, { onDelete: 'cascade' }).notNull(),
  studentId: uuid('student_id').references(() => students.id, { onDelete: 'cascade' }).notNull(),
  examId: uuid('exam_id').references(() => exams.id, { onDelete: 'cascade' }).notNull(),
  streamId: uuid('stream_id').references(() => streams.id, { onDelete: 'set null' }),
  classTeacherRemarks: text('class_teacher_remarks'),
  principalRemarks: text('principal_remarks'),
  attendanceDaysPresent: integer('attendance_days_present').default(60).notNull(),
  attendanceTotalDays: integer('attendance_total_days').default(65).notNull(),
  nextTermBegins: varchar('next_term_begins', { length: 50 }),
  status: varchar('status', { length: 50 }).default('Published').notNull(), // 'Draft' | 'Published' | 'Withheld'
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});