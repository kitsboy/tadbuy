import type { ReactNode } from 'react';
import { Badge } from '@/components/ui/Badge';

/**
 * Labelled preview wrapper for account-scoped routes.
 *
 * Accounts are intentionally NOT part of this preview build (the platform has
 * no account backend on the static host, so a sign-in wall nobody can pass is
 * worse than an honest preview). These routes render their sample/static data
 * under one banner instead of a sign-in wall. Same pattern as /metrics
 * ("Sample Data") and /marketplace ("DEMO MODE").
 *
 * When real accounts land (Supabase Auth, see the sibling real-backend card),
 * this wrapper is replaced by a genuine auth gate — not before.
 */
export function AccountPreviewBanner({ children }: { children: ReactNode }) {
  return (
    <div className="space-y-4">
      <div className="flex justify-center">
        <Badge variant="warning" className="gap-1.5" data-account-preview="true">
          🔐 Preview build — accounts are not available yet; showing sample data
        </Badge>
      </div>
      {children}
    </div>
  );
}
