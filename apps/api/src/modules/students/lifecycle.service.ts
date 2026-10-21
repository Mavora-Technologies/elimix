// apps/api/src/modules/students/lifecycle.service.ts
import { StudentLifecycleRepository } from './lifecycle.repository.js';

export class StudentLifecycleService {
  // Medical
  static async getMedicalOverview(tenantId: string) {
    const [profiles, visits] = await Promise.all([
      StudentLifecycleRepository.findAllMedicalProfiles(tenantId),
      StudentLifecycleRepository.findAllClinicVisits(tenantId),
    ]);

    return {
      profiles: profiles.map((p) => ({
        ...p,
        studentName: `${p.firstName} ${p.lastName}`.trim(),
      })),
      visits: visits.map((v) => ({
        ...v,
        studentName: `${v.firstName} ${v.lastName}`.trim(),
      })),
    };
  }

  static async saveMedicalProfile(tenantId: string, actorUserId: string | undefined, data: any) {
    return await StudentLifecycleRepository.upsertMedicalProfile(tenantId, actorUserId, data);
  }

  static async logClinicVisit(tenantId: string, actorUserId: string | undefined, data: any) {
    return await StudentLifecycleRepository.createClinicVisit(tenantId, actorUserId, data);
  }

  // Transfers
  static async getTransfers(tenantId: string) {
    const rows = await StudentLifecycleRepository.findAllTransfers(tenantId);
    return rows.map((r) => ({
      ...r,
      studentName: `${r.firstName} ${r.lastName}`.trim(),
    }));
  }

  static async initiateTransfer(tenantId: string, actorUserId: string | undefined, data: any) {
    return await StudentLifecycleRepository.createTransferRequest(tenantId, actorUserId, data);
  }

  static async updateTransferClearance(
    tenantId: string,
    transferId: string,
    actorUserId: string | undefined,
    data: any
  ) {
    return await StudentLifecycleRepository.updateTransferClearance(tenantId, transferId, actorUserId, data);
  }

  // Withdrawals
  static async getWithdrawals(tenantId: string) {
    const rows = await StudentLifecycleRepository.findAllWithdrawals(tenantId);
    return rows.map((r) => ({
      ...r,
      studentName: `${r.firstName} ${r.lastName}`.trim(),
    }));
  }

  static async initiateWithdrawal(tenantId: string, actorUserId: string | undefined, data: any) {
    return await StudentLifecycleRepository.createWithdrawal(tenantId, actorUserId, {
      ...data,
      outstandingBalance: String(data.outstandingBalance ?? '0.00'),
    });
  }

  static async updateWithdrawal(
    tenantId: string,
    withdrawalId: string,
    actorUserId: string | undefined,
    data: any
  ) {
    return await StudentLifecycleRepository.updateWithdrawalStatus(tenantId, withdrawalId, actorUserId, {
      ...data,
      ...(data.outstandingBalance !== undefined ? { outstandingBalance: String(data.outstandingBalance) } : {}),
    });
  }
}