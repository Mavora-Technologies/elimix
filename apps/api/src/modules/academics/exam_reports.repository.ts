// apps/api/src/modules/academics/exam_reports.repository.ts
import { db } from '../../config/db.js';
import { examReports } from './exam_reports.schema.js';
import { examResults } from './exam_results.schema.js';
import { exams } from './exams.schema.js';
import { academicYears, streams } from './academics.schema.js';
import { subjects } from './subjects.schema.js';
import { students } from '../students/students.schema.js';
import { computeKnecAndCbcGrade } from '../../validators/exam_results.validator.js';
import { eq, and } from 'drizzle-orm';

export class ExamReportsRepository {
  async getAggregatedReports(tenantId: string) {
    const [
      allResults,
      allStudents,
      allExams,
      allSubjects,
      allStreams,
      allAcademicYears,
      storedReports,
    ] = await Promise.all([
      db.select().from(examResults).where(eq(examResults.tenantId, tenantId)).catch(() => []),
      db.select().from(students).where(eq(students.tenantId, tenantId)).catch(() => []),
      db.select().from(exams).where(eq(exams.tenantId, tenantId)).catch(() => []),
      db.select().from(subjects).where(eq(subjects.tenantId, tenantId)).catch(() => []),
      db.select().from(streams).where(eq(streams.tenantId, tenantId)).catch(() => []),
      db.select().from(academicYears).where(eq(academicYears.tenantId, tenantId)).catch(() => []),
      db.select().from(examReports).where(eq(examReports.tenantId, tenantId)).catch(() => []),
    ]);

    const studentMap = new Map(allStudents.map((s: any) => [s.id, s]));
    const examMap = new Map(allExams.map((e: any) => [e.id, e]));
    const subjectMap = new Map(allSubjects.map((sub: any) => [sub.id, sub]));
    const streamMap = new Map(allStreams.map((st: any) => [st.id, st]));
    const yearMap = new Map(allAcademicYears.map((y: any) => [y.id, y.name]));
    const reportOverrideMap = new Map(
      storedReports.map((r: any) => [`${r.studentId}_${r.examId}`, r])
    );

    // Group exam_results by `${studentId}_${examId}`
    const groupedScores = new Map<string, any[]>();
    for (const res of allResults) {
      const key = `${res.studentId}_${res.examId}`;
      if (!groupedScores.has(key)) {
        groupedScores.set(key, []);
      }
      groupedScores.get(key)!.push(res);
    }

    // Also include any explicitly saved exam_reports even if results are still being entered
    for (const rep of storedReports) {
      const key = `${rep.studentId}_${rep.examId}`;
      if (!groupedScores.has(key)) {
        groupedScores.set(key, []);
      }
    }

    const rawTranscripts: any[] = [];

    for (const [key, scoreRows] of groupedScores.entries()) {
      const [studentId, examId] = key.split('_');
      const student: any = studentMap.get(studentId);
      const exam: any = examMap.get(examId);
      if (!student || !exam) continue;

      const override: any = reportOverrideMap.get(key);
      const streamId = scoreRows[0]?.streamId || override?.streamId || '';
      const streamObj: any = streamId ? streamMap.get(streamId) : null;

      // Build detailed subject rows
      const subjectBreakdown = scoreRows.map((row: any) => {
        const sub: any = subjectMap.get(row.subjectId);
        const obtained = Number(row.marksObtained) || 0;
        const max = Number(row.totalMarks) || 100;
        const evalData = computeKnecAndCbcGrade(obtained, max);

        return {
          resultId: row.id,
          subjectId: row.subjectId,
          subjectName: sub?.name || 'Subject',
          subjectCode: sub?.code || 'SUB',
          marksObtained: obtained,
          totalMarks: max,
          percentage: evalData.percentage,
          knecGrade: evalData.knecGrade,
          knecPoints: evalData.knecPoints,
          cbcRubric: evalData.cbcRubric,
          cbcLabel: evalData.cbcLabel,
          remarks: evalData.remarks,
        };
      });

      const subjectsCount = subjectBreakdown.length;
      const totalMarksObtained = subjectBreakdown.reduce((s, r) => s + r.marksObtained, 0);
      const totalMaxMarks = subjectBreakdown.reduce((s, r) => s + r.totalMarks, 0);
      const meanPercentage =
        subjectsCount > 0
          ? Math.round(
              (subjectBreakdown.reduce((s, r) => s + r.percentage, 0) / subjectsCount) * 10
            ) / 10
          : 0;

      const totalKnecPoints = subjectBreakdown.reduce((s, r) => s + r.knecPoints, 0);
      const meanKnecPoints =
        subjectsCount > 0 ? Math.round((totalKnecPoints / subjectsCount) * 100) / 100 : 0;

      const overallEval = computeKnecAndCbcGrade(meanPercentage, 100);

      const defaultTeacherRemark =
        meanPercentage >= 75
          ? 'An outstanding performance across subjects. Keep up the dedication and leadership!'
          : meanPercentage >= 55
          ? 'Good academic progress this term. Put extra effort into subjects below 60%.'
          : 'Requires structured revision and closer follow-up in core subjects next term.';

      const defaultPrincipalRemark =
        meanPercentage >= 75
          ? 'Exemplary academic achievement. Proud of your hard work.'
          : meanPercentage >= 50
          ? 'Satisfactory results. Aim higher next term.'
          : 'Consult with subject teachers for remedial support.';

      rawTranscripts.push({
        id: override?.id || key,
        studentId: student.admissionNumber,
        dbStudentId: student.id,
        studentName: `${student.firstName} ${student.lastName}`.trim(),
        gender: student.gender || 'N/A',
        examId: exam.id,
        examTitle: exam.title,
        term: exam.term,
        academicYearName: yearMap.get(exam.academicYearId) || '2026 Academic Year',
        streamId,
        gradeStream: streamObj?.name || 'All Streams',
        subjectsCount,
        totalMarksObtained: Math.round(totalMarksObtained * 10) / 10,
        totalMaxMarks,
        meanPercentage,
        totalKnecPoints,
        meanKnecPoints,
        meanGrade: overallEval.knecGrade,
        cbcRubric: overallEval.cbcRubric,
        cbcLabel: overallEval.cbcLabel,
        classTeacherRemarks: override?.classTeacherRemarks || defaultTeacherRemark,
        principalRemarks: override?.principalRemarks || defaultPrincipalRemark,
        attendanceDaysPresent: override?.attendanceDaysPresent ?? 62,
        attendanceTotalDays: override?.attendanceTotalDays ?? 65,
        nextTermBegins: override?.nextTermBegins || '2027-01-06',
        status: override?.status || (exam.status === 'Published' ? 'Published' : 'Draft'),
        subjectBreakdown,
      });
    }

    // Compute Stream Rank and Overall Exam Rank per Exam
    const byExam = new Map<string, any[]>();
    for (const item of rawTranscripts) {
      if (!byExam.has(item.examId)) byExam.set(item.examId, []);
      byExam.get(item.examId)!.push(item);
    }

    for (const [, cohort] of byExam.entries()) {
      cohort.sort((a, b) => b.meanPercentage - a.meanPercentage);
      cohort.forEach((studentRep, idx) => {
        studentRep.overallRank = idx + 1;
        studentRep.overallOutOf = cohort.length;
      });

      // Stream-level rank
      const byStream = new Map<string, any[]>();
      for (const item of cohort) {
        const sKey = item.gradeStream || 'Default';
        if (!byStream.has(sKey)) byStream.set(sKey, []);
        byStream.get(sKey)!.push(item);
      }

      for (const [, streamCohort] of byStream.entries()) {
        streamCohort.sort((a, b) => b.meanPercentage - a.meanPercentage);
        streamCohort.forEach((studentRep, idx) => {
          studentRep.streamRank = idx + 1;
          studentRep.streamOutOf = streamCohort.length;
        });
      }
    }

    return rawTranscripts.sort((a, b) => b.meanPercentage - a.meanPercentage);
  }

