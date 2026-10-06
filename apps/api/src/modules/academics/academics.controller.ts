// apps/api/src/modules/academics/academics.controller.ts
import { Response } from 'express';
import { AuthenticatedRequest } from '../../middleware/auth.middleware.js';
import { AcademicsService } from './academics.service.js';
import { createStreamSchema } from '../../validators/academics.validator.js';

const service = new AcademicsService();

export class AcademicsController {
  async getClassesAndStreams(req: AuthenticatedRequest, res: Response) {
    try {
      const data = await service.getClassesAndStreams(req.tenantId!);
      res.status(200).json({ success: true, data });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async getReferenceData(req: AuthenticatedRequest, res: Response) {
    try {
      const data = await service.getReferenceData(req.tenantId!);
      res.status(200).json({ success: true, data });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async createStream(req: AuthenticatedRequest, res: Response) {
    try {
      const validatedData = createStreamSchema.parse(req.body);
      const stream = await service.createStream(req.tenantId!, req.user!.userId, validatedData as any);
      res.status(201).json({ success: true, data: stream });
    } catch (error: any) {
      if (error.name === 'ZodError') {
        console.error('[Zod Validation Error Details]:', JSON.stringify(error.errors, null, 2));
        return res.status(400).json({ 
          success: false, 
          message: 'Validation failed', 
          errors: error.errors 
        });
      }
      console.error('[Controller Error]:', error.message);
      res.status(400).json({ success: false, message: error.message });
    }
  }
}