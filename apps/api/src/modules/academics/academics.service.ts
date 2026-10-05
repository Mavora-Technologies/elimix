// apps/api/src/modules/academics/academics.service.ts
import { AcademicsRepository } from './academics.repository.js';
import { db } from '../../config/db.js';
import { auditLogs } from '../audit/audit.schema.js';

const repository = new AcademicsRepository();

export class AcademicsService {
  async getClassesAndStreams(tenantId: string) {
    const rawStreams = await repository.getStreamsWithDetails(tenantId);

    // Map the database response to match the frontend ClassStream interface
    return rawStreams.map((row) => ({
      id: row.id,
      gradeName: row.gradeName,
      streamName: row.streamName,
      classTeacher: row.teacherFirstName ? `${row.teacherFirstName} ${row.teacherLastName}` : 'Unassigned',
      teacherEmail: row.teacherEmail || 'N/A',
      studentCount: 0, // TODO: Will dynamically count from `enrollments` table in Phase 4
      capacity: row.capacity,
      roomNumber: row.roomNumber || 'TBD',
    }));
  }

  async getReferenceData(tenantId: string) {
    return await repository.getReferenceData(tenantId);
  }

  async createStream(tenantId: string, userId: string, data: any) {
    const cleanedData = {
      ...data,
      classTeacherId: data.classTeacherId && data.classTeacherId !== '' ? data.classTeacherId : null,
      roomNumber: data.roomNumber && data.roomNumber !== '' ? data.roomNumber : null,
    };

    const stream = await repository.createStream(tenantId, cleanedData);
    
    await db.insert(auditLogs).values({
      tenantId, userId, action: 'CREATE', module: 'ACADEMICS', entity: 'Stream', entityId: stream.id, newValue: stream,
    });
    
    return stream;
  }
}