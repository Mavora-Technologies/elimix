// apps/api/src/modules/academics/elearning.repository.ts
import { db } from '../../config/db.js';
import {
  eLearningCourses,
  eLearningLessons,
  eLearningQuizzes,
  eLearningQuizQuestions,
  eLearningQuizAttempts,
} from './elearning.schema.js';
import { subjects } from './subjects.schema.js';
import { streams } from './academics.schema.js';
import { teachers } from '../teachers/teachers.schema.js';
import { users } from '../auth/auth.schema.js';
import { students } from '../students/students.schema.js';
import { eq, and, desc, asc } from 'drizzle-orm';

export class ELearningRepository {
  // =========================================================================
  // 1. COURSES & LESSONS
  // =========================================================================
  async getCourses(tenantId: string) {
    const [coursesList, allLessons, allStudents, allStreams] = await Promise.all([
      db
        .select({
          id: eLearningCourses.id,
          title: eLearningCourses.title,
          description: eLearningCourses.description,
          status: eLearningCourses.status,
          subjectId: eLearningCourses.subjectId,
          subjectName: subjects.name,
          teacherId: eLearningCourses.teacherId,
          teacherFirstName: users.firstName,
          teacherLastName: users.lastName,
          streamId: eLearningCourses.streamId,
          createdAt: eLearningCourses.createdAt,
        })
        .from(eLearningCourses)
        .innerJoin(subjects, eq(eLearningCourses.subjectId, subjects.id))
        .innerJoin(teachers, eq(eLearningCourses.teacherId, teachers.id))
        .innerJoin(users, eq(teachers.userId, users.id))
        .where(eq(eLearningCourses.tenantId, tenantId))
        .orderBy(desc(eLearningCourses.createdAt)),
      db.select().from(eLearningLessons).where(eq(eLearningLessons.tenantId, tenantId)).catch(() => []),
      db.select().from(students).where(eq(students.tenantId, tenantId)).catch(() => []),
      db.select().from(streams).where(eq(streams.tenantId, tenantId)).catch(() => []),
    ]);

    const streamMap = new Map(allStreams.map((s: any) => [s.id, s]));

    return coursesList.map((course) => {
      const courseLessons = allLessons.filter((l: any) => l.courseId === course.id);
      const totalDurationMinutes = courseLessons.reduce(
        (sum: number, l: any) => sum + (Number(l.durationMinutes) || 0),
        0
      );

      const targetStream: any = course.streamId ? streamMap.get(course.streamId) : null;
      let enrolledCount = 0;

      if (course.streamId) {
        const matched = allStudents.filter(
          (st: any) =>
            st.streamId === course.streamId ||
            (targetStream?.classId && st.classId === targetStream.classId)
        );
        enrolledCount = matched.length > 0 ? matched.length : allStudents.length;
      } else {
        enrolledCount = allStudents.length;
      }

      return {
        ...course,
        streamName: targetStream?.name || 'All Streams',
        enrolledStudents: enrolledCount,
        modulesCount: courseLessons.length,
        totalDurationMinutes,
      };
    });
  }

  async createCourse(tenantId: string, data: any) {
    const validStreamId = data.streamId && data.streamId.trim() !== '' ? data.streamId : null;
    const [course] = await db
      .insert(eLearningCourses)
      .values({
        tenantId,
        title: data.title,
        subjectId: data.subjectId,
        teacherId: data.teacherId,
        streamId: validStreamId,
        description: data.description,
        enrolledStudents: 0,
        modulesCount: 0,
        status: data.status || 'Active',
      })
      .returning();
    return course;
  }

  async updateCourse(tenantId: string, courseId: string, data: any) {
    const validStreamId = data.streamId && data.streamId.trim() !== '' ? data.streamId : null;
    const [updated] = await db
      .update(eLearningCourses)
      .set({
        title: data.title,
        subjectId: data.subjectId,
        teacherId: data.teacherId,
        streamId: validStreamId,
        description: data.description,
        status: data.status,
        updatedAt: new Date(),
      })
      .where(and(eq(eLearningCourses.id, courseId), eq(eLearningCourses.tenantId, tenantId)))
      .returning();
    return updated;
  }

