import { pgTable, uuid, varchar, date, timestamp, unique } from 'drizzle-orm/pg-core';
import { tenants } from '../tenant/tenant.schema.js';
import { students } from '../students/students.schema.js';
import { users } from '../auth/auth.schema.js';

export const attendance = pgTable('attendance', {
  id: uuid('id').defaultRandom().primaryKey(),
  tenantId: uuid('tenant_id').references(() => tenants.id, { onDelete: 'cascade' }).notNull(),
  studentId: uuid('student_id').references(() => students.id, { onDelete: 'cascade' }).notNull(),
  date: date('date').notNull(),
  status: varchar('status', { length: 20 }).notNull(), // 'Present', 'Absent', 'Late', 'Excused'
  recordedById: uuid('recorded_by_id').references(() => users.id, { onDelete: 'set null' }),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
}, (t) => ({
  // Prevents duplicate attendance records for the same student on the same day
  uniqueStudentDate: unique('unique_student_date').on(t.studentId, t.date)
}));