// apps/api/src/validators/students.validator.ts
import { z } from 'zod';

export const createStudentSchema = z.object({
  admissionNumber: z.string().min(1, 'Admission number is required'),
  firstName: z.string().min(2, 'First name is required'),
  lastName: z.string().min(2, 'Last name is required'),
  dateOfBirth: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: 'Invalid date format (YYYY-MM-DD expected)',
  }),
  gender: z.enum(['Male', 'Female', 'Other'], {
    message: 'Gender must be Male, Female, or Other',
  }),
  enrollmentStatus: z.enum(['Admitted', 'Enrolled', 'Transferred', 'Withdrawn']).optional(),
  familyId: z.string().uuid('Invalid Family ID').optional(),
});

export const updateStudentSchema = createStudentSchema.partial();