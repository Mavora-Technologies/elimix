import { Router } from 'express';
import { UserController } from './user.controller.js';
import { authMiddleware } from '../../middleware/auth.middleware.js';
import { requirePermission } from '../../middleware/rbac.middleware.js';

const router = Router();

// All user routes require a valid JWT token
router.use(authMiddleware);

// Protect specific routes with fine-grained permissions
router.get('/', requirePermission('users:read'), UserController.list);
router.post('/', requirePermission('users:write'), UserController.create);

export default router;