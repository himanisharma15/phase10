import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { env } from '../config/env.js';
import { AppError } from './error.js';

export const signToken = (userId, remember = false) => jwt.sign({ sub: userId }, env.JWT_SECRET, { expiresIn: remember ? '30d' : '1d' });

export const requireAuth = async (req, res, next) => {
  try {
    const token = req.cookies.opslens_token;
    if (!token) throw new AppError(401, 'UNAUTHENTICATED', 'Authentication required');
    const payload = jwt.verify(token, env.JWT_SECRET);
    const user = await User.findById(payload.sub);
    if (!user) throw new AppError(401, 'INVALID_SESSION', 'Session is no longer valid');
    req.user = user;
    next();
  } catch (error) {
    next(error instanceof AppError ? error : new AppError(401, 'INVALID_SESSION', 'Session is invalid or expired'));
  }
};
