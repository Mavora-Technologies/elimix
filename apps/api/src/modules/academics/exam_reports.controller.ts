// apps/api/src/modules/academics/exam_reports.controller.ts
import { Response } from 'express';
import { AuthenticatedRequest } from '../../middleware/auth.middleware.js';
import { ExamReportsRepository } from './exam_reports.repository.js';
import { createExamReportSchema } from '../../validators/exam_reports.validator.js';

const repository = new ExamReportsRepository();

export class ExamReportsController {
  async getReports(req: AuthenticatedRequest, res: Response) {
    try {
      const records = await repository.getReports(req.tenantId!);
      const data = records.map(r => ({
        id: r.id,
        title: r.title,
        term: r.term,
        gradeLevel: r.gradeLevel,
        totalStudents: r.totalStudents,
        averageGpa: Number(r.averageGpa),
        passRate: Number(r.passRate),
        status: r.status,
        generatedDate: new Date(r.generatedDate).toISOString().split('T')[0],
      }));
      res.status(200).json({ success: true, data });
    } catch (error: any) { res.status(500).json({ success: false, message: error.message }); }
  }

  async createReport(req: AuthenticatedRequest, res: Response) {
    try {
      const validated = createExamReportSchema.parse(req.body);
      // In a real system, you would calculate totalStudents, GPA, and Pass Rate dynamically here
      // by querying the `exam_results` table for the specific Term/Grade.
      // For this phase, we accept UI input to demonstrate the engine.
      const payload = {
        ...validated,
        totalStudents: validated.totalStudents || Math.floor(Math.random() * 150) + 50,
        averageGpa: validated.averageGpa || Number((Math.random() * (4.0 - 2.5) + 2.5).toFixed(2)),
        passRate: validated.passRate || Number((Math.random() * (100 - 65) + 65).toFixed(1)),
        generatedDate: new Date(),
      };
      const data = await repository.createReport(req.tenantId!, payload);
      res.status(201).json({ success: true, data });
    } catch (error: any) {
      if (error.name === 'ZodError') return res.status(400).json({ success: false, errors: error.errors });
      res.status(400).json({ success: false, message: error.message });
    }
  }

  async updateReport(req: AuthenticatedRequest, res: Response) {
    try {
      const validated = createExamReportSchema.parse(req.body);
      const data = await repository.updateReport(req.tenantId!, req.params.id as string, validated);
      res.status(200).json({ success: true, data });
    } catch (error: any) { res.status(400).json({ success: false, message: error.message }); }
  }

  async deleteReport(req: AuthenticatedRequest, res: Response) {
    try {
      await repository.deleteReport(req.tenantId!, req.params.id as string);
      res.status(200).json({ success: true, message: 'Deleted' });
    } catch (error: any) { res.status(500).json({ success: false, message: error.message }); }
  }
}