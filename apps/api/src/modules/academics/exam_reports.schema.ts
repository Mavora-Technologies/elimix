// apps/api/src/modules/academics/exam_reports.schema.ts
import { pgTable, uuid, varchar, integer, numeric, timestamp } from 'drizzle-orm/pg-core';
import { tenants } from '../tenant/tenant.schema.js';

export const examReports = pgTable('exam_reports', {
  id: uuid('id').defaultRandom().primaryKey(),
  tenantId: uuid('tenant_id').references(() => tenants.id, { onDelete: 'cascade' }).notNull(),
  
  title: varchar('title', { length: 255 }).notNull(),
  term: varchar('term', { length: 50 }).notNull(),
  gradeLevel: varchar('grade_level', { length: 50 }).notNull(),
  
  // Analytics
  totalStudents: integer('total_students').notNull().default(0),
  averageGpa: numeric('average_gpa', { precision: 3, scale: 2 }).notNull().default('0.00'),
  passRate: numeric('pass_rate', { precision: 5, scale: 2 }).notNull().default('0.00'),
  
  // Status
  status: varchar('status', { length: 50 }).notNull().default('Draft'), // Published, Pending Approval, Draft
  generatedDate: timestamp('generated_date').defaultNow().notNull(),
  
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});