// apps/api/src/modules/attendance/attendance.routes.ts
import { Router } from 'express';
import { AttendanceController } from './attendance.controller.js';
import { authMiddleware } from '../../middleware/auth.middleware.js';
import { requirePermission } from '../../middleware/rbac.middleware.js';

const router = Router();
const controller = new AttendanceController();

router.use(authMiddleware);

// MUST BE ADDED HERE:
router.get('/', requirePermission('attendance.read'), controller.getAttendance);

router.post('/', requirePermission('attendance.write'), controller.saveAttendance);

export default router;