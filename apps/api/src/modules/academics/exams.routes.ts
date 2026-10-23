// apps/api/src/modules/academics/exams.routes.ts
import { Router } from 'express';
import { ExamsController } from './exams.controller.js';
import { authMiddleware } from '../../middleware/auth.middleware.js';
import { requirePermission } from '../../middleware/rbac.middleware.js';

const router = Router();
const controller = new ExamsController();

router.use(authMiddleware);

router.get('/academic-years', requirePermission('academics.read'), controller.getAcademicYears);
router.get('/', requirePermission('academics.read'), controller.getExams);
router.get('/:id', requirePermission('academics.read'), controller.getExamById);
router.post('/', requirePermission('academics.create'), controller.createExam);
router.put('/:id', requirePermission('academics.create'), controller.updateExam);
router.patch('/:id/status', requirePermission('academics.create'), controller.updateStatus);
router.delete('/:id', requirePermission('academics.create'), controller.deleteExam);

// Exam Subject Papers Routes
router.get('/:id/papers', requirePermission('academics.read'), controller.getExamPapers);
router.post('/:id/papers', requirePermission('academics.create'), controller.createExamPaper);
router.delete('/:id/papers/:paperId', requirePermission('academics.create'), controller.deleteExamPaper);

export default router;