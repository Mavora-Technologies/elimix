import { Router } from 'express';
import { SubjectsController } from './subjects.controller.js';
import { authMiddleware } from '../../middleware/auth.middleware.js';
import { requirePermission } from '../../middleware/rbac.middleware.js';

const router = Router();
const controller = new SubjectsController();

router.use(authMiddleware);

router.get('/', requirePermission('academics.read'), controller.getSubjects);
router.post('/', requirePermission('academics.create'), controller.createSubject);
router.post('/allocations', requirePermission('academics.create'), controller.allocateTeacher);

export default router;