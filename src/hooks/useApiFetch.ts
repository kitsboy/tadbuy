import { useState, useEffect, useCallback, useRef } from 'react';

const cache = new Map<string, { data: unknown; ts: number }>();
const CACHE_TTL = 30_000;

export function useApiFetch<T>(url: string | null, opts?: { ttl?: number; skip?: boolean }) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(!!url && !opts?.skip);
  const [error, setError] = useState<string | null>(null);
  const mounted = useRef(true);

  const fetchData = useCallback(async (force = false) => {
    if (!url || opts?.skip) return;
    const ttl = opts?.ttl ?? CACHE_TTL;
    const hit = cache.get(url);
    if (!force && hit && Date.now() - hit.ts < ttl) {
      setData(hit.data as T);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`${res.status}`);
      const json = await res.json() as T;
      cache.set(url, { data: json, ts: Date.now() });
      if (mounted.current) setData(json);
    } catch (e) {
      if (mounted.current) setError(e instanceof Error ? e.message : 'Failed');
    } finally {
      if (mounted.current) setLoading(false);
    }
  }, [url, opts?.skip, opts?.ttl]);

  useEffect(() => {
    mounted.current = true;
    fetchData();
    return () => { mounted.current = false; };
  }, [fetchData]);

  return { data, loading, error, refetch: () => fetchData(true) };
}