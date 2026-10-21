// apps/api/src/modules/reports/enrollment.service.ts
import { eq, sql, and, gte } from 'drizzle-orm';
import { db } from '../../config/db.js';
import { students } from '../students/students.schema.js';
import { classes, streams } from '../academics/academics.schema.js';

export class EnrollmentReportService {
  static async getEnrollmentAnalytics(tenantId: string, academicYear?: string) {
    const tenantOnly = eq(students.tenantId, tenantId);

    // 1. Fetch all students and classes concurrently
    const [allStudents, allClasses, allStreams] = await Promise.all([
      db.select().from(students).where(tenantOnly),
      db.select().from(classes).where(eq(classes.tenantId, tenantId)).catch(() => []),
      db.select().from(streams).where(eq(streams.tenantId, tenantId)).catch(() => []),
    ]);

    const totalStudents = allStudents.length;

    // 2. Calculate New Admissions (joined in current year / last 90 days)
    const currentYear = new Date().getFullYear();
    const newAdmissions = allStudents.filter((s: any) => {
      if (!s.createdAt) return false;
      return new Date(s.createdAt).getFullYear() === currentYear;
    }).length;

    // 3. Gender Distribution
    let boys = 0;
    let girls = 0;
    allStudents.forEach((s: any) => {
      const g = String(s.gender || '').toLowerCase().trim();
      if (g === 'male' || g === 'm' || g === 'boy') boys++;
      else if (g === 'female' || g === 'f' || g === 'girl') girls++;
    });

    const averageClassSize = allClasses.length > 0 ? Math.round(totalStudents / allClasses.length) : 0;

    // 4. Class-level breakdown
    const classEnrollmentMap = new Map<string, { enrolled: number; boys: number; girls: number }>();
    allStudents.forEach((s: any) => {
      const classId = s.classId || 'unassigned';
      const current = classEnrollmentMap.get(classId) || { enrolled: 0, boys: 0, girls: 0 };
      current.enrolled++;
      const g = String(s.gender || '').toLowerCase().trim();
      if (g === 'male' || g === 'm' || g === 'boy') current.boys++;
      else if (g === 'female' || g === 'f' || g === 'girl') current.girls++;
      classEnrollmentMap.set(classId, current);
    });

    const classDetails = allClasses.map((cls: any) => {
      const stats = classEnrollmentMap.get(cls.id) || { enrolled: 0, boys: 0, girls: 0 };
      const capacity = cls.capacity || 40;
      const vacancies = Math.max(0, capacity - stats.enrolled);
      let status = 'optimal';
      if (stats.enrolled >= capacity) status = 'full';
      else if (stats.enrolled < capacity * 0.6) status = 'under-enrolled';

      return {
        id: cls.id,
        className: cls.name,
        classTeacher: cls.classTeacher || 'Assigned Teacher',
        capacity,
        enrolled: stats.enrolled,
        boys: stats.boys,
        girls: stats.girls,
        vacancies,
        status,
      };
    });

    return {
      stats: {
        totalStudents,
        newAdmissions,
        boysCount: boys,
        girlsCount: girls,
        averageClassSize,
        totalStreams: allStreams.length || allClasses.length,
      },
      classEnrollment: classDetails,
    };
  }
}