import { db } from '../../config/db.js';
import { auditLogs } from './audit.schema.js';

interface AuditLogPayload {
  tenantId: string;
  userId: string;
  action: string;
  module: string;
  entity: string;
  entityId: string;
  oldValue?: any;
  newValue?: any;
  ipAddress?: string;
}

export class AuditService {
  static async log(data: AuditLogPayload) {
    try {
      await db.insert(auditLogs).values(data);
    } catch (error) {
      console.error('[Audit Log Error]', error);
      // We do not throw here to prevent breaking the main transaction, 
      // but in production, this should trigger a monitoring alert.
    }
  }
}