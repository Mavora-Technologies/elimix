// apps/api/src/modules/parents/parents.repository.ts
import { and, desc, eq, inArray } from 'drizzle-orm';
import { db } from '../../config/db.js';
import { users, roles, userRoles } from '../auth/auth.schema.js';
import { families, parents, studentParents } from './parents.schema.js';
import { students } from '../students/students.schema.js';
import { auditLogs } from '../audit/audit.schema.js';

export interface CreateParentRepoParams {
  tenantId: string;
  actorUserId?: string;
  ipAddress?: string;
  firstName: string;
  lastName: string;
  email: string;
  passwordHash: string;
  phone: string;
  relationship: string;
  occupation?: string | null;
  familyId?: string | null;
  familyName?: string | null;
  emergencyContact?: string | null;
  studentIds: string[];
  isPrimaryContact: boolean;
  financialResponsibility: boolean;
  portalActive: boolean;
}

export interface UpdateParentRepoParams {
  tenantId: string;
  parentId: string;
  actorUserId?: string;
  ipAddress?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  relationship?: string;
  occupation?: string | null;
  portalActive?: boolean;
  studentIds?: string[];
}

export class ParentsRepository {
  /**
   * Fetch all parent rows joined with user accounts and families for a tenant
   */
  static async findAllParentsByTenant(tenantId: string) {
    return await db
      .select({
        parentId: parents.id,
        relationship: parents.relationship,
        occupation: parents.occupation,
        familyId: parents.familyId,
        familyName: families.familyName,
        emergencyContact: families.emergencyContact,
        userId: users.id,
        firstName: users.firstName,
        lastName: users.lastName,
        email: users.email,
        phone: users.phone,
        isActive: users.isActive,
        createdAt: users.createdAt,
      })
      .from(parents)
      .innerJoin(users, eq(parents.userId, users.id))
      .leftJoin(families, eq(parents.familyId, families.id))
      .where(eq(parents.tenantId, tenantId))
      .orderBy(desc(users.createdAt));
  }

  /**
   * Fetch all linked students for a list of parent IDs within a tenant
   */
  static async findLinkedChildrenByParentIds(tenantId: string, parentIds: string[]) {
    if (parentIds.length === 0) return [];

    return await db
      .select({
        parentId: studentParents.parentId,
        studentId: students.id,
        admissionNumber: students.admissionNumber,
        firstName: students.firstName,
        lastName: students.lastName,
        gender: students.gender,
        enrollmentStatus: students.enrollmentStatus,
        isPrimaryContact: studentParents.isPrimaryContact,
        financialResponsibility: studentParents.financialResponsibility,
      })
      .from(studentParents)
      .innerJoin(students, eq(studentParents.studentId, students.id))
      .where(
        and(
          inArray(studentParents.parentId, parentIds),
          eq(students.tenantId, tenantId)
        )
      );
  }

  /**
   * Find a single parent by ID and tenantId
   */
  static async findParentById(tenantId: string, parentId: string) {
    const [record] = await db
      .select()
      .from(parents)
      .where(and(eq(parents.id, parentId), eq(parents.tenantId, tenantId)))
      .limit(1);
    return record || null;
  }

  /**
   * Fetch all families and their associated students for a tenant
   */
  static async findFamiliesByTenant(tenantId: string) {
    const [familyList, tenantStudents] = await Promise.all([
      db
        .select()
        .from(families)
        .where(eq(families.tenantId, tenantId))
        .orderBy(desc(families.createdAt)),
      db
        .select()
        .from(students)
        .where(eq(students.tenantId, tenantId)),
    ]);

    return familyList.map((f) => ({
      ...f,
      siblings: tenantStudents.filter((s) => s.familyId === f.id),
    }));
  }

