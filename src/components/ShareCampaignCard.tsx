import { useEffect, useState } from 'react';
import { Twitter, Linkedin, Zap, Copy, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui';
import { useCopyToClipboard } from '@/hooks/useCopyToClipboard';
import { PROJECT_STATE } from '@/data/projectState';

export interface ShareCampaignCardProps {
  campaignId: string;
  campaignName: string;
  headline?: string;
  status?: string;
  budgetSats?: number;
}

interface ShareCardData {
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  shareUrl: string;
  tweetText: string;
  nostrText: string;
}

export function ShareCampaignCard({
  campaignId,
  campaignName,
  headline,
  status = 'live',
  budgetSats,
}: ShareCampaignCardProps) {
  const [card, setCard] = useState<ShareCardData | null>(null);
  const { copy, copied } = useCopyToClipboard();

  useEffect(() => {
    const params = new URLSearchParams({
      id: campaignId,
      name: campaignName,
      ...(headline ? { headline } : {}),
      status,
      ...(budgetSats != null ? { budgetSats: String(budgetSats) } : {}),
    });

    fetch(`/api/delight/share-card?${params}`)
      .then((r) => r.json())
      .then(setCard)
      .catch(() => {
        const base = PROJECT_STATE.liveUrl;
        setCard({
          ogTitle: `${campaignName} · Tadbuy Campaign`,
          ogDescription: headline ?? 'Bitcoin-native advertising, paid in sats.',
          ogImage: `${base}/og-image.svg`,
          shareUrl: `${base}/embed/metrics/${campaignId}`,
          tweetText: `🚀 ${campaignName} is live on Tadbuy — ${headline ?? 'Bitcoin-native ads'}. ${base}`,
          nostrText: `Campaign ${campaignName} on Tadbuy ${base}/embed/metrics/${campaignId}`,
        });
      });
  }, [campaignId, campaignName, headline, status, budgetSats]);

  if (!card) {
    return <div className="h-24 rounded-xl bg-surface animate-pulse border border-border" />;
  }

  const shareOgText = `${card.ogTitle}\n${card.ogDescription}\n${card.shareUrl}`;

  return (
    <div className="rounded-xl border border-border bg-surface/50 p-4 space-y-3">
      <div className="flex gap-3">
        <img
          src={card.ogImage}
          alt=""
          className="w-16 h-16 rounded-lg border border-border object-cover bg-card shrink-0"
        />
        <div className="min-w-0">
          <p className="text-sm font-bold text-text truncate">{card.ogTitle}</p>
          <p className="text-[11px] text-muted line-clamp-2 mt-0.5">{card.ogDescription}</p>
          <p className="text-[10px] font-mono text-accent/80 truncate mt-1">{card.shareUrl}</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <Button
          variant="secondary"
          size="sm"
          className="gap-1.5"
          onClick={() => window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(card.tweetText)}`, '_blank')}
        >
          <Twitter className="w-3.5 h-3.5" /> X
        </Button>
        <Button
          variant="secondary"
          size="sm"
          className="gap-1.5"
          onClick={() => window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(card.shareUrl)}`, '_blank')}
        >
          <Linkedin className="w-3.5 h-3.5" /> LinkedIn
        </Button>
        <Button
          variant="secondary"
          size="sm"
          className="gap-1.5"
          onClick={() => window.open('https://njump.me/', '_blank')}
        >
          <Zap className="w-3.5 h-3.5" /> Nostr
        </Button>
        <Button
          variant="secondary"
          size="sm"
          className="gap-1.5"
          onClick={() => copy(shareOgText)}
        >
          {copied ? <CheckCircle2 className="w-3.5 h-3.5 text-green" /> : <Copy className="w-3.5 h-3.5" />}
          Copy OG text
        </Button>
      </div>
    </div>
  );
}