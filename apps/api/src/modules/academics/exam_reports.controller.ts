// apps/api/src/modules/academics/exam_reports.controller.ts
import { Response } from 'express';
import { AuthenticatedRequest } from '../../middleware/auth.middleware.js';
import { ExamReportsRepository } from './exam_reports.repository.js';
import { upsertExamReportSchema } from '../../validators/exam_reports.validator.js';

const repository = new ExamReportsRepository();

export class ExamReportsController {
  async getReports(req: AuthenticatedRequest, res: Response) {
    try {
      const data = await repository.getAggregatedReports(req.tenantId!);
      return res.status(200).json({ success: true, data });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  async upsertReport(req: AuthenticatedRequest, res: Response) {
    try {
      const parsed = upsertExamReportSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({
          success: false,
          message: parsed.error.issues[0]?.message || 'Validation failed',
        });
      }
      const data = await repository.upsertReportEndorsement(req.tenantId!, parsed.data);
      return res.status(200).json({ success: true, data });
    } catch (error: any) {
      return res.status(400).json({ success: false, message: error.message });
    }
  }

  async publishExamBatch(req: AuthenticatedRequest, res: Response) {
    try {
      const { examId } = req.body;
      if (!examId) {
        return res.status(400).json({ success: false, message: 'examId is required' });
      }
      const count = await repository.publishAllForExam(req.tenantId!, examId);
      return res.status(200).json({
        success: true,
        message: `Published ${count} official report cards.`,
      });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }
}