// apps/api/src/modules/dashboard/dashboard.routes.ts
import { Router } from 'express';
import { DashboardController } from './dashboard.controller.js';
import { tenantMiddleware } from '../../middleware/tenant.middleware.js';
import { authMiddleware } from '../../middleware/auth.middleware.js';

const router = Router();

router.get('/metrics', tenantMiddleware, authMiddleware, DashboardController.getOverviewMetrics);

export default router;