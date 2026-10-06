// apps/api/src/modules/academics/academics.schema.ts
import { pgTable, uuid, varchar, integer, timestamp, boolean, date } from 'drizzle-orm/pg-core';
import { tenants } from '../tenant/tenant.schema.js';
import { teachers } from '../teachers/teachers.schema.js';

export const academicYears = pgTable('academic_years', {
  id: uuid('id').defaultRandom().primaryKey(),
  tenantId: uuid('tenant_id').references(() => tenants.id, { onDelete: 'cascade' }).notNull(),
  name: varchar('name', { length: 50 }).notNull(), // e.g., "2026", "2026/2027"
  startDate: date('start_date').notNull(),
  endDate: date('end_date').notNull(),
  isActive: boolean('is_active').default(false),
  createdAt: timestamp('created_at').defaultNow(),
});

export const classes = pgTable('classes', {
  id: uuid('id').defaultRandom().primaryKey(),
  tenantId: uuid('tenant_id').references(() => tenants.id, { onDelete: 'cascade' }).notNull(),
  academicYearId: uuid('academic_year_id').references(() => academicYears.id, { onDelete: 'cascade' }).notNull(),
  name: varchar('name', { length: 50 }).notNull(), // e.g., "Grade 6", "Form 1"
  level: integer('level').notNull(), // Integer for correct sorting (e.g., 6, 7, 8)
  createdAt: timestamp('created_at').defaultNow(),
});

export const streams = pgTable('streams', {
  id: uuid('id').defaultRandom().primaryKey(),
  tenantId: uuid('tenant_id').references(() => tenants.id, { onDelete: 'cascade' }).notNull(),
  classId: uuid('class_id').references(() => classes.id, { onDelete: 'cascade' }).notNull(),
  name: varchar('name', { length: 50 }).notNull(), // e.g., "East Stream", "Blue"
  classTeacherId: uuid('class_teacher_id').references(() => teachers.id, { onDelete: 'set null' }),
  capacity: integer('capacity').default(40).notNull(),
  roomNumber: varchar('room_number', { length: 50 }),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});