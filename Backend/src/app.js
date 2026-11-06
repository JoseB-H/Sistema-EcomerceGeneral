import express from 'express';

export function createApp({ checkDatabase, logger = console }) {
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
  app.use((_req, res) => res.status(404).json({ error: 'not_found' }));
  app.use((_error, _req, res, _next) => {
    try { logger.error({ event: 'internal_error' }); } catch { /* logging must not expose the original error */ }
    res.status(500).json({ error: 'internal_error' });
  });
  return app;
}
