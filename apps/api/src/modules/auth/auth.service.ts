// apps/api/src/modules/auth/auth.service.ts
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { eq } from 'drizzle-orm';
import { db } from '../../config/db.js';
import { users } from './auth.schema.js';
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
}