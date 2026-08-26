import type { ReactNode } from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { ChevronRight, Copy, Check } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/Badge';
import { DemoModeBadge } from '@/components/payments/DemoModeBadge';
import { PageJsonLd } from '@/components/seo/PageJsonLd';
import { useToast } from './Toast';

export type Breadcrumb = { label: string; href?: string };

type PageShellProps = {
  title: string;
  description?: string;
  badge?: ReactNode;
  children: ReactNode;
  breadcrumbs?: Breadcrumb[];
  showDemoBadge?: boolean;
  maxWidth?: 'max-w-lg' | 'max-w-2xl' | 'max-w-3xl' | 'max-w-4xl' | 'max-w-5xl' | 'max-w-6xl' | 'max-w-[1440px]';
  actions?: ReactNode;
  faq?: { question: string; answer: string }[];
  canonicalPath?: string; // for "Copy link" action
};

export function PageShell({
  title,
  description,
  badge,
  children,
  breadcrumbs,
  showDemoBadge = false,
  maxWidth = 'max-w-4xl',
  actions,
  faq,
  canonicalPath,
}: PageShellProps) {
  const [copied, setCopied] = useState(false);
  const { addToast } = useToast();

  const handleCopyLink = async () => {
    if (!canonicalPath) return;
    const url = `${window.location.origin}${canonicalPath}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      addToast('Link copied to clipboard', 'success', 2200);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      addToast('Could not copy link', 'error');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn('mx-auto space-y-6 pb-16', maxWidth)}
    >
      {breadcrumbs && breadcrumbs.length > 0 && (
        <nav
          aria-label="Breadcrumb"
          className="flex flex-wrap items-center gap-1 text-[10px] text-muted font-semibold uppercase tracking-wider"
        >
          {breadcrumbs.map((crumb, i) => (
            <span key={crumb.label} className="flex items-center gap-1">
              {i > 0 && <ChevronRight className="w-3 h-3 opacity-50" />}
              {crumb.href ? (
                <Link to={crumb.href} className="hover:text-accent transition-colors">
                  {crumb.label}
                </Link>
              ) : (
                <span className="text-text">{crumb.label}</span>
              )}
            </span>
          ))}
        </nav>
      )}

      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            {badge}
            {showDemoBadge && <DemoModeBadge />}
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-text">{title}</h1>
          {description && <p className="text-sm text-muted max-w-2xl leading-relaxed">{description}</p>}
        </div>

        <div className="flex shrink-0 flex-wrap items-center gap-2">
          {canonicalPath && (
            <button
              type="button"
              onClick={handleCopyLink}
              className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.02] px-3 py-1.5 text-[11px] font-bold text-zinc-300 transition-all hover:border-accent/40 hover:bg-accent/5 hover:text-accent"
              title="Copy link to this page"
            >
              {copied ? <Check className="h-3 w-3 text-green-400" /> : <Copy className="h-3 w-3" />}
              {copied ? 'Copied' : 'Copy link'}
            </button>
          )}
          {actions}
        </div>
      </div>

      {children}

      {faq && faq.length > 0 && (
        <PageJsonLd
          type="FAQPage"
          data={{
            mainEntity: faq.map((f) => ({
              '@type': 'Question',
              name: f.question,
              acceptedAnswer: { '@type': 'Answer', text: f.answer },
            })),
          }}
        />
      )}

      <PageJsonLd
        type="BreadcrumbList"
        data={{
          itemListElement: (breadcrumbs ?? [{ label: title }]).map((c, i) => ({
            '@type': 'ListItem',
            position: i + 1,
            name: c.label,
            item: c.href ? `https://tadbuy.giveabit.io${c.href}` : undefined,
          })),
        }}
      />
    </motion.div>
  );
}

export function PageSection({ title, children, className }: { title?: string; children: ReactNode; className?: string }) {
  return (
    <section className={cn('space-y-3', className)}>
      {title && <h2 className="text-sm font-bold text-text uppercase tracking-widest">{title}</h2>}
      {children}
    </section>
  );
}

export function StatusPill({ status }: { status: 'live' | 'beta' | 'planned' | 'manual' | 'demo' }) {
  const map = {
    live: { label: 'Live', variant: 'success' as const },
    beta: { label: 'Beta', variant: 'accent' as const },
    planned: { label: 'Planned', variant: 'info' as const },
    manual: { label: 'Manual', variant: 'warning' as const },
    demo: { label: 'Demo', variant: 'warning' as const },
  };
  const m = map[status];
  return <Badge variant={m.variant}>{m.label}</Badge>;
}