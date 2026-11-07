import express from 'express';
import { createCatalogRouter } from './catalog/router.js';
import { createReaderRouter } from './reader/router.js';

export function createApp({ checkDatabase, logger = console, catalogRepository, readerRepository }) {
  const app = express();
  app.disable('x-powered-by');
  app.get('/api/health', async (_req, res) => {
    res.set('Cache-Control', 'no-store');
    try {
      await checkDatabase();
    } catch {
      logger.error({ event: 'database_unavailable' });
      return res.status(503).json({ status: 'degraded', database: 'unavailable' });
    }
    return res.json({ status: 'ok', database: 'ok' });
  });
  if (catalogRepository && readerRepository) app.use('/api/works/:workId/chapters', createReaderRouter(readerRepository, catalogRepository, logger));
  if (catalogRepository) app.use('/api/works', createCatalogRouter(catalogRepository, logger));
  app.use((_req, res) => res.status(404).json({ error: 'not_found' }));
  app.use((_error, _req, res, _next) => {
    try { logger.error({ event: 'internal_error' }); } catch { /* logging must not expose the original error */ }
    res.status(500).json({ error: 'internal_error' });
  });
  return app;
}
