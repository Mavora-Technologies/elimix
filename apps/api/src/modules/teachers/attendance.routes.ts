// apps/api/src/modules/teachers/attendance.routes.ts
import { Router } from 'express';
import { AttendanceController } from './attendance.controller.js';
import { authMiddleware } from '../../middleware/auth.middleware.js';
import { requirePermission } from '../../middleware/rbac.middleware.js';

const router = Router();
const controller = new AttendanceController();

router.use(authMiddleware);

router.get('/', requirePermission('staff.read'), controller.getDailyAttendance);
router.post('/', requirePermission('staff.create'), controller.logAttendance);

export default router;