// apps/api/src/modules/academics/assignments.routes.ts
import { Router } from 'express';
import { AssignmentsController } from './assignments.controller.js';
import { authMiddleware } from '../../middleware/auth.middleware.js';
import { requirePermission } from '../../middleware/rbac.middleware.js';

const router = Router();
const controller = new AssignmentsController();

router.use(authMiddleware);

router.get('/', requirePermission('academics.read'), controller.getAssignments);
router.post('/', requirePermission('academics.create'), controller.createAssignment);
router.get('/:id/submissions', requirePermission('academics.read'), controller.getSubmissions);
router.post('/:id/submissions', requirePermission('academics.create'), controller.recordSubmission);
router.put('/:id', requirePermission('academics.create'), controller.updateAssignment);
router.patch('/:id/status', requirePermission('academics.create'), controller.updateStatus);
router.delete('/:id', requirePermission('academics.create'), controller.deleteAssignment);

export default router;