// apps/api/src/modules/academics/curriculum.service.ts
import { and, desc, eq } from 'drizzle-orm';
import { db } from '../../config/db.js';
import { academicYears, classes, streams } from './academics.schema.js';
import { subjects, subjectAllocations } from './subjects.schema.js';
import { timetables } from './timetables.schema.js';
import {
  academicTerms,
  curricula,
  cbcStrands,
  cbcSubStrands,
  cbcRubrics,
  cbcLearnerAssessments,
} from './curriculum.schema.js';
import { teachers, departments } from '../teachers/teachers.schema.js';
import { users } from '../auth/auth.schema.js';
import { students } from '../students/students.schema.js';
import { auditLogs } from '../audit/audit.schema.js';

export class Phase3AcademicsService {
  // =========================================================================
  // 1. ACADEMIC STRUCTURE (YEARS, TERMS, CLASSES, STREAMS)
  // =========================================================================
  static async getStructureOverview(tenantId: string) {
    const [yearsList, termsList, classesList, streamsList, studentsList] = await Promise.all([
      db.select().from(academicYears).where(eq(academicYears.tenantId, tenantId)).orderBy(desc(academicYears.startDate)),
      db.select().from(academicTerms).where(eq(academicTerms.tenantId, tenantId)).orderBy(desc(academicTerms.createdAt)).catch(() => []),
      db.select().from(classes).where(eq(classes.tenantId, tenantId)),
      db.select().from(streams).where(eq(streams.tenantId, tenantId)),
      db.select().from(students).where(eq(students.tenantId, tenantId)),
    ]);

    const enrichedClasses = classesList.map((cls: any) => {
      const classStreams = streamsList.filter((s: any) => s.classId === cls.id);
      const enrolledCount = studentsList.filter((st: any) => st.classId === cls.id).length;
      const totalCapacity = classStreams.reduce((sum, s: any) => sum + (s.capacity || 40), 0) || 40;
      return {
        ...cls,
        streams: classStreams,
        enrolledCount,
        totalCapacity,
      };
    });

    return {
      academicYears: yearsList,
      terms: termsList,
      classes: enrichedClasses,
      streams: streamsList,
    };
  }

  static async createAcademicYear(tenantId: string, actorUserId: string | undefined, payload: {
    name: string;
    startDate: string;
    endDate: string;
    isCurrent?: boolean;
  }) {
    return await db.transaction(async (tx) => {
      if (payload.isCurrent) {
        await tx
          .update(academicYears)
          .set({ isActive: false } as any)
          .where(eq(academicYears.tenantId, tenantId));
      }

      const [year] = await tx
        .insert(academicYears)
        .values({
          tenantId,
          name: payload.name,
          startDate: payload.startDate,
          endDate: payload.endDate,
          isActive: payload.isCurrent ?? false,
        } as any)
        .returning();

      await tx.insert(auditLogs).values({
        tenantId,
        userId: actorUserId || null,
        action: 'academic_year.created',
        module: 'academics',
        entity: 'academic_year',
        entityId: year.id,
        newValue: year,
      });

      return year;
    });
  }

  static async createAcademicTerm(tenantId: string, actorUserId: string | undefined, payload: {
    academicYearId: string;
    name: string;
    startDate: string;
    endDate: string;
    isCurrent?: boolean;
  }) {
    return await db.transaction(async (tx) => {
      if (payload.isCurrent) {
        await tx
          .update(academicTerms)
          .set({ isCurrent: false })
          .where(eq(academicTerms.tenantId, tenantId));
      }

      const [term] = await tx
        .insert(academicTerms)
        .values({
          tenantId,
          academicYearId: payload.academicYearId,
          name: payload.name,
          startDate: payload.startDate,
          endDate: payload.endDate,
          isCurrent: payload.isCurrent ?? false,
        } as any)
        .returning();

      await tx.insert(auditLogs).values({
        tenantId,
        userId: actorUserId || null,
        action: 'academic_term.created',
        module: 'academics',
        entity: 'academic_term',
        entityId: term.id,
        newValue: term,
      });

      return term;
    });
  }

