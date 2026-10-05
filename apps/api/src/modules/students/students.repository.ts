// apps/api/src/modules/students/students.repository.ts
import { db } from '../../config/db.js';
import { students } from './students.schema.js';
import { eq, and } from 'drizzle-orm';

export class StudentsRepository {
  async create(tenantId: string, data: typeof students.$inferInsert) {
    const [student] = await db.insert(students).values({
      ...data,
      tenantId,
    }).returning();
    return student;
  }

  async findAll(tenantId: string) {
    return await db.select()
      .from(students)
      .where(eq(students.tenantId, tenantId));
  }

  async findById(tenantId: string, studentId: string) {
    const [student] = await db.select()
      .from(students)
      .where(
        and(
          eq(students.tenantId, tenantId),
          eq(students.id, studentId)
        )
      ).limit(1);
    return student;
  }

  async update(tenantId: string, studentId: string, data: Partial<typeof students.$inferInsert>) {
    const [updated] = await db.update(students)
      .set({ ...data, updatedAt: new Date() })
      .where(
        and(
          eq(students.tenantId, tenantId),
          eq(students.id, studentId)
        )
      ).returning();
    return updated;
  }

  async delete(tenantId: string, studentId: string) {
    const [deleted] = await db.delete(students)
      .where(
        and(
          eq(students.tenantId, tenantId),
          eq(students.id, studentId)
        )
      ).returning();
    return deleted;
  }
}