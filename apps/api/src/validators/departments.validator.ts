import { z } from 'zod';

export const departmentSchema = z.object({
  name: z.string().min(1, 'Department name is required'),
  hodId: z.preprocess(
    (val) => (!val || val === '' || val === 'null' || val === 'undefined' ? null : val),
    z.string().uuid({ message: 'Invalid HOD ID' }).nullable().optional()
  ),
  subjects: z.array(z.string()),
  status: z.enum(['Active', 'Inactive']),
  establishedYear: z.number().int(),
});