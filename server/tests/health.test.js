import request from 'supertest';
import { createApp } from '../src/app.js';

test('health reports degraded state when database is unavailable', async () => {
  const response = await request(createApp()).get('/api/health');
  expect(response.status).toBe(503);
  expect(response.body).toMatchObject({ success: false, status: 'degraded', db: 'disconnected' });
  expect(response.body.timestamp).toEqual(expect.any(String));
});