  static async createClass(tenantId: string, actorUserId: string | undefined, payload: {
    name: string;
    numericLevel?: number;
  }) {
    const [yearRecord] = await db
      .select()
      .from(academicYears)
      .where(eq(academicYears.tenantId, tenantId))
      .limit(1);

    const [cls] = await db
      .insert(classes)
      .values({
        tenantId,
        name: payload.name.trim(),
        level: payload.numericLevel ?? 1,
        academicYearId: yearRecord?.id || '00000000-0000-0000-0000-000000000000',
      } as any)
      .returning();

    await db.insert(auditLogs).values({
      tenantId,
      userId: actorUserId || null,
      action: 'class.created',
      module: 'academics',
      entity: 'class',
      entityId: cls.id,
      newValue: cls,
    });

    return cls;
  }

  static async createStream(tenantId: string, actorUserId: string | undefined, payload: {
    classId: string;
    name: string;
    capacity?: number;
  }) {
    const [stream] = await db
      .insert(streams)
      .values({
        tenantId,
        classId: payload.classId,
        name: payload.name.trim(),
        capacity: payload.capacity ?? 40,
      } as any)
      .returning();

    await db.insert(auditLogs).values({
      tenantId,
      userId: actorUserId || null,
      action: 'stream.created',
      module: 'academics',
      entity: 'stream',
      entityId: stream.id,
      newValue: stream,
    });

    return stream;
  }

