// apps/api/src/modules/reports/reports.routes.ts
import { Router } from 'express';
import { ReportsController } from './reports.controller.js';
import { authMiddleware } from '../../middleware/auth.middleware.js';
import { tenantMiddleware } from '../../middleware/tenant.middleware.js';

const router = Router();
router.use(tenantMiddleware);
router.use(authMiddleware);

router.get('/enrollment', ReportsController.getEnrollmentReport);

export default router;