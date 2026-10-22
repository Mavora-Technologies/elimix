// apps/api/src/modules/academics/elearning.routes.ts
import { Router } from 'express';
import { ELearningController } from './elearning.controller.js';
import { authMiddleware } from '../../middleware/auth.middleware.js';
import { requirePermission } from '../../middleware/rbac.middleware.js';

const router = Router();
const controller = new ELearningController();

router.use(authMiddleware);

// 1. Courses & Lessons
router.get('/courses', requirePermission('academics.read'), controller.getCourses);
router.post('/courses', requirePermission('academics.create'), controller.createCourse);
router.put('/courses/:id', requirePermission('academics.create'), controller.updateCourse);
router.delete('/courses/:id', requirePermission('academics.delete'), controller.deleteCourse);

router.get('/courses/:id/lessons', requirePermission('academics.read'), controller.getCourseLessons);
router.post('/courses/:id/lessons', requirePermission('academics.create'), controller.addCourseLesson);
router.delete('/courses/:id/lessons/:lessonId', requirePermission('academics.create'), controller.deleteCourseLesson);

// 2. Quizzes, Auto-Marking Question Bank & Attempts
router.get('/quizzes', requirePermission('academics.read'), controller.getQuizzes);
router.post('/quizzes', requirePermission('academics.create'), controller.createQuiz);
router.put('/quizzes/:id', requirePermission('academics.create'), controller.updateQuiz);
router.delete('/quizzes/:id', requirePermission('academics.delete'), controller.deleteQuiz);

router.get('/quizzes/:id/details', requirePermission('academics.read'), controller.getQuizDetailsAndQuestions);
router.post('/quizzes/:id/questions', requirePermission('academics.create'), controller.addQuizQuestion);
router.delete('/quizzes/:id/questions/:questionId', requirePermission('academics.create'), controller.deleteQuizQuestion);
router.post('/quizzes/:id/attempts', requirePermission('academics.create'), controller.submitQuizAttempt);

export default router;