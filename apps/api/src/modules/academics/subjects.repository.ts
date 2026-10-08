// apps/api/src/modules/academics/subjects.repository.ts
import { db } from '../../config/db.js';
import { subjects, subjectAllocations } from './subjects.schema.js';
import { departments, teachers } from '../teachers/teachers.schema.js';
import { eq, and } from 'drizzle-orm';

export class SubjectsRepository {
  async getSubjects(tenantId: string) {
    return await db.select({
      id: subjects.id,
      name: subjects.name,
      code: subjects.code,
      departmentId: subjects.departmentId,
      departmentName: departments.name,
      teacherIds: subjects.teacherIds,
      status: subjects.status,
    })
    .from(subjects)
    .leftJoin(departments, eq(subjects.departmentId, departments.id))
    .where(eq(subjects.tenantId, tenantId))
    .orderBy(subjects.name);
  }

  async createSubject(tenantId: string, data: any) {
    const payload = {
      name: data.name,
      code: data.code,
      departmentId: data.departmentId || null,
      teacherIds: JSON.stringify(Array.isArray(data.teacherIds) ? data.teacherIds : []),
      tenantId,
    };
    const [subject] = await db.insert(subjects).values(payload).returning();
    return subject;
  }

  async updateSubject(tenantId: string, id: string, data: any) {
    const payload = {
      name: data.name,
      code: data.code,
      departmentId: data.departmentId || null,
      teacherIds: JSON.stringify(Array.isArray(data.teacherIds) ? data.teacherIds : []),
      updatedAt: new Date(),
    };
    const [subject] = await db.update(subjects)
      .set(payload)
      .where(and(eq(subjects.id, id), eq(subjects.tenantId, tenantId)))
      .returning();
    return subject;
  }

  async deleteSubject(tenantId: string, id: string) {
    await db.delete(subjects).where(and(eq(subjects.id, id), eq(subjects.tenantId, tenantId)));
    return true;
  }

  async allocateTeacher(tenantId: string, data: typeof subjectAllocations.$inferInsert) {
    const [allocation] = await db.insert(subjectAllocations).values({ ...data, tenantId }).returning();
    return allocation;
  }
}