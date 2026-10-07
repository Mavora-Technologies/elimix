import { db } from '../../config/db.js';
import { subjects, subjectAllocations } from './subjects.schema.js';
import { departments, teachers } from '../teachers/teachers.schema.js';
import { users } from '../auth/auth.schema.js';
import { streams, classes } from './academics.schema.js';
import { eq, and } from 'drizzle-orm';

export class SubjectsRepository {
  async createSubject(tenantId: string, data: typeof subjects.$inferInsert) {
    const [subject] = await db.insert(subjects).values({ ...data, tenantId }).returning();
    return subject;
  }

  async getSubjects(tenantId: string) {
    return await db.select({
      id: subjects.id,
      name: subjects.name,
      code: subjects.code,
      departmentName: departments.name
    })
    .from(subjects)
    .leftJoin(departments, eq(subjects.departmentId, departments.id))
    .where(eq(subjects.tenantId, tenantId));
  }

  async allocateTeacher(tenantId: string, data: typeof subjectAllocations.$inferInsert) {
    const [allocation] = await db.insert(subjectAllocations).values({ ...data, tenantId }).returning();
    return allocation;
  }
}