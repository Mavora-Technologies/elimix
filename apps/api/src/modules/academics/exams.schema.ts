// apps/api/src/modules/academics/exams.schema.ts
import { pgTable, uuid, varchar, timestamp, date } from 'drizzle-orm/pg-core';
import { tenants } from '../tenant/tenant.schema.js';
import { academicYears } from './academics.schema.js';

export const exams = pgTable('exams', {
  id: uuid('id').defaultRandom().primaryKey(),
  tenantId: uuid('tenant_id').references(() => tenants.id, { onDelete: 'cascade' }).notNull(),
  
  // E.g., "Term 3 Mid-Term", "End of Year Finals"
  title: varchar('title', { length: 255 }).notNull(),
  
  // Link to the academic year
  academicYearId: uuid('academic_year_id').references(() => academicYears.id, { onDelete: 'cascade' }).notNull(),
  
  // E.g., "Term 1", "Term 2", "Term 3"
  term: varchar('term', { length: 50 }).notNull(),
  
  startDate: date('start_date').notNull(),
  endDate: date('end_date').notNull(),
  
  // Upcoming, Ongoing, Grading, Published, Archived
  status: varchar('status', { length: 50 }).notNull().default('Upcoming'), 
  
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});