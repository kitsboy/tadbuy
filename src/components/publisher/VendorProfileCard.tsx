import { useMemo, useState, type FormEvent } from 'react';
import { Check, IdCard, ShieldCheck, Zap } from 'lucide-react';
import { Button, Card, CardTitle, Input, Label, Textarea } from '@/components/ui';
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

const EMPTY_PROFILE: VendorProfile = {
  displayName: '',
  npub: '',
  nip05: '',
  lightningAddress: '',
  audience: '',
  geography: '',
  channels: [],
};

export function VendorProfileCard() {
  const [savedProfile, setSavedProfile] = useLocalStorage<VendorProfile>(PROFILE_KEY, EMPTY_PROFILE);
  const [profile, setProfile] = useState<VendorProfile>(savedProfile);
  const [saved, setSaved] = useState(false);

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

  const submit = (event: FormEvent) => {
    event.preventDefault();
    setSavedProfile(profile);
    setSaved(true);
  };

  return (
    <Card className="glass-panel border-accent/20">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <IdCard className="w-4 h-4 text-accent" />
            <CardTitle className="mb-0">Vendor profile</CardTitle>
            <span className="text-[10px] font-bold uppercase tracking-wider text-lightning border border-lightning/30 bg-lightning/10 rounded-full px-2 py-0.5">Pilot</span>
          </div>
          <p className="text-xs text-muted mt-1 leading-relaxed max-w-2xl">
            Tell advertisers who controls the inventory. These details are saved in this browser until durable account storage is available; NIP-05 is not verified by this form.
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
            <Input id="vendor-display-name" value={profile.displayName} onChange={event => update('displayName', event.target.value)} placeholder="e.g. Nostr Community Hub" maxLength={80} />
          </div>
          <div>
            <Label htmlFor="vendor-nip05">NIP-05 identifier <span className="normal-case font-normal">— planned verification</span></Label>
            <Input id="vendor-nip05" value={profile.nip05} onChange={event => update('nip05', event.target.value)} placeholder="you@example.com" maxLength={120} />
          </div>
          <div>
            <Label htmlFor="vendor-npub">Nostr npub</Label>
            <Input id="vendor-npub" value={profile.npub} onChange={event => update('npub', event.target.value)} placeholder="npub1…" maxLength={120} />
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
          <Button type="submit" size="sm" className="gap-2"><Check className="w-3.5 h-3.5" /> Save pilot profile</Button>
          {saved && <span className="text-[11px] text-green flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5" /> Saved locally for this pilot</span>}
          <span className="text-[10px] text-muted flex items-center gap-1.5 sm:ml-auto"><Zap className="w-3 h-3 text-lightning" /> No payout or identity verification is triggered</span>
        </div>
      </form>
    </Card>
  );
}
