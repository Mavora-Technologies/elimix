// apps/api/src/modules/academics/assignments.controller.ts
import { Response } from 'express';
import { AuthenticatedRequest } from '../../middleware/auth.middleware.js';
import { AssignmentsRepository } from './assignments.repository.js';
import {
  createAssignmentSchema,
  updateAssignmentStatusSchema,
  upsertSubmissionSchema,
} from '../../validators/assignments.validator.js';

const repository = new AssignmentsRepository();

export class AssignmentsController {
  async getAssignments(req: AuthenticatedRequest, res: Response) {
    try {
      const records = await repository.getAssignments(req.tenantId!);
      const data = records.map((r) => ({
        id: r.id,
        title: r.title,
        instructions: r.instructions || '',
        subjectId: r.subjectId,
        subject: r.subjectName,
        teacherId: r.teacherId,
        teacherName: `${r.teacherFirstName} ${r.teacherLastName}`.trim(),
        streamId: r.streamId,
        gradeStream: r.streamName,
        dueDate: new Date(r.dueDate).toISOString().replace('T', ' ').substring(0, 16),
        status: r.status,
        submittedCount: r.submittedCount,
        gradedCount: r.gradedCount,
        totalStudentsCount: r.totalStudentsCount,
        submissionProgress: `${r.submittedCount} / ${r.totalStudentsCount}`,
      }));
      return res.status(200).json({ success: true, data });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  async createAssignment(req: AuthenticatedRequest, res: Response) {
    try {
      const parsed = createAssignmentSchema.safeParse(req.body);
      if (!parsed.success) {
        const issues = parsed.error.issues || (parsed.error as any).errors || [];
        return res.status(400).json({
          success: false,
          message: issues[0]?.message || 'Validation failed',
          errors: issues,
        });
      }

      const payload = {
        ...parsed.data,
        dueDate: new Date(parsed.data.dueDate),
      };

      const data = await repository.createAssignment(req.tenantId!, payload);
      return res.status(201).json({ success: true, data });
    } catch (error: any) {
      return res.status(400).json({ success: false, message: error.message });
    }
  }

  async updateAssignment(req: AuthenticatedRequest, res: Response) {
    try {
      const parsed = createAssignmentSchema.safeParse(req.body);
      if (!parsed.success) {
        const issues = parsed.error.issues || (parsed.error as any).errors || [];
        return res.status(400).json({
          success: false,
          message: issues[0]?.message || 'Validation failed',
          errors: issues,
        });
      }

      const payload = {
        ...parsed.data,
        dueDate: new Date(parsed.data.dueDate),
      };

      const data = await repository.updateAssignment(
        req.tenantId!,
        req.params.id as string,
        payload
      );
      return res.status(200).json({ success: true, data });
    } catch (error: any) {
      return res.status(400).json({ success: false, message: error.message });
    }
  }

  async updateStatus(req: AuthenticatedRequest, res: Response) {
    try {
      const { status } = updateAssignmentStatusSchema.parse(req.body);
      await repository.updateStatus(req.tenantId!, req.params.id as string, status);
      return res.status(200).json({ success: true, message: 'Status updated' });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  async deleteAssignment(req: AuthenticatedRequest, res: Response) {
    try {
      await repository.deleteAssignment(req.tenantId!, req.params.id as string);
      return res.status(200).json({ success: true, message: 'Deleted' });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  async getSubmissions(req: AuthenticatedRequest, res: Response) {
    try {
      const data = await repository.getSubmissionsForAssignment(
        req.tenantId!,
        req.params.id as string
      );
      return res.status(200).json({ success: true, data });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  async recordSubmission(req: AuthenticatedRequest, res: Response) {
    try {
      const parsed = upsertSubmissionSchema.safeParse(req.body);
      if (!parsed.success) {
        const issues = parsed.error.issues || [];
        return res.status(400).json({
          success: false,
          message: issues[0]?.message || 'Invalid submission data',
        });
      }
      const data = await repository.upsertSubmission(
        req.tenantId!,
        req.params.id as string,
        parsed.data
      );
      return res.status(200).json({ success: true, data });
    } catch (error: any) {
      return res.status(400).json({ success: false, message: error.message });
    }
  }
}