import { useEffect, useState, createContext, useContext, type ReactNode } from 'react';
import { FlaskConical } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';

interface DemoContextValue {
  isDemo: boolean;
  loading: boolean;
}

const DemoContext = createContext<DemoContextValue>({ isDemo: true, loading: true });
export const useDemo = () => useContext(DemoContext);

export function DemoProvider({ children }: { children: ReactNode }) {
  const [isDemo, setIsDemo] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    fetch('/api/feature-flags')
      .then(r => r.json())
      .then(d => { if (!cancelled) setIsDemo(!!d.demoPayments); })
      .catch(() => { if (!cancelled) setIsDemo(true); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  return (
    <DemoContext.Provider value={{ isDemo, loading }}>
      {children}
    </DemoContext.Provider>
  );
}

export function DemoModeBadge() {
  const { isDemo, loading } = useDemo();
  if (loading || !isDemo) return null;

  return (
    <Badge variant="warning" className="gap-1.5">
      <FlaskConical className="w-3 h-3" />
      Demo mode — no real Lightning settlement
    </Badge>
  );
}