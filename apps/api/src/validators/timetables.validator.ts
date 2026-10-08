// apps/api/src/validators/timetables.validator.ts
import { z } from 'zod';

export const timetableBlockSchema = z.object({
  subjectId: z.string().uuid(),
  teacherId: z.string().uuid(),
  streamId: z.string().uuid(),
  dayOfWeek: z.enum(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']),
  startTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Invalid start time format (HH:MM)'),
  endTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Invalid end time format (HH:MM)'),
  room: z.string().min(1, 'Room is required'),
  term: z.string().min(1, 'Term is required'),
  status: z.enum(['Active', 'Cancelled']).default('Active'),
});