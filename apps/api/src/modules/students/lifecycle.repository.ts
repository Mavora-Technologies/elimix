// apps/api/src/modules/students/lifecycle.repository.ts
import { and, desc, eq } from 'drizzle-orm';
import { db } from '../../config/db.js';
import { students } from './students.schema.js';
import {
  studentMedicalProfiles,
  studentClinicVisits,
  studentTransfers,
  studentWithdrawals,
} from './lifecycle.schema.js';
import { auditLogs } from '../audit/audit.schema.js';

export class StudentLifecycleRepository {
  // ==========================================
  // MEDICAL PROFILES & CLINIC VISITS
  // ==========================================
  static async findAllMedicalProfiles(tenantId: string) {
    return await db
      .select({
        id: studentMedicalProfiles.id,
        studentId: students.id,
        admissionNumber: students.admissionNumber,
        firstName: students.firstName,
        lastName: students.lastName,
        gender: students.gender,
        bloodGroup: studentMedicalProfiles.bloodGroup,
        allergies: studentMedicalProfiles.allergies,
        chronicConditions: studentMedicalProfiles.chronicConditions,
        currentMedications: studentMedicalProfiles.currentMedications,
        dietaryRestrictions: studentMedicalProfiles.dietaryRestrictions,
        emergencyContactName: studentMedicalProfiles.emergencyContactName,
        emergencyContactPhone: studentMedicalProfiles.emergencyContactPhone,
        insuranceProvider: studentMedicalProfiles.insuranceProvider,
        insurancePolicyNumber: studentMedicalProfiles.insurancePolicyNumber,
        updatedAt: studentMedicalProfiles.updatedAt,
      })
      .from(studentMedicalProfiles)
      .innerJoin(students, eq(studentMedicalProfiles.studentId, students.id))
      .where(eq(studentMedicalProfiles.tenantId, tenantId))
      .orderBy(desc(studentMedicalProfiles.updatedAt));
  }

  static async upsertMedicalProfile(
    tenantId: string,
    actorUserId: string | undefined,
    payload: {
      studentId: string;
      bloodGroup?: string;
      allergies?: string;
      chronicConditions?: string;
      currentMedications?: string;
      dietaryRestrictions?: string;
      emergencyContactName?: string | null;
      emergencyContactPhone?: string | null;
      insuranceProvider?: string | null;
      insurancePolicyNumber?: string | null;
    }
  ) {
    return await db.transaction(async (tx) => {
      const existing = await tx
        .select()
        .from(studentMedicalProfiles)
        .where(
          and(
            eq(studentMedicalProfiles.tenantId, tenantId),
            eq(studentMedicalProfiles.studentId, payload.studentId)
          )
        )
        .limit(1);

      let record;
      if (existing[0]) {
        const [updated] = await tx
          .update(studentMedicalProfiles)
          .set({
            bloodGroup: payload.bloodGroup,
            allergies: payload.allergies,
            chronicConditions: payload.chronicConditions,
            currentMedications: payload.currentMedications,
            dietaryRestrictions: payload.dietaryRestrictions,
            emergencyContactName: payload.emergencyContactName,
            emergencyContactPhone: payload.emergencyContactPhone,
            insuranceProvider: payload.insuranceProvider,
            insurancePolicyNumber: payload.insurancePolicyNumber,
            updatedBy: actorUserId || null,
            updatedAt: new Date(),
          })
          .where(eq(studentMedicalProfiles.id, existing[0].id))
          .returning();
        record = updated;
      } else {
        const [created] = await tx
          .insert(studentMedicalProfiles)
          .values({
            tenantId,
            studentId: payload.studentId,
            bloodGroup: payload.bloodGroup || 'Unknown',
            allergies: payload.allergies || 'None',
            chronicConditions: payload.chronicConditions || 'None',
            currentMedications: payload.currentMedications || 'None',
            dietaryRestrictions: payload.dietaryRestrictions || 'Standard',
            emergencyContactName: payload.emergencyContactName || null,
            emergencyContactPhone: payload.emergencyContactPhone || null,
            insuranceProvider: payload.insuranceProvider || null,
            insurancePolicyNumber: payload.insurancePolicyNumber || null,
            updatedBy: actorUserId || null,
          })
          .returning();
        record = created;
      }

      await tx.insert(auditLogs).values({
        tenantId,
        userId: actorUserId || null,
        action: 'medical.profile.upserted',
        module: 'medical',
        entity: 'student_medical_profile',
        entityId: record.id,
        newValue: payload,
      });

      return record;
    });
  }

  static async findAllClinicVisits(tenantId: string) {
    return await db
      .select({
        id: studentClinicVisits.id,
        studentId: students.id,
        admissionNumber: students.admissionNumber,
        firstName: students.firstName,
        lastName: students.lastName,
        visitDate: studentClinicVisits.visitDate,
        symptoms: studentClinicVisits.symptoms,
        diagnosis: studentClinicVisits.diagnosis,
        treatmentGiven: studentClinicVisits.treatmentGiven,
        medicationPrescribed: studentClinicVisits.medicationPrescribed,
        severity: studentClinicVisits.severity,
        parentNotified: studentClinicVisits.parentNotified,
        attendedBy: studentClinicVisits.attendedBy,
      })
      .from(studentClinicVisits)
      .innerJoin(students, eq(studentClinicVisits.studentId, students.id))
      .where(eq(studentClinicVisits.tenantId, tenantId))
      .orderBy(desc(studentClinicVisits.visitDate));
  }

