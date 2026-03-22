import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Import middleware
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';

// Import routes
import userRoutes from './routes/userRoutes.js';
import clientRoutes from './routes/clientRoutes.js';
import therapistRoutes from './routes/therapistRoutes.js';
import sessionRoutes from './routes/sessionRoutes.js';
import analyticsRoutes from './routes/analyticsRoutes.js';

/**
 * Initialize Express Application
 */
const app = express();

// Trust proxy
app.set('trust proxy', 1);

// Security middleware
app.use(helmet());

// CORS configuration
const allowedOrigins = process.env.CORS_ORIGIN?.split(',') || ['http://localhost:3000'];
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

// Body parser middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Logging middleware
app.use(morgan('combined'));

/**
 * Health check endpoint
 */
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString(),
  });
});

/**
 * API Routes
 * Version: v1
 */
const apiVersion = process.env.API_VERSION || 'v1';

app.use(`/api/${apiVersion}/users`, userRoutes);
app.use(`/api/${apiVersion}/clients`, clientRoutes);
app.use(`/api/${apiVersion}/therapists`, therapistRoutes);
app.use(`/api/${apiVersion}/sessions`, sessionRoutes);
app.use(`/api/${apiVersion}/analytics`, analyticsRoutes);

/**
 * Root endpoint
 */
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'SmartHeal Backend API',
    version: apiVersion,
    endpoints: {
      users: `/api/${apiVersion}/users`,
      clients: `/api/${apiVersion}/clients`,
      therapists: `/api/${apiVersion}/therapists`,
      sessions: `/api/${apiVersion}/sessions`,
      analytics: `/api/${apiVersion}/analytics`,
    },
  });
});

/**
 * 404 Handler
 */
app.use(notFoundHandler);

/**
 * Error Handler (must be last)
 */
app.use(errorHandler);

export default app;
