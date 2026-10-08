// apps/api/src/modules/academics/timetables.routes.ts
import { Router } from 'express';
import { TimetablesController } from './timetables.controller.js';
import { authMiddleware } from '../../middleware/auth.middleware.js';
import { requirePermission } from '../../middleware/rbac.middleware.js';

const router = Router();
const controller = new TimetablesController();

router.use(authMiddleware);

// --- ADD THIS ROUTE ABOVE THE /:id ROUTES ---
router.get('/streams', requirePermission('academics.read'), controller.getStreams);

router.get('/', requirePermission('academics.read'), controller.getTimetable);
router.post('/', requirePermission('academics.create'), controller.createBlock);
router.delete('/:id', requirePermission('academics.create'), controller.deleteBlock);

export default router;