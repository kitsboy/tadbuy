import { ExternalLink } from 'lucide-react';
import { GIVEABIT_ECOSYSTEM } from '@/data/ecosystemConfig';
import { SafeLink } from '@/components/SafeLink';

export function EcosystemLinks({ highlight }: { highlight?: string }) {
  return (
    <div className="flex flex-wrap gap-2">
      {GIVEABIT_ECOSYSTEM.projects.map(p => (
        <SafeLink
          key={p.id}
          href={p.url}
          showIcon
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors ${
            highlight === p.id
              ? 'border-accent bg-accent/10 text-accent'
              : 'border-border text-muted hover:text-text hover:border-muted'
          }`}
        >
          {p.name}
        </SafeLink>
      ))}
    </div>
  );
}