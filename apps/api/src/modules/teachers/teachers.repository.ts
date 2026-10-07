// apps/api/src/modules/teachers/teachers.repository.ts
import { db } from '../../config/db.js';
import { teachers, departments } from './teachers.schema.js';
import { users, userRoles, roles } from '../auth/auth.schema.js';
import { eq, and } from 'drizzle-orm';

export class TeachersRepository {
  async getAllTeachers(tenantId: string) {
    return await db.select({
      id: teachers.id,
      userId: users.id,
      firstName: users.firstName,
      lastName: users.lastName,
      email: users.email,
      phone: users.phone, // Restored users.phone
      employeeNumber: teachers.employeeNumber,
      qualifications: teachers.qualifications,
      isActive: teachers.isActive,
      departmentName: departments.name,
      departmentId: departments.id,
    })
    .from(teachers)
    .innerJoin(users, eq(teachers.userId, users.id))
    .leftJoin(departments, eq(teachers.departmentId, departments.id))
    .where(eq(teachers.tenantId, tenantId));
  }

  async getDepartments(tenantId: string) {
    return await db.select().from(departments).where(eq(departments.tenantId, tenantId));
  }

  async getTeacherById(tenantId: string, teacherId: string) {
    const [teacher] = await db.select({
      id: teachers.id,
      userId: users.id,
      firstName: users.firstName,
      lastName: users.lastName,
      email: users.email,
      phone: users.phone, // Include phone in the detailed profile
      employeeNumber: teachers.employeeNumber,
      qualifications: teachers.qualifications,
      isActive: teachers.isActive,
      departmentName: departments.name,
      departmentId: departments.id,
    })
    .from(teachers)
    .innerJoin(users, eq(teachers.userId, users.id))
    .leftJoin(departments, eq(teachers.departmentId, departments.id))
    .where(and(eq(teachers.tenantId, tenantId), eq(teachers.id, teacherId)));
    
    return teacher;
  }

  async createTeacher(
    tenantId: string, 
    userData: typeof users.$inferInsert, 
    teacherData: Omit<typeof teachers.$inferInsert, 'userId' | 'tenantId'>
  ) {
    return await db.transaction(async (tx) => {
      const [newUser] = await tx.insert(users).values({ ...userData, tenantId }).returning();

      const [teacherRole] = await tx.select().from(roles).where(eq(roles.name, 'Teacher'));
      
      if (teacherRole) {
        await tx.insert(userRoles).values({
          userId: newUser.id,
          roleId: teacherRole.id
        });
      }

      const [newTeacher] = await tx.insert(teachers).values({
        ...teacherData,
        tenantId,
        userId: newUser.id,
      }).returning();

      return { user: newUser, teacher: newTeacher };
    });
  }

  async updateTeacher(tenantId: string, teacherId: string, userData: any, teacherData: any) {
    return await db.transaction(async (tx) => {
      // Find the associated userId
      const [existingTeacher] = await tx.select({ userId: teachers.userId }).from(teachers).where(and(eq(teachers.id, teacherId), eq(teachers.tenantId, tenantId)));
      if (!existingTeacher) throw new Error('Teacher not found');

      // Update User Base
      if (Object.keys(userData).length > 0) {
        await tx.update(users).set(userData).where(eq(users.id, existingTeacher.userId));
      }
      // Update Teacher Profile
      if (Object.keys(teacherData).length > 0) {
        await tx.update(teachers).set(teacherData).where(eq(teachers.id, teacherId));
      }
      return true;
    });
  }

  async deleteTeacher(tenantId: string, teacherId: string) {
    return await db.transaction(async (tx) => {
      const [existingTeacher] = await tx.select({ userId: teachers.userId }).from(teachers).where(and(eq(teachers.id, teacherId), eq(teachers.tenantId, tenantId)));
      if (!existingTeacher) throw new Error('Teacher not found');

      // Due to 'onDelete: cascade' in the schema, deleting the user automatically deletes the teacher profile and user_roles
      await tx.delete(users).where(eq(users.id, existingTeacher.userId));
      return true;
    });
  }
}