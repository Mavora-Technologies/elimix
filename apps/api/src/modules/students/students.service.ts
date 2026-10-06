import { StudentsRepository } from './students.repository';
import { AuditService } from '../audit/audit.service';

export class StudentsService {
  private studentsRepo = new StudentsRepository();
  private auditService = new AuditService();

  async getStudentDirectory(tenantId: string, search?: string) {
    return await this.studentsRepo.findAllByTenant(tenantId, search);
  }

  async registerStudent(tenantId: string, userId: string, payload: any) {
    const student = await this.studentsRepo.create({
      ...payload,
      tenantId,
    });

    // Rule 11 & 65: Every important action must be auditable
    await this.auditService.log({
      tenantId,
      userId,
      action: 'STUDENT_ADMISSION_CREATED',
      module: 'STUDENTS',
      entityId: student.id,
      newValue: student,
    });

    return student;
  }
}