// apps/api/src/modules/academics/timetables.schema.ts
import { pgTable, uuid, varchar, timestamp, unique, time } from 'drizzle-orm/pg-core';
import { tenants } from '../tenant/tenant.schema.js';
import { subjects } from './subjects.schema.js';
import { teachers } from '../teachers/teachers.schema.js';
// Assuming streams/classes schema exists. If not, replace streamId with a simple varchar for now.
import { streams } from './academics.schema.js'; 

export const timetables = pgTable('timetables', {
  id: uuid('id').defaultRandom().primaryKey(),
  tenantId: uuid('tenant_id').references(() => tenants.id, { onDelete: 'cascade' }).notNull(),
  subjectId: uuid('subject_id').references(() => subjects.id, { onDelete: 'cascade' }).notNull(),
  teacherId: uuid('teacher_id').references(() => teachers.id, { onDelete: 'cascade' }).notNull(),
  streamId: uuid('stream_id').references(() => streams.id, { onDelete: 'cascade' }).notNull(),
  
  dayOfWeek: varchar('day_of_week', { length: 10 }).notNull(), // 'Monday', 'Tuesday', etc.
  startTime: time('start_time').notNull(), // '08:00:00'
  endTime: time('end_time').notNull(),     // '09:00:00'
  room: varchar('room', { length: 50 }).notNull(), // e.g., 'Lab 1', 'Room 102'
  
  term: varchar('term', { length: 50 }).notNull(), // e.g., 'Term 1 2026'
  status: varchar('status', { length: 20 }).default('Active'),
  
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
}, (t) => ({
  // Prevents a teacher from being booked in two different rooms at the exact same time
  uniqueTeacherTime: unique('unique_teacher_time').on(t.tenantId, t.teacherId, t.dayOfWeek, t.startTime),
  // Prevents a room from being double-booked at the exact same time
  uniqueRoomTime: unique('unique_room_time').on(t.tenantId, t.room, t.dayOfWeek, t.startTime),
}));