import { Router } from 'express';
import { StudentsController } from './students.controller';
import { authenticateToken } from '../../middleware/auth.middleware';
import { requireTenant } from '../../middleware/tenant.middleware';
import { requirePermission } from '../../middleware/rbac.middleware';

const router = Router();
const controller = new StudentsController();

router.use(authenticateToken, requireTenant);

router.get('/', requirePermission('students.read'), controller.getDirectory);
router.post('/admissions', requirePermission('students.create'), controller.createAdmission);

export default router;