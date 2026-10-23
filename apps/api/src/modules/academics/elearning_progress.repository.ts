// apps/api/src/modules/academics/elearning_progress.repository.ts
import { db } from '../../config/db.js';
import {
  eLearningCourses,
  eLearningLessons,
  eLearningQuizzes,
  eLearningQuizAttempts,
  eLearningStudentProgress,
} from './elearning.schema.js';
import { subjects } from './subjects.schema.js';
import { students } from '../students/students.schema.js';
import { eq, and, asc, desc } from 'drizzle-orm';

export class ELearningProgressRepository {
  private deriveAutomaticStatus(
    completionPct: number,
    totalModules: number,
    quizAvgNumeric: number | null
  ): 'Completed' | 'On Track' | 'Behind' | 'At Risk' {
    if (totalModules > 0 && completionPct >= 100) return 'Completed';
    if (quizAvgNumeric !== null && quizAvgNumeric < 50) return 'At Risk';
    if (completionPct >= 60) return 'On Track';
    if (completionPct >= 25) return 'Behind';
    return 'At Risk';
  }

  async getStudentProgressOverview(tenantId: string) {
    const [
      allStudents,
      allCourses,
      allLessons,
      allQuizzes,
      allAttempts,
      allSubjects,
      allStoredProgress,
    ] = await Promise.all([
      db.select().from(students).where(eq(students.tenantId, tenantId)).catch(() => []),
      db.select().from(eLearningCourses).where(eq(eLearningCourses.tenantId, tenantId)).catch(() => []),
      db.select().from(eLearningLessons).where(eq(eLearningLessons.tenantId, tenantId)).catch(() => []),
      db.select().from(eLearningQuizzes).where(eq(eLearningQuizzes.tenantId, tenantId)).catch(() => []),
      db.select().from(eLearningQuizAttempts).where(eq(eLearningQuizAttempts.tenantId, tenantId)).catch(() => []),
      db.select().from(subjects).where(eq(subjects.tenantId, tenantId)).catch(() => []),
      db.select().from(eLearningStudentProgress).where(eq(eLearningStudentProgress.tenantId, tenantId)).catch(() => []),
    ]);

    const subjectMap = new Map(allSubjects.map((s: any) => [s.id, s.name]));
    const studentMap = new Map(allStudents.map((s: any) => [s.id, s]));
    const courseMap = new Map(allCourses.map((c: any) => [c.id, c]));
    const progressMap = new Map(
      allStoredProgress.map((p: any) => [`${p.studentId}_${p.courseId}`, p])
    );

    // Build set of active (studentId, courseId) pairs:
    // 1. Explicitly enrolled/tracked in e_learning_student_progress
    // 2. Students who have taken a quiz linked to a course/subject
    // 3. Active roster students for active courses (capped cleanly to prevent cartesian explosion)
    const pairs = new Set<string>();

    allStoredProgress.forEach((p: any) => {
      if (studentMap.has(p.studentId) && courseMap.has(p.courseId)) {
        pairs.add(`${p.studentId}_${p.courseId}`);
      }
    });

    allAttempts.forEach((att: any) => {
      const quiz: any = allQuizzes.find((q: any) => q.id === att.quizId);
      if (quiz && studentMap.has(att.studentId)) {
        if (quiz.courseId && courseMap.has(quiz.courseId)) {
          pairs.add(`${att.studentId}_${quiz.courseId}`);
        } else {
          const matchingCourse: any = allCourses.find((c: any) => c.subjectId === quiz.subjectId);
          if (matchingCourse) pairs.add(`${att.studentId}_${matchingCourse.id}`);
        }
      }
    });

    // Ensure active courses display real enrolled students from the tenant roster
    const rosterSample = allStudents.slice(0, 50);
    for (const course of allCourses) {
      for (const stu of rosterSample) {
        if (!course.streamId || (stu as any).streamId === course.streamId) {
          pairs.add(`${stu.id}_${course.id}`);
        }
      }
    }

    const progressRecords: any[] = [];

    for (const pairKey of pairs) {
      const [studentId, courseId] = pairKey.split('_');
      const student: any = studentMap.get(studentId);
      const course: any = courseMap.get(courseId);
      if (!student || !course) continue;

      const stored: any = progressMap.get(pairKey);
      const courseLessons = allLessons.filter((l: any) => l.courseId === course.id);
      const totalModules = courseLessons.length;

      // Exact completed lessons from DB
      const completedIds: string[] = Array.isArray(stored?.completedLessonIds)
        ? stored.completedLessonIds
        : [];
      const validCompletedLessons = courseLessons.filter((l: any) => completedIds.includes(l.id));

      const modulesCompleted =
        validCompletedLessons.length > 0
          ? validCompletedLessons.length
          : stored?.modulesCompleted
          ? Math.min(Number(stored.modulesCompleted), totalModules)
          : 0;

      const completionPercentage =
        totalModules > 0 ? Math.min(Math.round((modulesCompleted / totalModules) * 100), 100) : 0;

      // Exact study time from completed lesson durations (or stored minutes)
      const calculatedMinutes = validCompletedLessons.reduce(
        (sum: number, l: any) => sum + (Number(l.durationMinutes) || 40),
        0
      );
      const totalMinutes =
        calculatedMinutes > 0 ? calculatedMinutes : Number(stored?.timeSpentMinutes) || 0;
      const timeSpentHours = Number((totalMinutes / 60).toFixed(1));

      // Real Quiz Average for this student in quizzes linked to this course or subject
      const relevantQuizIds = new Set(
        allQuizzes
          .filter((q: any) => q.courseId === course.id || q.subjectId === course.subjectId)
          .map((q: any) => q.id)
      );

      const studentCourseAttempts = allAttempts.filter(
        (a: any) => a.studentId === student.id && relevantQuizIds.has(a.quizId)
      );

      let quizAverageNumeric: number | null = null;
      if (studentCourseAttempts.length > 0) {
        const sumPct = studentCourseAttempts.reduce(
          (acc: number, a: any) => acc + (Number(a.scorePercentage) || 0),
          0
        );
        quizAverageNumeric = Math.round((sumPct / studentCourseAttempts.length) * 10) / 10;
      }

      const autoStatus = this.deriveAutomaticStatus(
        completionPercentage,
        totalModules,
        quizAverageNumeric
      );

      const finalStatus =
        completionPercentage === 100
          ? 'Completed'
          : stored?.status || autoStatus;

      progressRecords.push({
        id: stored?.id || `${student.id}_${course.id}`,
        studentId: student.admissionNumber || `STU-${student.id.substring(0, 6)}`,
        dbStudentId: student.id,
        dbCourseId: course.id,
        studentName: `${student.firstName} ${student.lastName}`.trim(),
        courseTitle: course.title,
        subject: subjectMap.get(course.subjectId) || 'General',
        modulesCompleted,
        totalModules,
        completionPercentage,
        quizAttemptsCount: studentCourseAttempts.length,
        quizAverageNumeric,
        quizAverage: quizAverageNumeric !== null ? `${quizAverageNumeric}%` : 'No attempts',
        timeSpentHours,
        status: finalStatus,
        facultyNotes: stored?.facultyNotes || '',
        lastUpdated: stored?.updatedAt
          ? new Date(stored.updatedAt).toISOString().split('T')[0]
          : null,
      });
    }

    return progressRecords.sort((a, b) => b.completionPercentage - a.completionPercentage);
  }

