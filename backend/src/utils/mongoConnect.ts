import mongoose from 'mongoose';
import logger from './logger';

// Cache the database connection
let cachedConnection: typeof mongoose | null = null;

export async function connectToDatabase(mongoURI: string) {
  console.log(mongoURI);
  if (cachedConnection) {
    logger.info('Using cached database connection');
    return cachedConnection;
  }

  logger.info('Connecting to MongoDB...');
  
  try {
    const connection = await mongoose.connect(mongoURI);
    cachedConnection = connection;
    logger.info('Connected to MongoDB');
    return connection;
  } catch (error) {
    console.log(error);
    logger.error('MongoDB connection error:', error);
    throw error;
  }
}