  async upsertReportEndorsement(tenantId: string, payload: any) {
    const validStreamId =
      payload.streamId && payload.streamId.trim() !== '' ? payload.streamId : null;

    const existing = await db
      .select()
      .from(examReports)
      .where(
        and(
          eq(examReports.tenantId, tenantId),
          eq(examReports.studentId, payload.studentId),
          eq(examReports.examId, payload.examId)
        )
      )
      .limit(1);

    if (existing[0]) {
      const [updated] = await db
        .update(examReports)
        .set({
          streamId: validStreamId || existing[0].streamId,
          classTeacherRemarks: payload.classTeacherRemarks,
          principalRemarks: payload.principalRemarks,
          attendanceDaysPresent: payload.attendanceDaysPresent,
          attendanceTotalDays: payload.attendanceTotalDays,
          nextTermBegins: payload.nextTermBegins,
          status: payload.status,
          updatedAt: new Date(),
        })
        .where(eq(examReports.id, existing[0].id))
        .returning();
      return updated;
    }

    const [created] = await db
      .insert(examReports)
      .values({
        tenantId,
        studentId: payload.studentId,
        examId: payload.examId,
        streamId: validStreamId,
        classTeacherRemarks: payload.classTeacherRemarks || null,
        principalRemarks: payload.principalRemarks || null,
        attendanceDaysPresent: payload.attendanceDaysPresent ?? 62,
        attendanceTotalDays: payload.attendanceTotalDays ?? 65,
        nextTermBegins: payload.nextTermBegins || null,
        status: payload.status || 'Published',
      })
      .returning();

    return created;
  }

  async publishAllForExam(tenantId: string, examId: string) {
    const allReports = await this.getAggregatedReports(tenantId);
    const targetReports = allReports.filter((r) => r.examId === examId);

    for (const rep of targetReports) {
      await this.upsertReportEndorsement(tenantId, {
        studentId: rep.dbStudentId,
        examId: rep.examId,
        streamId: rep.streamId,
        classTeacherRemarks: rep.classTeacherRemarks,
        principalRemarks: rep.principalRemarks,
        attendanceDaysPresent: rep.attendanceDaysPresent,
        attendanceTotalDays: rep.attendanceTotalDays,
        nextTermBegins: rep.nextTermBegins,
        status: 'Published',
      });
    }

    return targetReports.length;
  }
}