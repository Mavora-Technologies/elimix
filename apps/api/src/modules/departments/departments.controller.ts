// apps/api/src/modules/departments/departments.controller.ts
import { Response } from 'express';
import { AuthenticatedRequest } from '../../middleware/auth.middleware.js';
import { DepartmentsService } from './departments.service.js';
import { departmentSchema } from '../../validators/departments.validator.js';

const service = new DepartmentsService();

export class DepartmentsController {
  async getAllDepartments(req: AuthenticatedRequest, res: Response) {
    try {
      const data = await service.getAllDepartments(req.tenantId!);
      res.status(200).json({ success: true, data });
    } catch (error: any) { 
      res.status(500).json({ success: false, message: error.detail || error.message }); 
    }
  }

  async createDepartment(req: AuthenticatedRequest, res: Response) {
    try {
      const validatedData = departmentSchema.parse(req.body);
      const data = await service.createDepartment(req.tenantId!, req.user!.userId, validatedData);
      res.status(201).json({ success: true, data });
    } catch (error: any) { 
      // Expose Postgres internal error details if they exist
      const msg = error.detail ? `${error.message} - ${error.detail}` : error.message;
      res.status(400).json({ success: false, message: msg }); 
    }
  }

  async updateDepartment(req: AuthenticatedRequest, res: Response) {
    try {
      const validatedData = departmentSchema.parse(req.body);
      await service.updateDepartment(req.tenantId!, req.params.id as string, req.user!.userId, validatedData);
      res.status(200).json({ success: true });
    } catch (error: any) { 
      const msg = error.detail ? `${error.message} - ${error.detail}` : error.message;
      res.status(400).json({ success: false, message: msg }); 
    }
  }

  async deleteDepartment(req: AuthenticatedRequest, res: Response) {
    try {
      await service.deleteDepartment(req.tenantId!, req.params.id as string, req.user!.userId);
      res.status(200).json({ success: true });
    } catch (error: any) { 
      res.status(500).json({ success: false, message: error.detail || error.message }); 
    }
  }
}