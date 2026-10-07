import { Response } from 'express';
import { AuthenticatedRequest } from '../../middleware/auth.middleware.js';
import { TeachersService } from './teachers.service.js';
import { createTeacherSchema, updateTeacherSchema } from '../../validators/teachers.validator.js';

const service = new TeachersService();

export class TeachersController {
  async getAllTeachers(req: AuthenticatedRequest, res: Response) {
    try {
      const data = await service.getAllTeachers(req.tenantId!);
      res.status(200).json({ success: true, data });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async getDepartments(req: AuthenticatedRequest, res: Response) {
    try {
      const data = await service.getDepartments(req.tenantId!);
      res.status(200).json({ success: true, data });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async createTeacher(req: AuthenticatedRequest, res: Response) {
    try {
      const validatedData = createTeacherSchema.parse(req.body);
      const data = await service.createTeacher(req.tenantId!, req.user!.userId, validatedData);
      res.status(201).json({ success: true, data });
    } catch (error: any) {
      if (error.name === 'ZodError') {
        console.error('[Teacher Validation Error]:', JSON.stringify(error.errors, null, 2));
        return res.status(400).json({ success: false, message: 'Validation failed', errors: error.errors });
      }
      if (error.code === '23505') { 
        // PostgreSQL unique constraint violation (e.g., email already exists)
        return res.status(409).json({ success: false, message: 'A user with this email or employee number already exists.' });
      }
      console.error('[Teacher Controller Error]:', error);
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async getTeacherById(req: AuthenticatedRequest, res: Response) {
    try {
      // Added "as string" to satisfy TypeScript's strict type checking
      const data = await service.getTeacherById(req.tenantId!, req.params.id as string);
      res.status(200).json({ success: true, data });
    } catch (error: any) {
      if (error.message === 'Teacher not found') {
        return res.status(404).json({ success: false, message: error.message });
      }
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async updateTeacher(req: AuthenticatedRequest, res: Response) {
    try {
      const validatedData = updateTeacherSchema.parse(req.body);
      await service.updateTeacher(req.tenantId!, req.params.id as string, req.user!.userId, validatedData);
      res.status(200).json({ success: true, message: 'Teacher updated successfully' });
    } catch (error: any) {
      if (error.name === 'ZodError') return res.status(400).json({ success: false, errors: error.errors });
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async deleteTeacher(req: AuthenticatedRequest, res: Response) {
    try {
      await service.deleteTeacher(req.tenantId!, req.params.id as string, req.user!.userId);
      res.status(200).json({ success: true, message: 'Teacher deleted successfully' });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
}