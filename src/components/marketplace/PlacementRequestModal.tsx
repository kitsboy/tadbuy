import { useState, type FormEvent } from 'react';
import { MessageSquare, ShieldCheck, Users, Zap } from 'lucide-react';
import { Button, Input, Label, Modal, Textarea } from '@/components/ui';
import type { MarketplaceSlot } from '@/data/marketplaceSlots';
import type { PlacementRequest } from '@/data/placementRequests';

interface PlacementRequestModalProps {
  slot: MarketplaceSlot;
  onClose: () => void;
  onCreate: (input: { advertiserLabel: string; budgetSats: number; message: string }) => Promise<PlacementRequest>;
}

export function PlacementRequestModal({ slot, onClose, onCreate }: PlacementRequestModalProps) {
  const [advertiserLabel, setAdvertiserLabel] = useState('');
  const [budgetSats, setBudgetSats] = useState(String(slot.currentBidSats));
  const [message, setMessage] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    const budget = Number(budgetSats);
    if (!Number.isFinite(budget) || budget < slot.minBidSats) {
      setError(`Enter at least ${slot.minBidSats.toLocaleString()} sats.`);
      return;
    }
    setSaving(true);
    try {
      await onCreate({ advertiserLabel, budgetSats: budget, message });
      onClose();
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Placement request could not be saved.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal isOpen onClose={onClose} size="lg" title="Request this community placement" description="Send a vendor-assisted placement request. No payment or publication happens at this step.">
      <form onSubmit={submit} className="p-6 pt-4 space-y-4">
        <div className="rounded-xl border border-accent/25 bg-accent/5 p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="text-sm font-extrabold truncate">{slot.name}</div>
              <div className="text-xs text-muted mt-1">{slot.publisher} · {slot.format}</div>
            </div>
            <span className="shrink-0 text-xs font-mono font-bold text-accent">{slot.currentBidSats.toLocaleString()} sats</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-3 text-[10px] text-muted">
            <span className="flex items-center gap-1.5"><Users className="w-3 h-3" /> {slot.audience}</span>
            <span className="flex items-center gap-1.5"><Zap className="w-3 h-3 text-lightning" /> {slot.platformType || slot.category}</span>
            <span className="flex items-center gap-1.5"><ShieldCheck className="w-3 h-3 text-green" /> Proof required</span>
          </div>
        </div>

        <div>
          <Label htmlFor="placement-advertiser">Advertiser or project name</Label>
          <Input id="placement-advertiser" value={advertiserLabel} onChange={event => setAdvertiserLabel(event.target.value)} placeholder="e.g. Give A Bit" maxLength={80} />
        </div>
        <div>
          <Label htmlFor="placement-budget">Proposed budget (sats)</Label>
          <Input id="placement-budget" type="number" min={slot.minBidSats} value={budgetSats} onChange={event => { setBudgetSats(event.target.value); setError(null); }} />
          {error && <p className="text-[11px] text-red mt-1.5">{error}</p>}
        </div>
        <div>
          <Label htmlFor="placement-message">Message to vendor <span className="normal-case font-normal">— optional</span></Label>
          <Textarea id="placement-message" value={message} onChange={event => setMessage(event.target.value)} placeholder="Share timing, creative context, or questions for the publisher…" rows={3} maxLength={500} />
        </div>

        <div className="rounded-xl border border-border bg-surface/60 p-3 text-[11px] text-muted leading-relaxed flex gap-2">
          <MessageSquare className="w-4 h-4 shrink-0 text-blue mt-0.5" />
          The vendor controls the community account or property. They must accept before publishing, disclose sponsorship, and submit delivery proof afterward.
        </div>
        <div className="flex flex-col-reverse sm:flex-row gap-3 pt-1">
          <Button type="button" variant="secondary" className="flex-1" onClick={onClose} disabled={saving}>Cancel</Button>
          <Button type="submit" className="flex-1" disabled={saving}>{saving ? 'Saving request…' : 'Send placement request'}</Button>
        </div>
      </form>
    </Modal>
  );
}
