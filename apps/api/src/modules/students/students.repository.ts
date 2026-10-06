import { db } from '../../config/database';
import { students } from './students.schema';
import { eq, and, ilike, or } from 'drizzle-orm';

export class StudentsRepository {
  async findAllByTenant(tenantId: string, search?: string) {
    if (search) {
      return await db.select().from(students).where(
        and(
          eq(students.tenantId, tenantId),
          or(
            ilike(students.firstName, `%${search}%`),
            ilike(students.lastName, `%${search}%`),
            ilike(students.admissionNumber, `%${search}%`)
          )
        )
      );
    }
    return await db.select().from(students).where(eq(students.tenantId, tenantId));
  }

  async create(data: typeof students.$inferInsert) {
    const [newStudent] = await db.insert(students).values(data).returning();
    return newStudent;
  }
}