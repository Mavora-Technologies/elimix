import { AttendanceRepository } from './attendance.repository.js';
import { db } from '../../config/db.js';
import { auditLogs } from '../audit/audit.schema.js';

const repository = new AttendanceRepository();

export class AttendanceService {
    async saveAttendance(tenantId: string, userId: string, payload: any) {
        // 1. Format payload for database bulk insert
        const recordsToInsert = payload.records.map((r: any) => ({
            tenantId,
            studentId: r.studentId,
            date: payload.date,
            status: r.status,
            recordedById: userId
        }));

        // 2. Perform bulk upsert
        const savedRecords = await repository.upsertAttendanceRecords(recordsToInsert);

        // 3. Log the batch update in the audit trail
        await db.insert(auditLogs).values({
            tenantId,
            userId,
            action: 'UPDATE',
            module: 'ATTENDANCE',
            entity: 'AttendanceBatch',
            entityId: payload.date,
            newValue: { count: savedRecords.length, date: payload.date, stream: payload.stream }
        });

        return savedRecords;
    }

    async getAttendanceByDate(tenantId: string, date: string) {
        return await repository.getAttendanceByDate(tenantId, date);
    }
}