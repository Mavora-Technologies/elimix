import { pgTable, uuid, varchar, timestamp, date, boolean } from 'drizzle-orm/pg-core';
import { tenants } from '../tenants/schema';
import { classes } from '../academics/schema';

export const assessments = pgTable('assessments', {
  id: uuid('id').primaryKey().defaultRandom(),
  tenantId: uuid('tenant_id').notNull().references(() => tenants.id),
  title: varchar('title', { length: 255 }).notNull(),
  curriculumSystem: varchar('curriculum_system', { length: 50 }).notNull(), // 'CBC' | '8-4-4'
  type: varchar('type', { length: 50 }).notNull(), // 'Summative' | 'Formative'
  targetClassId: uuid('target_class_id').notNull().references(() => classes.id),
  startDate: date('start_date').notNull(),
  endDate: date('end_date').notNull(),
  status: varchar('status', { length: 50 }).default('Draft'), // 'Draft' | 'Upcoming' | 'Ongoing' | 'Completed'
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});