  // =========================================================================
  // 2. CURRICULUM ENGINE (CBC, IGCSE, IB, ACE) & KENYA CBC MODULE
  // =========================================================================
  static async getCurriculumEngineData(tenantId: string) {
    let existingCurricula = await db
      .select()
      .from(curricula)
      .where(eq(curricula.tenantId, tenantId))
      .catch(() => []);

    if (existingCurricula.length === 0) {
      try {
        existingCurricula = await db
          .insert(curricula)
          .values([
            {
              tenantId,
              code: 'CBC',
              name: 'Kenya Competency-Based Curriculum (CBC / KICD)',
              description: 'Competency, Strand, Sub-Strand & 4-Level Descriptive Rubric Framework (EE, ME, AE, BE)',
              gradingModel: 'Rubric-4-Point (EE, ME, AE, BE)',
              gradeBoundaries: [
                { grade: 'EE', label: 'Exceeding Expectations', points: 4, minScore: 80, maxScore: 100 },
                { grade: 'ME', label: 'Meeting Expectations', points: 3, minScore: 60, maxScore: 79 },
                { grade: 'AE', label: 'Approaching Expectations', points: 2, minScore: 40, maxScore: 59 },
                { grade: 'BE', label: 'Below Expectations', points: 1, minScore: 0, maxScore: 39 },
              ],
              isActive: true,
            },
            {
              tenantId,
              code: 'IGCSE',
              name: 'Cambridge International (IGCSE / A-Level)',
              description: 'Cambridge International 8-Point Letter Grading (A* to G and U)',
              gradingModel: 'Letter Grade (A* – G)',
              gradeBoundaries: [
                { grade: 'A*', label: 'Distinction*', points: 8, minScore: 90, maxScore: 100 },
                { grade: 'A', label: 'Distinction', points: 7, minScore: 80, maxScore: 89 },
                { grade: 'B', label: 'Merit', points: 6, minScore: 70, maxScore: 79 },
                { grade: 'C', label: 'Credit', points: 5, minScore: 60, maxScore: 69 },
                { grade: 'D', label: 'Pass', points: 4, minScore: 50, maxScore: 59 },
                { grade: 'E', label: 'Weak Pass', points: 3, minScore: 40, maxScore: 49 },
              ],
              isActive: true,
            },
          ])
          .returning();
      } catch {}
    }

    const [
      strandsList,
      subStrandsList,
      rubricsList,
      assessmentsList,
      subjectsList,
      classesList,
      studentsList,
    ] = await Promise.all([
      db.select().from(cbcStrands).where(eq(cbcStrands.tenantId, tenantId)).catch(() => []),
      db.select().from(cbcSubStrands).where(eq(cbcSubStrands.tenantId, tenantId)).catch(() => []),
      db.select().from(cbcRubrics).where(eq(cbcRubrics.tenantId, tenantId)).catch(() => []),
      db.select().from(cbcLearnerAssessments).where(eq(cbcLearnerAssessments.tenantId, tenantId)).orderBy(desc(cbcLearnerAssessments.assessedAt)).catch(() => []),
      db.select().from(subjects).where(eq(subjects.tenantId, tenantId)).catch(() => []),
      db.select().from(classes).where(eq(classes.tenantId, tenantId)).catch(() => []),
      db.select().from(students).where(eq(students.tenantId, tenantId)).catch(() => []),
    ]);

    const subjectMap = new Map(subjectsList.map((s) => [s.id, s.name]));
    const classMap = new Map(classesList.map((c) => [c.id, c.name]));
    const studentMap = new Map(studentsList.map((st) => [st.id, `${st.firstName} ${st.lastName} (${st.admissionNumber})`]));
    const strandMap = new Map(strandsList.map((st) => [st.id, st.name]));
    const subStrandMap = new Map(subStrandsList.map((ss) => [ss.id, ss]));

    const enrichedStrands = strandsList.map((strand: any) => {
      const children = subStrandsList
        .filter((ss: any) => ss.strandId === strand.id)
        .map((ss: any) => ({
          ...ss,
          rubric: rubricsList.find((r: any) => r.subStrandId === ss.id) || null,
        }));
      return {
        ...strand,
        subjectName: subjectMap.get(strand.subjectId) || 'Learning Area',
        className: strand.classId ? classMap.get(strand.classId) || 'All Grades' : 'All Grades',
        subStrands: children,
      };
    });

    const enrichedAssessments = assessmentsList.map((a: any) => ({
      ...a,
      studentName: studentMap.get(a.studentId) || 'Student',
      subjectName: subjectMap.get(a.subjectId) || 'Learning Area',
      strandName: strandMap.get(a.strandId) || 'Strand',
      subStrandName: subStrandMap.get(a.subStrandId)?.name || 'Sub-Strand',
      coreCompetency: subStrandMap.get(a.subStrandId)?.coreCompetency || 'Competency',
    }));

    return {
      curricula: existingCurricula,
      strands: enrichedStrands,
      assessments: enrichedAssessments,
      subjects: subjectsList,
      classes: classesList,
      students: studentsList,
    };
  }

  static async createCbcStrand(tenantId: string, actorUserId: string | undefined, payload: {
    curriculumId?: string | null;
    subjectId: string;
    classId?: string | null;
    code: string;
    name: string;
    description?: string | null;
  }) {
    const [strand] = await db
      .insert(cbcStrands)
      .values({
        tenantId,
        curriculumId: payload.curriculumId || null,
        subjectId: payload.subjectId,
        classId: payload.classId || null,
        code: payload.code.trim(),
        name: payload.name.trim(),
        description: payload.description || null,
      } as any)
      .returning();

    return strand;
  }

  static async createCbcSubStrand(tenantId: string, actorUserId: string | undefined, payload: {
    strandId: string;
    code: string;
    name: string;
    coreCompetency: string;
    learningOutcomes?: string | null;
    suggestedActivities?: string | null;
    exceedingDescriptor?: string;
    meetingDescriptor?: string;
    approachingDescriptor?: string;
    belowDescriptor?: string;
  }) {
    return await db.transaction(async (tx) => {
      const [subStrand] = await tx
        .insert(cbcSubStrands)
        .values({
          tenantId,
          strandId: payload.strandId,
          code: payload.code.trim(),
          name: payload.name.trim(),
          coreCompetency: payload.coreCompetency.trim(),
          learningOutcomes: payload.learningOutcomes || null,
          suggestedActivities: payload.suggestedActivities || null,
        } as any)
        .returning();

      await tx.insert(cbcRubrics).values({
        tenantId,
        subStrandId: subStrand.id,
        exceedingDescriptor:
          payload.exceedingDescriptor ||
          `Consistently and accurately applies ${payload.name} concepts independently with exceptional proficiency.`,
        meetingDescriptor:
          payload.meetingDescriptor ||
          `Correctly demonstrates ${payload.name} competencies as expected for the grade level.`,
        approachingDescriptor:
          payload.approachingDescriptor ||
          `Demonstrates partial understanding of ${payload.name}; requires occasional teacher scaffolding.`,
        belowDescriptor:
          payload.belowDescriptor ||
          `Experiences difficulty with ${payload.name}; requires targeted remedial support.`,
      } as any);

      return subStrand;
    });
  }

