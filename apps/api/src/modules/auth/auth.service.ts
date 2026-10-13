// apps/api/src/modules/auth/auth.service.ts
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { eq } from 'drizzle-orm';
import { db } from '../../config/db.js';
import { users, roles, userRoles } from './auth.schema.js';
import { tenants } from '../tenant/tenant.schema.js';
import { z } from 'zod';
import { loginSchema, registerSchema } from '../../validators/auth.validator.js';

export class AuthService {
  static async login(data: z.infer<typeof loginSchema>) {
    const userResult = await db.select().from(users).where(eq(users.email, data.email)).limit(1);
    const user = userResult[0];

    if (!user) {
      throw new Error('INVALID_CREDENTIALS');
    }

    const isValidPassword = await bcrypt.compare(data.password, user.passwordHash);
    if (!isValidPassword) {
      throw new Error('INVALID_CREDENTIALS');
    }

    if (!user.isActive) {
      throw new Error('ACCOUNT_DISABLED');
    }

    const token = jwt.sign(
      {
        userId: user.id,
        tenantId: user.tenantId,
        isSuperAdmin: user.isSuperAdmin,
      },
      process.env.JWT_SECRET as string,
      { expiresIn: '24h' }
    );

    return {
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        tenantId: user.tenantId,
        isSuperAdmin: user.isSuperAdmin,
      },
      token,
    };
  }

  static async register(data: z.infer<typeof registerSchema>) {
    // 1. Check if email is already in use
    const existingUser = await db.select().from(users).where(eq(users.email, data.email)).limit(1);
    if (existingUser.length > 0) {
      throw new Error('EMAIL_ALREADY_EXISTS');
    }

    // 2. Hash password securely
    const passwordHash = await bcrypt.hash(data.password, 12);

    // 3. Provision the new Tenant (Institution)
    const [newTenant] = await db.insert(tenants).values({
      name: data.institutionName,
      type: 'Institution', 
      status: 'active',
      isActive: true,
    }).returning();

    // 4. Split the full admin name
    const nameParts = data.adminName.trim().split(' ');
    const firstName = nameParts[0];
    const lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : 'Admin';

    // 5. Create the User
    const [newUser] = await db.insert(users).values({
      tenantId: newTenant.id, 
      email: data.email,
      passwordHash,
      firstName,
      lastName,
      isSuperAdmin: false, // Standard institution admin, not platform admin
      isActive: true,
    }).returning();

    // 6. Create the default "Institution Administrator" role
    const [adminRole] = await db.insert(roles).values({
      tenantId: newTenant.id,
      name: 'Institution Administrator',
      description: 'Full administrative access to the institution workspace.',
      isSystem: true, // Mark as system-level role for the tenant
    }).returning();

    // 7. Bind the User to the Role
    await db.insert(userRoles).values({
      userId: newUser.id,
      roleId: adminRole.id,
    });

    // 8. Generate Auth Token
    const token = jwt.sign(
      {
        userId: newUser.id,
        tenantId: newUser.tenantId,
        isSuperAdmin: newUser.isSuperAdmin,
      },
      process.env.JWT_SECRET as string,
      { expiresIn: '24h' }
    );

    return {
      user: {
        id: newUser.id,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        email: newUser.email,
        tenantId: newUser.tenantId,
        isSuperAdmin: newUser.isSuperAdmin,
        institutionName: newTenant.name, 
      },
      token,
    };
  }
}