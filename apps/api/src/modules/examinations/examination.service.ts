import { db } from '../../config/database';
import { assessments } from './schema';
import { eq, and } from 'drizzle-orm';

export class ExaminationService {
  // Always require tenantId to prevent cross-tenant data leaks
  static async getAssessmentsByTenant(tenantId: string) {
    return await db
      .select()
      .from(assessments)
      .where(eq(assessments.tenantId, tenantId))
      .execute();
  }

  static async createAssessment(tenantId: string, data: any) {
    return await db.insert(assessments).values({
      ...data,
      tenantId, // Force tenant ID on creation
    }).returning();
  }
}