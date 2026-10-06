import { pgTable, uuid, varchar, timestamp, boolean, primaryKey } from 'drizzle-orm/pg-core';
import { tenants } from '../tenant/tenant.schema.js';
import { users } from '../auth/auth.schema.js';
import { students } from './students.schema.js';

export const families = pgTable('families', {
  id: uuid('id').defaultRandom().primaryKey(),
  tenantId: uuid('tenant_id').references(() => tenants.id, { onDelete: 'cascade' }).notNull(),
  familyName: varchar('family_name', { length: 255 }).notNull(),
  emergencyContact: varchar('emergency_contact', { length: 50 }),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const parents = pgTable('parents', {
  id: uuid('id').defaultRandom().primaryKey(),
  tenantId: uuid('tenant_id').references(() => tenants.id, { onDelete: 'cascade' }).notNull(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  familyId: uuid('family_id').references(() => families.id, { onDelete: 'cascade' }).notNull(),
  relationship: varchar('relationship', { length: 50 }).notNull(), // Father, Mother, Guardian
  occupation: varchar('occupation', { length: 255 }),
});

export const studentParents = pgTable('student_parents', {
  studentId: uuid('student_id').references(() => students.id, { onDelete: 'cascade' }).notNull(),
  parentId: uuid('parent_id').references(() => parents.id, { onDelete: 'cascade' }).notNull(),
  isPrimaryContact: boolean('is_primary_contact').default(false),
  financialResponsibility: boolean('financial_responsibility').default(true),
}, (t) => [
  primaryKey({ columns: [t.studentId, t.parentId] }),
]);