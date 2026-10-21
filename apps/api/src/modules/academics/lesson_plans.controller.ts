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
      const data = records.map((r) => ({
        id: r.id,
        title: r.title,
        objectives: r.objectives || '',
        subjectId: r.subjectId,
        subject: r.subjectName,
        teacherId: r.teacherId,
        teacherName: `${r.teacherFirstName} ${r.teacherLastName}`.trim(),
        streamId: r.streamId,
        gradeStream: r.streamName,
        status: r.status,
        submissionDate: r.submissionDate
          ? new Date(r.submissionDate).toISOString().split('T')[0]
          : 'N/A',
      }));
      return res.status(200).json({ success: true, data });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  async createLessonPlan(req: AuthenticatedRequest, res: Response) {
    try {
      const parsed = createLessonPlanSchema.safeParse(req.body);
      if (!parsed.success) {
        const issues = parsed.error.issues || (parsed.error as any).errors || [];
        return res.status(400).json({
          success: false,
          message: issues[0]?.message || 'Validation failed',
          errors: issues,
        });
      }
      const data = await repository.createLessonPlan(req.tenantId!, parsed.data);
      return res.status(201).json({ success: true, data });
    } catch (error: any) {
      return res.status(400).json({ success: false, message: error.message });
    }
  }

  async updateStatus(req: AuthenticatedRequest, res: Response) {
    try {
      const { status } = updateLessonPlanStatusSchema.parse(req.body);
      await repository.updateStatus(req.tenantId!, req.params.id as string, status);
      return res.status(200).json({ success: true, message: 'Status updated' });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  async updateLessonPlan(req: AuthenticatedRequest, res: Response) {
    try {
      const parsed = createLessonPlanSchema.safeParse(req.body);
      if (!parsed.success) {
        const issues = parsed.error.issues || (parsed.error as any).errors || [];
        return res.status(400).json({
          success: false,
          message: issues[0]?.message || 'Validation failed',
          errors: issues,
        });
      }
      const data = await repository.updateLessonPlan(
        req.tenantId!,
        req.params.id as string,
        parsed.data
      );
      return res.status(200).json({ success: true, data });
    } catch (error: any) {
      return res.status(400).json({ success: false, message: error.message });
    }
  }

  async deleteLessonPlan(req: AuthenticatedRequest, res: Response) {
    try {
      await repository.deleteLessonPlan(req.tenantId!, req.params.id as string);
      return res.status(200).json({ success: true, message: 'Lesson plan deleted successfully' });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }
}