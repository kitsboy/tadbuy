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
  const sample = !slot.durable;

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    const budget = Number(budgetSats);
    if (!Number.isSafeInteger(budget) || budget < slot.minBidSats) {
      setError(`Enter a whole-sat amount of at least ${slot.minBidSats.toLocaleString()} sats.`);
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
    <Modal
      isOpen
      onClose={onClose}
      size="lg"
      title={sample ? 'Preview a placement request' : 'Request this community placement'}
      description={sample ? 'Local-only example · no vendor is contacted and no sats move.' : 'Send a vendor-assisted request. No payment or publication happens at this step.'}
    >
      <form onSubmit={submit} className="space-y-4 p-6 pt-4">
        {sample && (
          <div className="rounded-xl border border-blue/25 bg-blue/5 p-3 text-[11px] leading-relaxed text-muted">
            <strong className="text-blue">Sample inventory · local preview.</strong> Publisher, audience, and budget details are illustrative. Saving this request does not contact a vendor, reserve inventory, or initiate payment.
          </div>
        )}

        <div className="rounded-xl border border-accent/25 bg-accent/5 p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="truncate text-sm font-extrabold">{slot.name}</div>
              <div className="mt-1 text-xs text-muted">{slot.publisher} · {slot.format}</div>
            </div>
            <span className="shrink-0 text-xs font-mono font-bold text-accent">
              {slot.currentBidSats.toLocaleString()} {sample ? 'example sats' : 'sats'}
            </span>
          </div>
          <div className="mt-3 grid grid-cols-1 gap-2 text-[10px] text-muted sm:grid-cols-3">
            <span className="flex items-center gap-1.5"><Users className="h-3 w-3" /> {sample ? 'Example' : 'Listed'}: {slot.audience}</span>
            <span className="flex items-center gap-1.5"><Zap className="h-3 w-3 text-lightning" /> {slot.platformType || slot.category}</span>
            <span className="flex items-center gap-1.5"><ShieldCheck className="h-3 w-3 text-green" /> Proof required</span>
          </div>
        </div>

        <div>
          <Label htmlFor="placement-advertiser">Advertiser or project name</Label>
          <Input
            id="placement-advertiser"
            value={advertiserLabel}
            onChange={event => setAdvertiserLabel(event.target.value)}
            placeholder="e.g. Give A Bit"
            maxLength={80}
          />
        </div>
        <div>
          <Label htmlFor="placement-budget">{sample ? 'Example budget (sats)' : 'Proposed budget (sats)'}</Label>
          <Input
            id="placement-budget"
            type="number"
            min={slot.minBidSats}
            max={Number.MAX_SAFE_INTEGER}
            step={1}
            value={budgetSats}
            onChange={event => { setBudgetSats(event.target.value); setError(null); }}
          />
          {error && <p role="alert" className="mt-1.5 text-[11px] text-red">{error}</p>}
        </div>
        <div>
          <Label htmlFor="placement-message">{sample ? 'Example message · not sent' : 'Message to vendor'} <span className="normal-case font-normal">— optional</span></Label>
          <Textarea
            id="placement-message"
            value={message}
            onChange={event => setMessage(event.target.value)}
            placeholder={sample ? 'Example context for this local preview…' : 'Share timing, creative context, or questions for the publisher…'}
            rows={3}
            maxLength={500}
          />
        </div>

        <div className="flex gap-2 rounded-xl border border-border bg-surface/60 p-3 text-[11px] leading-relaxed text-muted">
          <MessageSquare className="mt-0.5 h-4 w-4 shrink-0 text-blue" />
          {sample
            ? 'In a real placement, the vendor would control the property, accept before publishing, disclose sponsorship, and submit delivery proof. This sample does none of those things.'
            : 'The vendor controls the community account or property. They must accept before publishing, disclose sponsorship, and submit delivery proof afterward.'}
        </div>

        <div className="flex flex-col-reverse gap-3 pt-1 sm:flex-row">
          <Button type="button" variant="secondary" className="flex-1" onClick={onClose} disabled={saving}>Cancel</Button>
          <Button type="submit" className="flex-1" disabled={saving}>
            {saving ? (sample ? 'Saving preview…' : 'Sending request…') : sample ? 'Save local preview' : 'Send placement request'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
