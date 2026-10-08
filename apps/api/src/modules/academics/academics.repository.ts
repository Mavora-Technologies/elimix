// apps/api/src/modules/academics/academics.repository.ts
import { db } from '../../config/db.js';
import { classes, streams } from './academics.schema.js';
import { teachers } from '../teachers/teachers.schema.js';
import { users } from '../auth/auth.schema.js';
import { eq, and } from 'drizzle-orm';

export class AcademicsRepository {
  async getStreamsWithDetails(tenantId: string) {
    // Joins streams -> classes -> teachers -> users to build the full UI profile
    const result = await db
      .select({
        id: streams.id,
        gradeName: classes.name,
        streamName: streams.name,
        capacity: streams.capacity,
        roomNumber: streams.roomNumber,
        teacherFirstName: users.firstName,
        teacherLastName: users.lastName,
        teacherEmail: users.email,
      })
      .from(streams)
      .innerJoin(classes, eq(streams.classId, classes.id))
      .leftJoin(teachers, eq(streams.classTeacherId, teachers.id))
      .leftJoin(users, eq(teachers.userId, users.id))
      .where(eq(streams.tenantId, tenantId));

    return result;
  }
  
  async getReferenceData(tenantId: string) {
    const classesList = await db.select({ id: classes.id, name: classes.name })
      .from(classes).where(eq(classes.tenantId, tenantId)).orderBy(classes.level);
      
    const teachersList = await db.select({ 
      id: teachers.id, 
      firstName: users.firstName, 
      lastName: users.lastName 
    })
    .from(teachers)
    .innerJoin(users, eq(teachers.userId, users.id))
    .where(eq(teachers.tenantId, tenantId));

    return { classes: classesList, teachers: teachersList };
  }

  async createStream(tenantId: string, data: typeof streams.$inferInsert) {
    const [stream] = await db.insert(streams).values({ ...data, tenantId }).returning();
    return stream;
  }

  async updateStream(tenantId: string, id: string, data: any) {
    const [stream] = await db.update(streams)
      .set({ ...data, updatedAt: new Date() })
      .where(and(eq(streams.id, id), eq(streams.tenantId, tenantId)))
      .returning();
    return stream;
  }

  async deleteStream(tenantId: string, id: string) {
    await db.delete(streams).where(and(eq(streams.id, id), eq(streams.tenantId, tenantId)));
    return true;
  }
}