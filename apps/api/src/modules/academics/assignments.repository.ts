// apps/api/src/modules/academics/assignments.repository.ts
import { db } from '../../config/db.js';
import { assignments, assignmentSubmissions } from './assignments.schema.js';
import { subjects } from './subjects.schema.js';
import { streams, classes } from './academics.schema.js';
import { teachers } from '../teachers/teachers.schema.js';
import { users } from '../auth/auth.schema.js';
import { students } from '../students/students.schema.js';
import { eq, and, desc } from 'drizzle-orm';

export class AssignmentsRepository {
  async getAssignments(tenantId: string) {
    const [records, allSubmissions, allStudents] = await Promise.all([
      db
        .select({
          id: assignments.id,
          title: assignments.title,
          instructions: assignments.instructions,
          dueDate: assignments.dueDate,
          status: assignments.status,
          subjectId: assignments.subjectId,
          subjectName: subjects.name,
          streamId: assignments.streamId,
          streamName: streams.name,
          classId: streams.classId,
          streamCapacity: streams.capacity,
          teacherId: assignments.teacherId,
          teacherFirstName: users.firstName,
          teacherLastName: users.lastName,
        })
        .from(assignments)
        .innerJoin(subjects, eq(assignments.subjectId, subjects.id))
        .innerJoin(streams, eq(assignments.streamId, streams.id))
        .innerJoin(teachers, eq(assignments.teacherId, teachers.id))
        .innerJoin(users, eq(teachers.userId, users.id))
        .where(eq(assignments.tenantId, tenantId))
        .orderBy(desc(assignments.createdAt)),
      db.select().from(assignmentSubmissions).where(eq(assignmentSubmissions.tenantId, tenantId)).catch(() => []),
      db.select().from(students).where(eq(students.tenantId, tenantId)).catch(() => []),
    ]);

    return records.map((r) => {
      const subs = allSubmissions.filter(
        (s: any) => s.assignmentId === r.id && s.submissionStatus !== 'Pending'
      );
      const graded = allSubmissions.filter(
        (s: any) => s.assignmentId === r.id && s.submissionStatus === 'Graded'
      );
      const streamStudents = allStudents.filter(
        (st: any) => st.streamId === r.streamId || st.classId === r.classId
      );
      const totalTarget = streamStudents.length > 0 ? streamStudents.length : r.streamCapacity || 40;

      return {
        ...r,
        submittedCount: subs.length,
        gradedCount: graded.length,
        totalStudentsCount: totalTarget,
      };
    });
  }

  async createAssignment(tenantId: string, data: any) {
    const [assignment] = await db.insert(assignments).values({ ...data, tenantId }).returning();
    return assignment;
  }

  async updateAssignment(tenantId: string, id: string, data: any) {
    const [assignment] = await db
      .update(assignments)
      .set({ ...data, updatedAt: new Date() })
      .where(and(eq(assignments.id, id), eq(assignments.tenantId, tenantId)))
      .returning();
    return assignment;
  }

  async updateStatus(tenantId: string, id: string, status: string) {
    const [assignment] = await db
      .update(assignments)
      .set({ status, updatedAt: new Date() })
      .where(and(eq(assignments.id, id), eq(assignments.tenantId, tenantId)))
      .returning();
    return assignment;
  }

  async deleteAssignment(tenantId: string, id: string) {
    await db
      .delete(assignments)
      .where(and(eq(assignments.id, id), eq(assignments.tenantId, tenantId)));
    return true;
  }

  async getSubmissionsForAssignment(tenantId: string, assignmentId: string) {
    const [asn] = await db
      .select()
      .from(assignments)
      .where(and(eq(assignments.id, assignmentId), eq(assignments.tenantId, tenantId)))
      .limit(1);

    if (!asn) throw new Error('Assignment not found');

    const [streamRecord] = await db
      .select()
      .from(streams)
      .where(eq(streams.id, asn.streamId))
      .limit(1);

    const [allStudents, existingSubs] = await Promise.all([
      db.select().from(students).where(eq(students.tenantId, tenantId)),
      db
        .select()
        .from(assignmentSubmissions)
        .where(
          and(
            eq(assignmentSubmissions.tenantId, tenantId),
            eq(assignmentSubmissions.assignmentId, assignmentId)
          )
        )
        .catch(() => []),
    ]);

    // Filter students belonging to this stream or parent class; fallback to all tenant students if none assigned yet
    let roster = allStudents.filter(
      (s: any) =>
        s.streamId === asn.streamId || (streamRecord && s.classId === streamRecord.classId)
    );
    if (roster.length === 0) roster = allStudents;

    const subMap = new Map(existingSubs.map((sub: any) => [sub.studentId, sub]));

    return roster.map((stu: any) => {
      const sub = subMap.get(stu.id);
      return {
        studentId: stu.id,
        admissionNumber: stu.admissionNumber,
        studentName: `${stu.firstName} ${stu.lastName}`.trim(),
        submissionId: sub?.id || null,
        submissionStatus: sub?.submissionStatus || 'Pending',
        score: sub?.score ?? null,
        remarks: sub?.remarks || '',
        submittedAt: sub?.submittedAt ? new Date(sub.submittedAt).toLocaleDateString() : '-',
      };
    });
  }

  async upsertSubmission(
    tenantId: string,
    assignmentId: string,
    payload: {
      studentId: string;
      submissionStatus: string;
      score?: number | null;
      remarks?: string | null;
    }
  ) {
    const existing = await db
      .select()
      .from(assignmentSubmissions)
      .where(
        and(
          eq(assignmentSubmissions.tenantId, tenantId),
          eq(assignmentSubmissions.assignmentId, assignmentId),
          eq(assignmentSubmissions.studentId, payload.studentId)
        )
      )
      .limit(1);

    if (existing[0]) {
      const [updated] = await db
        .update(assignmentSubmissions)
        .set({
          submissionStatus: payload.submissionStatus,
          score: payload.score ?? existing[0].score,
          remarks: payload.remarks ?? existing[0].remarks,
          gradedAt: payload.submissionStatus === 'Graded' ? new Date() : existing[0].gradedAt,
        })
        .where(eq(assignmentSubmissions.id, existing[0].id))
        .returning();
      return updated;
    }

    const [created] = await db
      .insert(assignmentSubmissions)
      .values({
        tenantId,
        assignmentId,
        studentId: payload.studentId,
        submissionStatus: payload.submissionStatus,
        score: payload.score ?? null,
        remarks: payload.remarks || null,
        gradedAt: payload.submissionStatus === 'Graded' ? new Date() : null,
      })
      .returning();

    return created;
  }
}