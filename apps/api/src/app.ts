import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { tenantMiddleware } from './middleware/tenant.middleware.js';
import authRoutes from './modules/auth/auth.routes.js';
import userRoutes from './modules/users/user.routes.js';
import studentRoutes from './modules/students/students.routes.js';
import academicRoutes from './modules/academics/academics.routes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());
app.use(tenantMiddleware);

// Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/students', studentRoutes);
app.use('/api/v1/academics', academicRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'Elimix API', timestamp: new Date() });
});

app.listen(PORT, () => {
  console.log(`🚀 Elimix API running on port ${PORT}`);
});

export default app;