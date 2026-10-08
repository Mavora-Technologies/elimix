// apps/api/src/modules/academics/exam_results.routes.ts
import { Router } from 'express';
import { ExamResultsController } from './exam_results.controller.js';
import { authMiddleware } from '../../middleware/auth.middleware.js';
import { requirePermission } from '../../middleware/rbac.middleware.js';

const router = Router();
const controller = new ExamResultsController();

router.use(authMiddleware);

router.get('/', requirePermission('academics.read'), controller.getResults);
router.post('/', requirePermission('academics.create'), controller.createResult);
router.put('/:id', requirePermission('academics.create'), controller.updateResult);
router.delete('/:id', requirePermission('academics.create'), controller.deleteResult);

export default router;