// apps/api/src/modules/academics/exam_results.controller.ts
import { Response } from 'express';
import { AuthenticatedRequest } from '../../middleware/auth.middleware.js';
import { ExamResultsRepository } from './exam_results.repository.js';
import { createExamResultSchema } from '../../validators/exam_results.validator.js';

const repository = new ExamResultsRepository();

export class ExamResultsController {
  async getResults(req: AuthenticatedRequest, res: Response) {
    try {
      const records = await repository.getResults(req.tenantId!);
      const data = records.map(r => ({
        id: r.id,
        studentId: r.studentId,
        studentName: `${r.studentFirstName} ${r.studentLastName}`,
        examTitle: r.examTitle,
        subject: r.subject,
        gradeStream: r.gradeStream,
        marksObtained: Number(r.marksObtained),
        totalMarks: Number(r.totalMarks),
        grade: r.grade,
        status: r.status,
      }));
      res.status(200).json({ success: true, data });
    } catch (error: any) { res.status(500).json({ success: false, message: error.message }); }
  }

  async createResult(req: AuthenticatedRequest, res: Response) {
    try {
      const validated = createExamResultSchema.parse(req.body);
      const data = await repository.createResult(req.tenantId!, validated);
      res.status(201).json({ success: true, data });
    } catch (error: any) {
      if (error.name === 'ZodError') return res.status(400).json({ success: false, errors: error.errors });
      res.status(400).json({ success: false, message: error.message });
    }
  }

  async updateResult(req: AuthenticatedRequest, res: Response) {
    try {
      const validated = createExamResultSchema.parse(req.body);
      const data = await repository.updateResult(req.tenantId!, req.params.id as string, validated);
      res.status(200).json({ success: true, data });
    } catch (error: any) { res.status(400).json({ success: false, message: error.message }); }
  }

  async deleteResult(req: AuthenticatedRequest, res: Response) {
    try {
      await repository.deleteResult(req.tenantId!, req.params.id as string);
      res.status(200).json({ success: true, message: 'Deleted' });
    } catch (error: any) { res.status(500).json({ success: false, message: error.message }); }
  }
}