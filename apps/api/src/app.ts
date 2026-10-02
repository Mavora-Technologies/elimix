import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { tenantMiddleware } from './middleware/tenant.middleware.js';
import authRoutes from './modules/auth/auth.routes.js';
import userRoutes from './modules/users/user.routes.js'; // <-- Add this import

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());
app.use(tenantMiddleware);

// Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRoutes); // <-- Mount users module

app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'Elimix API', timestamp: new Date() });
});

app.listen(PORT, () => {
  console.log(`🚀 Elimix API running on port ${PORT}`);
});

export default app;