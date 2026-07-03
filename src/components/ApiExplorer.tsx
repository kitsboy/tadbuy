import { useState } from 'react';
import { Loader2, Play } from 'lucide-react';
import { Button } from './ui';
import { apiFetch } from '@/lib/apiBase';

export function ApiExplorer({ endpoint, label }: { endpoint: string; label: string }) {
  const [data, setData] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const run = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiFetch(endpoint);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      setData(JSON.stringify(json, null, 2));
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Request failed — API may be offline (see /beta)');
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-3">
      <Button variant="secondary" size="sm" onClick={run} disabled={loading} className="gap-2">
        {loading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Play className="w-3 h-3" />}
        Try {label}
      </Button>
      {error && <p className="text-[10px] text-red mt-2">{error}</p>}
      {data && (
        <pre className="mt-2 p-3 rounded-lg bg-surface border border-border text-[10px] font-mono overflow-x-auto max-h-40 text-muted">
          {data}
        </pre>
      )}
    </div>
  );
}