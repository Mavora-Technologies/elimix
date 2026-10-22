// apps/api/src/app.ts
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { tenantMiddleware } from './middleware/tenant.middleware.js';
import authRoutes from './modules/auth/auth.routes.js';
import userRoutes from './modules/users/user.routes.js';
import studentRoutes from './modules/students/students.routes.js';
import academicRoutes from './modules/academics/academics.routes.js';
import attendanceRoutes from './modules/attendance/attendance.routes.js';
import subjectRoutes from './modules/academics/subjects.routes.js';
import teacherRoutes from './modules/teachers/teachers.routes.js';
import departmentRoutes from './modules/departments/departments.routes.js';
import teacherAttendanceRoutes from './modules/teachers/attendance.routes.js';
import timetableRoutes from './modules/academics/timetables.routes.js';
import lessonPlanRoutes from './modules/academics/lesson_plans.routes.js';
import assignmentRoutes from './modules/academics/assignments.routes.js';
import examRoutes from './modules/academics/exams.routes.js';
import examResultsRoutes from './modules/academics/exam_results.routes.js';
import examReportsRoutes from './modules/academics/exam_reports.routes.js';
import elearningRoutes from './modules/academics/elearning.routes.js';
import dashboardRoutes from './modules/dashboard/dashboard.routes.js';
import parentRoutes from './modules/parents/parents.routes.js';
import reportsRoutes from './modules/reports/reports.routes.js';
import elearningResourcesRoutes from './modules/academics/elearning_resources.routes.js';
import elearningProgressRoutes from './modules/academics/elearning_progress.routes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// ==========================================
// CORS CONFIGURATION
// ==========================================
const allowedOrigins = [
  'http://localhost:3000',
  'https://elimix.pages.dev',
  'https://elimix.mavoratechnologies.com',
  'https://www.elimix.mavoratechnologies.com'
];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));

app.use(express.json());
app.use(tenantMiddleware);

// ==========================================
// ROUTES (Ordered by specificity)
// ==========================================

// 1. Core Authentication & Identity
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/dashboard', dashboardRoutes);

// 2. Specific Academic & E-Learning Sub-Routes (MUST go before base academic route)
app.use('/api/v1/e-learning', elearningRoutes);
app.use('/api/v1/academics/e-learning', elearningRoutes);
app.use('/api/v1/e-learning/resources', elearningResourcesRoutes);
app.use('/api/v1/e-learning/progress', elearningProgressRoutes);
app.use('/api/v1/academics/progress', elearningResourcesRoutes);
app.use('/api/v1/academics/resources', elearningResourcesRoutes);
app.use('/api/v1/academics/subjects', subjectRoutes);
app.use('/api/v1/academics/timetables', timetableRoutes);
app.use('/api/v1/academics/lesson-plans', lessonPlanRoutes);
app.use('/api/v1/academics/assignments', assignmentRoutes);
app.use('/api/v1/academics/exam-results', examResultsRoutes);
app.use('/api/v1/academics/exam-reports', examReportsRoutes);
app.use('/api/v1/academics/exams', examRoutes);

// 3. Base Academic Route
app.use('/api/v1/academics', academicRoutes);

// 4. Students & Attendance
app.use('/api/v1/students', studentRoutes);
app.use('/api/v1/parents', parentRoutes);
app.use('/api/v1/attendance', attendanceRoutes);

// 5. Teachers & Departments
app.use('/api/v1/teachers/attendance', teacherAttendanceRoutes);
app.use('/api/v1/teachers', teacherRoutes);
app.use('/api/v1/departments', departmentRoutes);

// 6. Reports & Analytics
app.use('/api/v1/reports', reportsRoutes);

// ==========================================
// HEALTH CHECK
// ==========================================
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'Elimix API (Vercel Serverless)', timestamp: new Date() });
});

// ==========================================
// SERVER INITIALIZATION
// ==========================================
// Only listen locally. Vercel handles routing automatically without app.listen()
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Elimix API running securely on port ${PORT}`);
  });
}

// MUST export the app for Vercel's serverless builder
export default app;