// apps/api/src/modules/academics/assignments.controller.ts
import { Response } from 'express';
import { AuthenticatedRequest } from '../../middleware/auth.middleware.js';
import { AssignmentsRepository } from './assignments.repository.js';
import { createAssignmentSchema, updateAssignmentStatusSchema } from '../../validators/assignments.validator.js';

const repository = new AssignmentsRepository();

export class AssignmentsController {
  async getAssignments(req: AuthenticatedRequest, res: Response) {
    try {
      const records = await repository.getAssignments(req.tenantId!);
      const data = records.map(r => ({
        id: r.id,
        title: r.title,
        instructions: r.instructions,
        subject: r.subjectName,
        teacherName: `${r.teacherFirstName} ${r.teacherLastName}`,
        gradeStream: r.streamName,
        dueDate: new Date(r.dueDate).toISOString().replace('T', ' ').substring(0, 16),
        status: r.status,
        submissionProgress: `0 / ${r.streamCapacity}`, 
      }));
      res.status(200).json({ success: true, data });
    } catch (error: any) { res.status(500).json({ success: false, message: error.message }); }
  }

  async createAssignment(req: AuthenticatedRequest, res: Response) {
    try {
      // 1. Validate the incoming string payload
      const validated = createAssignmentSchema.parse(req.body);
      
      // 2. Convert the date string into a native Date object for Drizzle ORM
      const payload = {
        ...validated,
        dueDate: new Date(validated.dueDate) 
      };

      const data = await repository.createAssignment(req.tenantId!, payload);
      res.status(201).json({ success: true, data });
    } catch (error: any) {
      if (error.name === 'ZodError') return res.status(400).json({ success: false, errors: error.errors });
      res.status(400).json({ success: false, message: error.message });
    }
  }

  async updateAssignment(req: AuthenticatedRequest, res: Response) {
    try {
      // 1. Validate the incoming string payload
      const validated = createAssignmentSchema.parse(req.body);
      
      // 2. Convert the date string into a native Date object for Drizzle ORM
      const payload = {
        ...validated,
        dueDate: new Date(validated.dueDate) 
      };

      const data = await repository.updateAssignment(req.tenantId!, req.params.id as string, payload);
      res.status(200).json({ success: true, data });
    } catch (error: any) { res.status(400).json({ success: false, message: error.message }); }
  }

  async updateStatus(req: AuthenticatedRequest, res: Response) {
    try {
      const { status } = updateAssignmentStatusSchema.parse(req.body);
      await repository.updateStatus(req.tenantId!, req.params.id as string, status);
      res.status(200).json({ success: true, message: 'Status updated' });
    } catch (error: any) { res.status(500).json({ success: false, message: error.message }); }
  }

  async deleteAssignment(req: AuthenticatedRequest, res: Response) {
    try {
      await repository.deleteAssignment(req.tenantId!, req.params.id as string);
      res.status(200).json({ success: true, message: 'Deleted' });
    } catch (error: any) { res.status(500).json({ success: false, message: error.message }); }
  }
}