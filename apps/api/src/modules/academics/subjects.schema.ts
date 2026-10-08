// apps/api/src/modules/academics/subjects.schema.ts
import { pgTable, uuid, varchar, timestamp, unique, text } from 'drizzle-orm/pg-core';
import { tenants } from '../tenant/tenant.schema.js';
import { departments, teachers } from '../teachers/teachers.schema.js';
import { streams } from './academics.schema.js';

export const subjects = pgTable('subjects', {
  id: uuid('id').defaultRandom().primaryKey(),
  tenantId: uuid('tenant_id').references(() => tenants.id, { onDelete: 'cascade' }).notNull(),
  name: varchar('name', { length: 100 }).notNull(),
  code: varchar('code', { length: 20 }).notNull(),
  departmentId: uuid('department_id').references(() => departments.id, { onDelete: 'set null' }),
  teacherIds: text('teacher_ids').default('[]'), // Storing array as text to bypass driver bugs
  status: varchar('status', { length: 20 }).default('Active'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const subjectAllocations = pgTable('subject_allocations', {
  id: uuid('id').defaultRandom().primaryKey(),
  tenantId: uuid('tenant_id').references(() => tenants.id, { onDelete: 'cascade' }).notNull(),
  subjectId: uuid('subject_id').references(() => subjects.id, { onDelete: 'cascade' }).notNull(),
  streamId: uuid('stream_id').references(() => streams.id, { onDelete: 'cascade' }).notNull(),
  teacherId: uuid('teacher_id').references(() => teachers.id, { onDelete: 'cascade' }).notNull(),
  createdAt: timestamp('created_at').defaultNow(),
}, (t) => ({
  uniqueAllocation: unique('unique_subject_stream').on(t.subjectId, t.streamId)
}));