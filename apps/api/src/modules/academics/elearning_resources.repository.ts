// apps/api/src/modules/academics/elearning_resources.repository.ts
import { db } from '../../config/db.js';
import { eLearningResources } from './elearning_resources.schema.js';
import { subjects } from './subjects.schema.js';
import { teachers } from '../teachers/teachers.schema.js';
import { users } from '../auth/auth.schema.js';
import { eq, and, desc } from 'drizzle-orm';

export class ELearningResourcesRepository {
  async getResources(tenantId: string) {
    return await db
      .select({
        id: eLearningResources.id,
        title: eLearningResources.title,
        resourceType: eLearningResources.resourceType,
        fileSize: eLearningResources.fileSize,
        fileUrl: eLearningResources.fileUrl,
        downloadsCount: eLearningResources.downloadsCount,
        description: eLearningResources.description,
        subjectId: eLearningResources.subjectId,
        subjectName: subjects.name,
        teacherId: eLearningResources.teacherId,
        teacherFirstName: users.firstName,
        teacherLastName: users.lastName,
        createdAt: eLearningResources.createdAt,
      })
      .from(eLearningResources)
      .innerJoin(subjects, eq(eLearningResources.subjectId, subjects.id))
      .innerJoin(teachers, eq(eLearningResources.teacherId, teachers.id))
      .innerJoin(users, eq(teachers.userId, users.id))
      .where(eq(eLearningResources.tenantId, tenantId))
      .orderBy(desc(eLearningResources.createdAt));
  }

  async createResource(tenantId: string, data: any) {
    const [resource] = await db
      .insert(eLearningResources)
      .values({ ...data, tenantId })
      .returning();
    return resource;
  }

  async incrementDownload(tenantId: string, id: string) {
    const [existing] = await db
      .select()
      .from(eLearningResources)
      .where(and(eq(eLearningResources.id, id), eq(eLearningResources.tenantId, tenantId)))
      .limit(1);

    if (existing) {
      const [updated] = await db
        .update(eLearningResources)
        .set({ downloadsCount: (existing.downloadsCount || 0) + 1 })
        .where(eq(eLearningResources.id, id))
        .returning();
      return updated;
    }
    return null;
  }

  async deleteResource(tenantId: string, id: string) {
    await db
      .delete(eLearningResources)
      .where(and(eq(eLearningResources.id, id), eq(eLearningResources.tenantId, tenantId)));
    return true;
  }
}