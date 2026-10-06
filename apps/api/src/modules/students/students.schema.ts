import { pgTable, uuid, varchar, text, timestamp, date } from 'drizzle-orm/pg-core';
import { tenants } from '../tenants/tenants.schema'; // Tenant relation

export const students = pgTable('students', {
  id: uuid('id').primaryKey().defaultRandom(),
  tenantId: uuid('tenant_id').notNull().references(() => tenants.id),
  admissionNumber: varchar('admission_number', { length: 50 }).notNull(),
  firstName: varchar('first_name', { length: 100 }).notNull(),
  lastName: varchar('last_name', { length: 100 }).notNull(),
  gender: varchar('gender', { length: 20 }).notNull(),
  dateOfBirth: date('date_of_birth'),
  classGrade: varchar('class_grade', { length: 50 }).notNull(),
  stream: varchar('stream', { length: 50 }).notNull(),
  status: varchar('status', { length: 30 }).default('Active').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});