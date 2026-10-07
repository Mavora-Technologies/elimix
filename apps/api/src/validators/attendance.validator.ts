import { z } from 'zod';

export const saveAttendanceSchema = z.object({
  date: z.string().min(10, 'Date is required'),
  stream: z.string().optional().nullable(),
  records: z.array(z.object({
    studentId: z.string().min(1, 'Invalid Student ID'),
    status: z.enum(['Present', 'Absent', 'Late', 'Excused'])
  })).min(1, 'At least one student attendance record is required')
});