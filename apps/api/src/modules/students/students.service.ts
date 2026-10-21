// apps/api/src/modules/students/students.service.ts
import { eq } from 'drizzle-orm';
import { db } from '../../config/db.js';
import { auditLogs } from '../audit/audit.schema.js';
import { StudentsRepository } from './students.repository.js';
import { students } from './students.schema.js';
import { classes, streams } from '../academics/academics.schema.js';

const repository = new StudentsRepository();

export class StudentsService {
  async createStudent(tenantId: string, userId: string, data: typeof students.$inferInsert) {
    const student = await repository.create(tenantId, data);
    
    await db.insert(auditLogs).values({
      tenantId,
      userId,
      action: 'CREATE',
      module: 'STUDENTS',
      entity: 'Student',
      entityId: student.id,
      newValue: student,
    });

    return student;
  }

  async getStudents(tenantId: string) {
    return await repository.findAll(tenantId);
  }

  async getStudentById(tenantId: string, studentId: string) {
    const student = await repository.findById(tenantId, studentId);
    if (!student) throw new Error('Student not found');
    return student;
  }

  async updateStudent(tenantId: string, userId: string, studentId: string, data: Partial<typeof students.$inferInsert>) {
    const oldStudent = await this.getStudentById(tenantId, studentId);
    const updatedStudent = await repository.update(tenantId, studentId, data);
    
    if (!updatedStudent) throw new Error('Student not found');

    await db.insert(auditLogs).values({
      tenantId,
      userId,
      action: 'UPDATE',
      module: 'STUDENTS',
      entity: 'Student',
      entityId: studentId,
      oldValue: oldStudent,
      newValue: updatedStudent,
    });

    return updatedStudent;
  }

  async deleteStudent(tenantId: string, userId: string, studentId: string) {
    const oldStudent = await this.getStudentById(tenantId, studentId);
    const deletedStudent = await repository.delete(tenantId, studentId);
    
    if (!deletedStudent) throw new Error('Student not found');

    await db.insert(auditLogs).values({
      tenantId,
      userId,
      action: 'DELETE',
      module: 'STUDENTS',
      entity: 'Student',
      entityId: studentId,
      oldValue: oldStudent,
    });

    return deletedStudent;
  }

  async getClassesAndStreams(tenantId: string) {
    const [classList, streamList] = await Promise.all([
      db.select().from(classes).where(eq(classes.tenantId, tenantId)).catch(() => []),
      db.select().from(streams).where(eq(streams.tenantId, tenantId)).catch(() => []),
    ]);
    return { classes: classList, streams: streamList };
  }
}