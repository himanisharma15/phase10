import { AppError } from './error.js';
export const validate = (schema) => (req, res, next) => { const result = schema.safeParse(req.body); if (!result.success) return next(new AppError(400, 'VALIDATION_ERROR', 'Please check the submitted fields', result.error.flatten().fieldErrors)); req.body = result.data; next(); };