  static async createClinicVisit(
    tenantId: string,
    actorUserId: string | undefined,
    payload: {
      studentId: string;
      symptoms: string;
      diagnosis?: string | null;
      treatmentGiven: string;
      medicationPrescribed?: string | null;
      severity: string;
      parentNotified: boolean;
      attendedBy: string;
    }
  ) {
    return await db.transaction(async (tx) => {
      const [visit] = await tx
        .insert(studentClinicVisits)
        .values({
          tenantId,
          studentId: payload.studentId,
          symptoms: payload.symptoms,
          diagnosis: payload.diagnosis || null,
          treatmentGiven: payload.treatmentGiven,
          medicationPrescribed: payload.medicationPrescribed || null,
          severity: payload.severity,
          parentNotified: payload.parentNotified,
          attendedBy: payload.attendedBy,
          recordedBy: actorUserId || null,
        })
        .returning();

      await tx.insert(auditLogs).values({
        tenantId,
        userId: actorUserId || null,
        action: 'medical.clinic_visit.created',
        module: 'medical',
        entity: 'student_clinic_visit',
        entityId: visit.id,
        newValue: visit,
      });

      return visit;
    });
  }

  // ==========================================
  // STUDENT TRANSFERS & CLEARANCE WORKFLOW
  // ==========================================
  static async findAllTransfers(tenantId: string) {
    return await db
      .select({
        id: studentTransfers.id,
        studentId: students.id,
        admissionNumber: students.admissionNumber,
        firstName: students.firstName,
        lastName: students.lastName,
        transferType: studentTransfers.transferType,
        destinationSchool: studentTransfers.destinationSchool,
        reason: studentTransfers.reason,
        effectiveDate: studentTransfers.effectiveDate,
        academicCleared: studentTransfers.academicCleared,
        financeCleared: studentTransfers.financeCleared,
        libraryCleared: studentTransfers.libraryCleared,
        boardingCleared: studentTransfers.boardingCleared,
        certificateNumber: studentTransfers.certificateNumber,
        status: studentTransfers.status,
        createdAt: studentTransfers.createdAt,
      })
      .from(studentTransfers)
      .innerJoin(students, eq(studentTransfers.studentId, students.id))
      .where(eq(studentTransfers.tenantId, tenantId))
      .orderBy(desc(studentTransfers.createdAt));
  }

