// apps/api/src/validators/attendance.validator.ts
import { z } from 'zod';

/* ==========================================================================
   STUDENT ATTENDANCE VALIDATORS
   (Preserved original functionality)
   ========================================================================== */
export const saveAttendanceSchema = z.object({
  date: z.string().min(10, 'Date is required'),
  stream: z.string().optional().nullable(),
  records: z.array(z.object({
    studentId: z.string().min(1, 'Invalid Student ID'),
    status: z.enum(['Present', 'Absent', 'Late', 'Excused'])
  })).min(1, 'At least one student attendance record is required')
});


/* ==========================================================================
   TEACHER / STAFF ATTENDANCE VALIDATORS
   (New features added for dashboard/teachers/attendance)
   ========================================================================== */
export const attendanceRecordSchema = z.object({
  teacherId: z.string().uuid('Invalid Teacher ID'),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be YYYY-MM-DD'),
  checkIn: z.string().nullable().optional(),
  checkOut: z.string().nullable().optional(),
  status: z.enum(['Present', 'Late', 'Absent', 'On Leave']),
});