  /**
   * Fetch recent portal access and parent audit logs for a tenant
   */
  static async findAccessLogsByTenant(tenantId: string, limit = 50) {
    return await db
      .select({
        id: auditLogs.id,
        action: auditLogs.action,
        module: auditLogs.module,
        entity: auditLogs.entity,
        entityId: auditLogs.entityId,
        ipAddress: auditLogs.ipAddress,
        createdAt: auditLogs.createdAt,
        userId: auditLogs.userId,
        firstName: users.firstName,
        lastName: users.lastName,
        email: users.email,
      })
      .from(auditLogs)
      .leftJoin(users, eq(auditLogs.userId, users.id))
      .where(eq(auditLogs.tenantId, tenantId))
      .orderBy(desc(auditLogs.createdAt))
      .limit(limit);
  }

  /**
   * Execute transactional creation of User + Family + Parent + Student Links + Audit Log
   */
  static async createParentTransaction(params: CreateParentRepoParams) {
    return await db.transaction(async (tx) => {
      // 1. Check if user already exists by email
      const existingUsers = await tx
        .select()
        .from(users)
        .where(eq(users.email, params.email))
        .limit(1);

      let userRecord = existingUsers[0];

      if (!userRecord) {
        const [newUser] = await tx
          .insert(users)
          .values({
            tenantId: params.tenantId,
            email: params.email,
            passwordHash: params.passwordHash,
            firstName: params.firstName,
            lastName: params.lastName,
            phone: params.phone,
            isSuperAdmin: false,
            isActive: params.portalActive,
          })
          .returning();
        userRecord = newUser;

        // Attach 'Parent' role if configured in tenant
        const parentRole = await tx
          .select()
          .from(roles)
          .where(and(eq(roles.tenantId, params.tenantId), eq(roles.name, 'Parent')))
          .limit(1);

        if (parentRole[0]) {
          await tx
            .insert(userRoles)
            .values({ userId: userRecord.id, roleId: parentRole[0].id })
            .onConflictDoNothing();
        }
      }

      // 2. Resolve or create Family
      let targetFamilyId = params.familyId;
      if (!targetFamilyId) {
        const [newFamily] = await tx
          .insert(families)
          .values({
            tenantId: params.tenantId,
            familyName: params.familyName || `${params.lastName} Family`,
            emergencyContact: params.emergencyContact || params.phone,
          })
          .returning();
        targetFamilyId = newFamily.id;
      }

      // 3. Insert Parent record
      const [newParent] = await tx
        .insert(parents)
        .values({
          tenantId: params.tenantId,
          userId: userRecord.id,
          familyId: targetFamilyId,
          relationship: params.relationship,
          occupation: params.occupation || null,
        })
        .returning();

      // 4. Link children in student_parents & sync student.familyId
      if (params.studentIds.length > 0) {
        for (const studentId of params.studentIds) {
          await tx
            .insert(studentParents)
            .values({
              studentId,
              parentId: newParent.id,
              isPrimaryContact: params.isPrimaryContact,
              financialResponsibility: params.financialResponsibility,
            })
            .onConflictDoNothing();

          await tx
            .update(students)
            .set({ familyId: targetFamilyId, updatedAt: new Date() })
            .where(and(eq(students.id, studentId), eq(students.tenantId, params.tenantId)));
        }
      }

      // 5. Record Audit Log
      await tx.insert(auditLogs).values({
        tenantId: params.tenantId,
        userId: params.actorUserId || null,
        action: 'parent.created',
        module: 'parents',
        entity: 'parent',
        entityId: newParent.id,
        newValue: {
          parentId: newParent.id,
          email: userRecord.email,
          relationship: params.relationship,
          linkedStudentIds: params.studentIds,
        },
        ipAddress: params.ipAddress || null,
      });

      return newParent;
    });
  }

