export async function getHealth({ fetchImpl = globalThis.fetch, signal } = {}) {
  const response = await fetchImpl('/api/health', { cache: 'no-store', signal });
  if (response.status !== 200) throw new Error('Health unavailable');
  const result = await response.json();
  if (!result || result.status !== 'ok' || result.database !== 'ok' || Object.keys(result).length !== 2) {
    throw new Error('Invalid health response');
  }
  return { status: 'ok', database: 'ok' };
}
