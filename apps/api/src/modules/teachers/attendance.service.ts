// apps/api/src/modules/teachers/attendance.service.ts
import { AttendanceRepository } from './attendance.repository.js';
import { db } from '../../config/db.js';
import { auditLogs } from '../audit/audit.schema.js';

const repository = new AttendanceRepository();

export class AttendanceService {
  async getDailyAttendance(tenantId: string, date: string) {
    const records = await repository.getDailyAttendance(tenantId, date);
    
    return records.map(r => ({
      id: r.attendanceId || `pending-${r.teacherId}`, // Generate safe UI key if no record exists
      teacherId: r.teacherId,
      teacherName: `${r.teacherName} ${r.teacherLastName}`,
      employeeNumber: r.employeeNumber,
      department: r.department || 'Unassigned',
      date: r.date || date,
      checkIn: r.checkIn || '--',
      checkOut: r.checkOut || '--',
      status: r.status || 'Not Marked', // Default UI status
    }));
  }

  async logAttendance(tenantId: string, adminUserId: string, data: any) {
    const record = await repository.upsertAttendance(tenantId, data);
    
    await db.insert(auditLogs).values({
      tenantId, userId: adminUserId, action: 'UPDATE', module: 'STAFF', entity: 'TeacherAttendance', entityId: record.id, newValue: record,
    });
    
    return record;
  }
}