import { SubjectsRepository } from './subjects.repository.js';
import { db } from '../../config/db.js';
import { auditLogs } from '../audit/audit.schema.js';

const repository = new SubjectsRepository();

export class SubjectsService {
  async createSubject(tenantId: string, userId: string, data: any) {
    const subject = await repository.createSubject(tenantId, data);
    
    await db.insert(auditLogs).values({
      tenantId, userId, action: 'CREATE', module: 'ACADEMICS', entity: 'Subject', entityId: subject.id, newValue: subject,
    });
    
    return subject;
  }

  async getSubjects(tenantId: string) {
    return await repository.getSubjects(tenantId);
  }

  async allocateTeacher(tenantId: string, userId: string, data: any) {
    const allocation = await repository.allocateTeacher(tenantId, data);
    
    await db.insert(auditLogs).values({
      tenantId, userId, action: 'CREATE', module: 'ACADEMICS', entity: 'SubjectAllocation', entityId: allocation.id, newValue: allocation,
    });
    
    return allocation;
  }
}