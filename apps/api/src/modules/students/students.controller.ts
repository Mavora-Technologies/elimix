// apps/api/src/modules/students/students.controller.ts
import { Response } from 'express';
import { AuthenticatedRequest } from '../../middleware/auth.middleware.js';
import { StudentsService } from './students.service.js';
import { createStudentSchema, updateStudentSchema } from '../../validators/students.validator.js';

const service = new StudentsService();

export class StudentsController {
  async create(req: AuthenticatedRequest, res: Response) {
    try {
      const validatedData = createStudentSchema.parse(req.body);
      const student = await service.createStudent(req.tenantId!, req.user!.userId, validatedData as any);
      res.status(201).json({ success: true, data: student });
    } catch (error: any) {
      if (error.name === 'ZodError') {
        return res.status(400).json({ success: false, message: 'Validation failed', errors: error.errors });
      }
      res.status(400).json({ success: false, message: error.message });
    }
  }

  async getAll(req: AuthenticatedRequest, res: Response) {
    try {
      const students = await service.getStudents(req.tenantId!);
      res.status(200).json({ success: true, data: students });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async getById(req: AuthenticatedRequest, res: Response) {
    try {
      const student = await service.getStudentById(req.tenantId!, req.params.id as string);
      res.status(200).json({ success: true, data: student });
    } catch (error: any) {
      res.status(404).json({ success: false, message: error.message });
    }
  }

  async update(req: AuthenticatedRequest, res: Response) {
    try {
      const validatedData = updateStudentSchema.parse(req.body);
      const student = await service.updateStudent(req.tenantId!, req.user!.userId, req.params.id as string, validatedData);
      res.status(200).json({ success: true, data: student });
    } catch (error: any) {
      if (error.name === 'ZodError') {
        return res.status(400).json({ success: false, message: 'Validation failed', errors: error.errors });
      }
      res.status(400).json({ success: false, message: error.message });
    }
  }

  async remove(req: AuthenticatedRequest, res: Response) {
    try {
      await service.deleteStudent(req.tenantId!, req.user!.userId, req.params.id as string);
      res.status(200).json({ success: true, message: 'Student deleted successfully' });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  }
}