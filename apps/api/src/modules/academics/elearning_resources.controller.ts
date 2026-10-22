// apps/api/src/modules/academics/elearning_resources.controller.ts
import { Response } from 'express';
import { AuthenticatedRequest } from '../../middleware/auth.middleware.js';
import { ELearningResourcesRepository } from './elearning_resources.repository.js';
import { createResourceSchema } from '../../validators/elearning_resources.validator.js';

const repository = new ELearningResourcesRepository();

export class ELearningResourcesController {
  async getResources(req: AuthenticatedRequest, res: Response) {
    try {
      const records = await repository.getResources(req.tenantId!);
      const data = records.map((r) => ({
        id: r.id,
        title: r.title,
        resourceType: r.resourceType,
        fileSize: r.fileSize,
        fileUrl: r.fileUrl,
        downloadsCount: r.downloadsCount,
        description: r.description,
        subjectId: r.subjectId,
        subject: r.subjectName,
        teacherId: r.teacherId,
        uploader: `${r.teacherFirstName} ${r.teacherLastName}`.trim(),
        uploadDate: r.createdAt ? new Date(r.createdAt).toISOString().split('T')[0] : 'N/A',
      }));
      return res.status(200).json({ success: true, data });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  async createResource(req: AuthenticatedRequest, res: Response) {
    try {
      const parsed = createResourceSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({
          success: false,
          message: parsed.error.issues[0]?.message || 'Validation failed',
        });
      }
      const data = await repository.createResource(req.tenantId!, parsed.data);
      return res.status(201).json({ success: true, data });
    } catch (error: any) {
      return res.status(400).json({ success: false, message: error.message });
    }
  }

  async recordDownload(req: AuthenticatedRequest, res: Response) {
    try {
      const data = await repository.incrementDownload(req.tenantId!, req.params.id as string);
      return res.status(200).json({ success: true, data });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  async deleteResource(req: AuthenticatedRequest, res: Response) {
    try {
      await repository.deleteResource(req.tenantId!, req.params.id as string);
      return res.status(200).json({ success: true, message: 'Resource deleted' });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }
}