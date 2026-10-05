// apps/api/src/modules/students/students.routes.ts
import { Router } from 'express';
import { StudentsController } from './students.controller.js';
import { authMiddleware } from '../../middleware/auth.middleware.js';
import { requirePermission } from '../../middleware/rbac.middleware.js';

const router = Router();
const controller = new StudentsController();

router.use(authMiddleware);

router.post('/', requirePermission('students.create'), controller.create);
router.get('/', requirePermission('students.read'), controller.getAll);
router.get('/:id', requirePermission('students.read'), controller.getById);
router.patch('/:id', requirePermission('students.update'), controller.update);
router.delete('/:id', requirePermission('students.delete'), controller.remove);

export default router;