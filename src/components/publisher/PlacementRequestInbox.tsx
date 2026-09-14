import { useState } from 'react';
import { Check, CheckCircle2, Clock3, FileCheck2, MessageSquare, Send, X, Zap } from 'lucide-react';
import { Button, Card, CardTitle, Input, Label, Textarea } from '@/components/ui';
import { Alert, Badge } from '@/components/ui/index';
import { usePlacementRequests } from '@/hooks/usePlacementRequests';
import {
  PLACEMENT_STATUS_HELP,
  PLACEMENT_STATUS_LABELS,
  PLACEMENT_STATUS_ORDER,
  type PlacementProof,
  type PlacementRequest,
  type PlacementStatus,
} from '@/data/placementRequests';

function statusVariant(status: PlacementStatus): 'success' | 'warning' | 'info' | 'outline' {
  if (status === 'verified') return 'success';
  if (status === 'proof_submitted' || status === 'published') return 'info';
  if (status === 'accepted') return 'warning';
  return 'outline';
}

function StatusTimeline({ status }: { status: PlacementStatus }) {
  const currentIndex = PLACEMENT_STATUS_ORDER.indexOf(status);
  return (
    <div className="flex items-center gap-1.5 overflow-x-auto pb-1" aria-label="Placement delivery status">
      {PLACEMENT_STATUS_ORDER.map((step, index) => (
        <div key={step} className="flex items-center gap-1.5 shrink-0">
          <span className={`w-2 h-2 rounded-full ${index <= currentIndex ? 'bg-accent' : 'bg-border'}`} />
          <span className={`text-[10px] ${index <= currentIndex ? 'text-text font-bold' : 'text-muted'}`}>
            {PLACEMENT_STATUS_LABELS[step]}
          </span>
          {index < PLACEMENT_STATUS_ORDER.length - 1 && <span className="text-muted/40">→</span>}
        </div>
      ))}
    </div>
  );
}

function ProofForm({ request, onSubmit, busy }: { request: PlacementRequest; onSubmit: (proof: PlacementProof) => void; busy: boolean }) {
  const [proof, setProof] = useState<PlacementProof>({
    url: '',
    screenshotRef: '',
    publishedAt: new Date().toISOString().slice(0, 10),
    notes: '',
  });
  const [error, setError] = useState<string | null>(null);

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!proof.url.trim() || !proof.publishedAt) {
      setError('Add the published URL or event reference and publication date.');
      return;
    }
    onSubmit({ ...proof, url: proof.url.trim(), screenshotRef: proof.screenshotRef.trim(), notes: proof.notes.trim() });
  };

  return (
    <form onSubmit={submit} className="mt-4 border-t border-border pt-4 space-y-3">
      <div className="flex items-center gap-2">
        <FileCheck2 className="w-4 h-4 text-blue" />
        <div className="text-xs font-extrabold">Submit delivery proof</div>
      </div>
      <p className="text-[10px] text-muted leading-relaxed">
        Required for this listing: {request.proofRequirements.join(' · ')}. Proof records delivery evidence only; it does not create impression or conversion data.
      </p>
      <div>
        <Label htmlFor={`proof-url-${request.id}`}>Published URL or event reference</Label>
        <Input id={`proof-url-${request.id}`} value={proof.url} onChange={event => { setProof({ ...proof, url: event.target.value }); setError(null); }} placeholder="https://… or Nostr event ID" maxLength={500} />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <Label htmlFor={`proof-screenshot-${request.id}`}>Screenshot reference <span className="normal-case font-normal">— optional</span></Label>
          <Input id={`proof-screenshot-${request.id}`} value={proof.screenshotRef} onChange={event => setProof({ ...proof, screenshotRef: event.target.value })} placeholder="File name or evidence link" maxLength={500} />
        </div>
        <div>
          <Label htmlFor={`proof-date-${request.id}`}>Publication date</Label>
          <Input id={`proof-date-${request.id}`} type="date" value={proof.publishedAt} onChange={event => setProof({ ...proof, publishedAt: event.target.value })} />
        </div>
      </div>
      <div>
        <Label htmlFor={`proof-notes-${request.id}`}>Vendor note <span className="normal-case font-normal">— optional</span></Label>
        <Textarea id={`proof-notes-${request.id}`} value={proof.notes} onChange={event => setProof({ ...proof, notes: event.target.value })} placeholder="Describe where and when the placement appeared…" rows={2} maxLength={500} />
      </div>
      {error && <p className="text-[11px] text-red">{error}</p>}
      <Button type="submit" size="sm" className="gap-2" disabled={busy}><Send className="w-3.5 h-3.5" /> {busy ? 'Saving proof…' : 'Submit proof'}</Button>
    </form>
  );
}

