// apps/api/src/modules/parents/parents.service.ts
import bcrypt from 'bcryptjs';
import { and, desc, eq } from 'drizzle-orm';
import { db } from '../../config/db.js';
import { ParentsRepository } from './parents.repository.js';
import { parentNotifications } from './notifications.schema.js';

export class ParentsService {
  static async getAllParents(tenantId: string) {
    const parentRows = await ParentsRepository.findAllParentsByTenant(tenantId);
    if (parentRows.length === 0) return [];

    const parentIds = parentRows.map((p) => p.parentId);
    const links = await ParentsRepository.findLinkedChildrenByParentIds(tenantId, parentIds);

    const childrenByParent = new Map<string, typeof links>();
    for (const link of links) {
      const existing = childrenByParent.get(link.parentId) || [];
      existing.push(link);
      childrenByParent.set(link.parentId, existing);
    }

    return parentRows.map((row) => {
      const linked = childrenByParent.get(row.parentId) || [];
      return {
        id: row.parentId,
        userId: row.userId,
        firstName: row.firstName,
        lastName: row.lastName,
        fullName: `${row.firstName} ${row.lastName}`.trim(),
        email: row.email,
        phone: row.phone || '',
        relationship: row.relationship,
        occupation: row.occupation || '',
        familyId: row.familyId,
        familyName: row.familyName || `${row.lastName} Family`,
        emergencyContact: row.emergencyContact || row.phone || '',
        portalStatus: row.isActive ? 'Active' : 'Disabled',
        createdAt: row.createdAt,
        linkedChildren: linked.map((c) => ({
          id: c.studentId,
          admissionNumber: c.admissionNumber,
          name: `${c.firstName} ${c.lastName}`.trim(),
          classGrade: c.enrollmentStatus || 'Enrolled',
          gender: c.gender,
          isPrimaryContact: c.isPrimaryContact,
          financialResponsibility: c.financialResponsibility,
        })),
      };
    });
  }

  static async getFamilies(tenantId: string) {
    return await ParentsRepository.findFamiliesByTenant(tenantId);
  }

  static async getPortalAccessLogs(tenantId: string) {
    return await ParentsRepository.findAccessLogsByTenant(tenantId);
  }

  static async createParent(
    tenantId: string,
    actorUserId: string | undefined,
    payload: {
      firstName: string;
      lastName: string;
      email: string;
      phone: string;
      relationship: string;
      occupation?: string | null;
      familyId?: string | null;
      familyName?: string | null;
      emergencyContact?: string | null;
      studentIds?: string[];
      isPrimaryContact?: boolean;
      financialResponsibility?: boolean;
      portalActive?: boolean;
    },
    ipAddress?: string
  ) {
    const defaultPasswordHash = await bcrypt.hash('Parent@1234', 10);

    return await ParentsRepository.createParentTransaction({
      tenantId,
      actorUserId,
      ipAddress,
      firstName: payload.firstName.trim(),
      lastName: payload.lastName.trim(),
      email: payload.email.toLowerCase().trim(),
      passwordHash: defaultPasswordHash,
      phone: payload.phone.trim(),
      relationship: payload.relationship,
      occupation: payload.occupation || null,
      familyId: payload.familyId || null,
      familyName: payload.familyName?.trim() || `${payload.lastName.trim()} Family`,
      emergencyContact: payload.emergencyContact?.trim() || payload.phone.trim(),
      studentIds: payload.studentIds || [],
      isPrimaryContact: payload.isPrimaryContact ?? true,
      financialResponsibility: payload.financialResponsibility ?? true,
      portalActive: payload.portalActive ?? true,
    });
  }

  static async updateParent(
    tenantId: string,
    parentId: string,
    actorUserId: string | undefined,
    payload: {
      firstName?: string;
      lastName?: string;
      email?: string;
      phone?: string;
      relationship?: string;
      occupation?: string | null;
      portalActive?: boolean;
      studentIds?: string[];
    },
    ipAddress?: string
  ) {
    return await ParentsRepository.updateParentTransaction({
      tenantId,
      parentId,
      actorUserId,
      ipAddress,
      firstName: payload.firstName?.trim(),
      lastName: payload.lastName?.trim(),
      email: payload.email?.toLowerCase().trim(),
      phone: payload.phone?.trim(),
      relationship: payload.relationship,
      occupation: payload.occupation,
      portalActive: payload.portalActive,
      studentIds: payload.studentIds,
    });
  }

  static async deleteParent(tenantId: string, parentId: string, actorUserId?: string, ipAddress?: string) {
    return await ParentsRepository.deleteParentTransaction(tenantId, parentId, actorUserId, ipAddress);
  }

  static async getLinkedChildren(tenantId: string) {
    const rawLinks = await ParentsRepository.findAllLinkagesByTenant(tenantId);
    return rawLinks.map((row, index) => ({
      id: `LNK-${String(index + 1).padStart(3, '0')}`,
      studentId: row.studentId,
      studentName: `${row.studentFirstName} ${row.studentLastName}`.trim(),
      admissionNo: row.admissionNumber,
      classGrade: row.enrollmentStatus || 'Enrolled',
      guardianName: `${row.userFirstName} ${row.userLastName}`.trim(),
      guardianEmail: row.userEmail,
      guardianPhone: row.userPhone || '',
      relationship: row.parentRelationship,
      isPrimaryContact: row.isPrimaryContact ?? true,
    }));
  }

  static async getNotifications(tenantId: string) {
    const list = await db
      .select()
      .from(parentNotifications)
      .where(eq(parentNotifications.tenantId, tenantId))
      .orderBy(desc(parentNotifications.createdAt));

    return list.map((n) => ({
      id: `NOT-${n.id.slice(0, 6).toUpperCase()}`,
      uuid: n.id,
      subject: n.subject,
      targetAudience: n.targetAudience,
      channel: n.channel,
      sentDate: n.createdAt ? new Date(n.createdAt).toLocaleString() : 'Just now',
      recipientsCount: n.recipientsCount,
      status: n.status,
    }));
  }

  static async sendBroadcast(tenantId: string, actorUserId: string | undefined, payload: {
    subject: string;
    targetAudience: string;
    channel: string;
    content: string;
  }) {
    const [inserted] = await db
      .insert(parentNotifications)
      .values({
        tenantId,
        subject: payload.subject,
        targetAudience: payload.targetAudience,
        channel: payload.channel,
        content: payload.content,
        recipientsCount: 764,
        status: 'Delivered',
        sentById: actorUserId || null,
      })
      .returning();

    return inserted;
  }
}