  /**
   * Execute transactional update of Parent + User + Student Links + Audit Log
   */
  static async updateParentTransaction(params: UpdateParentRepoParams) {
    return await db.transaction(async (tx) => {
      const [existingParent] = await tx
        .select()
        .from(parents)
        .where(and(eq(parents.id, params.parentId), eq(parents.tenantId, params.tenantId)))
        .limit(1);

      if (!existingParent) {
        throw new Error('Parent not found');
      }

      if (params.relationship !== undefined || params.occupation !== undefined) {
        await tx
          .update(parents)
          .set({
            ...(params.relationship ? { relationship: params.relationship } : {}),
            ...(params.occupation !== undefined ? { occupation: params.occupation } : {}),
          })
          .where(eq(parents.id, params.parentId));
      }

      const userUpdates: Record<string, any> = { updatedAt: new Date() };
      if (params.firstName) userUpdates.firstName = params.firstName;
      if (params.lastName) userUpdates.lastName = params.lastName;
      if (params.email) userUpdates.email = params.email;
      if (params.phone !== undefined) userUpdates.phone = params.phone;
      if (params.portalActive !== undefined) userUpdates.isActive = params.portalActive;

      await tx
        .update(users)
        .set(userUpdates)
        .where(eq(users.id, existingParent.userId));

      if (params.studentIds !== undefined) {
        await tx.delete(studentParents).where(eq(studentParents.parentId, params.parentId));
        for (const studentId of params.studentIds) {
          await tx
            .insert(studentParents)
            .values({
              studentId,
              parentId: params.parentId,
              isPrimaryContact: true,
              financialResponsibility: true,
            })
            .onConflictDoNothing();

          await tx
            .update(students)
            .set({ familyId: existingParent.familyId, updatedAt: new Date() })
            .where(and(eq(students.id, studentId), eq(students.tenantId, params.tenantId)));
        }
      }

      await tx.insert(auditLogs).values({
        tenantId: params.tenantId,
        userId: params.actorUserId || null,
        action: 'parent.updated',
        module: 'parents',
        entity: 'parent',
        entityId: params.parentId,
        newValue: {
          relationship: params.relationship,
          portalActive: params.portalActive,
          studentIds: params.studentIds,
        },
        ipAddress: params.ipAddress || null,
      });

      return { id: params.parentId, updated: true };
    });
  }

  /**
   * Execute transactional deletion of Parent + Student Links + Audit Log
   */
  static async deleteParentTransaction(
    tenantId: string,
    parentId: string,
    actorUserId?: string,
    ipAddress?: string
  ) {
    return await db.transaction(async (tx) => {
      const [existing] = await tx
        .select()
        .from(parents)
        .where(and(eq(parents.id, parentId), eq(parents.tenantId, tenantId)))
        .limit(1);

      if (!existing) {
        throw new Error('Parent record not found');
      }

      await tx.delete(studentParents).where(eq(studentParents.parentId, parentId));
      await tx.delete(parents).where(eq(parents.id, parentId));

      await tx.insert(auditLogs).values({
        tenantId,
        userId: actorUserId || null,
        action: 'parent.deleted',
        module: 'parents',
        entity: 'parent',
        entityId: parentId,
        oldValue: existing,
        ipAddress: ipAddress || null,
      });

      return { deleted: true };
    });
  }

  /**
   * Fetch all student-parent linkages across the tenant
   */
  static async findAllLinkagesByTenant(tenantId: string) {
    return await db
      .select({
        studentId: students.id,
        studentFirstName: students.firstName,
        studentLastName: students.lastName,
        admissionNumber: students.admissionNumber,
        enrollmentStatus: students.enrollmentStatus,
        parentId: parents.id,
        parentRelationship: parents.relationship,
        isPrimaryContact: studentParents.isPrimaryContact,
        userFirstName: users.firstName,
        userLastName: users.lastName,
        userEmail: users.email,
        userPhone: users.phone,
      })
      .from(studentParents)
      .innerJoin(students, eq(studentParents.studentId, students.id))
      .innerJoin(parents, eq(studentParents.parentId, parents.id))
      .innerJoin(users, eq(parents.userId, users.id))
      .where(eq(students.tenantId, tenantId))
      .orderBy(desc(students.createdAt));
  }
}