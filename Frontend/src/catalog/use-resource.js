import { useEffect, useState } from 'react';

export function useResource(load) {
  const [attempt, setAttempt] = useState(0);
  const [state, setState] = useState({ status: 'loading', data: null, error: null });
  useEffect(() => {
    const controller = new AbortController();
    let current = true;
    setState({ status: 'loading', data: null, error: null });
    const timer = setTimeout(() => {
      current = false;
      controller.abort();
      setState({ status: 'error', data: null, error: new Error('Request timeout') });
    }, 4000);
    const run = async () => {
      try {
        const data = await load(controller.signal);
        if (current) setState({ status: 'ready', data, error: null });
      } catch (error) {
        if (current) setState({ status: 'error', data: null, error });
      } finally { clearTimeout(timer); }
    };
    void run();
    return () => { current = false; clearTimeout(timer); controller.abort(); };
  }, [load, attempt]);
  return { ...state, retry: () => setAttempt(value => value + 1) };
}
