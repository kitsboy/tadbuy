import { useEffect, useState, type FormEvent } from 'react';
import { Check, Edit3, Loader2, Plus, Radio, Save, X } from 'lucide-react';
import { Button, Card, CardTitle, Input, Label, Select, Textarea } from '@/components/ui';
import { Badge } from '@/components/ui/Badge';
import { useAuth } from '@/components/AuthProvider';
import { useToast } from '@/components/Toast';
import { authFetch } from '@/lib/authFetch';
import type { VendorInventoryRecord } from '@/lib/db/types';

const CHANNELS = ['Nostr', 'Reddit', 'Blogs', 'Newsletters', 'Podcasts'] as const;
const EMPTY_FORM = {
  name: '',
  channel: 'Nostr',
  format: '',
  placement: '',
  audience: '',
  geography: '',
  minBidSats: '0',
  proofRequirements: 'Published URL\nPlacement screenshot\nPublication date',
};

type InventoryForm = typeof EMPTY_FORM;

function splitLines(value: string): string[] {
  return value.split(/\n|,/).map(item => item.trim()).filter(Boolean).slice(0, 10);
}

function toForm(item: VendorInventoryRecord): InventoryForm {
  return {
    name: item.name,
    channel: item.channel,
    format: item.format,
    placement: item.placement,
    audience: item.audience,
    geography: item.geography.join(', '),
    minBidSats: String(item.minBidSats),
    proofRequirements: item.proofRequirements.join('\n'),
  };
}

