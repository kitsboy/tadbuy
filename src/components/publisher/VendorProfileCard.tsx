import { useEffect, useMemo, useState, type FormEvent } from 'react';
import { Check, IdCard, Loader2, ShieldCheck, Zap } from 'lucide-react';
import { Button, Card, CardTitle, Input, Label, Textarea } from '@/components/ui';
import { useAuth } from '@/components/AuthProvider';
import { useToast } from '@/components/Toast';
import { authFetch } from '@/lib/authFetch';
import { useLocalStorage } from '@/hooks/useLocalStorage';

const PROFILE_KEY = 'tadbuy:vendor_profile';
const CHANNELS = ['Nostr', 'Reddit communities', 'Websites & blogs', 'Newsletters', 'Podcasts'] as const;

type VendorProfile = {
  displayName: string;
  npub: string;
  nip05: string;
  lightningAddress: string;
  audience: string;
  geography: string;
  channels: string[];
};

type Nip05State = 'unverified' | 'pending' | 'verified' | 'failed';

const EMPTY_PROFILE: VendorProfile = {
  displayName: '',
  npub: '',
  nip05: '',
  lightningAddress: '',
  audience: '',
  geography: '',
  channels: [],
};

function fromRemoteProfile(value: unknown): (VendorProfile & { nip05Status?: Nip05State }) | null {
  if (!value || typeof value !== 'object') return null;
  const profile = value as Record<string, unknown>;
  return {
    displayName: typeof profile.displayName === 'string' ? profile.displayName : '',
    npub: typeof profile.npub === 'string' ? profile.npub : '',
    nip05: typeof profile.nip05 === 'string' ? profile.nip05 : '',
    lightningAddress: typeof profile.lightningAddress === 'string' ? profile.lightningAddress : '',
    audience: typeof profile.audience === 'string' ? profile.audience : '',
    geography: typeof profile.geography === 'string' ? profile.geography : '',
    channels: Array.isArray(profile.channels)
      ? profile.channels.filter((channel): channel is string => typeof channel === 'string')
      : [],
    ...(typeof profile.nip05Status === 'string' ? { nip05Status: profile.nip05Status as Nip05State } : {}),
  };
}

