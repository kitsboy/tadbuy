import { useEffect, useState } from 'react';
import { FlaskConical } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';

export function DemoModeBadge() {
  const [demo, setDemo] = useState<boolean | null>(null);

  useEffect(() => {
    fetch('/api/feature-flags')
      .then(r => r.json())
      .then(d => setDemo(!!d.demoPayments))
      .catch(() => setDemo(true));
  }, []);

  if (demo === null || !demo) return null;

  return (
    <Badge variant="warning" className="gap-1.5">
      <FlaskConical className="w-3 h-3" />
      Demo mode — no real Lightning settlement
    </Badge>
  );
}