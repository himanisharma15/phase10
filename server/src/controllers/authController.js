import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import { AppError } from '../middleware/error.js';
import { signToken } from '../middleware/auth.js';

const cookieOptions = (remember = false) => ({ httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production', maxAge: remember ? 30 * 86400000 : 86400000 });
const publicUser = (user) => ({ id: user.id || user._id, name: user.name, email: user.email });

export const signup = async (req, res, next) => { try { const { name, email, password } = req.body; if (await User.exists({ email })) throw new AppError(409, 'EMAIL_EXISTS', 'An account with this email already exists'); const user = await User.create({ name, email, passwordHash: await bcrypt.hash(password, 12) }); res.cookie('opslens_token', signToken(user.id), cookieOptions()); res.status(201).json({ success: true, user: publicUser(user) }); } catch (error) { next(error); } };
export const login = async (req, res, next) => { try { const { email, password, remember } = req.body; const user = await User.findOne({ email }).select('+passwordHash'); if (!user || !(await bcrypt.compare(password, user.passwordHash))) throw new AppError(401, 'INVALID_CREDENTIALS', 'Email or password is incorrect'); res.cookie('opslens_token', signToken(user.id, remember), cookieOptions(remember)); res.json({ success: true, user: publicUser(user) }); } catch (error) { next(error); } };
export const logout = (req, res) => { res.clearCookie('opslens_token', { httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production' }); res.json({ success: true }); };
export const me = (req, res) => res.json({ success: true, user: publicUser(req.user) });