  async deleteCourse(tenantId: string, id: string) {
    await db
      .delete(eLearningCourses)
      .where(and(eq(eLearningCourses.id, id), eq(eLearningCourses.tenantId, tenantId)));
    return true;
  }

  async getLessonsByCourse(tenantId: string, courseId: string) {
    return await db
      .select()
      .from(eLearningLessons)
      .where(and(eq(eLearningLessons.tenantId, tenantId), eq(eLearningLessons.courseId, courseId)))
      .orderBy(asc(eLearningLessons.chapterNumber), asc(eLearningLessons.createdAt));
  }

  async createLesson(tenantId: string, courseId: string, data: any) {
    const existing = await this.getLessonsByCourse(tenantId, courseId);
    const nextChapter = data.chapterNumber || existing.length + 1;

    const [lesson] = await db
      .insert(eLearningLessons)
      .values({
        tenantId,
        courseId,
        chapterNumber: nextChapter,
        title: data.title,
        contentType: data.contentType || 'Video',
        contentUrl: data.contentUrl || null,
        notes: data.notes || null,
        durationMinutes: data.durationMinutes || 40,
      })
      .returning();

    await db
      .update(eLearningCourses)
      .set({ modulesCount: existing.length + 1, updatedAt: new Date() })
      .where(and(eq(eLearningCourses.id, courseId), eq(eLearningCourses.tenantId, tenantId)));

    return lesson;
  }

  async deleteLesson(tenantId: string, courseId: string, lessonId: string) {
    await db
      .delete(eLearningLessons)
      .where(
        and(
          eq(eLearningLessons.id, lessonId),
          eq(eLearningLessons.courseId, courseId),
          eq(eLearningLessons.tenantId, tenantId)
        )
      );

    const remaining = await this.getLessonsByCourse(tenantId, courseId);
    await db
      .update(eLearningCourses)
      .set({ modulesCount: remaining.length, updatedAt: new Date() })
      .where(and(eq(eLearningCourses.id, courseId), eq(eLearningCourses.tenantId, tenantId)));

    return true;
  }

  // =========================================================================
  // 2. QUIZZES, QUESTION BANK & AUTO-MARKING ENGINE
  // =========================================================================
  async getQuizzes(tenantId: string) {
    const [quizzesList, allQuestions, allAttempts, allCourses, allStreams] = await Promise.all([
      db
        .select({
          id: eLearningQuizzes.id,
          title: eLearningQuizzes.title,
          instructions: eLearningQuizzes.instructions,
          timeLimitMinutes: eLearningQuizzes.timeLimitMinutes,
          passingScore: eLearningQuizzes.passingScore,
          status: eLearningQuizzes.status,
          courseId: eLearningQuizzes.courseId,
          subjectId: eLearningQuizzes.subjectId,
          subjectName: subjects.name,
          teacherId: eLearningQuizzes.teacherId,
          teacherFirstName: users.firstName,
          teacherLastName: users.lastName,
          streamId: eLearningQuizzes.streamId,
          createdAt: eLearningQuizzes.createdAt,
        })
        .from(eLearningQuizzes)
        .innerJoin(subjects, eq(eLearningQuizzes.subjectId, subjects.id))
        .innerJoin(teachers, eq(eLearningQuizzes.teacherId, teachers.id))
        .innerJoin(users, eq(teachers.userId, users.id))
        .where(eq(eLearningQuizzes.tenantId, tenantId))
        .orderBy(desc(eLearningQuizzes.createdAt)),
      db.select().from(eLearningQuizQuestions).where(eq(eLearningQuizQuestions.tenantId, tenantId)).catch(() => []),
      db.select().from(eLearningQuizAttempts).where(eq(eLearningQuizAttempts.tenantId, tenantId)).catch(() => []),
      db.select().from(eLearningCourses).where(eq(eLearningCourses.tenantId, tenantId)).catch(() => []),
      db.select().from(streams).where(eq(streams.tenantId, tenantId)).catch(() => []),
    ]);

    const courseMap = new Map(allCourses.map((c: any) => [c.id, c.title]));
    const streamMap = new Map(allStreams.map((s: any) => [s.id, s.name]));

    return quizzesList.map((q) => {
      const questions = allQuestions.filter((qn: any) => qn.quizId === q.id);
      const totalPoints = questions.reduce((sum: number, qn: any) => sum + (Number(qn.points) || 1), 0);
      const attempts = allAttempts.filter((a: any) => a.quizId === q.id);

      let avgNumeric: number | null = null;
      if (attempts.length > 0) {
        const sumScores = attempts.reduce((acc: number, a: any) => acc + (Number(a.scorePercentage) || 0), 0);
        avgNumeric = Math.round((sumScores / attempts.length) * 10) / 10;
      }

      return {
        ...q,
        instructor: `${q.teacherFirstName} ${q.teacherLastName}`.trim(),
        courseTitle: q.courseId ? courseMap.get(q.courseId) || 'General Course' : 'Standalone Assessment',
        streamName: q.streamId ? streamMap.get(q.streamId) || 'All Streams' : 'All Streams',
        questionsCount: questions.length,
        totalPoints,
        submissionsCount: attempts.length,
        averageScoreNumeric: avgNumeric,
        averageScore: avgNumeric !== null ? `${avgNumeric}%` : 'No attempts',
      };
    });
  }

