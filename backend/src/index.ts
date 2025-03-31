import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import logger from './utils/logger';

// Import routes
import userRoutes from './routes/user.routes';
import transactionRoutes from './routes/transaction.routes';
import budgetRoutes from './routes/budget.routes';
import categoryRoutes from './routes/category.routes';
import insightRoutes from './routes/insight.routes';

// Import middleware
import { errorHandler, notFound } from './middleware/error.middleware';
import { connectToDatabase } from './mongoConnect';

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(compression());
app.use(express.json());

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'), // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100') // limit each IP
});
app.use(limiter);

// Routes
app.use('/api/users', userRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/budgets', budgetRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/insights', insightRoutes);

// Add a simple root route for testing
app.get('/', (req, res) => {
  res.json({ message: 'Budget API is running!' });
});

// Error handling
app.use(notFound);
app.use(errorHandler);

// Connect to database at startup
connectToDatabase()
  .catch((err: any) => {
    logger.error('Failed to connect to database', err);
    process.exit(1);
  });

// Start server
const PORT = process.env.PORT || 3000;

// Only start the server if not running on Vercel
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    logger.info(`Server is running on port ${PORT}`);
  });
}

// Export app for serverless environment
export default app;