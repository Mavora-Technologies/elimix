// apps/api/src/modules/academics/elearning.controller.ts
import { Response } from 'express';
import { AuthenticatedRequest } from '../../middleware/auth.middleware.js';
import { ELearningRepository } from './elearning.repository.js';
import {
  createCourseSchema,
  createCourseLessonSchema,
  createQuizSchema,
  createQuizQuestionSchema,
  submitQuizAttemptSchema,
} from '../../validators/elearning.validator.js';

const repository = new ELearningRepository();

export class ELearningController {
  // --- COURSES ---
  async getCourses(req: AuthenticatedRequest, res: Response) {
    try {
      const records = await repository.getCourses(req.tenantId!);
      const data = records.map((r) => ({
        id: r.id,
        title: r.title,
        description: r.description,
        subjectId: r.subjectId,
        subject: r.subjectName,
        teacherId: r.teacherId,
        instructor: `${r.teacherFirstName} ${r.teacherLastName}`.trim(),
        streamId: r.streamId || '',
        streamName: r.streamName,
        enrolledStudents: r.enrolledStudents,
        modulesCount: r.modulesCount,
        totalDurationMinutes: r.totalDurationMinutes,
        status: r.status,
      }));
      return res.status(200).json({ success: true, data });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  async createCourse(req: AuthenticatedRequest, res: Response) {
    try {
      const parsed = createCourseSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({
          success: false,
          message: parsed.error.issues[0]?.message || 'Validation failed',
        });
      }
      const data = await repository.createCourse(req.tenantId!, parsed.data);
      return res.status(201).json({ success: true, data });
    } catch (error: any) {
      return res.status(400).json({ success: false, message: error.message });
    }
  }

  async updateCourse(req: AuthenticatedRequest, res: Response) {
    try {
      const parsed = createCourseSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({
          success: false,
          message: parsed.error.issues[0]?.message || 'Validation failed',
        });
      }
      const data = await repository.updateCourse(req.tenantId!, req.params.id as string, parsed.data);
      return res.status(200).json({ success: true, data });
    } catch (error: any) {
      return res.status(400).json({ success: false, message: error.message });
    }
  }

  async deleteCourse(req: AuthenticatedRequest, res: Response) {
    try {
      await repository.deleteCourse(req.tenantId!, req.params.id as string);
      return res.status(200).json({ success: true, message: 'Course deleted successfully' });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  // --- LESSONS ---
  async getCourseLessons(req: AuthenticatedRequest, res: Response) {
    try {
      const data = await repository.getLessonsByCourse(req.tenantId!, req.params.id as string);
      return res.status(200).json({ success: true, data });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  async addCourseLesson(req: AuthenticatedRequest, res: Response) {
    try {
      const parsed = createCourseLessonSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({
          success: false,
          message: parsed.error.issues[0]?.message || 'Invalid lesson details',
        });
      }
      const data = await repository.createLesson(req.tenantId!, req.params.id as string, parsed.data);
      return res.status(201).json({ success: true, data });
    } catch (error: any) {
      return res.status(400).json({ success: false, message: error.message });
    }
  }

  async deleteCourseLesson(req: AuthenticatedRequest, res: Response) {
    try {
      await repository.deleteLesson(req.tenantId!, req.params.id as string, req.params.lessonId as string);
      return res.status(200).json({ success: true, message: 'Lesson removed' });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  // --- QUIZZES & AUTO-MARKING ---
  async getQuizzes(req: AuthenticatedRequest, res: Response) {
    try {
      const records = await repository.getQuizzes(req.tenantId!);
      const data = records.map((q) => ({
        id: q.id,
        title: q.title,
        instructions: q.instructions,
        courseId: q.courseId || '',
        courseTitle: q.courseTitle,
        subjectId: q.subjectId,
        subject: q.subjectName,
        teacherId: q.teacherId,
        instructor: q.instructor,
        streamId: q.streamId || '',
        streamName: q.streamName,
        questionsCount: q.questionsCount,
        totalPoints: q.totalPoints,
        timeLimitMinutes: q.timeLimitMinutes,
        passingScore: q.passingScore,
        submissionsCount: q.submissionsCount,
        averageScoreNumeric: q.averageScoreNumeric,
        averageScore: q.averageScore,
        status: q.status,
      }));
      return res.status(200).json({ success: true, data });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  async createQuiz(req: AuthenticatedRequest, res: Response) {
    try {
      const parsed = createQuizSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({
          success: false,
          message: parsed.error.issues[0]?.message || 'Validation failed',
        });
      }
      const data = await repository.createQuiz(req.tenantId!, parsed.data);
      return res.status(201).json({ success: true, data });
    } catch (error: any) {
      return res.status(400).json({ success: false, message: error.message });
    }
  }

  async updateQuiz(req: AuthenticatedRequest, res: Response) {
    try {
      const parsed = createQuizSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({
          success: false,
          message: parsed.error.issues[0]?.message || 'Validation failed',
        });
      }
      const data = await repository.updateQuiz(req.tenantId!, req.params.id as string, parsed.data);
      return res.status(200).json({ success: true, data });
    } catch (error: any) {
      return res.status(400).json({ success: false, message: error.message });
    }
  }

  async deleteQuiz(req: AuthenticatedRequest, res: Response) {
    try {
      await repository.deleteQuiz(req.tenantId!, req.params.id as string);
      return res.status(200).json({ success: true, message: 'Quiz deleted' });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  async getQuizDetailsAndQuestions(req: AuthenticatedRequest, res: Response) {
    try {
      const quizId = req.params.id as string;
      const [questions, attempts] = await Promise.all([
        repository.getQuestionsByQuiz(req.tenantId!, quizId),
        repository.getAttemptsByQuiz(req.tenantId!, quizId),
      ]);
      return res.status(200).json({ success: true, data: { questions, attempts } });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  async addQuizQuestion(req: AuthenticatedRequest, res: Response) {
    try {
      const parsed = createQuizQuestionSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({
          success: false,
          message: parsed.error.issues[0]?.message || 'Invalid question format',
        });
      }
      const data = await repository.addQuestionToQuiz(req.tenantId!, req.params.id as string, parsed.data);
      return res.status(201).json({ success: true, data });
    } catch (error: any) {
      return res.status(400).json({ success: false, message: error.message });
    }
  }

  async deleteQuizQuestion(req: AuthenticatedRequest, res: Response) {
    try {
      await repository.deleteQuizQuestion(
        req.tenantId!,
        req.params.id as string,
        req.params.questionId as string
      );
      return res.status(200).json({ success: true, message: 'Question deleted' });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  async submitQuizAttempt(req: AuthenticatedRequest, res: Response) {
    try {
      const parsed = submitQuizAttemptSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({
          success: false,
          message: parsed.error.issues[0]?.message || 'Invalid submission payload',
        });
      }
      const data = await repository.submitAndAutoGradeQuiz(
        req.tenantId!,
        req.params.id as string,
        parsed.data
      );
      return res.status(201).json({ success: true, data });
    } catch (error: any) {
      return res.status(400).json({ success: false, message: error.message });
    }
  }
}