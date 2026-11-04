import { createApp } from './app.js';
import { readConfig } from './config.js';
import { createPool, createDatabaseCheck } from './database.js';

let config;
try {
  config = readConfig(process.env);
} catch (error) {
  console.error({ event: 'invalid_configuration', variable: error.message.replace('Invalid ', '') });
  process.exit(1);
}
const pool = createPool(config.database);
const server = createApp({ checkDatabase: createDatabaseCheck(pool) }).listen(config.port, '0.0.0.0', () => {
  console.info({ event: 'listening', port: config.port });
});
server.on('error', () => { console.error({ event: 'server_error' }); process.exit(1); });
let closing = false;
const shutdown = () => {
  if (closing) return;
  closing = true;
  const timer = setTimeout(() => {
    console.error({ event: 'shutdown_timeout' });
    process.exit(1);
  }, 10000);
  timer.unref();
  server.close(async error => {
    try {
      await pool.end();
      clearTimeout(timer);
      process.exitCode = error ? 1 : 0;
    } catch {
      console.error({ event: 'shutdown_error' });
      process.exitCode = 1;
    }
  });
};
process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);
