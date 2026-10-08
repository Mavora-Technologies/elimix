// apps/api/src/modules/academics/lesson_plans.routes.ts
import { Router } from 'express';
import { LessonPlansController } from './lesson_plans.controller.js';
import { authMiddleware } from '../../middleware/auth.middleware.js';
import { requirePermission } from '../../middleware/rbac.middleware.js';

const router = Router();
const controller = new LessonPlansController();

router.use(authMiddleware);

router.get('/', requirePermission('academics.read'), controller.getLessonPlans);
router.post('/', requirePermission('academics.create'), controller.createLessonPlan);
router.patch('/:id/status', requirePermission('academics.create'), controller.updateStatus);
router.put('/:id', requirePermission('academics.create'), controller.updateLessonPlan);
router.delete('/:id', requirePermission('academics.create'), controller.deleteLessonPlan);

export default router;