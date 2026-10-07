// apps/api/src/modules/departments/departments.service.ts
import { DepartmentsRepository } from './departments.repository.js';
import { db } from '../../config/db.js';
import { auditLogs } from '../audit/audit.schema.js';

const repository = new DepartmentsRepository();

export class DepartmentsService {
  async getAllDepartments(tenantId: string) {
    const records = await repository.getAllDepartments(tenantId);
    return records.map(r => {
      let parsedSubjects: string[] = [];
      
      // Cast to unknown to override any lingering strict schema types
      const rawSubjects: unknown = r.subjects; 

      if (typeof rawSubjects === 'string') {
        try {
          // Attempt to parse standard JSON
          let parsed = JSON.parse(rawSubjects);
          
          // Unpack if it was accidentally double-encoded
          if (typeof parsed === 'string') {
            try { parsed = JSON.parse(parsed); } catch (e) { /* ignore */ }
          }
          
          parsedSubjects = Array.isArray(parsed) ? parsed : [];
        } catch {
          // Fallback for comma-separated string, with explicit (s: string) type
          parsedSubjects = rawSubjects.split(',').map((s: string) => s.trim()).filter(Boolean);
        }
      } else if (Array.isArray(rawSubjects)) {
        // If the database driver already parsed it as an array
        parsedSubjects = rawSubjects;
      }

      // Final safety fallback
      if (!Array.isArray(parsedSubjects)) {
        parsedSubjects = [];
      }

      return {
        ...r,
        hodName: r.hodFirstName && r.hodLastName ? `${r.hodFirstName} ${r.hodLastName}` : null,
        facultyCount: Number(r.facultyCount) || 0,
        subjects: parsedSubjects,
      };
    });
  }

  async createDepartment(tenantId: string, adminUserId: string, data: any) {
    const dept = await repository.createDepartment(tenantId, data);
    await db.insert(auditLogs).values({
      tenantId, userId: adminUserId, action: 'CREATE', module: 'ACADEMICS', entity: 'Department', entityId: dept.id, newValue: dept,
    });
    return dept;
  }

  async updateDepartment(tenantId: string, id: string, adminUserId: string, data: any) {
    const dept = await repository.updateDepartment(tenantId, id, data);
    if (!dept) throw new Error('Department not found');
    await db.insert(auditLogs).values({
      tenantId, userId: adminUserId, action: 'UPDATE', module: 'ACADEMICS', entity: 'Department', entityId: dept.id, newValue: data,
    });
    return dept;
  }

  async deleteDepartment(tenantId: string, id: string, adminUserId: string) {
    await repository.deleteDepartment(tenantId, id);
    await db.insert(auditLogs).values({
      tenantId, userId: adminUserId, action: 'DELETE', module: 'ACADEMICS', entity: 'Department', entityId: id, newValue: { status: 'deleted' },
    });
    return true;
  }
}