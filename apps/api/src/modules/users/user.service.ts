import bcrypt from 'bcryptjs';
import { eq, and } from 'drizzle-orm';
import { db } from '../../config/db.js';
import { users } from '../auth/auth.schema.js';
import { z } from 'zod';
import { createUserSchema } from '../../validators/user.validator.js';

export class UserService {
  static async listUsers(tenantId: string) {
    return db
      .select({
        id: users.id,
        email: users.email,
        firstName: users.firstName,
        lastName: users.lastName,
        isActive: users.isActive,
        createdAt: users.createdAt,
      })
      .from(users)
      .where(eq(users.tenantId, tenantId));
  }

  static async createUser(tenantId: string, data: z.infer<typeof createUserSchema>) {
    const existingUser = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.email, data.email))
      .limit(1);

    if (existingUser.length > 0) {
      throw new Error('EMAIL_IN_USE');
    }

    const passwordHash = await bcrypt.hash(data.password, 10);

    const [newUser] = await db.insert(users).values({
      tenantId,
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      passwordHash,
      isActive: data.isActive,
    }).returning({
      id: users.id,
      email: users.email,
      firstName: users.firstName,
      lastName: users.lastName,
    });

    return newUser;
  }
}