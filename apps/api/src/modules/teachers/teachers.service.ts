import { TeachersRepository } from './teachers.repository.js';
import { db } from '../../config/db.js';
import { auditLogs } from '../audit/audit.schema.js';
import bcrypt from 'bcrypt';

const repository = new TeachersRepository();

export class TeachersService {
  async getAllTeachers(tenantId: string) {
    const rawTeachers = await repository.getAllTeachers(tenantId);
    
    return rawTeachers.map(t => ({
      id: t.id,
      fullName: `${t.firstName} ${t.lastName}`,
      email: t.email,
      phone: t.phone || 'N/A', // Phone restored
      department: t.departmentName || 'Unassigned',
      subjects: ['Pending Allocation'], 
      assignedClasses: ['Unassigned'],
      status: t.isActive ? 'Active' : 'On Leave',
    }));
  }

  async getDepartments(tenantId: string) {
    return await repository.getDepartments(tenantId);
  }

  async getTeacherById(tenantId: string, teacherId: string) {
    const t = await repository.getTeacherById(tenantId, teacherId);
    if (!t) throw new Error('Teacher not found');
    
    return {
      id: t.id,
      fullName: `${t.firstName} ${t.lastName}`,
      email: t.email,
      phone: t.phone || 'N/A',
      employeeNumber: t.employeeNumber,
      qualifications: t.qualifications || 'No qualifications listed',
      department: t.departmentName || 'Unassigned',
      subjects: ['Pending Allocation'],
      assignedClasses: ['Unassigned'],
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
      phone: data.phone || null, // Phone restored
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
      tenantId,
      userId: adminUserId,
      action: 'CREATE',
      module: 'STAFF',
      entity: 'Teacher',
      entityId: result.teacher.id,
      newValue: result.teacher,
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