// apps/api/src/modules/academics/assignments.repository.ts
import { db } from '../../config/db.js';
import { assignments } from './assignments.schema.js';
import { subjects } from './subjects.schema.js';
import { streams } from './academics.schema.js';
import { teachers } from '../teachers/teachers.schema.js';
import { users } from '../auth/auth.schema.js';
import { eq, and, desc } from 'drizzle-orm';

export class AssignmentsRepository {
  async getAssignments(tenantId: string) {
    return await db.select({
      id: assignments.id,
      title: assignments.title,
      instructions: assignments.instructions,
      dueDate: assignments.dueDate,
      status: assignments.status,
      subjectName: subjects.name,
      streamName: streams.name,
      streamCapacity: streams.capacity,
      teacherFirstName: users.firstName,
      teacherLastName: users.lastName,
    })
    .from(assignments)
    .innerJoin(subjects, eq(assignments.subjectId, subjects.id))
    .innerJoin(streams, eq(assignments.streamId, streams.id))
    .innerJoin(teachers, eq(assignments.teacherId, teachers.id))
    .innerJoin(users, eq(teachers.userId, users.id))
    .where(eq(assignments.tenantId, tenantId))
    .orderBy(desc(assignments.createdAt));
  }

  async createAssignment(tenantId: string, data: any) {
    const [assignment] = await db.insert(assignments).values({ ...data, tenantId }).returning();
    return assignment;
  }

  async updateAssignment(tenantId: string, id: string, data: any) {
    const [assignment] = await db.update(assignments).set({ ...data, updatedAt: new Date() })
      .where(and(eq(assignments.id, id), eq(assignments.tenantId, tenantId)))
      .returning();
    return assignment;
  }

  async updateStatus(tenantId: string, id: string, status: string) {
    const [assignment] = await db.update(assignments).set({ status, updatedAt: new Date() })
      .where(and(eq(assignments.id, id), eq(assignments.tenantId, tenantId)))
      .returning();
    return assignment;
  }

  async deleteAssignment(tenantId: string, id: string) {
    await db.delete(assignments).where(and(eq(assignments.id, id), eq(assignments.tenantId, tenantId)));
    return true;
  }
}