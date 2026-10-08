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
    return await db.select({
      id: examResults.id,
      studentId: students.admissionNumber, // Map UI 'studentId' to admission number
      studentFirstName: students.firstName,
      studentLastName: students.lastName,
      examTitle: exams.title,
      subject: subjects.name,
      gradeStream: streams.name,
      marksObtained: examResults.marksObtained,
      totalMarks: examResults.totalMarks,
      grade: examResults.grade,
      status: examResults.status,
    })
    .from(examResults)
    .innerJoin(students, eq(examResults.studentId, students.id))
    .innerJoin(exams, eq(examResults.examId, exams.id))
    .innerJoin(subjects, eq(examResults.subjectId, subjects.id))
    .innerJoin(streams, eq(examResults.streamId, streams.id))
    .where(eq(examResults.tenantId, tenantId))
    .orderBy(desc(examResults.createdAt));
  }

  async createResult(tenantId: string, data: any) {
    const [result] = await db.insert(examResults).values({ ...data, tenantId }).returning();
    return result;
  }

  async updateResult(tenantId: string, id: string, data: any) {
    const [result] = await db.update(examResults).set({ ...data, updatedAt: new Date() })
      .where(and(eq(examResults.id, id), eq(examResults.tenantId, tenantId)))
      .returning();
    return result;
  }

  async deleteResult(tenantId: string, id: string) {
    await db.delete(examResults).where(and(eq(examResults.id, id), eq(examResults.tenantId, tenantId)));
    return true;
  }
}