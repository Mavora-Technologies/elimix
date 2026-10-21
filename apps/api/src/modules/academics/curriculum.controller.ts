// apps/api/src/modules/academics/curriculum.controller.ts
import { Response } from 'express';
import { AuthenticatedRequest } from '../../middleware/auth.middleware.js';
import { Phase3AcademicsService } from './curriculum.service.js';
import {
  createAcademicYearSchema,
  createAcademicTermSchema,
  createClassSchema,
  createStreamSchema,
  createCbcStrandSchema,
  createCbcSubStrandSchema,
  createCbcAssessmentSchema,
  createTeacherAllocationSchema,
} from './curriculum.validator.js';

export class Phase3AcademicsController {
  private static getTenantId(req: AuthenticatedRequest): string | null {
    const raw = req.tenantId || req.user?.tenantId;
    if (!raw) return null;
    return Array.isArray(raw) ? raw[0] : raw;
  }

  static async getStructure(req: AuthenticatedRequest, res: Response) {
    try {
      const tenantId = Phase3AcademicsController.getTenantId(req);
      if (!tenantId) return res.status(400).json({ success: false, message: 'Tenant context required' });
      const data = await Phase3AcademicsService.getStructureOverview(tenantId);
      return res.status(200).json({ success: true, data });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  static async createYear(req: AuthenticatedRequest, res: Response) {
    try {
      const tenantId = Phase3AcademicsController.getTenantId(req);
      if (!tenantId) return res.status(400).json({ success: false, message: 'Tenant context required' });
      const parsed = createAcademicYearSchema.safeParse(req.body);
      if (!parsed.success) return res.status(400).json({ success: false, message: parsed.error.issues[0]?.message });
      const data = await Phase3AcademicsService.createAcademicYear(tenantId, req.user?.userId, parsed.data);
      return res.status(201).json({ success: true, data });
    } catch (error: any) {
      return res.status(400).json({ success: false, message: error.message });
    }
  }

  static async createTerm(req: AuthenticatedRequest, res: Response) {
    try {
      const tenantId = Phase3AcademicsController.getTenantId(req);
      if (!tenantId) return res.status(400).json({ success: false, message: 'Tenant context required' });
      const parsed = createAcademicTermSchema.safeParse(req.body);
      if (!parsed.success) return res.status(400).json({ success: false, message: parsed.error.issues[0]?.message });
      const data = await Phase3AcademicsService.createAcademicTerm(tenantId, req.user?.userId, parsed.data);
      return res.status(201).json({ success: true, data });
    } catch (error: any) {
      return res.status(400).json({ success: false, message: error.message });
    }
  }

  static async createClass(req: AuthenticatedRequest, res: Response) {
    try {
      const tenantId = Phase3AcademicsController.getTenantId(req);
      if (!tenantId) return res.status(400).json({ success: false, message: 'Tenant context required' });
      const parsed = createClassSchema.safeParse(req.body);
      if (!parsed.success) return res.status(400).json({ success: false, message: parsed.error.issues[0]?.message });
      const data = await Phase3AcademicsService.createClass(tenantId, req.user?.userId, parsed.data);
      return res.status(201).json({ success: true, data });
    } catch (error: any) {
      return res.status(400).json({ success: false, message: error.message });
    }
  }

  static async createStream(req: AuthenticatedRequest, res: Response) {
    try {
      const tenantId = Phase3AcademicsController.getTenantId(req);
      if (!tenantId) return res.status(400).json({ success: false, message: 'Tenant context required' });
      const parsed = createStreamSchema.safeParse(req.body);
      if (!parsed.success) return res.status(400).json({ success: false, message: parsed.error.issues[0]?.message });
      const data = await Phase3AcademicsService.createStream(tenantId, req.user?.userId, parsed.data);
      return res.status(201).json({ success: true, data });
    } catch (error: any) {
      return res.status(400).json({ success: false, message: error.message });
    }
  }

  // Curriculum & CBC
  static async getCurriculumEngine(req: AuthenticatedRequest, res: Response) {
    try {
      const tenantId = Phase3AcademicsController.getTenantId(req);
      if (!tenantId) return res.status(400).json({ success: false, message: 'Tenant context required' });
      const data = await Phase3AcademicsService.getCurriculumEngineData(tenantId);
      return res.status(200).json({ success: true, data });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  static async createStrand(req: AuthenticatedRequest, res: Response) {
    try {
      const tenantId = Phase3AcademicsController.getTenantId(req);
      if (!tenantId) return res.status(400).json({ success: false, message: 'Tenant context required' });
      const parsed = createCbcStrandSchema.safeParse(req.body);
      if (!parsed.success) return res.status(400).json({ success: false, message: parsed.error.issues[0]?.message });
      const data = await Phase3AcademicsService.createCbcStrand(tenantId, req.user?.userId, parsed.data);
      return res.status(201).json({ success: true, data });
    } catch (error: any) {
      return res.status(400).json({ success: false, message: error.message });
    }
  }

  static async createSubStrand(req: AuthenticatedRequest, res: Response) {
    try {
      const tenantId = Phase3AcademicsController.getTenantId(req);
      if (!tenantId) return res.status(400).json({ success: false, message: 'Tenant context required' });
      const parsed = createCbcSubStrandSchema.safeParse(req.body);
      if (!parsed.success) return res.status(400).json({ success: false, message: parsed.error.issues[0]?.message });
      const data = await Phase3AcademicsService.createCbcSubStrand(tenantId, req.user?.userId, parsed.data);
      return res.status(201).json({ success: true, data });
    } catch (error: any) {
      return res.status(400).json({ success: false, message: error.message });
    }
  }

  static async recordAssessment(req: AuthenticatedRequest, res: Response) {
    try {
      const tenantId = Phase3AcademicsController.getTenantId(req);
      if (!tenantId) return res.status(400).json({ success: false, message: 'Tenant context required' });
      const parsed = createCbcAssessmentSchema.safeParse(req.body);
      if (!parsed.success) return res.status(400).json({ success: false, message: parsed.error.issues[0]?.message });
      const data = await Phase3AcademicsService.recordCbcAssessment(tenantId, req.user?.userId, parsed.data);
      return res.status(201).json({ success: true, data });
    } catch (error: any) {
      return res.status(400).json({ success: false, message: error.message });
    }
  }

  // Teacher Allocations & Workload
  static async getTeacherAllocations(req: AuthenticatedRequest, res: Response) {
    try {
      const tenantId = Phase3AcademicsController.getTenantId(req);
      if (!tenantId) return res.status(400).json({ success: false, message: 'Tenant context required' });
      const data = await Phase3AcademicsService.getTeacherAllocationsAndWorkload(tenantId);
      return res.status(200).json({ success: true, data });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  static async createTeacherAllocation(req: AuthenticatedRequest, res: Response) {
    try {
      const tenantId = Phase3AcademicsController.getTenantId(req);
      if (!tenantId) return res.status(400).json({ success: false, message: 'Tenant context required' });
      const parsed = createTeacherAllocationSchema.safeParse(req.body);
      if (!parsed.success) return res.status(400).json({ success: false, message: parsed.error.issues[0]?.message });
      const data = await Phase3AcademicsService.createTeacherAllocation(tenantId, req.user?.userId, parsed.data);
      return res.status(201).json({ success: true, data });
    } catch (error: any) {
      return res.status(400).json({ success: false, message: error.message });
    }
  }

  static async removeTeacherAllocation(req: AuthenticatedRequest, res: Response) {
    try {
      const tenantId = Phase3AcademicsController.getTenantId(req);
      const rawId = req.params.id;
      const id = Array.isArray(rawId) ? rawId[0] : rawId;
      if (!tenantId || !id) return res.status(400).json({ success: false, message: 'Missing parameters' });
      await Phase3AcademicsService.deleteTeacherAllocation(tenantId, id, req.user?.userId);
      return res.status(200).json({ success: true, message: 'Allocation removed' });
    } catch (error: any) {
      return res.status(400).json({ success: false, message: error.message });
    }
  }
}