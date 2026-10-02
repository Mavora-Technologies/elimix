import { Request, Response, NextFunction } from 'express';

export interface TenantRequest extends Request {
  tenantId?: string;
}

export const tenantMiddleware = (req: TenantRequest, res: Response, next: NextFunction) => {
  const tenantId = req.headers['x-tenant-id'] as string;

  // Platform endpoints or public auth don't require tenantId
  if (req.path.startsWith('/api/v1/platform') || req.path.startsWith('/api/v1/auth/login')) {
    return next();
  }

  if (!tenantId) {
    return res.status(400).json({
      success: false,
      message: 'Tenant context missing. Provision x-tenant-id header.',
      code: 'TENANT_HEADER_MISSING',
    });
  }

  req.tenantId = tenantId;
  next();
};