// apps/api/src/modules/academics/elearning_resources.routes.ts
import { Router } from 'express';
import { ELearningResourcesController } from './elearning_resources.controller.js';
import { authMiddleware } from '../../middleware/auth.middleware.js';
import { requirePermission } from '../../middleware/rbac.middleware.js';

const router = Router();
const controller = new ELearningResourcesController();

router.use(authMiddleware);

router.get('/', requirePermission('academics.read'), controller.getResources);
router.post('/', requirePermission('academics.create'), controller.createResource);
router.post('/:id/download', requirePermission('academics.read'), controller.recordDownload);
router.delete('/:id', requirePermission('academics.delete'), controller.deleteResource);

export default router;