  async createQuiz(tenantId: string, data: any) {
    const validCourseId = data.courseId && data.courseId.trim() !== '' ? data.courseId : null;
    const validStreamId = data.streamId && data.streamId.trim() !== '' ? data.streamId : null;

    const [quiz] = await db
      .insert(eLearningQuizzes)
      .values({
        tenantId,
        title: data.title,
        courseId: validCourseId,
        subjectId: data.subjectId,
        teacherId: data.teacherId,
        streamId: validStreamId,
        instructions: data.instructions,
        timeLimitMinutes: data.timeLimitMinutes || 30,
        passingScore: data.passingScore || 50,
        questionsCount: 0,
        status: data.status || 'Active',
      })
      .returning();

    return quiz;
  }

  async updateQuiz(tenantId: string, quizId: string, data: any) {
    const validCourseId = data.courseId && data.courseId.trim() !== '' ? data.courseId : null;
    const validStreamId = data.streamId && data.streamId.trim() !== '' ? data.streamId : null;

    const [updated] = await db
      .update(eLearningQuizzes)
      .set({
        title: data.title,
        courseId: validCourseId,
        subjectId: data.subjectId,
        teacherId: data.teacherId,
        streamId: validStreamId,
        instructions: data.instructions,
        timeLimitMinutes: data.timeLimitMinutes,
        passingScore: data.passingScore,
        status: data.status,
        updatedAt: new Date(),
      })
      .where(and(eq(eLearningQuizzes.id, quizId), eq(eLearningQuizzes.tenantId, tenantId)))
      .returning();

    return updated;
  }

  async deleteQuiz(tenantId: string, quizId: string) {
    await db
      .delete(eLearningQuizzes)
      .where(and(eq(eLearningQuizzes.id, quizId), eq(eLearningQuizzes.tenantId, tenantId)));
    return true;
  }

  // --- QUESTIONS BANK ---
  async getQuestionsByQuiz(tenantId: string, quizId: string) {
    return await db
      .select()
      .from(eLearningQuizQuestions)
      .where(and(eq(eLearningQuizQuestions.tenantId, tenantId), eq(eLearningQuizQuestions.quizId, quizId)))
      .orderBy(asc(eLearningQuizQuestions.questionNumber), asc(eLearningQuizQuestions.createdAt));
  }