export function VendorProfileCard() {
  const { user } = useAuth();
  const { addToast } = useToast();
  const [savedProfile, setSavedProfile] = useLocalStorage<VendorProfile>(PROFILE_KEY, EMPTY_PROFILE);
  const [profile, setProfile] = useState<VendorProfile>(savedProfile);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(Boolean(user));
  const [saving, setSaving] = useState(false);
  const [durable, setDurable] = useState(false);
  const [nip05Status, setNip05Status] = useState<Nip05State>('unverified');
  const [verifyingNip05, setVerifyingNip05] = useState(false);
  const [nip05Message, setNip05Message] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      setDurable(false);
      return;
    }

    let cancelled = false;
    setLoading(true);
    authFetch('/api/vendor/profile')
      .then(async response => {
        if (!response.ok) return null;
        const body = await response.json() as { profile?: unknown; durable?: boolean };
        return { profile: fromRemoteProfile(body.profile), durable: body.durable === true };
      })
      .then(result => {
        if (cancelled) return;
        if (result?.profile) {
          setProfile(result.profile);
          setSavedProfile(result.profile);
          setDurable(result.durable);
          setNip05Status(result.profile.nip05Status ?? 'unverified');
        }
      })
      .catch(() => {
        // Local pilot data remains available while the API is not configured.
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [setSavedProfile, user]);

  const completeness = useMemo(() => {
    const fields = [profile.displayName, profile.npub, profile.nip05, profile.lightningAddress, profile.audience, profile.geography];
    return Math.round((fields.filter(Boolean).length / fields.length) * 100);
  }, [profile]);

  const update = <K extends keyof VendorProfile>(key: K, value: VendorProfile[K]) => {
    setProfile(current => ({ ...current, [key]: value }));
    setSaved(false);
  };

  const toggleChannel = (channel: string) => {
    update('channels', profile.channels.includes(channel)
      ? profile.channels.filter(item => item !== channel)
      : [...profile.channels, channel]);
  };

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setSavedProfile(profile);

    if (!user) {
      setSaved(true);
      setDurable(false);
      setSaving(false);
      return;
    }

    try {
      const response = await authFetch('/api/vendor/profile', {
        method: 'PUT',
        body: JSON.stringify(profile),
      });
      if (response.ok) {
        const body = await response.json() as { profile?: unknown; durable?: boolean };
        const remote = fromRemoteProfile(body.profile);
        if (remote) {
          setProfile(remote);
          setSavedProfile(remote);
          setNip05Status(remote.nip05Status ?? 'unverified');
        } else {
          setNip05Status('unverified');
        }
        setDurable(body.durable === true);
        setNip05Message(null);
        setSaved(true);
        addToast(body.durable === true ? 'Vendor profile saved securely.' : 'Profile saved locally for the pilot.', 'success', 2600);
      } else {
        setDurable(false);
        setSaved(true);
        addToast('Backend storage is staged; profile saved locally for this pilot.', 'info', 3200);
      }
    } catch {
      setDurable(false);
      setSaved(true);
      addToast('Backend unavailable; profile saved locally for this pilot.', 'info', 3200);
    } finally {
      setSaving(false);
    }
  };

  const verifyNip05 = async () => {
    if (!user || !profile.nip05.trim() || !profile.npub.trim()) {
      setNip05Message('Save a profile with both NIP-05 and npub before checking identity.');
      return;
    }
    setVerifyingNip05(true);
    setNip05Status('pending');
    setNip05Message(null);
    try {
      const response = await authFetch('/api/vendor/nip05/verify', {
        method: 'POST',
        body: JSON.stringify({ nip05: profile.nip05, npub: profile.npub }),
      });
      const body = await response.json().catch(() => ({})) as { status?: Nip05State; error?: string; profile?: { nip05Status?: Nip05State } };
      const status = body.status ?? body.profile?.nip05Status ?? 'failed';
      setNip05Status(status);
      setNip05Message(response.ok ? (status === 'verified' ? 'Resolver response matched this npub.' : 'Resolver response did not match this npub.') : (body.error ?? 'NIP-05 check could not be completed.'));
    } catch {
      setNip05Status('failed');
      setNip05Message('NIP-05 resolver unavailable; no identity claim was verified.');
    } finally {
      setVerifyingNip05(false);
    }
  };

  const nip05Label = nip05Status === 'verified' ? 'Resolver matched' : nip05Status === 'failed' ? 'Check failed' : nip05Status === 'pending' ? 'Checking…' : 'Not checked';

  return (
    <Card className="glass-panel border-accent/20">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <IdCard className="w-4 h-4 text-accent" />
            <CardTitle className="mb-0">Vendor profile</CardTitle>
            <span className="text-[10px] font-bold uppercase tracking-wider text-lightning border border-lightning/30 bg-lightning/10 rounded-full px-2 py-0.5">Pilot</span>
            {user && <span className={`text-[10px] font-bold uppercase tracking-wider rounded-full px-2 py-0.5 border ${durable ? 'text-green border-green/30 bg-green/10' : 'text-muted border-border bg-surface'}`}>
              {durable ? 'Durable' : 'Local fallback'}
            </span>}
          </div>
          <p className="text-xs text-muted mt-1 leading-relaxed max-w-2xl">
            Tell advertisers who controls the inventory. {user ? 'Signed-in profiles use the authenticated backend when it is configured.' : 'Sign in to request durable account storage.'} NIP-05 checks create resolver evidence only; they do not grant blanket trust or payout approval.
          </p>
        </div>
        <div className="shrink-0 text-right">
          <div className="text-[10px] uppercase tracking-widest text-muted">Profile completeness</div>
          <div className="text-lg font-extrabold text-accent">{completeness}%</div>
        </div>
      </div>

      <form onSubmit={submit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <Label htmlFor="vendor-display-name">Public display name</Label>
            <Input id="vendor-display-name" value={profile.displayName} onChange={event => update('displayName', event.target.value)} placeholder="e.g. Nostr Community Hub" maxLength={80} required />
          </div>
          <div>
            <Label htmlFor="vendor-nip05">NIP-05 identifier <span className="normal-case font-normal">— resolver evidence</span></Label>
            <Input id="vendor-nip05" value={profile.nip05} onChange={event => { update('nip05', event.target.value); setNip05Status('unverified'); setNip05Message(null); }} placeholder="you@example.com" maxLength={120} />
          </div>
          <div>
            <Label htmlFor="vendor-npub">Nostr npub</Label>
            <Input id="vendor-npub" value={profile.npub} onChange={event => { update('npub', event.target.value); setNip05Status('unverified'); setNip05Message(null); }} placeholder="npub1…" maxLength={120} />
          </div>
          <div>
            <Label htmlFor="vendor-lightning">Lightning Address <span className="normal-case font-normal">— payouts staged</span></Label>
            <Input id="vendor-lightning" value={profile.lightningAddress} onChange={event => update('lightningAddress', event.target.value)} placeholder="you@wallet.example" maxLength={120} />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <Label htmlFor="vendor-audience">Audience description</Label>
            <Textarea id="vendor-audience" value={profile.audience} onChange={event => update('audience', event.target.value)} placeholder="Who do you reach? Be specific and evidence-led." rows={3} maxLength={500} />
          </div>
          <div>
            <Label htmlFor="vendor-geography">Geography and language</Label>
            <Textarea id="vendor-geography" value={profile.geography} onChange={event => update('geography', event.target.value)} placeholder="e.g. Global, English and Spanish; note any limits." rows={3} maxLength={300} />
          </div>
        </div>

        <fieldset>
          <legend className="block text-[11px] font-bold text-muted mb-2 uppercase tracking-wider">Channels you control</legend>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {CHANNELS.map(channel => {
              const checked = profile.channels.includes(channel);
              return (
                <label key={channel} className="flex items-center gap-2 rounded-xl border border-border bg-surface/60 px-3 py-2.5 text-xs cursor-pointer hover:border-accent/40 transition-colors">
                  <input type="checkbox" checked={checked} onChange={() => toggleChannel(channel)} className="accent-accent" />
                  <span>{channel}</span>
                </label>
              );
            })}
          </div>
        </fieldset>

        <div className="flex flex-col sm:flex-row sm:items-center gap-3 pt-1">
          <Button type="submit" size="sm" className="gap-2" disabled={loading || saving}>
            {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
            {saving ? 'Saving…' : 'Save pilot profile'}
          </Button>
          {user && <Button type="button" size="sm" variant="secondary" className="gap-2" onClick={() => void verifyNip05()} disabled={verifyingNip05 || saving || !profile.nip05.trim() || !profile.npub.trim()}>
            {verifyingNip05 ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <ShieldCheck className="w-3.5 h-3.5" />}
            {verifyingNip05 ? 'Checking…' : 'Check NIP-05'}
          </Button>}
          {saved && <span className="text-[11px] text-green flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5" /> {durable ? 'Saved to authenticated storage' : 'Saved locally for this pilot'}</span>}
          {user && <span className={`text-[11px] flex items-center gap-1.5 ${nip05Status === 'verified' ? 'text-green' : nip05Status === 'failed' ? 'text-red' : 'text-muted'}`}><IdCard className="w-3.5 h-3.5" /> NIP-05: {nip05Label}</span>}
          <span className="text-[10px] text-muted flex items-center gap-1.5 sm:ml-auto"><Zap className="w-3 h-3 text-lightning" /> No payout or identity verification is triggered automatically</span>
        </div>
        {nip05Message && <p className={`text-[11px] ${nip05Status === 'verified' ? 'text-green' : nip05Status === 'failed' ? 'text-red' : 'text-muted'}`}>{nip05Message}</p>}
      </form>
    </Card>
  );
}
