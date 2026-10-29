import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { requireAuth } from '../middleware/auth.js';
import { analyze, ask, messages } from '../controllers/aiController.js';
const limiter = rateLimit({ windowMs: 60000, limit: 20 });
const router = Router(); router.use(requireAuth); router.post('/incidents/:id/analyze', limiter, analyze); router.get('/incidents/:id/messages', messages); router.post('/ask', limiter, (req, res, next) => { if (typeof req.body?.message !== 'string' || !req.body.message.trim()) return res.status(400).json({ success: false, error: { code: 'VALIDATION_ERROR', message: 'Message is required' } }); return ask(req, res, next); }); export default router;
