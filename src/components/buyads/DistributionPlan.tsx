import { useMemo, useState } from 'react';
import { Check, Info, Radio, Users } from 'lucide-react';
import { Card, CardTitle } from '@/components/ui';
import { Badge } from '@/components/ui/Badge';
import { cn } from '@/lib/utils';
import { DISTRIBUTION_CHANNELS, type PhaseOneChannelId } from '@/data/distributionChannels';

interface DistributionPlanProps {
  selectedChannels: string[];
  onToggleChannel: (id: string) => void;
  headline: string;
  description: string;
  url: string;
  onPublishNostr?: () => Promise<void>;
  nostrPublished?: { eventId: string; relays: number } | null;
}

const modeLabel = {
  nip07: 'NIP-07 signer',
  vendor_assisted: 'Vendor-assisted',
  provider_api: 'Provider API later',
  future: 'Future phase',
} as const;

const modeVariant = {
  nip07: 'success',
  vendor_assisted: 'warning',
  provider_api: 'info',
  future: 'outline',
} as const;

export function DistributionPlan({
  selectedChannels,
  onToggleChannel,
  headline,
  description,
  url,
  onPublishNostr,
  nostrPublished,
}: DistributionPlanProps) {
  const [publishing, setPublishing] = useState(false);
  const [publishError, setPublishError] = useState<string | null>(null);
  const phaseOne = useMemo(
    () => DISTRIBUTION_CHANNELS.filter(channel => channel.phase === 1),
    []
  );

  const publish = async () => {
    if (!onPublishNostr) return;
    setPublishing(true);
    setPublishError(null);
    try {
      await onPublishNostr();
    } catch (error) {
      setPublishError(error instanceof Error ? error.message : 'Nostr publishing failed');
    } finally {
      setPublishing(false);
    }
  };

  return (
    <Card className="glass-panel border-accent/25 shadow-[0_0_40px_rgba(244,114,182,0.08)]">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Radio className="w-4 h-4 text-accent" />
            <CardTitle className="mb-0">Distribution plan</CardTitle>
            <Badge variant="accent">Phase 1</Badge>
          </div>
          <p className="text-xs text-muted max-w-2xl leading-relaxed">
            Choose where this campaign should go. Tadbuy coordinates the plan; vendors control their own
            channels and submit proof after delivery.
          </p>
        </div>
        <div className="flex items-center gap-1.5 text-[10px] text-green font-bold shrink-0">
          <Check className="w-3.5 h-3.5" /> Honest delivery states
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {phaseOne.map(channel => {
          const selected = selectedChannels.includes(channel.id);
          const isNostr = channel.id === 'nostr';
          return (
            <button
              key={channel.id}
              type="button"
              onClick={() => onToggleChannel(channel.id)}
              className={cn(
                'text-left rounded-2xl border p-4 transition-all min-h-[150px] focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/60',
                selected
                  ? 'border-accent/60 bg-accent/10 shadow-[0_0_24px_rgba(244,114,182,0.10)]'
                  : 'border-border bg-surface hover:border-accent/35'
              )}
              aria-pressed={selected}
            >
              <div className="flex items-start justify-between gap-3">
                <span className="text-2xl" aria-hidden>{channel.icon}</span>
                <span className={cn(
                  'flex items-center justify-center w-6 h-6 rounded-full border',
                  selected ? 'bg-accent border-accent text-black' : 'border-border text-transparent'
                )}>
                  <Check className="w-3.5 h-3.5" />
                </span>
              </div>
              <div className="mt-3 flex items-center gap-2 flex-wrap">
                <span className="text-sm font-extrabold">{channel.name}</span>
                <Badge variant={modeVariant[channel.mode]}>{modeLabel[channel.mode]}</Badge>
              </div>
              <p className="text-[11px] text-muted leading-relaxed mt-1.5">{channel.description}</p>
              <p className="text-[10px] text-muted/80 mt-3 flex items-start gap-1.5">
                <Info className="w-3 h-3 shrink-0 mt-0.5" />
                Proof: {channel.proof}
              </p>
              {isNostr && selected && (
                <div className="mt-3 pt-3 border-t border-accent/20">
                  <div className="flex items-center gap-1.5 text-[10px] text-accent font-bold">
                    <Users className="w-3 h-3" /> Browser signer publishes the approved note
                  </div>
                </div>
              )}
            </button>
          );
        })}
      </div>

      {selectedChannels.includes('nostr') && (
        <div className="mt-4 rounded-2xl border border-purple/25 bg-purple/5 p-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <div className="min-w-0">
              <div className="text-xs font-extrabold text-purple uppercase tracking-wider">Nostr launch action</div>
              <p className="text-[11px] text-muted mt-1 leading-relaxed">
                Sign the campaign note with a NIP-07 browser extension and publish it to Tadbuy&apos;s relay set.
                No private key enters Tadbuy.
              </p>
              {nostrPublished && (
                <p className="text-[10px] text-green font-mono mt-2 break-all">
                  Published {nostrPublished.eventId.slice(0, 16)}… · acknowledged by {nostrPublished.relays} relay{nostrPublished.relays === 1 ? '' : 's'}
                </p>
              )}
              {publishError && <p className="text-[10px] text-red mt-2">{publishError}</p>}
            </div>
            <button
              type="button"
              onClick={publish}
              disabled={publishing || !!nostrPublished || !headline.trim() || !url.trim()}
              className="min-h-[44px] shrink-0 rounded-xl bg-purple text-black px-4 py-2.5 text-xs font-extrabold transition-opacity hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {publishing ? 'Publishing…' : nostrPublished ? 'Published ✓' : 'Sign & publish Nostr note'}
            </button>
          </div>
          <div className="mt-3 rounded-xl bg-black/20 border border-white/5 px-3 py-2 text-[11px] text-muted">
            <span className="text-text font-semibold">Preview:</span> [Sponsored] {headline || 'Your headline'} · {description || 'Your description'} · {url || 'destination URL'}
          </div>
        </div>
      )}

      <p className="text-[10px] text-muted mt-4">
        Phase 1 channels are deliberately small and accountable. Reddit, Meta, Google/YouTube, Spotify,
        Pinterest, LinkedIn, TikTok, and DOOH remain roadmap channels until provider access and reporting are real.
      </p>
    </Card>
  );
}

export type { PhaseOneChannelId };
