import express from 'express';
import { chapterNumber, validId } from './validation.js';

export function createReaderRouter(repository, catalog, logger) {
  const router = express.Router({ mergeParams: true });
  router.use(async (req, res, next) => {
    res.set({ 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff', 'Cross-Origin-Resource-Policy': 'same-origin' });
    if (!/^(?:localhost|127\.0\.0\.1|\[::1\])(?::\d{1,5})?$/i.test(req.headers.host ?? '')) return res.status(403).json({ error: 'local_reader_only' });
    if (!['GET', 'HEAD'].includes(req.method)) return res.status(405).set('Allow', 'GET, HEAD').json({ error: 'method_not_allowed' });
    const id = req.params.workId;
    if (!validId(id)) return res.status(404).json({ error: 'not_found' });
    try {
      const work = await catalog.findById(id);
      if (!work) return res.status(404).json({ error: 'not_found' });
      res.locals.work = { id: work.id, title: work.title }; next();
    } catch { unavailable(res, logger); }
  });
  const safe = handler => async (req, res) => {
    try { await handler(req, res); } catch { unavailable(res, logger); }
  };
  const canonical = value => { try { return chapterNumber(value) === value; } catch { return false; } };
  router.get('/', safe(async (_req, res) => {
    res.json({ work: res.locals.work, source: repository.source, chapters: await repository.list(res.locals.work.id) });
  }));
  router.get('/:number', safe(async (req, res) => {
    if (!canonical(req.params.number)) return res.status(404).json({ error: 'not_found' });
    const chapters = await repository.list(res.locals.work.id);
    const index = chapters.findIndex(c => c.number === req.params.number);
    if (index < 0) return res.status(404).json({ error: 'not_found' });
    const detail = await repository.detail(res.locals.work.id, req.params.number);
    if (!detail) return res.status(404).json({ error: 'not_found' });
    res.json({ work: res.locals.work, source: repository.source, ...detail, chapters, previous: chapters[index - 1]?.number ?? null, next: chapters[index + 1]?.number ?? null });
  }));
  router.get('/:number/pages/:index', safe(async (req, res) => {
    if (!canonical(req.params.number) || !/^[1-9]\d{0,2}$/.test(req.params.index) || Number(req.params.index) > 200) return res.status(404).json({ error: 'not_found' });
    const buffer = await repository.page(res.locals.work.id, req.params.number, Number(req.params.index));
    if (!buffer) return res.status(404).json({ error: 'not_found' });
    res.type('image/png').send(buffer);
  }));
  router.use((_req, res) => res.status(404).json({ error: 'not_found' }));
  return router;
}
function unavailable(res, logger) {
  try { logger.error({ event: 'local_reader_unavailable' }); } catch { /* never log content or paths */ }
  return res.status(503).json({ error: 'reader_unavailable' });
}
