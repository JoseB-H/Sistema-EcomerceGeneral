import pg from 'pg';

export function createPool(config) {
  const pool = new pg.Pool({
    ...config, max: 5, connectionTimeoutMillis: 1500, query_timeout: 1500,
    statement_timeout: 1500, idleTimeoutMillis: 10000,
  });
  pool.on('error', () => console.error({ event: 'database_idle_error' }));
  return pool;
}

export function createDatabaseCheck(pool) {
  return async () => {
    const { rows } = await pool.query('SELECT 1 AS ok');
    if (rows.length !== 1 || rows[0].ok !== 1) throw new Error('Unexpected database health result');
  };
}
