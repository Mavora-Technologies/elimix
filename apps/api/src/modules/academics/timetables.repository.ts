// apps/api/src/modules/academics/timetables.repository.ts
import { db } from '../../config/db.js';
import { timetables } from './timetables.schema.js';
import { subjects } from './subjects.schema.js';
import { teachers } from '../teachers/teachers.schema.js';
import { users } from '../auth/auth.schema.js';
import { streams } from './academics.schema.js'; // Ensure this points to where 'streams' is defined
import { eq, and } from 'drizzle-orm';

export class TimetablesRepository {
  async getTimetableBlocks(tenantId: string, filterBy?: { streamId?: string, teacherId?: string }) {
    const filters = [eq(timetables.tenantId, tenantId)];

    if (filterBy?.streamId) {
      filters.push(eq(timetables.streamId, filterBy.streamId));
    }
    if (filterBy?.teacherId) {
      filters.push(eq(timetables.teacherId, filterBy.teacherId));
    }

    return await db.select({
      id: timetables.id,
      dayOfWeek: timetables.dayOfWeek,
      startTime: timetables.startTime,
      endTime: timetables.endTime,
      room: timetables.room,
      subjectName: subjects.name,
      subjectCode: subjects.code,
      teacherName: users.lastName,
      streamName: streams.name,
    })
    .from(timetables)
    .innerJoin(subjects, eq(timetables.subjectId, subjects.id))
    .innerJoin(teachers, eq(timetables.teacherId, teachers.id))
    .innerJoin(users, eq(teachers.userId, users.id))
    .innerJoin(streams, eq(timetables.streamId, streams.id))
    .where(and(...filters))
    .orderBy(timetables.startTime);
  }

  // --- NEW METHOD ---
  async getStreams(tenantId: string) {
    return await db.select({
      id: streams.id,
      name: streams.name,
    })
    .from(streams)
    .where(eq(streams.tenantId, tenantId))
    .orderBy(streams.name);
  }

  async createBlock(tenantId: string, data: any) {
    const [block] = await db.insert(timetables).values({ ...data, tenantId }).returning();
    return block;
  }

  async deleteBlock(tenantId: string, id: string) {
    await db.delete(timetables).where(and(eq(timetables.id, id), eq(timetables.tenantId, tenantId)));
    return true;
  }
}