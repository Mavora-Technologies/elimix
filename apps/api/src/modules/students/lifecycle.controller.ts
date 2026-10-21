// apps/api/src/modules/students/lifecycle.controller.ts
import { Response } from 'express';
import { AuthenticatedRequest } from '../../middleware/auth.middleware.js';
import { StudentLifecycleService } from './lifecycle.service.js';
import {
  upsertMedicalProfileSchema,
  createClinicVisitSchema,
  createTransferSchema,
  updateTransferClearanceSchema,
  createWithdrawalSchema,
  updateWithdrawalSchema,
} from './lifecycle.validator.js';

export class StudentLifecycleController {
  private static extractTenantId(req: AuthenticatedRequest): string | null {
    const raw = req.tenantId || req.user?.tenantId;
    if (!raw) return null;
    return Array.isArray(raw) ? raw[0] : raw;
  }

  private static extractParam(param: string | string[] | undefined): string {
    if (!param) return '';
    return Array.isArray(param) ? param[0] : param;
  }

  // --- MEDICAL ---
  static async getMedicalData(req: AuthenticatedRequest, res: Response) {
    try {
      const tenantId = StudentLifecycleController.extractTenantId(req);
      if (!tenantId) return res.status(400).json({ success: false, message: 'Tenant context required' });

      const data = await StudentLifecycleService.getMedicalOverview(tenantId);
      return res.status(200).json({ success: true, data });
    } catch (error: any) {
      console.error('[StudentLifecycleController.getMedicalData]', error);
      return res.status(500).json({ success: false, message: 'Failed to load medical records' });
    }
  }

  static async upsertMedicalProfile(req: AuthenticatedRequest, res: Response) {
    try {
      const tenantId = StudentLifecycleController.extractTenantId(req);
      if (!tenantId) return res.status(400).json({ success: false, message: 'Tenant context required' });

      const parsed = upsertMedicalProfileSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ success: false, message: parsed.error.issues[0]?.message || 'Validation error' });
      }

      const data = await StudentLifecycleService.saveMedicalProfile(tenantId, req.user?.userId, parsed.data);
      return res.status(200).json({ success: true, message: 'Medical profile saved', data });
    } catch (error: any) {
      console.error('[StudentLifecycleController.upsertMedicalProfile]', error);
      return res.status(500).json({ success: false, message: error.message || 'Failed to save medical profile' });
    }
  }

  static async createClinicVisit(req: AuthenticatedRequest, res: Response) {
    try {
      const tenantId = StudentLifecycleController.extractTenantId(req);
      if (!tenantId) return res.status(400).json({ success: false, message: 'Tenant context required' });

      const parsed = createClinicVisitSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ success: false, message: parsed.error.issues[0]?.message || 'Validation error' });
      }

      const data = await StudentLifecycleService.logClinicVisit(tenantId, req.user?.userId, parsed.data);
      return res.status(201).json({ success: true, message: 'Clinic visit logged', data });
    } catch (error: any) {
      console.error('[StudentLifecycleController.createClinicVisit]', error);
      return res.status(500).json({ success: false, message: error.message || 'Failed to log clinic visit' });
    }
  }

  // --- TRANSFERS ---
  static async getTransfers(req: AuthenticatedRequest, res: Response) {
    try {
      const tenantId = StudentLifecycleController.extractTenantId(req);
      if (!tenantId) return res.status(400).json({ success: false, message: 'Tenant context required' });

      const data = await StudentLifecycleService.getTransfers(tenantId);
      return res.status(200).json({ success: true, data });
    } catch (error: any) {
      console.error('[StudentLifecycleController.getTransfers]', error);
      return res.status(500).json({ success: false, message: 'Failed to load transfers' });
    }
  }

  static async createTransfer(req: AuthenticatedRequest, res: Response) {
    try {
      const tenantId = StudentLifecycleController.extractTenantId(req);
      if (!tenantId) return res.status(400).json({ success: false, message: 'Tenant context required' });

      const parsed = createTransferSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ success: false, message: parsed.error.issues[0]?.message || 'Validation error' });
      }

      const data = await StudentLifecycleService.initiateTransfer(tenantId, req.user?.userId, parsed.data);
      return res.status(201).json({ success: true, message: 'Transfer clearance initiated', data });
    } catch (error: any) {
      console.error('[StudentLifecycleController.createTransfer]', error);
      return res.status(500).json({ success: false, message: error.message || 'Failed to initiate transfer' });
    }
  }

  static async updateTransferClearance(req: AuthenticatedRequest, res: Response) {
    try {
      const tenantId = StudentLifecycleController.extractTenantId(req);
      const id = StudentLifecycleController.extractParam(req.params.id);
      if (!tenantId || !id) return res.status(400).json({ success: false, message: 'Tenant and Transfer ID required' });

      const parsed = updateTransferClearanceSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ success: false, message: parsed.error.issues[0]?.message || 'Validation error' });
      }

      const data = await StudentLifecycleService.updateTransferClearance(tenantId, id, req.user?.userId, parsed.data);
      return res.status(200).json({ success: true, message: 'Clearance updated', data });
    } catch (error: any) {
      console.error('[StudentLifecycleController.updateTransferClearance]', error);
      return res.status(500).json({ success: false, message: error.message || 'Failed to update transfer clearance' });
    }
  }

  // --- WITHDRAWALS ---
  static async getWithdrawals(req: AuthenticatedRequest, res: Response) {
    try {
      const tenantId = StudentLifecycleController.extractTenantId(req);
      if (!tenantId) return res.status(400).json({ success: false, message: 'Tenant context required' });

      const data = await StudentLifecycleService.getWithdrawals(tenantId);
      return res.status(200).json({ success: true, data });
    } catch (error: any) {
      console.error('[StudentLifecycleController.getWithdrawals]', error);
      return res.status(500).json({ success: false, message: 'Failed to load withdrawals' });
    }
  }

  static async createWithdrawal(req: AuthenticatedRequest, res: Response) {
    try {
      const tenantId = StudentLifecycleController.extractTenantId(req);
      if (!tenantId) return res.status(400).json({ success: false, message: 'Tenant context required' });

      const parsed = createWithdrawalSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ success: false, message: parsed.error.issues[0]?.message || 'Validation error' });
      }

      const data = await StudentLifecycleService.initiateWithdrawal(tenantId, req.user?.userId, parsed.data);
      return res.status(201).json({ success: true, message: 'Withdrawal record created', data });
    } catch (error: any) {
      console.error('[StudentLifecycleController.createWithdrawal]', error);
      return res.status(500).json({ success: false, message: error.message || 'Failed to record withdrawal' });
    }
  }

  static async updateWithdrawal(req: AuthenticatedRequest, res: Response) {
    try {
      const tenantId = StudentLifecycleController.extractTenantId(req);
      const id = StudentLifecycleController.extractParam(req.params.id);
      if (!tenantId || !id) return res.status(400).json({ success: false, message: 'Tenant and Withdrawal ID required' });

      const parsed = updateWithdrawalSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ success: false, message: parsed.error.issues[0]?.message || 'Validation error' });
      }

      const data = await StudentLifecycleService.updateWithdrawal(tenantId, id, req.user?.userId, parsed.data);
      return res.status(200).json({ success: true, message: 'Withdrawal updated', data });
    } catch (error: any) {
      console.error('[StudentLifecycleController.updateWithdrawal]', error);
      return res.status(500).json({ success: false, message: error.message || 'Failed to update withdrawal' });
    }
  }
}