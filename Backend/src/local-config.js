import { readConfig } from './config.js';

export function readLocalConfig(env) {
  const port = env.PORT ?? '3000';
  if (!/^\d+$/.test(port) || Number(port) < 1 || Number(port) > 65535) throw new Error('Invalid PORT');
  const configured = ['PGUSER', 'PGPASSWORD', 'PGDATABASE'].some(name => !!env[name]);
  return {
    port: Number(port),
    database: configured ? readConfig({ ...env, PGHOST: env.PGHOST ?? '127.0.0.1' }).database : null,
  };
}
