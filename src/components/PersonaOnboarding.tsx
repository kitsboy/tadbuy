import { Link } from 'react-router-dom';
import { Megaphone, Store, Globe } from 'lucide-react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { Card, Button } from './ui';
import { cn } from '@/lib/utils';

type Persona = 'advertiser' | 'publisher' | 'browse';

export function PersonaOnboarding({ className }: { className?: string }) {
  const [persona, setPersona] = useLocalStorage<Persona | null>('tadbuy_persona', null);
  const [dismissed, setDismissed] = useLocalStorage<boolean>('tadbuy_persona_dismissed', false);

  if (dismissed || persona) return null;

  const options = [
    {
      id: 'advertiser' as const,
      icon: Megaphone,
      title: 'I want to advertise',
      desc: 'Launch cross-platform campaigns and pay in sats',
      to: '/#campaign-builder',
      color: 'text-accent',
    },
    {
      id: 'browse' as const,
      icon: Globe,
      title: 'Browse ad inventory',
      desc: 'Bid on publisher slots in the marketplace',
      to: '/marketplace',
      color: 'text-blue',
    },
    {
      id: 'publisher' as const,
      icon: Store,
      title: 'I want to sell ad space',
      desc: 'Publisher portal — embed codes, earnings, payouts',
      to: '/publisher',
      color: 'text-green',
    },
  ];

  return (
    <Card className={cn('border-accent/30 bg-accent/5', className)}>
      <div className="text-sm font-extrabold mb-1">What brings you to Tadbuy?</div>
      <p className="text-xs text-muted mb-4">Pick your path — we&apos;ll tailor the experience.</p>
      <div className="grid sm:grid-cols-3 gap-3">
        {options.map(opt => (
          <Link
            key={opt.id}
            to={opt.to}
            onClick={() => { setPersona(opt.id); setDismissed(true); }}
            className="group p-4 rounded-xl border border-border bg-card hover:border-accent/40 transition-all text-left"
          >
            <opt.icon className={cn('w-6 h-6 mb-2', opt.color)} />
            <div className="text-sm font-bold group-hover:text-accent transition-colors">{opt.title}</div>
            <div className="text-[11px] text-muted mt-1 leading-relaxed">{opt.desc}</div>
          </Link>
        ))}
      </div>
      <Button variant="ghost" size="sm" className="mt-3 text-muted" onClick={() => setDismissed(true)}>
        Skip for now
      </Button>
    </Card>
  );
}