  static async recordCbcAssessment(tenantId: string, actorUserId: string | undefined, payload: {
    studentId: string;
    classId?: string | null;
    subjectId: string;
    strandId: string;
    subStrandId: string;
    assessmentType: string;
    performanceLevel: 'EE' | 'ME' | 'AE' | 'BE';
    teacherObservation: string;
  }) {
    const pointsMap: Record<'EE' | 'ME' | 'AE' | 'BE', number> = {
      EE: 4,
      ME: 3,
      AE: 2,
      BE: 1,
    };

    const [assessment] = await db
      .insert(cbcLearnerAssessments)
      .values({
        tenantId,
        studentId: payload.studentId,
        classId: payload.classId || null,
        subjectId: payload.subjectId,
        strandId: payload.strandId,
        subStrandId: payload.subStrandId,
        assessmentType: payload.assessmentType,
        performanceLevel: payload.performanceLevel,
        rubricPoints: pointsMap[payload.performanceLevel] || 3,
        teacherObservation: payload.teacherObservation.trim(),
        assessedBy: actorUserId || null,
      } as any)
      .returning();

    return assessment;
  }

  // =========================================================================
  // 3. TEACHER ALLOCATION & WORKLOAD ENGINE (Blueprint Section 21)
  // =========================================================================
  static async getTeacherAllocationsAndWorkload(tenantId: string) {
    const [
      allocationsList,
      teachersList,
      usersList,
      deptsList,
      subjectsList,
      classesList,
      streamsList,
      yearsList,
      timetableSlots,
    ] = await Promise.all([
      db.select().from(subjectAllocations).where(eq(subjectAllocations.tenantId, tenantId)).catch(() => []),
      db.select().from(teachers).where(eq(teachers.tenantId, tenantId)).catch(() => []),
      db.select().from(users).where(eq(users.tenantId, tenantId)).catch(() => []),
      db.select().from(departments).where(eq(departments.tenantId, tenantId)).catch(() => []),
      db.select().from(subjects).where(eq(subjects.tenantId, tenantId)).catch(() => []),
      db.select().from(classes).where(eq(classes.tenantId, tenantId)).catch(() => []),
      db.select().from(streams).where(eq(streams.tenantId, tenantId)).catch(() => []),
      db.select().from(academicYears).where(eq(academicYears.tenantId, tenantId)).catch(() => []),
      db.select().from(timetables).where(eq(timetables.tenantId, tenantId)).catch(() => []),
    ]);

    const userMap = new Map(usersList.map((u: any) => [u.id, u]));
    const deptMap = new Map(deptsList.map((d: any) => [d.id, d.name]));
    const subjectMap = new Map(subjectsList.map((s: any) => [s.id, s]));
    const classMap = new Map(classesList.map((c: any) => [c.id, c.name]));
    const streamMap = new Map(streamsList.map((s: any) => [s.id, s.name]));
    const yearMap = new Map(yearsList.map((y: any) => [y.id, y.name]));

    const enrichedTeachers = teachersList.map((t: any) => {
      const u = userMap.get(t.userId);
      const identifier = t.employeeNumber || 'Staff';
      const fullName = u ? `${u.firstName} ${u.lastName}`.trim() : `Teacher (${identifier})`;
      const myAllocations = allocationsList.filter((a: any) => a.teacherId === t.id);
      const scheduledLessons = timetableSlots.filter((slot: any) => slot.teacherId === t.id).length;
      const estimatedPeriods = scheduledLessons > 0 ? scheduledLessons : myAllocations.length * 5;

      return {
        id: t.id,
        staffNumber: identifier,
        fullName,
        email: u?.email || '',
        specialization: t.qualifications || 'General Education',
        departmentName: t.departmentId ? deptMap.get(t.departmentId) || 'General' : 'General',
        allocatedSubjectsCount: myAllocations.length,
        weeklyPeriods: estimatedPeriods,
        maxRecommendedPeriods: 30,
        workloadStatus:
          estimatedPeriods > 30
            ? 'Overloaded'
            : estimatedPeriods >= 18
            ? 'Optimal'
            : 'Under-utilized',
      };
    });

    const teacherNameMap = new Map(enrichedTeachers.map((t) => [t.id, t]));

    const enrichedAllocations = allocationsList.map((alloc: any) => {
      const tInfo = teacherNameMap.get(alloc.teacherId);
      const subInfo = subjectMap.get(alloc.subjectId);
      const streamIdVal = alloc.streamId || '';
      return {
        id: alloc.id,
        teacherId: alloc.teacherId,
        teacherName: tInfo?.fullName || 'Assigned Teacher',
        staffNumber: tInfo?.staffNumber || '',
        departmentName: tInfo?.departmentName || 'General',
        subjectId: alloc.subjectId,
        subjectName: subInfo?.name || 'Subject',
        subjectCode: subInfo?.code || '',
        classId: '',
        className: 'Class Assigned',
        streamId: streamIdVal,
        streamName: streamIdVal ? streamMap.get(streamIdVal) || 'Stream' : 'All Streams',
        academicYearId: '',
        academicYearName: 'Current Year',
      };
    });

    return {
      allocations: enrichedAllocations,
      teacherWorkloads: enrichedTeachers,
      subjects: subjectsList,
      classes: classesList,
      streams: streamsList,
      academicYears: yearsList,
    };
  }

