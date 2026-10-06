// apps/api/src/validators/academics.validator.ts
import { z } from 'zod';

export const createStreamSchema = z.object({
  classId: z.string().min(1, 'Target Grade is required'),
  name: z.string().min(1, 'Stream name is required'),
  classTeacherId: z.string().optional().nullable(),
  capacity: z.coerce.number().min(1).default(40),
  roomNumber: z.string().optional().nullable(),
});