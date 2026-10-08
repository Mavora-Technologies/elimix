// apps/api/src/modules/teachers/attendance.schema.ts
import { pgTable, uuid, varchar, timestamp, date, unique } from 'drizzle-orm/pg-core';
import { tenants } from '../tenant/tenant.schema.js';
import { teachers } from './teachers.schema.js';

export const teacherAttendance = pgTable('teacher_attendance', {
  id: uuid('id').defaultRandom().primaryKey(),
  tenantId: uuid('tenant_id').references(() => tenants.id, { onDelete: 'cascade' }).notNull(),
  teacherId: uuid('teacher_id').references(() => teachers.id, { onDelete: 'cascade' }).notNull(),
  date: date('date').notNull(), // 'YYYY-MM-DD'
  checkIn: varchar('check_in', { length: 20 }), // e.g., '07:45 AM'
  checkOut: varchar('check_out', { length: 20 }), // e.g., '04:15 PM'
  status: varchar('status', { length: 20 }).notNull().default('Present'), // Present, Late, Absent, On Leave
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
}, (t) => ({
  // Ensure a teacher only has one attendance record per day
  uniqueDailyAttendance: unique('unique_teacher_daily_attendance').on(t.tenantId, t.teacherId, t.date)
}));