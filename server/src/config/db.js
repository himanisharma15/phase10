import mongoose from 'mongoose';
import { env } from './env.js';

export const connectDatabase = async () => {
  if (mongoose.connection.readyState === 1) return mongoose.connection;
  await mongoose.connect(env.MONGODB_URI);
  return mongoose.connection;
};

export const databaseState = () => (mongoose.connection.readyState === 1 ? 'connected' : 'disconnected');
