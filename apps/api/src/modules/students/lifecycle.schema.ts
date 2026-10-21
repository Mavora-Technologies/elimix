// apps/api/src/modules/students/lifecycle.schema.ts
import { pgTable, uuid, varchar, text, timestamp, boolean, numeric } from 'drizzle-orm/pg-core';
import { tenants } from '../tenant/tenant.schema.js';
import { students } from './students.schema.js';
import { users } from '../auth/auth.schema.js';

// 1. Restricted Student Medical Profiles (Blueprint Section 14)
export const studentMedicalProfiles = pgTable('student_medical_profiles', {
  id: uuid('id').defaultRandom().primaryKey(),
  tenantId: uuid('tenant_id').references(() => tenants.id, { onDelete: 'cascade' }).notNull(),
  studentId: uuid('student_id').references(() => students.id, { onDelete: 'cascade' }).notNull().unique(),
  bloodGroup: varchar('blood_group', { length: 10 }).default('Unknown'),
  allergies: text('allergies').default('None'),
  chronicConditions: text('chronic_conditions').default('None'),
  currentMedications: text('current_medications').default('None'),
  dietaryRestrictions: varchar('dietary_restrictions', { length: 255 }).default('Standard'),
  emergencyContactName: varchar('emergency_contact_name', { length: 255 }),
  emergencyContactPhone: varchar('emergency_contact_phone', { length: 50 }),
  insuranceProvider: varchar('insurance_provider', { length: 255 }),
  insurancePolicyNumber: varchar('insurance_policy_number', { length: 100 }),
  updatedBy: uuid('updated_by').references(() => users.id, { onDelete: 'set null' }),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// 2. Clinic Visits & Medical Incidents (Blueprint Section 14)
export const studentClinicVisits = pgTable('student_clinic_visits', {
  id: uuid('id').defaultRandom().primaryKey(),
  tenantId: uuid('tenant_id').references(() => tenants.id, { onDelete: 'cascade' }).notNull(),
  studentId: uuid('student_id').references(() => students.id, { onDelete: 'cascade' }).notNull(),
  visitDate: timestamp('visit_date').defaultNow().notNull(),
  symptoms: text('symptoms').notNull(),
  diagnosis: text('diagnosis'),
  treatmentGiven: text('treatment_given').notNull(),
  medicationPrescribed: text('medication_prescribed'),
  severity: varchar('severity', { length: 50 }).default('Minor').notNull(), // Minor, Moderate, Emergency, Referral
  parentNotified: boolean('parent_notified').default(false).notNull(),
  attendedBy: varchar('attended_by', { length: 255 }).notNull(),
  recordedBy: uuid('recorded_by').references(() => users.id, { onDelete: 'set null' }),
  createdAt: timestamp('created_at').defaultNow(),
});

// 3. Student Transfers & Multi-Department Clearance (Blueprint Section 13)
export const studentTransfers = pgTable('student_transfers', {
  id: uuid('id').defaultRandom().primaryKey(),
  tenantId: uuid('tenant_id').references(() => tenants.id, { onDelete: 'cascade' }).notNull(),
  studentId: uuid('student_id').references(() => students.id, { onDelete: 'cascade' }).notNull(),
  transferType: varchar('transfer_type', { length: 50 }).default('Outgoing').notNull(), // Outgoing, Incoming, Internal
  destinationSchool: varchar('destination_school', { length: 255 }).notNull(),
  reason: text('reason').notNull(),
  effectiveDate: varchar('effective_date', { length: 50 }).notNull(),
  academicCleared: boolean('academic_cleared').default(false).notNull(),
  financeCleared: boolean('finance_cleared').default(false).notNull(),
  libraryCleared: boolean('library_cleared').default(false).notNull(),
  boardingCleared: boolean('boarding_cleared').default(false).notNull(),
  certificateNumber: varchar('certificate_number', { length: 100 }),
  status: varchar('status', { length: 50 }).default('Pending Clearance').notNull(), // Pending Clearance, Approved, Completed, Rejected
  requestedBy: uuid('requested_by').references(() => users.id, { onDelete: 'set null' }),
  approvedBy: uuid('approved_by').references(() => users.id, { onDelete: 'set null' }),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// 4. Student Withdrawals & Exit Clearance (Blueprint Section 13)
export const studentWithdrawals = pgTable('student_withdrawals', {
  id: uuid('id').defaultRandom().primaryKey(),
  tenantId: uuid('tenant_id').references(() => tenants.id, { onDelete: 'cascade' }).notNull(),
  studentId: uuid('student_id').references(() => students.id, { onDelete: 'cascade' }).notNull(),
  withdrawalDate: varchar('withdrawal_date', { length: 50 }).notNull(),
  reason: varchar('reason', { length: 255 }).notNull(), // Relocation, Financial, Medical, Disciplinary, Graduation, Other
  detailedNotes: text('detailed_notes'),
  outstandingBalance: numeric('outstanding_balance', { precision: 12, scale: 2 }).default('0.00').notNull(),
  clearanceStatus: varchar('clearance_status', { length: 50 }).default('In Progress').notNull(), // In Progress, Cleared, Hold - Balance Due
  finalStatus: varchar('final_status', { length: 50 }).default('Pending').notNull(), // Pending, Withdrawn, Archived, Cancelled
  processedBy: uuid('processed_by').references(() => users.id, { onDelete: 'set null' }),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});