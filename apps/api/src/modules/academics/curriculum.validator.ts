// apps/api/src/modules/academics/curriculum.validator.ts
import { z } from 'zod';

export const createAcademicYearSchema = z.object({
  name: z.string().min(4, 'Academic year name is required (e.g. 2026 Academic Year)'),
  startDate: z.string().min(4, 'Start date is required'),
  endDate: z.string().min(4, 'End date is required'),
  isCurrent: z.boolean().optional().default(false),
});

export const createAcademicTermSchema = z.object({
  academicYearId: z.string().uuid('Valid Academic Year ID is required'),
  name: z.string().min(2, 'Term/Semester name is required'),
  startDate: z.string().min(4, 'Start date is required'),
  endDate: z.string().min(4, 'End date is required'),
  isCurrent: z.boolean().optional().default(false),
});

export const createClassSchema = z.object({
  name: z.string().min(1, 'Class/Grade name is required'),
  numericLevel: z.number().int().optional().default(1),
});

export const createStreamSchema = z.object({
  classId: z.string().uuid('Valid Class ID is required'),
  name: z.string().min(1, 'Stream name is required'),
  capacity: z.number().int().positive().optional().default(40),
});

export const createCurriculumSchema = z.object({
  code: z.enum(['CBC', 'IGCSE', 'IB', 'ACE', '8-4-4', 'CUSTOM']),
  name: z.string().min(2, 'Curriculum name is required'),
  description: z.string().optional().nullable(),
  gradingModel: z.string().min(2),
  gradeBoundaries: z.array(z.any()).optional().default([]),
  isActive: z.boolean().optional().default(true),
});

export const createCbcStrandSchema = z.object({
  curriculumId: z.string().uuid().optional().nullable(),
  subjectId: z.string().uuid('Valid Learning Area (Subject) is required'),
  classId: z.string().uuid().optional().nullable(),
  code: z.string().min(1, 'Strand code is required'),
  name: z.string().min(2, 'Strand name is required'),
  description: z.string().optional().nullable(),
});

export const createCbcSubStrandSchema = z.object({
  strandId: z.string().uuid('Valid Strand ID is required'),
  code: z.string().min(1, 'Sub-strand code is required'),
  name: z.string().min(2, 'Sub-strand name is required'),
  coreCompetency: z.string().min(2, 'Core competency is required'),
  learningOutcomes: z.string().optional().nullable(),
  suggestedActivities: z.string().optional().nullable(),
  exceedingDescriptor: z.string().optional(),
  meetingDescriptor: z.string().optional(),
  approachingDescriptor: z.string().optional(),
  belowDescriptor: z.string().optional(),
});

export const createCbcAssessmentSchema = z.object({
  studentId: z.string().uuid('Valid Learner ID is required'),
  classId: z.string().uuid().optional().nullable(),
  subjectId: z.string().uuid('Valid Learning Area is required'),
  strandId: z.string().uuid('Valid Strand is required'),
  subStrandId: z.string().uuid('Valid Sub-Strand is required'),
  assessmentType: z.enum(['Formative', 'Summative', 'Portfolio']).default('Formative'),
  performanceLevel: z.enum(['EE', 'ME', 'AE', 'BE']),
  teacherObservation: z.string().min(3, 'Descriptive teacher observation is required'),
});

export const createTeacherAllocationSchema = z.object({
  teacherId: z.string().uuid('Valid Teacher ID is required'),
  subjectId: z.string().uuid('Valid Subject ID is required'),
  classId: z.string().uuid('Valid Class ID is required'),
  streamId: z.string().uuid().optional().nullable(),
  academicYearId: z.string().uuid('Valid Academic Year ID is required'),
});