  static async createTeacherAllocation(tenantId: string, actorUserId: string | undefined, payload: {
    teacherId: string;
    subjectId: string;
    classId: string;
    streamId?: string | null;
    academicYearId: string;
  }) {
    const existing = await db
      .select()
      .from(subjectAllocations)
      .where(
        and(
          eq(subjectAllocations.tenantId, tenantId),
          eq(subjectAllocations.subjectId, payload.subjectId),
          eq(subjectAllocations.teacherId, payload.teacherId)
        )
      );

    if (existing.length > 0) {
      throw new Error('This teacher is already allocated to this subject.');
    }

    // Only include stream_id if a valid non-empty UUID is provided
    const validStreamId = payload.streamId && payload.streamId !== '' ? payload.streamId : null;

    const [created] = await db
      .insert(subjectAllocations)
      .values({
        tenantId,
        teacherId: payload.teacherId,
        subjectId: payload.subjectId,
        ...(validStreamId ? { streamId: validStreamId } : {}),
      } as any)
      .returning();

    await db.insert(auditLogs).values({
      tenantId,
      userId: actorUserId || null,
      action: 'teacher.allocation.created',
      module: 'academics',
      entity: 'subject_allocation',
      entityId: created.id,
      newValue: created,
    });

    return created;
  }

  static async deleteTeacherAllocation(tenantId: string, allocationId: string, actorUserId?: string) {
    const [deleted] = await db
      .delete(subjectAllocations)
      .where(and(eq(subjectAllocations.id, allocationId), eq(subjectAllocations.tenantId, tenantId)))
      .returning();

    if (deleted) {
      await db.insert(auditLogs).values({
        tenantId,
        userId: actorUserId || null,
        action: 'teacher.allocation.deleted',
        module: 'academics',
        entity: 'subject_allocation',
        entityId: allocationId,
        oldValue: deleted,
      });
    }

    return deleted;
  }
}