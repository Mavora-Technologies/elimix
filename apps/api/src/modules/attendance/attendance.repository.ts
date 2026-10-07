import { db } from '../../config/db.js';
import { attendance } from './attendance.schema.js';
import { sql } from 'drizzle-orm';

export class AttendanceRepository {
    async upsertAttendanceRecords(records: typeof attendance.$inferInsert[]) {
        return await db.insert(attendance)
            .values(records)
            .onConflictDoUpdate({
                target: [attendance.studentId, attendance.date], // Conflict target
                set: {
                    status: sql`EXCLUDED.status`,
                    updatedAt: sql`NOW()`,
                    recordedById: sql`EXCLUDED.recorded_by_id`
                }
            })
            .returning();
    }

    async getAttendanceByDate(tenantId: string, targetDate: string) {
        return await db.select({
            studentId: attendance.studentId,
            status: attendance.status
        })
            .from(attendance)
            .where(
                sql`${attendance.tenantId} = ${tenantId} AND ${attendance.date} = ${targetDate}`
            );
    }
}