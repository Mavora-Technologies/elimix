// apps/api/src/modules/teachers/teachers.service.ts
import { TeachersRepository } from './teachers.repository.js';
import { db } from '../../config/db.js';
import { auditLogs } from '../audit/audit.schema.js';
// Import subjects schema so we can query it
import { subjects } from '../academics/subjects.schema.js';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcrypt';

const repository = new TeachersRepository();

export class TeachersService {
  async getAllTeachers(tenantId: string) {
    // Fetch teachers and subjects in parallel
    const [rawTeachers, allSubjects] = await Promise.all([
      repository.getAllTeachers(tenantId),
      db.select({ id: subjects.id, name: subjects.name, code: subjects.code, teacherIds: subjects.teacherIds }).from(subjects).where(eq(subjects.tenantId, tenantId))
    ]);

    // Parse subjects into a usable format
    const parsedSubjects = allSubjects.map(sub => {
      let ids: string[] = [];
      try {
        const raw = typeof sub.teacherIds === 'string' ? JSON.parse(sub.teacherIds) : sub.teacherIds;
        ids = Array.isArray(raw) ? raw : (typeof raw === 'string' ? JSON.parse(raw) : []);
        if (!Array.isArray(ids)) ids = [];
      } catch {
        ids = typeof sub.teacherIds === 'string' ? sub.teacherIds.split(',').map(s => s.trim()) : [];
      }
      return { ...sub, teacherIds: ids };
    });

    return rawTeachers.map(t => {
      // Find all subjects where this teacher's ID is explicitly listed
      const assignedSubjects = parsedSubjects
        .filter(sub => sub.teacherIds.includes(t.id))
        .map(sub => sub.name);

      return {
        id: t.id,
        fullName: `${t.firstName} ${t.lastName}`,
        email: t.email,
        phone: t.phone || 'N/A',
        department: t.departmentName || 'Unassigned',
        subjects: assignedSubjects.length > 0 ? assignedSubjects : [], 
        assignedClasses: [], // We will build this out later when we map Streams
        status: t.isActive ? 'Active' : 'On Leave',
      };
    });
  }

  async getDepartments(tenantId: string) {
    return await repository.getDepartments(tenantId);
  }

  async getTeacherById(tenantId: string, teacherId: string) {
    const t = await repository.getTeacherById(tenantId, teacherId);
    if (!t) throw new Error('Teacher not found');
    
    // Fetch specific subjects for this teacher
    const allSubjects = await db.select({ name: subjects.name, teacherIds: subjects.teacherIds }).from(subjects).where(eq(subjects.tenantId, tenantId));
    
    const assignedSubjects = allSubjects.filter(sub => {
      try {
        const raw = typeof sub.teacherIds === 'string' ? JSON.parse(sub.teacherIds) : sub.teacherIds;
        const ids = Array.isArray(raw) ? raw : (typeof raw === 'string' ? JSON.parse(raw) : []);
        return ids.includes(t.id);
      } catch { return false; }
    }).map(sub => sub.name);

    return {
      id: t.id,
      fullName: `${t.firstName} ${t.lastName}`,
      email: t.email,
      phone: t.phone || 'N/A',
      employeeNumber: t.employeeNumber,
      qualifications: t.qualifications || 'No qualifications listed',
      department: t.departmentName || 'Unassigned',
      subjects: assignedSubjects,
      assignedClasses: [],
      status: t.isActive ? 'Active' : 'On Leave',
    };
  }

  async createTeacher(tenantId: string, adminUserId: string, data: any) {
    const defaultPassword = 'Welcome123!';
    const passwordHash = await bcrypt.hash(defaultPassword, 10);

    const userData = {
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      phone: data.phone || null,
      passwordHash,
      isActive: data.isActive ?? true,
    };

    const teacherData = {
      departmentId: data.departmentId || null,
      employeeNumber: data.employeeNumber,
      qualifications: data.qualifications || null,
      isActive: data.isActive ?? true,
    };

    const result = await repository.createTeacher(tenantId, userData, teacherData as any);

    await db.insert(auditLogs).values({
      tenantId, userId: adminUserId, action: 'CREATE', module: 'STAFF', entity: 'Teacher', entityId: result.teacher.id, newValue: result.teacher,
    });

    return result;
  }

  async updateTeacher(tenantId: string, teacherId: string, adminUserId: string, data: any) {
    const userData: any = {};
    const teacherData: any = {};

    if (data.email !== undefined) userData.email = data.email;
    if (data.firstName !== undefined) userData.firstName = data.firstName;
    if (data.lastName !== undefined) userData.lastName = data.lastName;
    if (data.phone !== undefined) userData.phone = data.phone;
    if (data.isActive !== undefined) userData.isActive = data.isActive;

    if (data.departmentId !== undefined) teacherData.departmentId = data.departmentId;
    if (data.employeeNumber !== undefined) teacherData.employeeNumber = data.employeeNumber;
    if (data.qualifications !== undefined) teacherData.qualifications = data.qualifications;
    if (data.isActive !== undefined) teacherData.isActive = data.isActive;

    await repository.updateTeacher(tenantId, teacherId, userData, teacherData);

    await db.insert(auditLogs).values({
      tenantId, userId: adminUserId, action: 'UPDATE', module: 'STAFF', entity: 'Teacher', entityId: teacherId, newValue: data,
    });
    return { success: true };
  }

  async deleteTeacher(tenantId: string, teacherId: string, adminUserId: string) {
    await repository.deleteTeacher(tenantId, teacherId);
    await db.insert(auditLogs).values({
      tenantId, userId: adminUserId, action: 'DELETE', module: 'STAFF', entity: 'Teacher', entityId: teacherId, newValue: { status: 'deleted' },
    });
    return { success: true };
  }
}