// apps/api/src/modules/teachers/attendance.controller.ts
import { Response } from 'express';
import { AuthenticatedRequest } from '../../middleware/auth.middleware.js';
import { AttendanceService } from './attendance.service.js';
import { attendanceRecordSchema } from '../../validators/attendance.validator.js';

const service = new AttendanceService();

export class AttendanceController {
  async getDailyAttendance(req: AuthenticatedRequest, res: Response) {
    try {
      const date = (req.query.date as string) || new Date().toISOString().split('T')[0];
      const data = await service.getDailyAttendance(req.tenantId!, date);
      res.status(200).json({ success: true, data });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async logAttendance(req: AuthenticatedRequest, res: Response) {
    try {
      const validatedData = attendanceRecordSchema.parse(req.body);
      const data = await service.logAttendance(req.tenantId!, req.user!.userId, validatedData);
      res.status(200).json({ success: true, data });
    } catch (error: any) {
      if (error.name === 'ZodError') return res.status(400).json({ success: false, errors: error.errors });
      res.status(400).json({ success: false, message: error.message });
    }
  }
}