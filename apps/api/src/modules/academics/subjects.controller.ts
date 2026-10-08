// apps/api/src/modules/academics/subjects.controller.ts
import { Response } from 'express';
import { AuthenticatedRequest } from '../../middleware/auth.middleware.js';
import { SubjectsService } from './subjects.service.js';
import { createSubjectSchema, allocateSubjectSchema } from '../../validators/subjects.validator.js';

const service = new SubjectsService();

export class SubjectsController {
  async getSubjects(req: AuthenticatedRequest, res: Response) {
    try {
      const data = await service.getSubjects(req.tenantId!);
      res.status(200).json({ success: true, data });
    } catch (error: any) { res.status(500).json({ success: false, message: error.message }); }
  }

  async createSubject(req: AuthenticatedRequest, res: Response) {
    try {
      const validatedData = createSubjectSchema.parse(req.body);
      const data = await service.createSubject(req.tenantId!, req.user!.userId, validatedData);
      res.status(201).json({ success: true, data });
    } catch (error: any) {
      if (error.name === 'ZodError') return res.status(400).json({ success: false, message: 'Validation failed', errors: error.errors });
      const msg = error.detail ? `${error.message} - ${error.detail}` : error.message;
      res.status(400).json({ success: false, message: msg });
    }
  }

  async updateSubject(req: AuthenticatedRequest, res: Response) {
    try {
      const validatedData = createSubjectSchema.parse(req.body);
      await service.updateSubject(req.tenantId!, req.params.id as string, req.user!.userId, validatedData);
      res.status(200).json({ success: true });
    } catch (error: any) {
      if (error.name === 'ZodError') return res.status(400).json({ success: false, message: 'Validation failed', errors: error.errors });
      const msg = error.detail ? `${error.message} - ${error.detail}` : error.message;
      res.status(400).json({ success: false, message: msg });
    }
  }

  async deleteSubject(req: AuthenticatedRequest, res: Response) {
    try {
      await service.deleteSubject(req.tenantId!, req.params.id as string, req.user!.userId);
      res.status(200).json({ success: true });
    } catch (error: any) { res.status(500).json({ success: false, message: error.message }); }
  }

  async allocateTeacher(req: AuthenticatedRequest, res: Response) {
    try {
      const validatedData = allocateSubjectSchema.parse(req.body);
      const allocation = await service.allocateTeacher(req.tenantId!, req.user!.userId, validatedData);
      res.status(201).json({ success: true, data: allocation });
    } catch (error: any) {
      if (error.code === '23505') return res.status(409).json({ success: false, message: 'This subject is already allocated to a teacher for this stream.' });
      res.status(400).json({ success: false, message: error.message });
    }
  }
}