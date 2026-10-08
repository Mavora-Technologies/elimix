// apps/api/src/modules/academics/academics.routes.ts
import { Router } from 'express';
import { AcademicsController } from './academics.controller.js';
import { authMiddleware } from '../../middleware/auth.middleware.js';
import { requirePermission } from '../../middleware/rbac.middleware.js';

const router = Router();
const controller = new AcademicsController();

router.use(authMiddleware);

// Use a distinct permission for academics access
router.get('/classes', requirePermission('academics.read'), controller.getClassesAndStreams);
router.get('/reference', requirePermission('academics.read'), controller.getReferenceData);
router.post('/streams', requirePermission('academics.create'), controller.createStream);
router.put('/streams/:id', requirePermission('academics.create'), controller.updateStream);
router.delete('/streams/:id', requirePermission('academics.create'), controller.deleteStream);

export default router;