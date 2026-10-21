// apps/api/src/modules/students/students.routes.ts
import { Router } from 'express';
import { StudentsController } from './students.controller.js';
import { StudentLifecycleController } from './lifecycle.controller.js';
import { authMiddleware } from '../../middleware/auth.middleware.js';
import { requirePermission } from '../../middleware/rbac.middleware.js';

const router = Router();
const controller = new StudentsController();

router.use(authMiddleware);

// 1. Metadata & Lifecycle Sub-Routes (MUST come before /:id)
router.get('/meta/classes-streams', requirePermission('students.read'), controller.getMetadata);

// Medical & Clinic Module
router.get('/medical', requirePermission('students.read'), StudentLifecycleController.getMedicalData);
router.post('/medical/profiles', requirePermission('students.update'), StudentLifecycleController.upsertMedicalProfile);
router.post('/medical/visits', requirePermission('students.update'), StudentLifecycleController.createClinicVisit);

// Transfers & Multi-Department Clearance Module
router.get('/transfers', requirePermission('students.read'), StudentLifecycleController.getTransfers);
router.post('/transfers', requirePermission('students.update'), StudentLifecycleController.createTransfer);
router.patch('/transfers/:id/clearance', requirePermission('students.update'), StudentLifecycleController.updateTransferClearance);

// Withdrawals & Exit Clearance Module
router.get('/withdrawals', requirePermission('students.read'), StudentLifecycleController.getWithdrawals);
router.post('/withdrawals', requirePermission('students.update'), StudentLifecycleController.createWithdrawal);
router.patch('/withdrawals/:id', requirePermission('students.update'), StudentLifecycleController.updateWithdrawal);

// 2. Base Student CRUD Routes
router.post('/', requirePermission('students.create'), controller.create);
router.get('/', requirePermission('students.read'), controller.getAll);
router.get('/:id', requirePermission('students.read'), controller.getById);
router.patch('/:id', requirePermission('students.update'), controller.update);
router.delete('/:id', requirePermission('students.delete'), controller.remove);

export default router;