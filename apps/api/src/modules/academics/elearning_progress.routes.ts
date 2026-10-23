// apps/api/src/modules/academics/elearning_progress.routes.ts
import { Router } from 'express';
import { ELearningProgressController } from './elearning_progress.controller.js';
import { authMiddleware } from '../../middleware/auth.middleware.js';
import { requirePermission } from '../../middleware/rbac.middleware.js';

const router = Router();
const controller = new ELearningProgressController();

router.use(authMiddleware);

router.get('/', requirePermission('academics.read'), controller.getProgressOverview);
router.get('/details', requirePermission('academics.read'), controller.getStudentCourseDetail);
router.post('/toggle-lesson', requirePermission('academics.create'), controller.toggleLessonCompletion);
router.patch('/status', requirePermission('academics.create'), controller.updateProgressStatus);

export default router;