import { Request, Response } from 'express';
import { StudentsService } from './students.service';

const studentsService = new StudentsService();

export class StudentsController {
  async getDirectory(req: Request, res: Response) {
    try {
      const tenantId = req.user?.tenantId; // Injected via tenant middleware
      const search = req.query.search as string;

      if (!tenantId) {
        return res.status(403).json({ success: false, message: "Tenant context missing", code: "TENANT_REQUIRED" });
      }

      const data = await studentsService.getStudentDirectory(tenantId, search);
      return res.status(200).json({ success: true, data });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message, code: "INTERNAL_SERVER_ERROR" });
    }
  }

  async createAdmission(req: Request, res: Response) {
    try {
      const tenantId = req.user?.tenantId;
      const userId = req.user?.id;

      if (!tenantId) {
        return res.status(403).json({ success: false, message: "Tenant context missing", code: "TENANT_REQUIRED" });
      }

      const student = await studentsService.registerStudent(tenantId, userId, req.body);
      return res.status(201).json({ success: true, message: "Student admitted successfully", data: student });
    } catch (error: any) {
      return res.status(400).json({ success: false, message: error.message, code: "ADMISSION_FAILED" });
    }
  }
}