export function readConfig(env) {
  const required = name => {
    if (typeof env[name] !== 'string' || env[name].length === 0) throw new Error(`Invalid ${name}`);
    return env[name];
  };
  const port = (name, fallback) => {
    const value = env[name] ?? String(fallback);
    if (!/^\d+$/.test(value) || Number(value) < 1 || Number(value) > 65535) throw new Error(`Invalid ${name}`);
    return Number(value);
  };
  const host = env.PGHOST ?? 'database';
  if (!host.trim()) throw new Error('Invalid PGHOST');
  return {
    port: port('PORT', 3000),
    database: {
      host, port: port('PGPORT', 5432), user: required('PGUSER'),
      password: required('PGPASSWORD'), database: required('PGDATABASE'),
    },
  };
}
