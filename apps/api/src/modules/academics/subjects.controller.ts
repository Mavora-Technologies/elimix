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
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async createSubject(req: AuthenticatedRequest, res: Response) {
    try {
      const validatedData = createSubjectSchema.parse(req.body);
      const subject = await service.createSubject(req.tenantId!, req.user!.userId, validatedData);
      res.status(201).json({ success: true, data: subject });
    } catch (error: any) {
      if (error.name === 'ZodError') {
        console.error('[Subject Validation Error]:', JSON.stringify(error.errors, null, 2));
        return res.status(400).json({ success: false, message: 'Validation failed', errors: error.errors });
      }
      res.status(400).json({ success: false, message: error.message });
    }
  }

  async allocateTeacher(req: AuthenticatedRequest, res: Response) {
    try {
      const validatedData = allocateSubjectSchema.parse(req.body);
      const allocation = await service.allocateTeacher(req.tenantId!, req.user!.userId, validatedData);
      res.status(201).json({ success: true, data: allocation });
    } catch (error: any) {
      if (error.name === 'ZodError') {
        console.error('[Allocation Validation Error]:', JSON.stringify(error.errors, null, 2));
        return res.status(400).json({ success: false, message: 'Validation failed', errors: error.errors });
      }
      // Catch unique constraint violations (e.g., teacher already assigned to this subject/stream combo)
      if (error.code === '23505') {
         return res.status(409).json({ success: false, message: 'This subject is already allocated to a teacher for this stream.' });
      }
      res.status(400).json({ success: false, message: error.message });
    }
  }
}