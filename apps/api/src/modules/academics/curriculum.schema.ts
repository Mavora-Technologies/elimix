// apps/api/src/modules/academics/curriculum.schema.ts
import { pgTable, uuid, varchar, text, integer, boolean, timestamp, jsonb } from 'drizzle-orm/pg-core';
import { tenants } from '../tenant/tenant.schema.js';
import { academicYears, classes } from './academics.schema.js';
import { subjects } from './subjects.schema.js';
import { students } from '../students/students.schema.js';
import { users } from '../auth/auth.schema.js';

// 1. Academic Terms / Semesters (Blueprint Section 15)
export const academicTerms = pgTable('academic_terms', {
  id: uuid('id').defaultRandom().primaryKey(),
  tenantId: uuid('tenant_id').references(() => tenants.id, { onDelete: 'cascade' }).notNull(),
  academicYearId: uuid('academic_year_id').references(() => academicYears.id, { onDelete: 'cascade' }).notNull(),
  name: varchar('name', { length: 100 }).notNull(), // e.g., "Term 1", "Term 2", "Semester 1"
  startDate: varchar('start_date', { length: 50 }).notNull(),
  endDate: varchar('end_date', { length: 50 }).notNull(),
  isCurrent: boolean('is_current').default(false).notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

// 2. Configurable Curricula: CBC, IGCSE, IB, ACE, Custom (Blueprint Sections 16 & 18)
export const curricula = pgTable('curricula', {
  id: uuid('id').defaultRandom().primaryKey(),
  tenantId: uuid('tenant_id').references(() => tenants.id, { onDelete: 'cascade' }).notNull(),
  code: varchar('code', { length: 50 }).notNull(), // 'CBC', 'IGCSE', 'IB', 'ACE', '8-4-4'
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description'),
  gradingModel: varchar('grading_model', { length: 100 }).default('Rubric-4-Point').notNull(), // Rubric-4-Point, Letter-A*-G, IB-1-7, Percentage-PACE
  gradeBoundaries: jsonb('grade_boundaries').default([]), // Array of { grade, label, minScore, maxScore, points, descriptor }
  isActive: boolean('is_active').default(true).notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

// 3. Kenya CBC Strands (Blueprint Section 17)
export const cbcStrands = pgTable('cbc_strands', {
  id: uuid('id').defaultRandom().primaryKey(),
  tenantId: uuid('tenant_id').references(() => tenants.id, { onDelete: 'cascade' }).notNull(),
  curriculumId: uuid('curriculum_id').references(() => curricula.id, { onDelete: 'cascade' }),
  subjectId: uuid('subject_id').references(() => subjects.id, { onDelete: 'cascade' }).notNull(), // Learning Area
  classId: uuid('class_id').references(() => classes.id, { onDelete: 'set null' }),
  code: varchar('code', { length: 50 }).notNull(), // e.g., "STR-1.0"
  name: varchar('name', { length: 255 }).notNull(), // e.g., "Numbers", "Listening and Speaking"
  description: text('description'),
  createdAt: timestamp('created_at').defaultNow(),
});

// 4. Kenya CBC Sub-Strands & Competencies (Blueprint Section 17)
export const cbcSubStrands = pgTable('cbc_sub_strands', {
  id: uuid('id').defaultRandom().primaryKey(),
  tenantId: uuid('tenant_id').references(() => tenants.id, { onDelete: 'cascade' }).notNull(),
  strandId: uuid('strand_id').references(() => cbcStrands.id, { onDelete: 'cascade' }).notNull(),
  code: varchar('code', { length: 50 }).notNull(), // e.g., "SUB-1.1"
  name: varchar('name', { length: 255 }).notNull(), // e.g., "Whole Numbers"
  coreCompetency: varchar('core_competency', { length: 255 }).notNull(), // e.g., "Critical Thinking & Problem Solving"
  learningOutcomes: text('learning_outcomes'),
  suggestedActivities: text('suggested_activities'),
  createdAt: timestamp('created_at').defaultNow(),
});

// 5. CBC Descriptive Rubric Templates (EE, ME, AE, BE)
export const cbcRubrics = pgTable('cbc_rubrics', {
  id: uuid('id').defaultRandom().primaryKey(),
  tenantId: uuid('tenant_id').references(() => tenants.id, { onDelete: 'cascade' }).notNull(),
  subStrandId: uuid('sub_strand_id').references(() => cbcSubStrands.id, { onDelete: 'cascade' }).notNull(),
  exceedingDescriptor: text('exceeding_descriptor').notNull(), // EE (4)
  meetingDescriptor: text('meeting_descriptor').notNull(),     // ME (3)
  approachingDescriptor: text('approaching_descriptor').notNull(), // AE (2)
  belowDescriptor: text('below_descriptor').notNull(),         // BE (1)
  createdAt: timestamp('created_at').defaultNow(),
});

// 6. CBC Formative & Summative Learner Assessments (Blueprint Section 17 Workflow)
export const cbcLearnerAssessments = pgTable('cbc_learner_assessments', {
  id: uuid('id').defaultRandom().primaryKey(),
  tenantId: uuid('tenant_id').references(() => tenants.id, { onDelete: 'cascade' }).notNull(),
  studentId: uuid('student_id').references(() => students.id, { onDelete: 'cascade' }).notNull(),
  classId: uuid('class_id').references(() => classes.id, { onDelete: 'set null' }),
  subjectId: uuid('subject_id').references(() => subjects.id, { onDelete: 'cascade' }).notNull(),
  strandId: uuid('strand_id').references(() => cbcStrands.id, { onDelete: 'cascade' }).notNull(),
  subStrandId: uuid('sub_strand_id').references(() => cbcSubStrands.id, { onDelete: 'cascade' }).notNull(),
  assessmentType: varchar('assessment_type', { length: 50 }).default('Formative').notNull(), // Formative, Summative, Portfolio
  performanceLevel: varchar('performance_level', { length: 20 }).notNull(), // 'EE', 'ME', 'AE', 'BE'
  rubricPoints: integer('rubric_points').default(3).notNull(), // 4 = EE, 3 = ME, 2 = AE, 1 = BE
  teacherObservation: text('teacher_observation').notNull(),
  assessedBy: uuid('assessed_by').references(() => users.id, { onDelete: 'set null' }),
  assessedAt: timestamp('assessed_at').defaultNow(),
});