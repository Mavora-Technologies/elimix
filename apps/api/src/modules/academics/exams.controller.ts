// apps/api/src/modules/academics/exams.controller.ts
import { Response } from 'express';
import { AuthenticatedRequest } from '../../middleware/auth.middleware.js';
import { ExamsRepository } from './exams.repository.js';
import { createExamSchema, updateExamStatusSchema } from '../../validators/exams.validator.js';

const repository = new ExamsRepository();

export class ExamsController {
  async getExams(req: AuthenticatedRequest, res: Response) {
    try {
      const records = await repository.getExams(req.tenantId!);
      res.status(200).json({ success: true, data: records });
    } catch (error: any) { res.status(500).json({ success: false, message: error.message }); }
  }

  async createExam(req: AuthenticatedRequest, res: Response) {
    try {
      const validated = createExamSchema.parse(req.body);
      const data = await repository.createExam(req.tenantId!, validated);
      res.status(201).json({ success: true, data });
    } catch (error: any) {
      if (error.name === 'ZodError') return res.status(400).json({ success: false, errors: error.errors });
      res.status(400).json({ success: false, message: error.message });
    }
  }

  async updateExam(req: AuthenticatedRequest, res: Response) {
    try {
      const validated = createExamSchema.parse(req.body);
      const data = await repository.updateExam(req.tenantId!, req.params.id as string, validated);
      res.status(200).json({ success: true, data });
    } catch (error: any) { res.status(400).json({ success: false, message: error.message }); }
  }

  async updateStatus(req: AuthenticatedRequest, res: Response) {
    try {
      const { status } = updateExamStatusSchema.parse(req.body);
      await repository.updateStatus(req.tenantId!, req.params.id as string, status);
      res.status(200).json({ success: true, message: 'Status updated' });
    } catch (error: any) { res.status(500).json({ success: false, message: error.message }); }
  }

  async deleteExam(req: AuthenticatedRequest, res: Response) {
    try {
      await repository.deleteExam(req.tenantId!, req.params.id as string);
      res.status(200).json({ success: true, message: 'Deleted' });
    } catch (error: any) { res.status(500).json({ success: false, message: error.message }); }
  }
}