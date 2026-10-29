import os from 'node:os';
import { databaseState } from '../config/db.js';

export const health = (req, res) => {
  const db = databaseState();
  res.status(db === 'connected' ? 200 : 503).json({
    success: db === 'connected',
    status: db === 'connected' ? 'ok' : 'degraded',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    db,
    hostname: os.hostname()
  });
};
