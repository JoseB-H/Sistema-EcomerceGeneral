import { Router } from 'express';

export function createCatalogRouter(repository, logger = console) {
  const router = Router();
  router.use((_req, res, next) => { res.set('Cache-Control', 'no-store'); next(); });
  router.get('/', async (req, res) => {
    const { q = '', format = '' } = req.query;
    if (Object.keys(req.query).some(key => !['q', 'format'].includes(key))
      || typeof q !== 'string' || q.length > 100 || /[\x00-\x1f\x7f]/.test(q)
      || typeof format !== 'string' || !['', 'manga', 'manhwa'].includes(format)) {
      return res.status(400).json({ error: 'invalid_catalog_query' });
    }
    const items = await repository.list({ query: q.trim(), format });
    return res.json({ items, source: repository.source });
  });
  router.get('/:id', async (req, res) => {
    if (req.params.id.length > 80 || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(req.params.id)) return res.status(400).json({ error: 'invalid_work_id' });
    const item = await repository.findById(req.params.id);
    if (!item) return res.status(404).json({ error: 'work_not_found', source: repository.source });
    return res.json({ item, source: repository.source });
  });
  router.use((_error, _req, res, _next) => {
    try { logger.error({ event: 'catalog_unavailable' }); } catch { /* never expose a provider error */ }
    res.status(503).json({ error: 'catalog_unavailable' });
  });
  return router;
}
