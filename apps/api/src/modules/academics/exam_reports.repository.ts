// apps/api/src/modules/academics/exam_reports.repository.ts
import { db } from '../../config/db.js';
import { examReports } from './exam_reports.schema.js';
import { eq, and, desc } from 'drizzle-orm';

export class ExamReportsRepository {
  async getReports(tenantId: string) {
    return await db.select()
      .from(examReports)
      .where(eq(examReports.tenantId, tenantId))
      .orderBy(desc(examReports.generatedDate));
  }

  async createReport(tenantId: string, data: any) {
    const [report] = await db.insert(examReports).values({ ...data, tenantId }).returning();
    return report;
  }

  async updateReport(tenantId: string, id: string, data: any) {
    const [report] = await db.update(examReports).set({ ...data, updatedAt: new Date() })
      .where(and(eq(examReports.id, id), eq(examReports.tenantId, tenantId)))
      .returning();
    return report;
  }

  async deleteReport(tenantId: string, id: string) {
    await db.delete(examReports).where(and(eq(examReports.id, id), eq(examReports.tenantId, tenantId)));
    return true;
  }
}