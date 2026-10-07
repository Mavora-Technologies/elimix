import { Response } from 'express';
import { AuthenticatedRequest } from '../../middleware/auth.middleware.js';
import { AttendanceService } from './attendance.service.js';
import { saveAttendanceSchema } from '../../validators/attendance.validator.js';

const service = new AttendanceService();

export class AttendanceController {
    async saveAttendance(req: AuthenticatedRequest, res: Response) {
        try {
            const validatedData = saveAttendanceSchema.parse(req.body);
            const data = await service.saveAttendance(req.tenantId!, req.user!.userId, validatedData);
            res.status(200).json({ success: true, data });
        } catch (error: any) {
            if (error.name === 'ZodError') {
                // Log the EXACT fields causing the error in your server console
                console.error('[Attendance Validation Error]:', JSON.stringify(error.errors, null, 2));
                return res.status(400).json({
                    success: false,
                    message: 'Validation failed',
                    errors: error.errors
                });
            }
            console.error('[Attendance Server Error]:', error);
            res.status(500).json({ success: false, message: error.message });
        }
    }

    async getAttendance(req: AuthenticatedRequest, res: Response) {
        try {
            const date = req.query.date as string;
            if (!date) {
                return res.status(400).json({ success: false, message: 'Date query parameter is required' });
            }
            const data = await service.getAttendanceByDate(req.tenantId!, date);
            res.status(200).json({ success: true, data });
        } catch (error: any) {
            res.status(500).json({ success: false, message: error.message });
        }
    }
}