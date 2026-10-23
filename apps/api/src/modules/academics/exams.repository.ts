// apps/api/src/modules/academics/exams.repository.ts
import { db } from '../../config/db.js';
import { exams, examPapers } from './exams.schema.js';
import { academicYears } from './academics.schema.js';
import { subjects } from './subjects.schema.js';
import { eq, and, desc, asc } from 'drizzle-orm';

export class ExamsRepository {
  async getAcademicYears(tenantId: string) {
    let years = await db
      .select()
      .from(academicYears)
      .where(eq(academicYears.tenantId, tenantId))
      .orderBy(desc(academicYears.startDate));

    // Auto-seed current Academic Year if none exists for this tenant yet
    if (years.length === 0) {
      const currentYear = new Date().getFullYear();
      const [seeded] = await db
        .insert(academicYears)
        .values({
          tenantId,
          name: `${currentYear} Academic Year`,
          startDate: `${currentYear}-01-05`,
          endDate: `${currentYear}-11-20`,
          isActive: true,
        })
        .returning();
      years = [seeded];
    }

    return years;
  }

  async getExams(tenantId: string) {
    // Ensure at least one academic year exists
    await this.getAcademicYears(tenantId);

    const [examRecords, allPapers] = await Promise.all([
      db
        .select({
          id: exams.id,
          title: exams.title,
          term: exams.term,
          startDate: exams.startDate,
          endDate: exams.endDate,
          status: exams.status,
          academicYearId: exams.academicYearId,
          academicYearName: academicYears.name,
        })
        .from(exams)
        .innerJoin(academicYears, eq(exams.academicYearId, academicYears.id))
        .where(eq(exams.tenantId, tenantId))
        .orderBy(desc(exams.startDate)),
      db
        .select()
        .from(examPapers)
        .where(eq(examPapers.tenantId, tenantId))
        .catch(() => []),
    ]);

    return examRecords.map((exam) => {
      const papers = allPapers.filter((p: any) => p.examId === exam.id);
      return {
        ...exam,
        papersCount: papers.length,
      };
    });
  }

  async getExamById(tenantId: string, examId: string) {
    const [exam] = await db
      .select({
        id: exams.id,
        title: exams.title,
        term: exams.term,
        startDate: exams.startDate,
        endDate: exams.endDate,
        status: exams.status,
        academicYearId: exams.academicYearId,
        academicYearName: academicYears.name,
      })
      .from(exams)
      .innerJoin(academicYears, eq(exams.academicYearId, academicYears.id))
      .where(and(eq(exams.id, examId), eq(exams.tenantId, tenantId)))
      .limit(1);

    return exam || null;
  }

  async createExam(tenantId: string, data: any) {
    const [exam] = await db
      .insert(exams)
      .values({ ...data, tenantId })
      .returning();
    return exam;
  }

  async updateExam(tenantId: string, id: string, data: any) {
    const [exam] = await db
      .update(exams)
      .set({ ...data, updatedAt: new Date() })
      .where(and(eq(exams.id, id), eq(exams.tenantId, tenantId)))
      .returning();
    return exam;
  }

  async updateStatus(tenantId: string, id: string, status: string) {
    const [exam] = await db
      .update(exams)
      .set({ status, updatedAt: new Date() })
      .where(and(eq(exams.id, id), eq(exams.tenantId, tenantId)))
      .returning();
    return exam;
  }

  async deleteExam(tenantId: string, id: string) {
    await db
      .delete(exams)
      .where(and(eq(exams.id, id), eq(exams.tenantId, tenantId)));
    return true;
  }

  // --- EXAM SUBJECT PAPERS ---
  async getExamPapers(tenantId: string, examId: string) {
    return await db
      .select({
        id: examPapers.id,
        examId: examPapers.examId,
        subjectId: examPapers.subjectId,
        subjectName: subjects.name,
        subjectCode: subjects.code,
        paperCode: examPapers.paperCode,
        paperDate: examPapers.paperDate,
        startTime: examPapers.startTime,
        durationMinutes: examPapers.durationMinutes,
        maxMarks: examPapers.maxMarks,
        room: examPapers.room,
      })
      .from(examPapers)
      .innerJoin(subjects, eq(examPapers.subjectId, subjects.id))
      .where(and(eq(examPapers.tenantId, tenantId), eq(examPapers.examId, examId)))
      .orderBy(asc(examPapers.paperDate), asc(examPapers.startTime));
  }

  async createExamPaper(tenantId: string, examId: string, data: any) {
    const [paper] = await db
      .insert(examPapers)
      .values({
        tenantId,
        examId,
        subjectId: data.subjectId,
        paperCode: data.paperCode || 'Paper 1',
        paperDate: data.paperDate,
        startTime: data.startTime || '08:30',
        durationMinutes: data.durationMinutes || 120,
        maxMarks: data.maxMarks || 100,
        room: data.room || 'Main Hall',
      })
      .returning();
    return paper;
  }

  async deleteExamPaper(tenantId: string, examId: string, paperId: string) {
    await db
      .delete(examPapers)
      .where(
        and(
          eq(examPapers.id, paperId),
          eq(examPapers.examId, examId),
          eq(examPapers.tenantId, tenantId)
        )
      );
    return true;
  }
}