  static async createTransferRequest(
    tenantId: string,
    actorUserId: string | undefined,
    payload: {
      studentId: string;
      transferType: string;
      destinationSchool: string;
      reason: string;
      effectiveDate: string;
    }
  ) {
    return await db.transaction(async (tx) => {
      const certNo = `TC-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
      const [transfer] = await tx
        .insert(studentTransfers)
        .values({
          tenantId,
          studentId: payload.studentId,
          transferType: payload.transferType,
          destinationSchool: payload.destinationSchool,
          reason: payload.reason,
          effectiveDate: payload.effectiveDate,
          certificateNumber: certNo,
          status: 'Pending Clearance',
          requestedBy: actorUserId || null,
        })
        .returning();

      await tx.insert(auditLogs).values({
        tenantId,
        userId: actorUserId || null,
        action: 'student.transfer.requested',
        module: 'students',
        entity: 'student_transfer',
        entityId: transfer.id,
        newValue: transfer,
      });

      return transfer;
    });
  }

  static async updateTransferClearance(
    tenantId: string,
    transferId: string,
    actorUserId: string | undefined,
    payload: {
      academicCleared?: boolean;
      financeCleared?: boolean;
      libraryCleared?: boolean;
      boardingCleared?: boolean;
      status?: string;
    }
  ) {
    return await db.transaction(async (tx) => {
      const [existing] = await tx
        .select()
        .from(studentTransfers)
        .where(and(eq(studentTransfers.id, transferId), eq(studentTransfers.tenantId, tenantId)))
        .limit(1);

      if (!existing) throw new Error('Transfer record not found');

      const nextAcademic = payload.academicCleared ?? existing.academicCleared;
      const nextFinance = payload.financeCleared ?? existing.financeCleared;
      const nextLibrary = payload.libraryCleared ?? existing.libraryCleared;
      const nextBoarding = payload.boardingCleared ?? existing.boardingCleared;

      const allCleared = nextAcademic && nextFinance && nextLibrary && nextBoarding;
      let nextStatus = payload.status || existing.status;
      if (allCleared && nextStatus === 'Pending Clearance') {
        nextStatus = 'Completed';
      }

      const [updated] = await tx
        .update(studentTransfers)
        .set({
          academicCleared: nextAcademic,
          financeCleared: nextFinance,
          libraryCleared: nextLibrary,
          boardingCleared: nextBoarding,
          status: nextStatus,
          approvedBy: allCleared ? actorUserId || null : existing.approvedBy,
          updatedAt: new Date(),
        })
        .where(eq(studentTransfers.id, transferId))
        .returning();

      // If transfer is Completed and Outgoing, update student enrollmentStatus to 'Transferred'
      if (nextStatus === 'Completed' && existing.transferType === 'Outgoing') {
        await tx
          .update(students)
          .set({ enrollmentStatus: 'Transferred', updatedAt: new Date() })
          .where(and(eq(students.id, existing.studentId), eq(students.tenantId, tenantId)));
      }

      await tx.insert(auditLogs).values({
        tenantId,
        userId: actorUserId || null,
        action: 'student.transfer.clearance_updated',
        module: 'students',
        entity: 'student_transfer',
        entityId: transferId,
        oldValue: existing,
        newValue: updated,
      });

      return updated;
    });
  }

  // ==========================================
  // STUDENT WITHDRAWALS
  // ==========================================
  static async findAllWithdrawals(tenantId: string) {
    return await db
      .select({
        id: studentWithdrawals.id,
        studentId: students.id,
        admissionNumber: students.admissionNumber,
        firstName: students.firstName,
        lastName: students.lastName,
        withdrawalDate: studentWithdrawals.withdrawalDate,
        reason: studentWithdrawals.reason,
        detailedNotes: studentWithdrawals.detailedNotes,
        outstandingBalance: studentWithdrawals.outstandingBalance,
        clearanceStatus: studentWithdrawals.clearanceStatus,
        finalStatus: studentWithdrawals.finalStatus,
        createdAt: studentWithdrawals.createdAt,
      })
      .from(studentWithdrawals)
      .innerJoin(students, eq(studentWithdrawals.studentId, students.id))
      .where(eq(studentWithdrawals.tenantId, tenantId))
      .orderBy(desc(studentWithdrawals.createdAt));
  }

  static async createWithdrawal(
    tenantId: string,
    actorUserId: string | undefined,
    payload: {
      studentId: string;
      withdrawalDate: string;
      reason: string;
      detailedNotes?: string | null;
      outstandingBalance: string;
      clearanceStatus: string;
    }
  ) {
    return await db.transaction(async (tx) => {
      const [withdrawal] = await tx
        .insert(studentWithdrawals)
        .values({
          tenantId,
          studentId: payload.studentId,
          withdrawalDate: payload.withdrawalDate,
          reason: payload.reason,
          detailedNotes: payload.detailedNotes || null,
          outstandingBalance: payload.outstandingBalance,
          clearanceStatus: payload.clearanceStatus,
          finalStatus: payload.clearanceStatus === 'Cleared' ? 'Withdrawn' : 'Pending',
          processedBy: actorUserId || null,
        })
        .returning();

      if (withdrawal.finalStatus === 'Withdrawn') {
        await tx
          .update(students)
          .set({ enrollmentStatus: 'Withdrawn', updatedAt: new Date() })
          .where(and(eq(students.id, payload.studentId), eq(students.tenantId, tenantId)));
      }

      await tx.insert(auditLogs).values({
        tenantId,
        userId: actorUserId || null,
        action: 'student.withdrawal.created',
        module: 'students',
        entity: 'student_withdrawal',
        entityId: withdrawal.id,
        newValue: withdrawal,
      });

      return withdrawal;
    });
  }

  static async updateWithdrawalStatus(
    tenantId: string,
    withdrawalId: string,
    actorUserId: string | undefined,
    payload: {
      clearanceStatus?: string;
      finalStatus?: string;
      outstandingBalance?: string;
    }
  ) {
    return await db.transaction(async (tx) => {
      const [existing] = await tx
        .select()
        .from(studentWithdrawals)
        .where(and(eq(studentWithdrawals.id, withdrawalId), eq(studentWithdrawals.tenantId, tenantId)))
        .limit(1);

      if (!existing) throw new Error('Withdrawal record not found');

      const [updated] = await tx
        .update(studentWithdrawals)
        .set({
          ...(payload.clearanceStatus ? { clearanceStatus: payload.clearanceStatus } : {}),
          ...(payload.finalStatus ? { finalStatus: payload.finalStatus } : {}),
          ...(payload.outstandingBalance !== undefined ? { outstandingBalance: payload.outstandingBalance } : {}),
          updatedAt: new Date(),
        })
        .where(eq(studentWithdrawals.id, withdrawalId))
        .returning();

      if (updated.finalStatus === 'Withdrawn' || updated.finalStatus === 'Archived') {
        await tx
          .update(students)
          .set({ enrollmentStatus: 'Withdrawn', updatedAt: new Date() })
          .where(and(eq(students.id, existing.studentId), eq(students.tenantId, tenantId)));
      }

      await tx.insert(auditLogs).values({
        tenantId,
        userId: actorUserId || null,
        action: 'student.withdrawal.updated',
        module: 'students',
        entity: 'student_withdrawal',
        entityId: withdrawalId,
        oldValue: existing,
        newValue: updated,
      });

      return updated;
    });
  }
}