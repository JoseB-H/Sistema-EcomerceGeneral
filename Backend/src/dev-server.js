import { createApp } from './app.js';
import { readLocalConfig } from './local-config.js';
import { createPool, createDatabaseCheck } from './database.js';
import { createDemoCatalogRepository } from './catalog/demo-repository.js';
import { createReaderRepository } from './reader/repository.js';

let config;
try {
  config = readLocalConfig(process.env);
} catch (error) {
  console.error({ event: 'invalid_local_configuration', variable: error.message.replace('Invalid ', '') });
  process.exit(1);
}
const pool = config.database ? createPool(config.database) : null;
const checkDatabase = pool ? createDatabaseCheck(pool) : async () => { throw new Error('PostgreSQL not configured'); };
const server = createApp({ checkDatabase, catalogRepository: createDemoCatalogRepository(), readerRepository: createReaderRepository({ root: process.env.YITVERSE_CONTENT_ROOT }) })
  .listen(config.port, '127.0.0.1', () => {
    console.info({ event: 'local_listening', port: config.port, catalog: 'synthetic', postgresqlConfigured: !!pool });
  });
server.on('error', error => {
  console.error({ event: 'local_server_error', code: error.code });
  process.exit(1);
});
let closing = false;
function shutdown() {
  if (closing) return;
  closing = true;
  const timer = setTimeout(() => process.exit(1), 10000);
  timer.unref();
  server.close(async error => {
    try {
      await pool?.end();
      clearTimeout(timer);
      process.exitCode = error ? 1 : 0;
    } catch {
      console.error({ event: 'local_shutdown_error' });
      process.exitCode = 1;
    }
  });
}
process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
