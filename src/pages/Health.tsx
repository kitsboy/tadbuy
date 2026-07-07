import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import { Card, CardTitle } from '@/components/ui';
import { Badge } from '@/components/ui/Badge';
import { APP_VERSION } from '@/constants';
import { usePageMeta } from '@/hooks/usePageMeta';
import { checkApiHealth } from '@/lib/apiBase';

export default function Health() {
  usePageMeta('System Health', 'Tadbuy API and service status.');
  const [api, setApi] = useState<Awaited<ReturnType<typeof checkApiHealth>> | null>(null);

  useEffect(() => {
    checkApiHealth().then(setApi);
    const t = setInterval(() => checkApiHealth().then(setApi), 15_000);
    return () => clearInterval(t);
  }, []);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-lg mx-auto space-y-4 pb-16">
      <h1 className="text-2xl font-extrabold">System Health</h1>
      <Card>
        <CardTitle>App</CardTitle>
        <div className="flex justify-between text-sm">
          <span className="text-muted">Version</span>
          <span className="font-mono font-bold">{APP_VERSION}</span>
        </div>
        <div className="flex justify-between text-sm mt-2">
          <span className="text-muted">UI</span>
          <Badge variant="success" dot>Live</Badge>
        </div>
      </Card>
      <Card>
        <CardTitle>API Proxy</CardTitle>
        {!api ? (
          <div className="flex items-center gap-2 text-muted text-sm"><Loader2 className="w-4 h-4 animate-spin" /> Checking…</div>
        ) : (
          <div className="flex items-start gap-3">
            {api.ok ? <CheckCircle2 className="w-5 h-5 text-green" /> : <XCircle className="w-5 h-5 text-accent" />}
            <div>
              <p className="text-sm font-bold">{api.ok ? 'Online' : 'Offline / static mode'}</p>
              <p className="text-xs text-muted mt-1">{api.message}</p>
            </div>
          </div>
        )}
      </Card>
    </motion.div>
  );
}