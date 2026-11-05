import { demoWorks } from './demo-data.js';

const normalize = value => value.normalize('NFD').replace(/\p{M}/gu, '').toLocaleLowerCase('es');
const copy = work => ({ ...work, genres: [...work.genres] });

export function createDemoCatalogRepository() {
  return {
    source: Object.freeze({ kind: 'synthetic', persisted: false }),
    async list({ query = '', format = '' } = {}) {
      const needle = normalize(query.trim());
      return demoWorks.filter(work => (!format || work.format === format)
        && normalize(`${work.title} ${work.synopsis} ${work.genres.join(' ')}`).includes(needle)).map(copy);
    },
    async findById(id) {
      const work = demoWorks.find(work => work.id === id);
      return work ? copy(work) : null;
    },
  };
}