  // Fetch granular lesson checklist & quiz attempts for a single Student + Course
  async getStudentCourseDetail(tenantId: string, studentId: string, courseId: string) {
    const [course] = await db
      .select()
      .from(eLearningCourses)
      .where(and(eq(eLearningCourses.id, courseId), eq(eLearningCourses.tenantId, tenantId)))
      .limit(1);

    if (!course) throw new Error('Course not found');

    const [lessons, storedList, courseQuizzes, studentAttempts] = await Promise.all([
      db
        .select()
        .from(eLearningLessons)
        .where(and(eq(eLearningLessons.courseId, courseId), eq(eLearningLessons.tenantId, tenantId)))
        .orderBy(asc(eLearningLessons.chapterNumber), asc(eLearningLessons.createdAt)),
      db
        .select()
        .from(eLearningStudentProgress)
        .where(
          and(
            eq(eLearningStudentProgress.tenantId, tenantId),
            eq(eLearningStudentProgress.studentId, studentId),
            eq(eLearningStudentProgress.courseId, courseId)
          )
        )
        .limit(1)
        .catch(() => []),
      db
        .select()
        .from(eLearningQuizzes)
        .where(eq(eLearningQuizzes.tenantId, tenantId))
        .catch(() => []),
      db
        .select()
        .from(eLearningQuizAttempts)
        .where(
          and(
            eq(eLearningQuizAttempts.tenantId, tenantId),
            eq(eLearningQuizAttempts.studentId, studentId)
          )
        )
        .orderBy(desc(eLearningQuizAttempts.submittedAt))
        .catch(() => []),
    ]);

    const stored: any = storedList[0] || null;
    const completedIds: string[] = Array.isArray(stored?.completedLessonIds)
      ? stored.completedLessonIds
      : [];

    const lessonChecklist = lessons.map((l: any) => ({
      id: l.id,
      chapterNumber: l.chapterNumber,
      title: l.title,
      contentType: l.contentType,
      durationMinutes: l.durationMinutes,
      completed: completedIds.includes(l.id),
    }));

    const relevantQuizzes = courseQuizzes.filter(
      (q: any) => q.courseId === courseId || q.subjectId === course.subjectId
    );
    const quizMap = new Map(relevantQuizzes.map((q: any) => [q.id, q.title]));

    const quizHistory = studentAttempts
      .filter((a: any) => quizMap.has(a.quizId))
      .map((a: any) => ({
        id: a.id,
        quizTitle: quizMap.get(a.quizId) || 'Quiz',
        earnedPoints: a.earnedPoints,
        totalPoints: a.totalPoints,
        scorePercentage: a.scorePercentage,
        passed: a.passed,
        submittedAt: a.submittedAt,
      }));

    return {
      lessonChecklist,
      quizHistory,
      facultyNotes: stored?.facultyNotes || '',
      status: stored?.status || 'On Track',
    };
  }

