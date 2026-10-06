// apps/api/src/middleware/auth.middleware.ts
import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { TenantRequest } from './tenant.middleware.js';

export interface AuthenticatedRequest extends TenantRequest {
  user?: {
    userId: string;
    tenantId?: string;
    isSuperAdmin: boolean;
  };
}

export const authMiddleware = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      message: 'Unauthorized access. Token required.',
      code: 'UNAUTHORIZED',
    });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as AuthenticatedRequest['user'];
    req.user = decoded;

    // Validate tenant isolation (unless platform super admin)
    if (!decoded?.isSuperAdmin && req.tenantId && decoded?.tenantId !== req.tenantId) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden. Cross-tenant access denied.',
        code: 'TENANT_MISMATCH',
      });
    }

    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired authentication token.',
      code: 'INVALID_TOKEN',
    });
  }
};