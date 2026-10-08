// apps/api/src/modules/academics/exam_reports.routes.ts
import { Router } from 'express';
import { ExamReportsController } from './exam_reports.controller.js';
import { authMiddleware } from '../../middleware/auth.middleware.js';
import { requirePermission } from '../../middleware/rbac.middleware.js';

const router = Router();
const controller = new ExamReportsController();

router.use(authMiddleware);

router.get('/', requirePermission('academics.read'), controller.getReports);
router.post('/', requirePermission('academics.create'), controller.createReport);
router.put('/:id', requirePermission('academics.create'), controller.updateReport);
router.delete('/:id', requirePermission('academics.create'), controller.deleteReport);

export default router;