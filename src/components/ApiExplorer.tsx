import { useState } from 'react';
import { Loader2, Play, Copy, CheckCircle2 } from 'lucide-react';
import { Button } from './ui';
import { Badge } from './ui/index';
import { apiFetch } from '@/lib/apiBase';

const METHOD_VARIANT: Record<string, 'success' | 'info' | 'warning' | 'error'> = {
  GET: 'info',
  POST: 'success',
  PUT: 'warning',
  DELETE: 'error',
  PATCH: 'warning',
};

export function ApiExplorer({
  endpoint,
  label,
  method = 'GET',
}: {
  endpoint: string;
  label: string;
  method?: string;
}) {
  const [data, setData] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

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

  const handleCopy = () => {
    if (!data) return;
    navigator.clipboard.writeText(data);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="mt-3">
      <div className="flex items-center gap-2 flex-wrap">
        <Badge variant={METHOD_VARIANT[method] ?? 'default'}>{method}</Badge>
        <code className="text-[10px] font-mono text-muted">{endpoint}</code>
        <Button variant="secondary" size="sm" onClick={run} disabled={loading} className="gap-2 ml-auto">
          {loading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Play className="w-3 h-3" />}
          Try {label}
        </Button>
      </div>
      {error && <p className="text-[10px] text-red mt-2">{error}</p>}
      {data && (
        <div className="relative mt-2">
          <pre className="p-3 rounded-lg bg-surface border border-border text-[10px] font-mono overflow-x-auto max-h-40 text-muted">
            {data}
          </pre>
          <button
            onClick={handleCopy}
            className="absolute top-2 right-2 p-1 rounded-md bg-card hover:bg-white/10 transition-colors"
            title="Copy response"
          >
            {copied ? <CheckCircle2 className="w-3 h-3 text-green" /> : <Copy className="w-3 h-3 text-muted" />}
          </button>
        </div>
      )}
    </div>
  );
}