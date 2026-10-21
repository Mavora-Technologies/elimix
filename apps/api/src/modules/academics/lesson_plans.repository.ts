// apps/api/src/modules/academics/lesson_plans.repository.ts
import { db } from '../../config/db.js';
import { lessonPlans } from './lesson_plans.schema.js';
import { subjects } from './subjects.schema.js';
import { streams } from './academics.schema.js';
import { teachers } from '../teachers/teachers.schema.js';
import { users } from '../auth/auth.schema.js';
import { eq, and, desc } from 'drizzle-orm';

export class LessonPlansRepository {
  async getLessonPlans(tenantId: string) {
    return await db
      .select({
        id: lessonPlans.id,
        title: lessonPlans.title,
        objectives: lessonPlans.objectives,
        status: lessonPlans.status,
        submissionDate: lessonPlans.submissionDate,
        subjectId: lessonPlans.subjectId,
        subjectName: subjects.name,
        streamId: lessonPlans.streamId,
        streamName: streams.name,
        teacherId: lessonPlans.teacherId,
        teacherFirstName: users.firstName,
        teacherLastName: users.lastName,
      })
      .from(lessonPlans)
      .innerJoin(subjects, eq(lessonPlans.subjectId, subjects.id))
      .innerJoin(streams, eq(lessonPlans.streamId, streams.id))
      .innerJoin(teachers, eq(lessonPlans.teacherId, teachers.id))
      .innerJoin(users, eq(teachers.userId, users.id))
      .where(eq(lessonPlans.tenantId, tenantId))
      .orderBy(desc(lessonPlans.createdAt));
  }

  async createLessonPlan(tenantId: string, data: any) {
    const [plan] = await db
      .insert(lessonPlans)
      .values({ ...data, tenantId })
      .returning();
    return plan;
  }

  async updateStatus(tenantId: string, id: string, status: string) {
    const [plan] = await db
      .update(lessonPlans)
      .set({ status, updatedAt: new Date() })
      .where(and(eq(lessonPlans.id, id), eq(lessonPlans.tenantId, tenantId)))
      .returning();
    return plan;
  }

  async updateLessonPlan(tenantId: string, id: string, data: any) {
    const [plan] = await db
      .update(lessonPlans)
      .set({ ...data, updatedAt: new Date() })
      .where(and(eq(lessonPlans.id, id), eq(lessonPlans.tenantId, tenantId)))
      .returning();
    return plan;
  }

  async deleteLessonPlan(tenantId: string, id: string) {
    await db
      .delete(lessonPlans)
      .where(and(eq(lessonPlans.id, id), eq(lessonPlans.tenantId, tenantId)));
    return true;
  }
}