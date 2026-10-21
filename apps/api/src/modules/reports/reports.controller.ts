// apps/api/src/modules/reports/reports.controller.ts
import { Response } from 'express';
import { AuthenticatedRequest } from '../../middleware/auth.middleware.js';
import { EnrollmentReportService } from './enrollment.service.js';

export class ReportsController {
  static async getEnrollmentReport(req: AuthenticatedRequest, res: Response) {
    try {
      const tenantId = req.tenantId || req.user?.tenantId;
      if (!tenantId) {
        return res.status(400).json({ success: false, message: 'Tenant context required', code: 'TENANT_MISSING' });
      }

      const data = await EnrollmentReportService.getEnrollmentAnalytics(tenantId);
      return res.status(200).json({ success: true, data });
    } catch (error: any) {
      console.error('[ReportsController.getEnrollmentReport]', error);
      return res.status(500).json({ success: false, message: 'Failed to generate enrollment report', code: 'INTERNAL_ERROR' });
    }
  }
}