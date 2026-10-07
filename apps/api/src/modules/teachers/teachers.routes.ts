import { Router } from 'express';
import { TeachersController } from './teachers.controller.js';
import { authMiddleware } from '../../middleware/auth.middleware.js';
import { requirePermission } from '../../middleware/rbac.middleware.js';

const router = Router();
const controller = new TeachersController();

router.use(authMiddleware);

router.get('/', requirePermission('staff.read'), controller.getAllTeachers);
router.get('/departments', requirePermission('staff.read'), controller.getDepartments);
router.get('/:id', requirePermission('staff.read'), controller.getTeacherById);
router.put('/:id', requirePermission('staff.create'), controller.updateTeacher);
router.delete('/:id', requirePermission('staff.create'), controller.deleteTeacher);

// MUST BE ADDED HERE:
router.post('/', requirePermission('staff.create'), controller.createTeacher);

export default router;