// apps/api/src/modules/teachers/teachers.schema.ts
import { pgTable, uuid, varchar, timestamp, boolean, jsonb, integer, text } from 'drizzle-orm/pg-core';
import { tenants } from '../tenant/tenant.schema.js';
import { users } from '../auth/auth.schema.js';

export const departments = pgTable('departments', {
  id: uuid('id').defaultRandom().primaryKey(),
  tenantId: uuid('tenant_id').references(() => tenants.id, { onDelete: 'cascade' }),
  name: varchar('name', { length: 100 }).notNull(),
  hodId: uuid('hod_id').references(() => users.id, { onDelete: 'set null' }),
  subjects: jsonb('subjects').$type<string[]>().default([]), // Use native jsonb helper
  status: varchar('status', { length: 20 }).default('Active'),
  establishedYear: integer('established_year'),
  description: text('description'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const teachers = pgTable('teachers', {
  id: uuid('id').defaultRandom().primaryKey(),
  tenantId: uuid('tenant_id').references(() => tenants.id, { onDelete: 'cascade' }).notNull(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull().unique(),
  departmentId: uuid('department_id').references(() => departments.id, { onDelete: 'set null' }),
  employeeNumber: varchar('employee_number', { length: 50 }).notNull(),
  qualifications: varchar('qualifications', { length: 255 }),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});