  async addQuestionToQuiz(tenantId: string, quizId: string, data: any) {
    const existing = await this.getQuestionsByQuiz(tenantId, quizId);
    const nextNumber = data.questionNumber || existing.length + 1;

    const [question] = await db
      .insert(eLearningQuizQuestions)
      .values({
        tenantId,
        quizId,
        questionNumber: nextNumber,
        questionText: data.questionText,
        questionType: data.questionType || 'MCQ',
        options: data.options,
        correctAnswer: data.correctAnswer,
        points: data.points || 1,
        explanation: data.explanation || null,
      })
      .returning();

    await db
      .update(eLearningQuizzes)
      .set({ questionsCount: existing.length + 1, updatedAt: new Date() })
      .where(and(eq(eLearningQuizzes.id, quizId), eq(eLearningQuizzes.tenantId, tenantId)));

    return question;
  }

  async deleteQuizQuestion(tenantId: string, quizId: string, questionId: string) {
    await db
      .delete(eLearningQuizQuestions)
      .where(
        and(
          eq(eLearningQuizQuestions.id, questionId),
          eq(eLearningQuizQuestions.quizId, quizId),
          eq(eLearningQuizQuestions.tenantId, tenantId)
        )
      );

    const remaining = await this.getQuestionsByQuiz(tenantId, quizId);
    await db
      .update(eLearningQuizzes)
      .set({ questionsCount: remaining.length, updatedAt: new Date() })
      .where(and(eq(eLearningQuizzes.id, quizId), eq(eLearningQuizzes.tenantId, tenantId)));

    return true;
  }

  // --- INSTANT AUTO-MARKING ENGINE & SUBMISSIONS ---
  async getAttemptsByQuiz(tenantId: string, quizId: string) {
    const [attempts, allStudents] = await Promise.all([
      db
        .select()
        .from(eLearningQuizAttempts)
        .where(and(eq(eLearningQuizAttempts.tenantId, tenantId), eq(eLearningQuizAttempts.quizId, quizId)))
        .orderBy(desc(eLearningQuizAttempts.submittedAt)),
      db.select().from(students).where(eq(students.tenantId, tenantId)).catch(() => []),
    ]);

    const studentMap = new Map(allStudents.map((s: any) => [s.id, s]));

    return attempts.map((att) => {
      const stu: any = studentMap.get(att.studentId);
      return {
        ...att,
        studentName: stu ? `${stu.firstName} ${stu.lastName}`.trim() : 'Student',
        admissionNumber: stu?.admissionNumber || '-',
      };
    });
  }

  async submitAndAutoGradeQuiz(
    tenantId: string,
    quizId: string,
    payload: { studentId: string; answers: Record<string, string> }
  ) {
    const [quiz] = await db
      .select()
      .from(eLearningQuizzes)
      .where(and(eq(eLearningQuizzes.id, quizId), eq(eLearningQuizzes.tenantId, tenantId)))
      .limit(1);

    if (!quiz) throw new Error('Quiz not found');

    const questions = await this.getQuestionsByQuiz(tenantId, quizId);
    if (questions.length === 0) {
      throw new Error('Cannot submit attempt: This quiz has no questions configured yet.');
    }

    let earnedPoints = 0;
    let totalPoints = 0;

    questions.forEach((q) => {
      const pts = Number(q.points) || 1;
      totalPoints += pts;
      const submittedAnswer = (payload.answers[q.id] || '').trim().toLowerCase();
      const expectedAnswer = (q.correctAnswer || '').trim().toLowerCase();
      if (submittedAnswer && submittedAnswer === expectedAnswer) {
        earnedPoints += pts;
      }
    });

    const scorePercentage = totalPoints > 0 ? Math.round((earnedPoints / totalPoints) * 100) : 0;
    const passed = scorePercentage >= (quiz.passingScore || 50) ? 'Pass' : 'Fail';

    const [attempt] = await db
      .insert(eLearningQuizAttempts)
      .values({
        tenantId,
        quizId,
        studentId: payload.studentId,
        answers: payload.answers,
        earnedPoints,
        totalPoints,
        scorePercentage,
        passed,
      })
      .returning();

    return attempt;
  }
}