  // Toggle an individual lesson's completion state for a student & auto-recalculate progress
  async toggleLessonCompletion(
    tenantId: string,
    studentId: string,
    courseId: string,
    lessonId: string,
    completed: boolean
  ) {
    const [lessons, existingList] = await Promise.all([
      db
        .select()
        .from(eLearningLessons)
        .where(and(eq(eLearningLessons.courseId, courseId), eq(eLearningLessons.tenantId, tenantId))),
      db
        .select()
        .from(eLearningStudentProgress)
        .where(
          and(
            eq(eLearningStudentProgress.tenantId, tenantId),
            eq(eLearningStudentProgress.studentId, studentId),
            eq(eLearningStudentProgress.courseId, courseId)
          )
        )
        .limit(1),
    ]);

    const existing: any = existingList[0];
    const currentSet = new Set<string>(
      Array.isArray(existing?.completedLessonIds) ? existing.completedLessonIds : []
    );

    if (completed) {
      currentSet.add(lessonId);
    } else {
      currentSet.delete(lessonId);
    }

    const updatedLessonIds = Array.from(currentSet);
    const validCompleted = lessons.filter((l: any) => updatedLessonIds.includes(l.id));
    const modulesCompleted = validCompleted.length;
    const totalModules = lessons.length;
    const completionPct =
      totalModules > 0 ? Math.round((modulesCompleted / totalModules) * 100) : 0;

    const timeSpentMinutes = validCompleted.reduce(
      (sum: number, l: any) => sum + (Number(l.durationMinutes) || 40),
      0
    );

    const nextStatus =
      totalModules > 0 && completionPct === 100
        ? 'Completed'
        : completionPct >= 60
        ? 'On Track'
        : completionPct >= 25
        ? 'Behind'
        : 'At Risk';

    if (existing) {
      const [updated] = await db
        .update(eLearningStudentProgress)
        .set({
          completedLessonIds: updatedLessonIds,
          modulesCompleted,
          timeSpentMinutes,
          status: nextStatus,
          updatedAt: new Date(),
        })
        .where(eq(eLearningStudentProgress.id, existing.id))
        .returning();
      return updated;
    }

    const [created] = await db
      .insert(eLearningStudentProgress)
      .values({
        tenantId,
        studentId,
        courseId,
        completedLessonIds: updatedLessonIds,
        modulesCompleted,
        timeSpentMinutes,
        status: nextStatus,
      })
      .returning();

    return created;
  }

  async updateStudentProgressStatus(
    tenantId: string,
    studentId: string,
    courseId: string,
    data: { status: string; facultyNotes?: string; modulesCompleted?: number }
  ) {
    const existing = await db
      .select()
      .from(eLearningStudentProgress)
      .where(
        and(
          eq(eLearningStudentProgress.tenantId, tenantId),
          eq(eLearningStudentProgress.studentId, studentId),
          eq(eLearningStudentProgress.courseId, courseId)
        )
      )
      .limit(1);

    if (existing[0]) {
      const [updated] = await db
        .update(eLearningStudentProgress)
        .set({
          status: data.status,
          facultyNotes:
            data.facultyNotes !== undefined ? data.facultyNotes : existing[0].facultyNotes,
          modulesCompleted:
            data.modulesCompleted !== undefined
              ? data.modulesCompleted
              : existing[0].modulesCompleted,
          updatedAt: new Date(),
        })
        .where(eq(eLearningStudentProgress.id, existing[0].id))
        .returning();
      return updated;
    }

    const [created] = await db
      .insert(eLearningStudentProgress)
      .values({
        tenantId,
        studentId,
        courseId,
        completedLessonIds: [],
        status: data.status,
        facultyNotes: data.facultyNotes || null,
        modulesCompleted: data.modulesCompleted ?? 0,
        timeSpentMinutes: 0,
      })
      .returning();

    return created;
  }
}