export function VendorInventoryManager() {
  const { user } = useAuth();
  const { addToast } = useToast();
  const [inventory, setInventory] = useState<VendorInventoryRecord[]>([]);
  const [form, setForm] = useState<InventoryForm>(EMPTY_FORM);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(Boolean(user));
  const [saving, setSaving] = useState(false);
  const [durable, setDurable] = useState(false);

  const loadInventory = async () => {
    if (!user) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const response = await authFetch('/api/vendor/inventory');
      if (!response.ok) return;
      const body = await response.json() as { inventory?: VendorInventoryRecord[]; durable?: boolean };
      setInventory(Array.isArray(body.inventory) ? body.inventory : []);
      setDurable(body.durable === true);
    } catch {
      // The manager remains usable as a clear staged surface when the API is absent.
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadInventory();
  }, [user]);

  const update = (key: keyof InventoryForm, value: string) => {
    setForm(current => ({ ...current, [key]: value }));
  };

  const reset = () => {
    setForm(EMPTY_FORM);
    setEditingId(null);
  };

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (!user) {
      addToast('Sign in to create owned inventory.', 'info', 2600);
      return;
    }
    setSaving(true);
    const payload = {
      name: form.name.trim(),
      channel: form.channel,
      format: form.format.trim(),
      placement: form.placement.trim(),
      audience: form.audience.trim(),
      geography: splitLines(form.geography),
      minBidSats: Number(form.minBidSats) || 0,
      proofRequirements: splitLines(form.proofRequirements),
      disclosureRequired: true,
    };

    try {
      const response = await authFetch(editingId ? `/api/vendor/inventory/${editingId}` : '/api/vendor/inventory', {
        method: editingId ? 'PATCH' : 'POST',
        body: JSON.stringify(payload),
      });
      const body = await response.json().catch(() => ({})) as { inventory?: VendorInventoryRecord; durable?: boolean; error?: string };
      if (!response.ok) {
        addToast(body.error ?? 'Inventory storage is staged until the backend is configured.', 'info', 3200);
        return;
      }
      setDurable(body.durable === true);
      if (body.inventory) {
        setInventory(current => editingId
          ? current.map(item => item.id === editingId ? body.inventory! : item)
          : [body.inventory!, ...current]);
      }
      addToast(editingId ? 'Inventory listing updated.' : 'Inventory draft created.', 'success', 2400);
      reset();
    } catch {
      addToast('Inventory backend unavailable; nothing was published.', 'info', 3200);
    } finally {
      setSaving(false);
    }
  };

  const changeStatus = async (item: VendorInventoryRecord, status: VendorInventoryRecord['status']) => {
    if (!user) return;
    try {
      const response = await authFetch(`/api/vendor/inventory/${item.id}`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      });
      const body = await response.json().catch(() => ({})) as { inventory?: VendorInventoryRecord; durable?: boolean; error?: string };
      if (!response.ok || !body.inventory) {
        addToast(body.error ?? 'Inventory status could not be saved.', 'info', 2800);
        return;
      }
      setDurable(body.durable === true);
      setInventory(current => current.map(entry => entry.id === item.id ? body.inventory! : entry));
    } catch {
      addToast('Inventory backend unavailable; status was not changed.', 'info', 2800);
    }
  };

  return (
    <Card className="glass-panel border-blue/20">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <Radio className="w-4 h-4 text-blue" />
            <CardTitle className="mb-0">Owned inventory</CardTitle>
            <Badge variant={durable ? 'success' : 'outline'}>{durable ? 'Durable' : 'Backend staged'}</Badge>
          </div>
          <p className="text-xs text-muted mt-1 leading-relaxed max-w-2xl">
            Create listings only for channels or properties you control. New listings start private; publishing is an explicit owner action. No audience figures are generated here.
          </p>
        </div>
        <Button size="sm" variant="secondary" className="gap-1.5" onClick={() => { reset(); window.setTimeout(() => document.getElementById('vendor-inventory-form')?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 0); }}>
          <Plus className="w-3.5 h-3.5" /> New listing
        </Button>
      </div>

      {loading ? (
        <div className="flex items-center gap-2 text-xs text-muted py-5"><Loader2 className="w-4 h-4 animate-spin" /> Loading owned inventory…</div>
      ) : inventory.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border p-5 text-center text-xs text-muted">
          {user ? 'No durable listings yet. Create a draft below after the database migration is applied.' : 'Sign in to create inventory owned by your account.'}
        </div>
      ) : (
        <div className="space-y-2 mb-5">
          {inventory.map(item => (
            <div key={item.id} className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 rounded-xl border border-border bg-surface/50 p-3.5">
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm font-bold truncate">{item.name}</span>
                  <Badge variant={item.status === 'published' ? 'success' : item.status === 'paused' ? 'warning' : 'outline'}>{item.status}</Badge>
                </div>
                <div className="text-[11px] text-muted mt-1">{item.channel} · {item.format} · {item.placement}</div>
                <div className="text-[10px] text-muted mt-1">Proof: {item.proofRequirements.join(' · ')}</div>
              </div>
              <div className="flex flex-wrap gap-2 shrink-0">
                <Button size="sm" variant="secondary" className="gap-1.5" onClick={() => { setEditingId(item.id); setForm(toForm(item)); }}><Edit3 className="w-3.5 h-3.5" /> Edit</Button>
                {item.status === 'published' ? (
                  <Button size="sm" variant="secondary" onClick={() => void changeStatus(item, 'paused')}>Pause</Button>
                ) : (
                  <Button size="sm" className="gap-1.5" onClick={() => void changeStatus(item, 'published')}><Check className="w-3.5 h-3.5" /> Publish</Button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <form id="vendor-inventory-form" onSubmit={submit} className="border-t border-border pt-5 space-y-4">
        <div className="flex items-center justify-between gap-3">
          <div className="text-xs font-extrabold uppercase tracking-wider text-muted">{editingId ? 'Edit listing' : 'Create listing'}</div>
          {editingId && <Button type="button" size="sm" variant="secondary" className="gap-1.5" onClick={reset}><X className="w-3.5 h-3.5" /> Cancel edit</Button>}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div><Label htmlFor="inventory-name">Listing name</Label><Input id="inventory-name" value={form.name} onChange={event => update('name', event.target.value)} placeholder="e.g. Weekly community newsletter" maxLength={120} required /></div>
          <div><Label htmlFor="inventory-channel">Channel</Label><Select id="inventory-channel" value={form.channel} onChange={event => update('channel', event.target.value)}>{CHANNELS.map(channel => <option key={channel}>{channel}</option>)}</Select></div>
          <div><Label htmlFor="inventory-format">Format</Label><Input id="inventory-format" value={form.format} onChange={event => update('format', event.target.value)} placeholder="Sponsored note, newsletter section, audio read…" maxLength={120} required /></div>
          <div><Label htmlFor="inventory-placement">Placement</Label><Input id="inventory-placement" value={form.placement} onChange={event => update('placement', event.target.value)} placeholder="Top of feed, issue sponsor, mid-roll…" maxLength={160} required /></div>
          <div><Label htmlFor="inventory-geography">Geography / language</Label><Input id="inventory-geography" value={form.geography} onChange={event => update('geography', event.target.value)} placeholder="Global, US, English" maxLength={200} /></div>
          <div><Label htmlFor="inventory-min-bid">Minimum budget (sats)</Label><Input id="inventory-min-bid" type="number" min="0" value={form.minBidSats} onChange={event => update('minBidSats', event.target.value)} /></div>
        </div>
        <div><Label htmlFor="inventory-audience">Audience description <span className="normal-case font-normal">— evidence-led, not a guaranteed reach figure</span></Label><Textarea id="inventory-audience" value={form.audience} onChange={event => update('audience', event.target.value)} placeholder="Who uses this property or community?" rows={3} maxLength={500} /></div>
        <div><Label htmlFor="inventory-proof">Proof requirements <span className="normal-case font-normal">— one per line</span></Label><Textarea id="inventory-proof" value={form.proofRequirements} onChange={event => update('proofRequirements', event.target.value)} rows={3} maxLength={600} /></div>
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <Button type="submit" className="gap-2" disabled={saving || !user}>{saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}{saving ? 'Saving…' : editingId ? 'Save listing' : 'Create draft'}</Button>
          {!user && <span className="text-[11px] text-muted">Sign in required for owned inventory.</span>}
          {user && <span className="text-[10px] text-muted">Draft first · owner publishes · payment remains staged</span>}
        </div>
      </form>
    </Card>
  );
}
