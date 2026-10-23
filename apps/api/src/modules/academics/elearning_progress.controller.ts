// apps/api/src/modules/academics/elearning_progress.controller.ts
import { Response } from 'express';
import { AuthenticatedRequest } from '../../middleware/auth.middleware.js';
import { ELearningProgressRepository } from './elearning_progress.repository.js';

const repository = new ELearningProgressRepository();

export class ELearningProgressController {
  async getProgressOverview(req: AuthenticatedRequest, res: Response) {
    try {
      const data = await repository.getStudentProgressOverview(req.tenantId!);
      return res.status(200).json({ success: true, data });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  async getStudentCourseDetail(req: AuthenticatedRequest, res: Response) {
    try {
      const { studentId, courseId } = req.query;
      if (!studentId || !courseId) {
        return res.status(400).json({ success: false, message: 'studentId and courseId are required' });
      }
      const data = await repository.getStudentCourseDetail(
        req.tenantId!,
        studentId as string,
        courseId as string
      );
      return res.status(200).json({ success: true, data });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  async toggleLessonCompletion(req: AuthenticatedRequest, res: Response) {
    try {
      const { studentId, courseId, lessonId, completed } = req.body;
      if (!studentId || !courseId || !lessonId) {
        return res.status(400).json({ success: false, message: 'Missing required fields' });
      }
      const data = await repository.toggleLessonCompletion(
        req.tenantId!,
        studentId,
        courseId,
        lessonId,
        Boolean(completed)
      );
      return res.status(200).json({ success: true, data });
    } catch (error: any) {
      return res.status(400).json({ success: false, message: error.message });
    }
  }

  async updateProgressStatus(req: AuthenticatedRequest, res: Response) {
    try {
      const { studentId, courseId, status, facultyNotes, modulesCompleted } = req.body;
      const data = await repository.updateStudentProgressStatus(
        req.tenantId!,
        studentId,
        courseId,
        { status, facultyNotes, modulesCompleted }
      );
      return res.status(200).json({ success: true, data });
    } catch (error: any) {
      return res.status(400).json({ success: false, message: error.message });
    }
  }
}