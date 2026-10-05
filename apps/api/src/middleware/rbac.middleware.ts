// apps/api/src/middleware/rbac.middleware.ts
import { Response, NextFunction } from 'express';
import { eq, inArray } from 'drizzle-orm';
import { db } from '../config/db.js';
import { userRoles, rolePermissions, permissions } from '../modules/auth/auth.schema.js';
import { AuthenticatedRequest } from './auth.middleware.js';

export const requirePermission = (requiredPermission: string) => {
  return async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const user = req.user;

      if (!user) {
        return res.status(401).json({ success: false, message: 'Unauthorized access', code: 'UNAUTHORIZED' });
      }

      // Platform Super Admins implicitly bypass all permission checks
      if (user.isSuperAdmin) {
        return next();
      }

      // Retrieve all roles assigned to the user
      const userRolesList = await db
        .select({ roleId: userRoles.roleId })
        .from(userRoles)
        .where(eq(userRoles.userId, user.userId));

      const roleIds = userRolesList.map((ur) => ur.roleId);

      if (roleIds.length === 0) {
        return res.status(403).json({ success: false, message: 'Forbidden. No roles assigned.', code: 'FORBIDDEN' });
      }

      // Resolve permission codes for those roles
      const permissionList = await db
        .select({ code: permissions.code })
        .from(rolePermissions)
        .innerJoin(permissions, eq(rolePermissions.permissionId, permissions.id))
        .where(inArray(rolePermissions.roleId, roleIds));

      const hasPermission = permissionList.some((p) => p.code === requiredPermission);

      if (!hasPermission) {
        return res.status(403).json({ 
          success: false, 
          message: `Forbidden. Missing required permission: ${requiredPermission}`,
          code: 'INSUFFICIENT_PERMISSIONS' 
        });
      }

      next();
    } catch (error) {
      console.error('[RBAC Error]', error);
      return res.status(500).json({ success: false, message: 'Internal authorization error', code: 'INTERNAL_ERROR' });
    }
  };
};