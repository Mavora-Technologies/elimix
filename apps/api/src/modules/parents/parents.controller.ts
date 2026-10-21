// apps/api/src/modules/parents/parents.controller.ts
import { Response } from 'express';
import { AuthenticatedRequest } from '../../middleware/auth.middleware.js';
import { ParentsService } from './parents.service.js';
import { createParentSchema, updateParentSchema } from './parents.validator.js';

export class ParentsController {
  private static extractTenantId(req: AuthenticatedRequest): string | null {
    const raw = req.tenantId || req.user?.tenantId;
    if (!raw) return null;
    return Array.isArray(raw) ? raw[0] : raw;
  }

  private static extractParam(param: string | string[] | undefined): string {
    if (!param) return '';
    return Array.isArray(param) ? param[0] : param;
  }

  static async getParents(req: AuthenticatedRequest, res: Response) {
    try {
      const tenantId = ParentsController.extractTenantId(req);
      if (!tenantId) {
        return res.status(400).json({ success: false, message: 'Tenant context required', code: 'TENANT_MISSING' });
      }

      const data = await ParentsService.getAllParents(tenantId);
      return res.status(200).json({ success: true, data });
    } catch (error: any) {
      console.error('[ParentsController.getParents]', error);
      return res.status(500).json({ success: false, message: 'Failed to fetch parents', code: 'INTERNAL_ERROR' });
    }
  }

  static async getFamilies(req: AuthenticatedRequest, res: Response) {
    try {
      const tenantId = ParentsController.extractTenantId(req);
      if (!tenantId) {
        return res.status(400).json({ success: false, message: 'Tenant context required', code: 'TENANT_MISSING' });
      }

      const data = await ParentsService.getFamilies(tenantId);
      return res.status(200).json({ success: true, data });
    } catch (error: any) {
      console.error('[ParentsController.getFamilies]', error);
      return res.status(500).json({ success: false, message: 'Failed to fetch families', code: 'INTERNAL_ERROR' });
    }
  }

  static async getAccessLogs(req: AuthenticatedRequest, res: Response) {
    try {
      const tenantId = ParentsController.extractTenantId(req);
      if (!tenantId) {
        return res.status(400).json({ success: false, message: 'Tenant context required', code: 'TENANT_MISSING' });
      }

      const data = await ParentsService.getPortalAccessLogs(tenantId);
      return res.status(200).json({ success: true, data });
    } catch (error: any) {
      console.error('[ParentsController.getAccessLogs]', error);
      return res.status(500).json({ success: false, message: 'Failed to fetch access logs', code: 'INTERNAL_ERROR' });
    }
  }

