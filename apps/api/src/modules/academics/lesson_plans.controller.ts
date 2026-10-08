// apps/api/src/modules/academics/lesson_plans.controller.ts
import { Response } from 'express';
import { AuthenticatedRequest } from '../../middleware/auth.middleware.js';
import { LessonPlansRepository } from './lesson_plans.repository.js';
import { createLessonPlanSchema, updateLessonPlanStatusSchema } from '../../validators/lesson_plans.validator.js';

const repository = new LessonPlansRepository();

export class LessonPlansController {
  async getLessonPlans(req: AuthenticatedRequest, res: Response) {
    try {
      const records = await repository.getLessonPlans(req.tenantId!);
      const data = records.map(r => ({
        id: r.id,
        title: r.title,
        subject: r.subjectName,
        teacherName: `${r.teacherFirstName} ${r.teacherLastName}`,
        gradeStream: r.streamName,
        status: r.status,
        submissionDate: r.submissionDate ? new Date(r.submissionDate).toISOString().split('T')[0] : 'N/A',
      }));
      res.status(200).json({ success: true, data });
    } catch (error: any) { res.status(500).json({ success: false, message: error.message }); }
  }

  async createLessonPlan(req: AuthenticatedRequest, res: Response) {
    try {
      const validatedData = createLessonPlanSchema.parse(req.body);
      const data = await repository.createLessonPlan(req.tenantId!, validatedData);
      res.status(201).json({ success: true, data });
    } catch (error: any) {
      if (error.name === 'ZodError') return res.status(400).json({ success: false, errors: error.errors });
      res.status(400).json({ success: false, message: error.message });
    }
  }

  async updateStatus(req: AuthenticatedRequest, res: Response) {
    try {
      const { status } = updateLessonPlanStatusSchema.parse(req.body);
      await repository.updateStatus(req.tenantId!, req.params.id as string, status);
      res.status(200).json({ success: true, message: 'Status updated' });
    } catch (error: any) { res.status(500).json({ success: false, message: error.message }); }
  }

  async updateLessonPlan(req: AuthenticatedRequest, res: Response) {
    try {
      const validatedData = createLessonPlanSchema.parse(req.body); // Reusing create schema for full updates
      const data = await repository.updateLessonPlan(req.tenantId!, req.params.id as string, validatedData);
      res.status(200).json({ success: true, data });
    } catch (error: any) {
      if (error.name === 'ZodError') return res.status(400).json({ success: false, errors: error.errors });
      res.status(400).json({ success: false, message: error.message });
    }
  }

  async deleteLessonPlan(req: AuthenticatedRequest, res: Response) {
    try {
      await repository.deleteLessonPlan(req.tenantId!, req.params.id as string);
      res.status(200).json({ success: true, message: 'Lesson plan deleted successfully' });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
}