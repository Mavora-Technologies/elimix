// apps/api/src/modules/academics/subjects.service.ts
import { SubjectsRepository } from './subjects.repository.js';
import { db } from '../../config/db.js';
import { auditLogs } from '../audit/audit.schema.js';

const repository = new SubjectsRepository();

export class SubjectsService {
  async getSubjects(tenantId: string) {
    return await repository.getSubjects(tenantId);
  }

  async createSubject(tenantId: string, userId: string, data: any) {
    const subject = await repository.createSubject(tenantId, data);
    await db.insert(auditLogs).values({
      tenantId, userId, action: 'CREATE', module: 'ACADEMICS', entity: 'Subject', entityId: subject.id, newValue: subject,
    });
    return subject;
  }

  async updateSubject(tenantId: string, id: string, userId: string, data: any) {
    const subject = await repository.updateSubject(tenantId, id, data);
    if (!subject) throw new Error('Subject not found');
    await db.insert(auditLogs).values({
      tenantId, userId, action: 'UPDATE', module: 'ACADEMICS', entity: 'Subject', entityId: subject.id, newValue: data,
    });
    return subject;
  }

  async deleteSubject(tenantId: string, id: string, userId: string) {
    await repository.deleteSubject(tenantId, id);
    await db.insert(auditLogs).values({
      tenantId, userId, action: 'DELETE', module: 'ACADEMICS', entity: 'Subject', entityId: id, newValue: { status: 'deleted' },
    });
    return true;
  }

  async allocateTeacher(tenantId: string, userId: string, data: any) {
    const allocation = await repository.allocateTeacher(tenantId, data);
    await db.insert(auditLogs).values({
      tenantId, userId, action: 'CREATE', module: 'ACADEMICS', entity: 'SubjectAllocation', entityId: allocation.id, newValue: allocation,
    });
    return allocation;
  }
}