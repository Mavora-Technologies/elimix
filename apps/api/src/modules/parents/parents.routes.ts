// apps/api/src/modules/parents/parents.routes.ts
import { Router } from 'express';
import { ParentsController } from './parents.controller.js';
import { authMiddleware } from '../../middleware/auth.middleware.js';
import { tenantMiddleware } from '../../middleware/tenant.middleware.js';

const router = Router();

router.use(tenantMiddleware);
router.use(authMiddleware);

// 1. Specific static sub-routes MUST come before parameter routes (/:id)
router.get('/families', ParentsController.getFamilies);
router.get('/links', ParentsController.getLinkedChildren);
router.get('/access-logs', ParentsController.getAccessLogs);
router.get('/notifications', ParentsController.getNotifications);
router.post('/notifications', ParentsController.sendBroadcast);

// 2. Base collection routes
router.get('/', ParentsController.getParents);
router.post('/', ParentsController.createParent);

// 3. Dynamic parameter routes
router.patch('/:id', ParentsController.updateParent);
router.delete('/:id', ParentsController.deleteParent);
router.get('/families', ParentsController.getFamilies);

export default router;