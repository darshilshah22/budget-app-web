
// Modify your mongoose connection to better handle serverless environment
import mongoose from 'mongoose';
import logger from './utils/logger';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/budget-app';

// Cache the database connection
let cachedConnection: typeof mongoose | null = null;

export async function connectToDatabase() {
  if (cachedConnection) {
    logger.info('Using cached database connection');
    return cachedConnection;
  }

  logger.info('Connecting to MongoDB...');
  
  try {
    const connection = await mongoose.connect(MONGODB_URI);
    cachedConnection = connection;
    logger.info('Connected to MongoDB');
    return connection;
  } catch (error) {
    logger.error('MongoDB connection error:', error);
    throw error;
  }
}