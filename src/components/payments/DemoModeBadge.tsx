import { createContext, useContext, type ReactNode } from 'react';
import { FlaskConical } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';

/**
 * Demo mode is PINNED at build time — never derived from a network fetch.
 *
 * Why: this used to fetch `/api/feature-flags` and fail closed to `isDemo = true`.
 * That made the honesty of the money UI an accident of a broken route: on the
 * static host the path answers `404 application/json` (or, before that, the SPA
 * shell as `text/html`), so the badge's visibility depended on the shape of an
 * unrelated response and could silently disappear while no payment behaviour
 * changed at all — an absent badge is indistinguishable from "payments are live".
 *
 * The default is DEMO. It may only be turned off by building with
 * `VITE_DEMO_PAYMENTS=false`, and only once a wallet ledger + spend limits exist
 * — the exact condition `requireLnPayoutsEnabled` already states in
 * `src/lib/api/userAuth.ts`.
 */
export const DEMO_PAYMENTS_ENABLED = import.meta.env.VITE_DEMO_PAYMENTS !== 'false';

interface DemoContextValue {
  isDemo: boolean;
  loading: boolean;
}

const DemoContext = createContext<DemoContextValue>({ isDemo: DEMO_PAYMENTS_ENABLED, loading: false });
export const useDemo = () => useContext(DemoContext);

export function DemoProvider({ children }: { children: ReactNode }) {
  // No fetch, no loading state: the pinned value is known synchronously, so the
  // badge can never be absent because a request was slow, blocked or reshaped.
  const value: DemoContextValue = { isDemo: DEMO_PAYMENTS_ENABLED, loading: false };

  return <DemoContext.Provider value={value}>{children}</DemoContext.Provider>;
}

export function DemoModeBadge() {
  const { isDemo } = useDemo();
  if (!isDemo) return null;

  return (
    <span
      data-demo-mode="pinned"
      title="Demo mode is pinned at build time (VITE_DEMO_PAYMENTS). Real Lightning settlement stays off until a wallet ledger and spend limits are live."
    >
      <Badge variant="warning" className="gap-1.5">
        <FlaskConical className="w-3 h-3" />
        Demo mode — no real Lightning settlement
      </Badge>
    </span>
  );
}
