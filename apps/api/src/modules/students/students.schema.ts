import { pgTable, uuid, varchar, date, timestamp, text } from 'drizzle-orm/pg-core';
import { tenants } from '../tenant/tenant.schema.js';
import { families } from './families.schema.js';

export const students = pgTable('students', {
  id: uuid('id').defaultRandom().primaryKey(),
  tenantId: uuid('tenant_id').references(() => tenants.id, { onDelete: 'cascade' }).notNull(),
  familyId: uuid('family_id').references(() => families.id, { onDelete: 'set null' }),
  admissionNumber: varchar('admission_number', { length: 50 }).notNull(),
  firstName: varchar('first_name', { length: 100 }).notNull(),
  lastName: varchar('last_name', { length: 100 }).notNull(),
  dateOfBirth: date('date_of_birth').notNull(),
  gender: varchar('gender', { length: 20 }).notNull(),
  enrollmentStatus: varchar('enrollment_status', { length: 50 }).default('Admitted'), // Admitted, Enrolled, Transferred, Withdrawn
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const medicalRecords = pgTable('medical_records', {
  id: uuid('id').defaultRandom().primaryKey(),
  tenantId: uuid('tenant_id').references(() => tenants.id, { onDelete: 'cascade' }).notNull(),
  studentId: uuid('student_id').references(() => students.id, { onDelete: 'cascade' }).notNull().unique(),
  bloodGroup: varchar('blood_group', { length: 10 }),
  allergies: text('allergies'),
  chronicConditions: text('chronic_conditions'),
  regularMedication: text('regular_medication'),
  emergencyInstructions: text('emergency_instructions'),
  updatedAt: timestamp('updated_at').defaultNow(),
});