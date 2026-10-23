// apps/api/src/modules/academics/exams.controller.ts
import { Response } from 'express';
import { AuthenticatedRequest } from '../../middleware/auth.middleware.js';
import { ExamsRepository } from './exams.repository.js';
import {
  createExamSchema,
  updateExamStatusSchema,
  createExamPaperSchema,
} from '../../validators/exams.validator.js';

const repository = new ExamsRepository();

export class ExamsController {
  async getAcademicYears(req: AuthenticatedRequest, res: Response) {
    try {
      const data = await repository.getAcademicYears(req.tenantId!);
      return res.status(200).json({ success: true, data });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  async getExams(req: AuthenticatedRequest, res: Response) {
    try {
      const records = await repository.getExams(req.tenantId!);
      return res.status(200).json({ success: true, data: records });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  async getExamById(req: AuthenticatedRequest, res: Response) {
    try {
      const exam = await repository.getExamById(req.tenantId!, req.params.id as string);
      if (!exam) return res.status(404).json({ success: false, message: 'Exam not found' });
      return res.status(200).json({ success: true, data: exam });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  async createExam(req: AuthenticatedRequest, res: Response) {
    try {
      const parsed = createExamSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({
          success: false,
          message: parsed.error.issues[0]?.message || 'Validation failed',
          errors: parsed.error.issues,
        });
      }
      const data = await repository.createExam(req.tenantId!, parsed.data);
      return res.status(201).json({ success: true, data });
    } catch (error: any) {
      return res.status(400).json({ success: false, message: error.message });
    }
  }

  async updateExam(req: AuthenticatedRequest, res: Response) {
    try {
      const parsed = createExamSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({
          success: false,
          message: parsed.error.issues[0]?.message || 'Validation failed',
          errors: parsed.error.issues,
        });
      }
      const data = await repository.updateExam(
        req.tenantId!,
        req.params.id as string,
        parsed.data
      );
      return res.status(200).json({ success: true, data });
    } catch (error: any) {
      return res.status(400).json({ success: false, message: error.message });
    }
  }

  async updateStatus(req: AuthenticatedRequest, res: Response) {
    try {
      const { status } = updateExamStatusSchema.parse(req.body);
      await repository.updateStatus(req.tenantId!, req.params.id as string, status);
      return res.status(200).json({ success: true, message: 'Status updated' });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  async deleteExam(req: AuthenticatedRequest, res: Response) {
    try {
      await repository.deleteExam(req.tenantId!, req.params.id as string);
      return res.status(200).json({ success: true, message: 'Deleted' });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  // --- EXAM PAPERS ---
  async getExamPapers(req: AuthenticatedRequest, res: Response) {
    try {
      const data = await repository.getExamPapers(req.tenantId!, req.params.id as string);
      return res.status(200).json({ success: true, data });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  async createExamPaper(req: AuthenticatedRequest, res: Response) {
    try {
      const parsed = createExamPaperSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({
          success: false,
          message: parsed.error.issues[0]?.message || 'Invalid paper details',
        });
      }
      const data = await repository.createExamPaper(
        req.tenantId!,
        req.params.id as string,
        parsed.data
      );
      return res.status(201).json({ success: true, data });
    } catch (error: any) {
      return res.status(400).json({ success: false, message: error.message });
    }
  }

  async deleteExamPaper(req: AuthenticatedRequest, res: Response) {
    try {
      await repository.deleteExamPaper(
        req.tenantId!,
        req.params.id as string,
        req.params.paperId as string
      );
      return res.status(200).json({ success: true, message: 'Paper removed' });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }
}