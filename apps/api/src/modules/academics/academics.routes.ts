// apps/api/src/modules/academics/academics.routes.ts
import { Router } from 'express';
import { AcademicsController } from './academics.controller.js';
import { Phase3AcademicsController } from './curriculum.controller.js';
import { authMiddleware } from '../../middleware/auth.middleware.js';
import { tenantMiddleware } from '../../middleware/tenant.middleware.js';
import { requirePermission } from '../../middleware/rbac.middleware.js';

const router = Router();
const controller = new AcademicsController();

router.use(tenantMiddleware);
router.use(authMiddleware);

// 1. Existing Stream & Class Management Routes
router.get('/classes', requirePermission('academics.read'), controller.getClassesAndStreams);
router.get('/reference', requirePermission('academics.read'), controller.getReferenceData);
router.post('/streams', requirePermission('academics.create'), controller.createStream);
router.put('/streams/:id', requirePermission('academics.create'), controller.updateStream);
router.delete('/streams/:id', requirePermission('academics.create'), controller.deleteStream);

// 2. Phase 3: Academic Structure (Years, Terms, Classes, Streams)
router.get('/structure', requirePermission('academics.read'), Phase3AcademicsController.getStructure);
router.post('/years', requirePermission('academics.create'), Phase3AcademicsController.createYear);
router.post('/terms', requirePermission('academics.create'), Phase3AcademicsController.createTerm);
router.post('/classes', requirePermission('academics.create'), Phase3AcademicsController.createClass);
// (Note: /streams is already handled above by controller.createStream, but you can route to Phase3AcademicsController if preferred)

// 3. Phase 3: Multi-System Curriculum & Kenya CBC Engine
router.get('/curriculum', requirePermission('academics.read'), Phase3AcademicsController.getCurriculumEngine);
router.post('/curriculum/strands', requirePermission('academics.create'), Phase3AcademicsController.createStrand);
router.post('/curriculum/sub-strands', requirePermission('academics.create'), Phase3AcademicsController.createSubStrand);
router.post('/curriculum/assessments', requirePermission('academics.create'), Phase3AcademicsController.recordAssessment);

// 4. Phase 3: Intelligent Teacher Allocation & Workload Engine
router.get('/allocations', requirePermission('academics.read'), Phase3AcademicsController.getTeacherAllocations);
router.post('/allocations', requirePermission('academics.create'), Phase3AcademicsController.createTeacherAllocation);
router.delete('/allocations/:id', requirePermission('academics.delete'), Phase3AcademicsController.removeTeacherAllocation);

export default router;