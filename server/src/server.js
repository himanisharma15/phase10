import { createApp } from './app.js';
import { connectDatabase } from './config/db.js';
import { env } from './config/env.js';

const start = async () => {
  if (env.NODE_ENV !== 'test') await connectDatabase();
  createApp().listen(env.PORT, () => console.log(`OpsLens API listening on port ${env.PORT}`));
};

start().catch((error) => {
  console.error(`Startup failed: ${error.message}`);
  process.exit(1);
});
