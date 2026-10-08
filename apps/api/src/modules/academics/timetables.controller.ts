// apps/api/src/modules/academics/timetables.controller.ts
import { Response } from 'express';
import { AuthenticatedRequest } from '../../middleware/auth.middleware.js';
import { TimetablesRepository } from './timetables.repository.js';
import { timetableBlockSchema } from '../../validators/timetables.validator.js';

const repository = new TimetablesRepository();

export class TimetablesController {
  async getTimetable(req: AuthenticatedRequest, res: Response) {
    try {
      const { streamId, teacherId } = req.query;
      const data = await repository.getTimetableBlocks(req.tenantId!, { 
        streamId: streamId as string, 
        teacherId: teacherId as string 
      });
      res.status(200).json({ success: true, data });
    } catch (error: any) { res.status(500).json({ success: false, message: error.message }); }
  }

  // --- NEW METHOD ---
  async getStreams(req: AuthenticatedRequest, res: Response) {
    try {
      const data = await repository.getStreams(req.tenantId!);
      res.status(200).json({ success: true, data });
    } catch (error: any) { res.status(500).json({ success: false, message: error.message }); }
  }

  async createBlock(req: AuthenticatedRequest, res: Response) {
    try {
      const validatedData = timetableBlockSchema.parse(req.body);
      const data = await repository.createBlock(req.tenantId!, validatedData);
      res.status(201).json({ success: true, data });
    } catch (error: any) {
      if (error.code === '23505') { 
        return res.status(409).json({ success: false, message: 'Double booking detected. This teacher or room is already booked at this exact time.' });
      }
      res.status(400).json({ success: false, message: error.message });
    }
  }

  async deleteBlock(req: AuthenticatedRequest, res: Response) {
    try {
      await repository.deleteBlock(req.tenantId!, req.params.id as string);
      res.status(200).json({ success: true });
    } catch (error: any) { res.status(500).json({ success: false, message: error.message }); }
  }
}