  static async createParent(req: AuthenticatedRequest, res: Response) {
    try {
      const tenantId = ParentsController.extractTenantId(req);
      if (!tenantId) {
        return res.status(400).json({ success: false, message: 'Tenant context required', code: 'TENANT_MISSING' });
      }

      const parsed = createParentSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({
          success: false,
          message: parsed.error.issues[0]?.message || 'Invalid input data',
          code: 'VALIDATION_ERROR',
          errors: parsed.error.issues,
        });
      }

      const created = await ParentsService.createParent(
        tenantId,
        req.user?.userId,
        parsed.data,
        req.ip
      );

      return res.status(201).json({
        success: true,
        message: 'Guardian profile created and linked successfully',
        data: created,
      });
    } catch (error: any) {
      console.error('[ParentsController.createParent]', error);
      return res.status(500).json({
        success: false,
        message: error.message || 'Failed to create parent profile',
        code: 'CREATE_PARENT_FAILED',
      });
    }
  }

  static async updateParent(req: AuthenticatedRequest, res: Response) {
    try {
      const tenantId = ParentsController.extractTenantId(req);
      const id = ParentsController.extractParam(req.params.id);

      if (!tenantId) {
        return res.status(400).json({ success: false, message: 'Tenant context required', code: 'TENANT_MISSING' });
      }

      if (!id) {
        return res.status(400).json({ success: false, message: 'Parent ID is required', code: 'ID_MISSING' });
      }

      const parsed = updateParentSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({
          success: false,
          message: parsed.error.issues[0]?.message || 'Invalid update payload',
          code: 'VALIDATION_ERROR',
        });
      }

      const result = await ParentsService.updateParent(
        tenantId,
        id,
        req.user?.userId,
        parsed.data,
        req.ip
      );

      return res.status(200).json({
        success: true,
        message: 'Guardian profile updated successfully',
        data: result,
      });
    } catch (error: any) {
      console.error('[ParentsController.updateParent]', error);
      return res.status(500).json({
        success: false,
        message: error.message || 'Failed to update parent profile',
        code: 'UPDATE_PARENT_FAILED',
      });
    }
  }

  static async deleteParent(req: AuthenticatedRequest, res: Response) {
    try {
      const tenantId = ParentsController.extractTenantId(req);
      const id = ParentsController.extractParam(req.params.id);

      if (!tenantId) {
        return res.status(400).json({ success: false, message: 'Tenant context required', code: 'TENANT_MISSING' });
      }

      if (!id) {
        return res.status(400).json({ success: false, message: 'Parent ID is required', code: 'ID_MISSING' });
      }

      await ParentsService.deleteParent(tenantId, id, req.user?.userId, req.ip);
      return res.status(200).json({ success: true, message: 'Guardian removed successfully' });
    } catch (error: any) {
      console.error('[ParentsController.deleteParent]', error);
      return res.status(500).json({
        success: false,
        message: error.message || 'Failed to delete parent profile',
        code: 'DELETE_PARENT_FAILED',
      });
    }
  }

  static async getLinkedChildren(req: AuthenticatedRequest, res: Response) {
    try {
      const tenantId = ParentsController.extractTenantId(req);
      if (!tenantId) {
        return res.status(400).json({ success: false, message: 'Tenant context required', code: 'TENANT_MISSING' });
      }

      const data = await ParentsService.getLinkedChildren(tenantId);
      return res.status(200).json({ success: true, data });
    } catch (error: any) {
      console.error('[ParentsController.getLinkedChildren]', error);
      return res.status(500).json({ success: false, message: 'Failed to fetch linked children', code: 'INTERNAL_ERROR' });
    }
  }

  static async getNotifications(req: AuthenticatedRequest, res: Response) {
    try {
      const tenantId = ParentsController.extractTenantId(req);
      if (!tenantId) {
        return res.status(400).json({ success: false, message: 'Tenant context required', code: 'TENANT_MISSING' });
      }

      const data = await ParentsService.getNotifications(tenantId);
      return res.status(200).json({ success: true, data });
    } catch (error: any) {
      console.error('[ParentsController.getNotifications]', error);
      return res.status(500).json({ success: false, message: 'Failed to fetch notifications', code: 'INTERNAL_ERROR' });
    }
  }

  static async sendBroadcast(req: AuthenticatedRequest, res: Response) {
    try {
      const tenantId = ParentsController.extractTenantId(req);
      if (!tenantId) {
        return res.status(400).json({ success: false, message: 'Tenant context required', code: 'TENANT_MISSING' });
      }

      const { subject, targetAudience, channel, content } = req.body;
      if (!subject || !content) {
        return res.status(400).json({ success: false, message: 'Subject and content are required' });
      }

      const created = await ParentsService.sendBroadcast(tenantId, req.user?.userId, {
        subject,
        targetAudience: targetAudience || 'All Parents',
        channel: channel || 'Email',
        content,
      });

      return res.status(201).json({ success: true, message: 'Broadcast dispatched successfully', data: created });
    } catch (error: any) {
      console.error('[ParentsController.sendBroadcast]', error);
      return res.status(500).json({ success: false, message: 'Failed to send broadcast', code: 'BROADCAST_FAILED' });
    }
  }
}