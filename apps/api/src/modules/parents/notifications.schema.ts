// apps/api/src/modules/parents/notifications.schema.ts
import { pgTable, uuid, varchar, timestamp, integer, text } from 'drizzle-orm/pg-core';
import { tenants } from '../tenant/tenant.schema.js';
import { users } from '../auth/auth.schema.js';

export const parentNotifications = pgTable('parent_notifications', {
  id: uuid('id').defaultRandom().primaryKey(),
  tenantId: uuid('tenant_id').references(() => tenants.id, { onDelete: 'cascade' }).notNull(),
  subject: varchar('subject', { length: 255 }).notNull(),
  targetAudience: varchar('target_audience', { length: 100 }).notNull(), // e.g. 'All Parents'
  channel: varchar('channel', { length: 50 }).notNull(), // 'Email' | 'SMS' | 'Push'
  content: text('content').notNull(),
  recipientsCount: integer('recipients_count').default(0).notNull(),
  status: varchar('status', { length: 50 }).default('Delivered').notNull(), // 'Delivered' | 'Scheduled' | 'Failed'
  sentById: uuid('sent_by_id').references(() => users.id, { onDelete: 'set null' }),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});