function RequestCard({ request, onTransition }: { request: PlacementRequest; onTransition: (id: string, status: PlacementStatus, proof?: PlacementProof) => Promise<boolean> }) {
  const [showProof, setShowProof] = useState(false);
  const [busy, setBusy] = useState(false);
  const canAccept = request.status === 'offered';
  const canPublish = request.status === 'accepted';
  const canSubmitProof = request.status === 'published';
  const canReview = request.status === 'proof_submitted';

  const transition = async (status: PlacementStatus, proof?: PlacementProof) => {
    setBusy(true);
    try {
      const ok = await onTransition(request.id, status, proof);
      if (ok && status === 'proof_submitted') setShowProof(false);
    } finally {
      setBusy(false);
    }
  };

  return (
    <Card className="border-border/80 bg-surface/40 p-4 sm:p-5">
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
        <div className="min-w-0 space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant={statusVariant(request.status)} dot>{PLACEMENT_STATUS_LABELS[request.status]}</Badge>
            <span className="text-[10px] text-muted font-mono">{request.id}</span>
            {request.durable && <Badge variant="success">Durable</Badge>}
          </div>
          <h3 className="text-sm font-extrabold">{request.slotName}</h3>
          <p className="text-xs text-muted">{request.publisher} · {request.channel} · {request.format}</p>
          <p className="text-[11px] text-muted leading-relaxed">Advertiser: <span className="text-text font-semibold">{request.advertiserLabel}</span>{request.message && <> · {request.message}</>}</p>
        </div>
        <div className="shrink-0 lg:text-right">
          <div className="text-[10px] uppercase tracking-widest text-muted">Proposed budget</div>
          <div className="text-lg font-extrabold text-accent font-mono">{request.budgetSats.toLocaleString()} sats</div>
          <div className="text-[10px] text-muted">Payment remains staged</div>
        </div>
      </div>

      <div className="mt-4 rounded-xl border border-border bg-black/10 p-3 space-y-2">
        <StatusTimeline status={request.status} />
        <p className="text-[10px] text-muted">{PLACEMENT_STATUS_HELP[request.status]}</p>
      </div>

      {request.proof && (
        <div className="mt-3 rounded-xl border border-blue/25 bg-blue/5 p-3 text-[11px] space-y-1">
          <div className="flex items-center gap-2 text-blue font-bold"><CheckCircle2 className="w-3.5 h-3.5" /> Submitted evidence</div>
          <div className="break-all"><span className="text-muted">Reference:</span> {request.proof.url}</div>
          <div><span className="text-muted">Date:</span> {request.proof.publishedAt}</div>
          {request.proof.screenshotRef && <div className="break-all"><span className="text-muted">Screenshot:</span> {request.proof.screenshotRef}</div>}
          {request.proof.notes && <div><span className="text-muted">Note:</span> {request.proof.notes}</div>}
        </div>
      )}

      {(canAccept || canPublish || canSubmitProof || canReview) && (
        <div className="flex flex-wrap gap-2 mt-4">
          {canAccept && <>
            <Button size="sm" className="gap-1.5" disabled={busy} onClick={() => void transition('accepted')}><Check className="w-3.5 h-3.5" /> Accept request</Button>
            <Button size="sm" variant="secondary" className="gap-1.5" disabled={busy} onClick={() => void transition('declined')}><X className="w-3.5 h-3.5" /> Decline</Button>
          </>}
          {canPublish && <Button size="sm" className="gap-1.5" disabled={busy} onClick={() => void transition('published')}><Send className="w-3.5 h-3.5" /> Mark published</Button>}
          {canSubmitProof && <Button size="sm" variant="secondary" className="gap-1.5" disabled={busy} onClick={() => setShowProof(value => !value)}><FileCheck2 className="w-3.5 h-3.5" /> {showProof ? 'Hide proof form' : 'Submit proof'}</Button>}
          {canReview && <Button size="sm" className="gap-1.5" disabled={busy} onClick={() => void transition('verified')}><CheckCircle2 className="w-3.5 h-3.5" /> Mark proof reviewed</Button>}
        </div>
      )}
      {showProof && canSubmitProof && <ProofForm request={request} busy={busy} onSubmit={proof => void transition('proof_submitted', proof)} />}
    </Card>
  );
}

export function PlacementRequestInbox() {
  const { requests, transitionPlacement, durable, durableLoading } = usePlacementRequests();
  const active = requests.filter(request => request.status !== 'declined' && request.status !== 'verified');

  return (
    <Card className="glass-panel border-blue/20">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <MessageSquare className="w-4 h-4 text-blue" />
            <CardTitle className="mb-0">Community placement requests</CardTitle>
            <Badge variant="info">Phase 2 pilot</Badge>
            {durable && <Badge variant="success">Durable</Badge>}
          </div>
          <p className="text-xs text-muted mt-1 leading-relaxed max-w-2xl">
            Review vendor-assisted requests and record the delivery trail. {durable ? 'These records are loaded from authenticated storage.' : 'These browser-local pilot records are not connected to payment or automatic Reddit publishing.'}
          </p>
        </div>
        <div className="flex items-center gap-1.5 text-[10px] text-muted shrink-0"><Clock3 className="w-3.5 h-3.5" /> {durableLoading ? 'Loading…' : `${active.length} active`}</div>
      </div>

      <Alert variant="warning" className="mb-4">
        Accepting a request is an agreement to coordinate the placement—not a payout authorization. Confirm community rules and sponsorship disclosure before publishing.
      </Alert>

      {requests.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border p-5 text-center text-xs text-muted">
          Placement requests from advertisers will appear here. Start with a real vendor listing and a clear proof contract.
        </div>
      ) : (
        <div className="space-y-3">
          {requests.map(request => <RequestCard key={request.id} request={request} onTransition={transitionPlacement} />)}
        </div>
      )}

      <div className="mt-4 text-[10px] text-muted flex items-start gap-1.5"><Zap className="w-3 h-3 text-lightning mt-0.5 shrink-0" /> Next operational step: move these records to durable backend storage before a live pilot or settlement.</div>
    </Card>
  );
}
