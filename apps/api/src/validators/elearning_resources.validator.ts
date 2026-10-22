// apps/api/src/validators/elearning_resources.validator.ts
import { z } from 'zod';

export const createResourceSchema = z.object({
  title: z.string().trim().min(3, 'Resource title must be at least 3 characters'),
  subjectId: z.string().uuid('Please select a valid Subject'),
  teacherId: z.string().uuid('Please select a valid Uploader / Instructor'),
  resourceType: z.enum(['PDF Document', 'Video Lecture', 'E-Book', 'Interactive Link', 'Past Paper']).default('PDF Document'),
  fileSize: z.string().trim().optional().default('1.5 MB'),
  fileUrl: z.string().trim().min(3, 'File URL or download link is required'),
  description: z.string().trim().optional().nullable(),
});