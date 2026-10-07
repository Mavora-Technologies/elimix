// apps/api/src/modules/departments/departments.repository.ts
import { db } from '../../config/db.js';
import { departments, teachers } from '../teachers/teachers.schema.js';
import { users } from '../auth/auth.schema.js';
import { eq, and, sql } from 'drizzle-orm';

export class DepartmentsRepository {
  // Smart helper to ensure we insert a User ID, not a Teacher ID
  private async resolveHodUserId(providedId: string | null): Promise<string | null> {
    if (!providedId) return null;
    try {
      const [teacher] = await db.select({ userId: teachers.userId })
        .from(teachers)
        .where(eq(teachers.id, providedId));
        
      if (teacher && teacher.userId) {
        return teacher.userId; // Found teacher, return the valid User ID
      }
    } catch (e) {
      // Ignore if UUID cast fails
    }
    return providedId; // Fallback
  }

  async getAllDepartments(tenantId: string) {
    return await db.select({
      id: departments.id,
      name: departments.name,
      hodId: departments.hodId,
      hodFirstName: users.firstName,
      hodLastName: users.lastName,
      subjects: departments.subjects,
      status: departments.status,
      establishedYear: departments.establishedYear,
      facultyCount: sql<number>`(SELECT COUNT(*) FROM ${teachers} WHERE ${teachers.departmentId} = ${departments.id})`,
    })
    .from(departments)
    .leftJoin(users, eq(departments.hodId, users.id))
    .where(eq(departments.tenantId, tenantId))
    .orderBy(departments.name);
  }

  async createDepartment(tenantId: string, data: any) {
    const finalHodId = await this.resolveHodUserId(data.hodId);

    const [dept] = await db.insert(departments).values({
      name: data.name,
      hodId: finalHodId,
      status: data.status || 'Active',
      establishedYear: data.establishedYear || new Date().getFullYear(),
      subjects: Array.isArray(data.subjects) ? data.subjects : [], // Pass array natively
      tenantId,
    }).returning();
    
    return dept;
  }

  async updateDepartment(tenantId: string, id: string, data: any) {
    const finalHodId = await this.resolveHodUserId(data.hodId);

    const updatePayload = {
      name: data.name,
      hodId: finalHodId,
      status: data.status || 'Active',
      establishedYear: data.establishedYear || new Date().getFullYear(),
      subjects: Array.isArray(data.subjects) ? data.subjects : [], // Pass array natively
      updatedAt: new Date(),
    };

    const [dept] = await db.update(departments)
      .set(updatePayload)
      .where(and(eq(departments.id, id), eq(departments.tenantId, tenantId)))
      .returning();

    return dept;
  }

  async deleteDepartment(tenantId: string, id: string) {
    await db.delete(departments).where(and(eq(departments.id, id), eq(departments.tenantId, tenantId)));
    return true;
  }
}