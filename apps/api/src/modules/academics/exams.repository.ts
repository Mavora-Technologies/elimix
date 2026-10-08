// apps/api/src/modules/academics/exams.repository.ts
import { db } from '../../config/db.js';
import { exams } from './exams.schema.js';
import { academicYears } from './academics.schema.js';
import { eq, and, desc } from 'drizzle-orm';

export class ExamsRepository {
  async getExams(tenantId: string) {
    return await db.select({
      id: exams.id,
      title: exams.title,
      term: exams.term,
      startDate: exams.startDate,
      endDate: exams.endDate,
      status: exams.status,
      academicYearName: academicYears.name,
    })
    .from(exams)
    .innerJoin(academicYears, eq(exams.academicYearId, academicYears.id))
    .where(eq(exams.tenantId, tenantId))
    .orderBy(desc(exams.startDate));
  }

  async createExam(tenantId: string, data: any) {
    const [exam] = await db.insert(exams).values({ ...data, tenantId }).returning();
    return exam;
  }

  async updateExam(tenantId: string, id: string, data: any) {
    const [exam] = await db.update(exams).set({ ...data, updatedAt: new Date() })
      .where(and(eq(exams.id, id), eq(exams.tenantId, tenantId)))
      .returning();
    return exam;
  }

  async updateStatus(tenantId: string, id: string, status: string) {
    const [exam] = await db.update(exams).set({ status, updatedAt: new Date() })
      .where(and(eq(exams.id, id), eq(exams.tenantId, tenantId)))
      .returning();
    return exam;
  }

  async deleteExam(tenantId: string, id: string) {
    await db.delete(exams).where(and(eq(exams.id, id), eq(exams.tenantId, tenantId)));
    return true;
  }
}