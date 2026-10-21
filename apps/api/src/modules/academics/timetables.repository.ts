// apps/api/src/modules/academics/timetables.repository.ts
import { db } from '../../config/db.js';
import { timetables } from './timetables.schema.js';
import { subjects } from './subjects.schema.js';
import { teachers } from '../teachers/teachers.schema.js';
import { users } from '../auth/auth.schema.js';
import { streams } from './academics.schema.js';
import { eq, and, or, lt, gt } from 'drizzle-orm';

export class TimetablesRepository {
  async getTimetableBlocks(tenantId: string, filterBy?: { streamId?: string; teacherId?: string }) {
    const filters = [eq(timetables.tenantId, tenantId)];

    if (filterBy?.streamId) {
      filters.push(eq(timetables.streamId, filterBy.streamId));
    }
    if (filterBy?.teacherId) {
      filters.push(eq(timetables.teacherId, filterBy.teacherId));
    }

    return await db
      .select({
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

  async getStreams(tenantId: string) {
    return await db
      .select({
        id: streams.id,
        name: streams.name,
      })
      .from(streams)
      .where(eq(streams.tenantId, tenantId))
      .orderBy(streams.name);
  }

  // CONFLICT DETECTION ENGINE
  async checkConflict(tenantId: string, data: { teacherId: string; room: string; streamId: string; dayOfWeek: string; startTime: string; endTime: string }) {
    const existing = await db
      .select()
      .from(timetables)
      .where(
        and(
          eq(timetables.tenantId, tenantId),
          eq(timetables.dayOfWeek, data.dayOfWeek),
          or(
            eq(timetables.teacherId, data.teacherId),
            eq(timetables.room, data.room),
            eq(timetables.streamId, data.streamId)
          ),
          // Time overlap condition: (StartA < EndB) and (EndA > StartB)
          and(
            lt(timetables.startTime, data.endTime),
            gt(timetables.endTime, data.startTime)
          )
        )
      );

    if (existing.length > 0) {
      const conflict = existing[0];
      if (conflict.teacherId === data.teacherId) {
        return 'Teacher is already booked for another class during this time slot.';
      }
      if (conflict.room === data.room) {
        return `Room '${data.room}' is already occupied during this time slot.`;
      }
      if (conflict.streamId === data.streamId) {
        return 'This class/stream already has a lesson scheduled at this time.';
      }
      return 'Schedule conflict detected with an existing time block.';
    }
    return null;
  }

  async createBlock(tenantId: string, data: any) {
    const conflictError = await this.checkConflict(tenantId, data);
    if (conflictError) {
      throw new Error(conflictError);
    }

    const [block] = await db.insert(timetables).values({ ...data, tenantId }).returning();
    return block;
  }

  async deleteBlock(tenantId: string, id: string) {
    await db.delete(timetables).where(and(eq(timetables.id, id), eq(timetables.tenantId, tenantId)));
    return true;
  }
}