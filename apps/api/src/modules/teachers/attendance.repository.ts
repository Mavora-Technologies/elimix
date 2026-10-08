// apps/api/src/modules/teachers/attendance.repository.ts
import { db } from '../../config/db.js';
import { teacherAttendance } from './attendance.schema.js';
import { teachers, departments } from './teachers.schema.js';
import { users } from '../auth/auth.schema.js';
import { eq, and } from 'drizzle-orm';

export class AttendanceRepository {
  async getDailyAttendance(tenantId: string, queryDate: string) {
    // Select ALL teachers, and left-join attendance data ONLY for the selected date
    return await db.select({
      teacherId: teachers.id,
      teacherName: users.firstName,
      teacherLastName: users.lastName,
      employeeNumber: teachers.employeeNumber,
      department: departments.name,
      // Attendance fields (will be null if not marked yet)
      attendanceId: teacherAttendance.id,
      date: teacherAttendance.date,
      checkIn: teacherAttendance.checkIn,
      checkOut: teacherAttendance.checkOut,
      status: teacherAttendance.status,
    })
    .from(teachers)
    .innerJoin(users, eq(teachers.userId, users.id))
    .leftJoin(departments, eq(teachers.departmentId, departments.id))
    .leftJoin(teacherAttendance, and(
      eq(teachers.id, teacherAttendance.teacherId),
      eq(teacherAttendance.date, queryDate)
    ))
    .where(eq(teachers.tenantId, tenantId))
    .orderBy(users.firstName);
  }

  async upsertAttendance(tenantId: string, data: any) {
    const payload = {
      tenantId,
      teacherId: data.teacherId,
      date: data.date,
      checkIn: data.checkIn || null,
      checkOut: data.checkOut || null,
      status: data.status,
      updatedAt: new Date(),
    };

    const [record] = await db.insert(teacherAttendance)
      .values(payload)
      .onConflictDoUpdate({
        target: [teacherAttendance.tenantId, teacherAttendance.teacherId, teacherAttendance.date],
        set: {
          checkIn: payload.checkIn,
          checkOut: payload.checkOut,
          status: payload.status,
          updatedAt: payload.updatedAt,
        }
      })
      .returning();

    return record;
  }
}