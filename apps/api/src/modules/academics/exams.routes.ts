// apps/api/src/modules/academics/exams.routes.ts
import { Router } from 'express';
import { ExamsController } from './exams.controller.js';
import { authMiddleware } from '../../middleware/auth.middleware.js';
import { requirePermission } from '../../middleware/rbac.middleware.js';

const router = Router();
const controller = new ExamsController();

router.use(authMiddleware);

router.get('/', requirePermission('academics.read'), controller.getExams);
router.post('/', requirePermission('academics.create'), controller.createExam);
router.put('/:id', requirePermission('academics.create'), controller.updateExam);
router.patch('/:id/status', requirePermission('academics.create'), controller.updateStatus);
router.delete('/:id', requirePermission('academics.create'), controller.deleteExam);

export default router;