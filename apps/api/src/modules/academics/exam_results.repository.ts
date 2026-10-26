// apps/api/src/modules/academics/exam_results.repository.ts
import { db } from '../../config/db.js';
import { examResults } from './exam_results.schema.js';
import { exams } from './exams.schema.js';
import { subjects } from './subjects.schema.js';
import { streams } from './academics.schema.js';
import { students } from '../students/students.schema.js';
import { eq, and, desc } from 'drizzle-orm';

export class ExamResultsRepository {
  async getResults(tenantId: string) {
    return await db
      .select({
        id: examResults.id,
        dbStudentId: examResults.studentId,
        studentId: students.admissionNumber,
        studentFirstName: students.firstName,
        studentLastName: students.lastName,
        examId: examResults.examId,
        examTitle: exams.title,
        examTerm: exams.term,
        subjectId: examResults.subjectId,
        subject: subjects.name,
        subjectCode: subjects.code,
        streamId: examResults.streamId,
        gradeStream: streams.name,
        marksObtained: examResults.marksObtained,
        totalMarks: examResults.totalMarks,
        grade: examResults.grade,
        status: examResults.status,
        createdAt: examResults.createdAt,
      })
      .from(examResults)
      .innerJoin(students, eq(examResults.studentId, students.id))
      .innerJoin(exams, eq(examResults.examId, exams.id))
      .innerJoin(subjects, eq(examResults.subjectId, subjects.id))
      .innerJoin(streams, eq(examResults.streamId, streams.id))
      .where(eq(examResults.tenantId, tenantId))
      .orderBy(desc(examResults.createdAt));
  }

  async createOrUpsertResult(
    tenantId: string,
    data: {
      studentId: string;
      examId: string;
      subjectId: string;
      streamId: string;
      marksObtained: number;
      totalMarks: number;
      grade: string;
      status: string;
    }
  ) {
    // Check if this student already has a score for this exam + subject
    const existing = await db
      .select()
      .from(examResults)
      .where(
        and(
          eq(examResults.tenantId, tenantId),
          eq(examResults.studentId, data.studentId),
          eq(examResults.examId, data.examId),
          eq(examResults.subjectId, data.subjectId)
        )
      )
      .limit(1);

    if (existing[0]) {
      const [updated] = await db
        .update(examResults)
        .set({
          streamId: data.streamId,
          marksObtained: String(data.marksObtained),
          totalMarks: String(data.totalMarks),
          grade: data.grade,
          status: data.status,
          updatedAt: new Date(),
        })
        .where(eq(examResults.id, existing[0].id))
        .returning();
      return updated;
    }

    const [created] = await db
      .insert(examResults)
      .values({
        tenantId,
        studentId: data.studentId,
        examId: data.examId,
        subjectId: data.subjectId,
        streamId: data.streamId,
        marksObtained: String(data.marksObtained),
        totalMarks: String(data.totalMarks),
        grade: data.grade,
        status: data.status,
      })
      .returning();

    return created;
  }

  async updateResult(
    tenantId: string,
    id: string,
    data: {
      studentId: string;
      examId: string;
      subjectId: string;
      streamId: string;
      marksObtained: number;
      totalMarks: number;
      grade: string;
      status: string;
    }
  ) {
    const [result] = await db
      .update(examResults)
      .set({
        studentId: data.studentId,
        examId: data.examId,
        subjectId: data.subjectId,
        streamId: data.streamId,
        marksObtained: String(data.marksObtained),
        totalMarks: String(data.totalMarks),
        grade: data.grade,
        status: data.status,
        updatedAt: new Date(),
      })
      .where(and(eq(examResults.id, id), eq(examResults.tenantId, tenantId)))
      .returning();

    return result;
  }

  async deleteResult(tenantId: string, id: string) {
    await db
      .delete(examResults)
      .where(and(eq(examResults.id, id), eq(examResults.tenantId, tenantId)));
    return true;
  }
}