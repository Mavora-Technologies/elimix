// apps/api/src/modules/teachers/teachers.schema.ts
import { pgTable, uuid, varchar, timestamp, boolean } from 'drizzle-orm/pg-core';
import { tenants } from '../tenant/tenant.schema.js';
import { users } from '../auth/auth.schema.js';

export const departments = pgTable('departments', {
  id: uuid('id').defaultRandom().primaryKey(),
  tenantId: uuid('tenant_id').references(() => tenants.id, { onDelete: 'cascade' }).notNull(),
  name: varchar('name', { length: 100 }).notNull(), // e.g., "Mathematics", "Languages"
  createdAt: timestamp('created_at').defaultNow(),
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