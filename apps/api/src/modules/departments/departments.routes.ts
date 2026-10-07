import { Router } from 'express';
import { DepartmentsController } from './departments.controller.js';
import { authMiddleware } from '../../middleware/auth.middleware.js';
import { requirePermission } from '../../middleware/rbac.middleware.js';

const router = Router();
const controller = new DepartmentsController();

// Secure all department routes with authentication
router.use(authMiddleware);

router.get('/', requirePermission('staff.read'), controller.getAllDepartments);
router.post('/', requirePermission('staff.create'), controller.createDepartment);
router.put('/:id', requirePermission('staff.create'), controller.updateDepartment);
router.delete('/:id', requirePermission('staff.create'), controller.deleteDepartment);

export default router;