// apps/api/src/modules/academics/elearning_resources.schema.ts
import { pgTable, uuid, varchar, text, timestamp, integer } from 'drizzle-orm/pg-core';
import { tenants } from '../tenant/tenant.schema.js';
import { subjects } from './subjects.schema.js';
import { teachers } from '../teachers/teachers.schema.js';

export const eLearningResources = pgTable('e_learning_resources', {
  id: uuid('id').defaultRandom().primaryKey(),
  tenantId: uuid('tenant_id').references(() => tenants.id, { onDelete: 'cascade' }).notNull(),
  title: varchar('title', { length: 255 }).notNull(),
  subjectId: uuid('subject_id').references(() => subjects.id, { onDelete: 'cascade' }).notNull(),
  teacherId: uuid('teacher_id').references(() => teachers.id, { onDelete: 'cascade' }).notNull(),
  resourceType: varchar('resource_type', { length: 50 }).default('PDF Document').notNull(), // 'PDF Document' | 'Video Lecture' | 'E-Book' | 'Interactive Link' | 'Past Paper'
  fileSize: varchar('file_size', { length: 50 }).default('2.4 MB'),
  fileUrl: text('file_url').notNull(),
  downloadsCount: integer('downloads_count').default(0).notNull(),
  description: text('description'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});