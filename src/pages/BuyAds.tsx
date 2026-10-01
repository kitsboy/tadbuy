import { useState, useEffect, useMemo, type ChangeEvent } from "react";
import { usePageMeta } from "@/hooks/usePageMeta";
import { Link, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { Card, CardTitle, Button, Input, Textarea, Select, Label, FormGroup, FileInput, InfoTooltip } from "@/components/ui";
import { cn } from "@/lib/utils";
import { CheckCircle2, Bot, X } from "lucide-react";
import { AD_PLATFORMS, allocateBudget, platformToCheckoutShape } from "@/data/platforms";
import { publishCampaignNote } from "@/services/nostrService";
import { PlatformWeightAllocator } from "@/components/PlatformWeightAllocator";
import SuccessScreen from "@/components/buyads/SuccessScreen";
import PaymentModal from "@/components/buyads/PaymentModal";
import { getCheckoutPaymentMethods } from "@/lib/payments/registry";
import { resolvePaymentOutcome, type PaymentOutcome } from "@/lib/campaignPaymentStatus";
import { getMarketplaceSlot, slotToPlatforms, type MarketplaceSlot } from "@/data/marketplaceSlots";
import { GEO_MARKETS } from "@/data/geoMarkets";
import { useCampaignDraft, useAutoSaveDraft } from "@/hooks/useCampaignDraft";
import { FullControlWizard } from "@/components/buyads/FullControlWizard";
import type { CampaignTemplate } from "@/components/buyads/CampaignTemplates";
import { ComingSoonPayments } from "@/components/buyads/ComingSoonPayments";
import { Alert } from "@/components/ui/Alert";
import { FedimintPanel } from "@/components/payments/FedimintPanel";
import { MempoolFeeTip } from "@/components/MempoolFeeTip";
import { CurrencyDisplay } from "@/components/widgets/CurrencyDisplay";
import { ArtMarketplaceScene } from "@/components/illustrations";

interface AdVariant {
  id: string;
  headline: string;
  description: string;
  url: string;
  bgHue: number;
  bgLightness: number;
  textColor: string;
  hashtags: string[];
}

interface TargetingSettings {
  interests: string;
  ageMin: number;
  ageMax: number;
  sex: 'all' | 'male' | 'female';
  countries: string[];
  languages: string[];
  devices: string[];
  networks: string[];
  pixelUrl: string;
  education: string;
  income: string;
  behaviors: string;
  industries: string;
  biddingStrategy: 'maximize_clicks' | 'target_cpa' | 'manual';
  keywords: string;
  frequencyCap: number;
}

const paymentMethods = getCheckoutPaymentMethods().map(method => ({
  id: method.id,
  name: method.name,
  sub: method.subtitle,
  icon: typeof method.icon === 'string' ? method.icon : <method.icon className={`mx-auto h-6 w-6 ${method.color}`} />,
  color: method.color,
  border: method.border,
  bg: method.bg,
}));

export default function BuyAds({ currency = 'USD', rate = 0, symbol = '$' }: { currency?: string; rate?: number; symbol?: string }) {
  usePageMeta('Buy Ads', 'Plan a Bitcoin-first campaign concept. Payment, vendor orders, targeting, and publishing are unavailable in this preview build.');

  const hasLiveRate = rate > 0;
  const [searchParams, setSearchParams] = useSearchParams();
  const { draft, clearDraft } = useCampaignDraft();
  const [currentStep, setCurrentStep] = useState(1);
  const [mode, setMode] = useState<'simple' | 'complex'>('simple');
  const [showComingSoonPayments, setShowComingSoonPayments] = useState(false);
  const paymentOutcome: PaymentOutcome = resolvePaymentOutcome();
  const [marketplaceSlot, setMarketplaceSlot] = useState<MarketplaceSlot | null>(null);
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(['nostr']);
  const [selectedDistributionChannels, setSelectedDistributionChannels] = useState<string[]>(['nostr']);
  const [nostrPublished, setNostrPublished] = useState<{ eventId: string; relays: string[] } | null>(null);
  const [btcAmount, setBtcAmount] = useState(0.0005);
  const [fiatAmount, setFiatAmount] = useState(0.0005 * rate);
  const [paymentMethod, setPaymentMethod] = useState('lightning');
  const [campaignName, setCampaignName] = useState("My Campaign");

  const [headline, setHeadline] = useState("Stack Sats Smarter — giveabit.io");
  const [description, setDescription] = useState("Bitcoin tools for the people. No banks. No middlemen.");
  const [url, setUrl] = useState("https://giveabit.io");
  const [adBgHue, setAdBgHue] = useState(240);
  const [adBgLightness, setAdBgLightness] = useState(96);
  const [adTextColor, setAdTextColor] = useState("#18181b");
  const [hashtags, setHashtags] = useState<string[]>([]);
  const [hashtagInput, setHashtagInput] = useState('');
  const [adImage, setAdImage] = useState<string | null>(null);
  const [isAiGenerating, setIsAiGenerating] = useState(false);
  const [platformWeights, setPlatformWeights] = useState<Record<string, number>>({ twitter: 100 });
  const [budgetAllocMode, setBudgetAllocMode] = useState<'even' | 'weighted' | 'ppq'>('even');
  const platforms = useMemo(() => platformToCheckoutShape(rate), [rate]);
  const [variants, setVariants] = useState<AdVariant[]>([
    { id: 'A', headline: "Stack Sats Smarter — giveabit.io", description: "Bitcoin tools for the people. No banks. No middlemen.", url: "https://giveabit.io", bgHue: 240, bgLightness: 96, textColor: "#18181b", hashtags: [] },
  ]);
  const [targeting, setTargeting] = useState<TargetingSettings>({
    interests: 'Bitcoin & Crypto', ageMin: 22, ageMax: 45, sex: 'all', countries: ['Global'], languages: ['English'],
    devices: ['ios', 'android', 'desktop'], networks: ['wifi', 'cellular'], pixelUrl: '', education: 'All Education Levels',
    income: 'All Incomes', behaviors: 'All Behaviors', industries: 'All Industries', biddingStrategy: 'manual', keywords: '', frequencyCap: 3,
  });
  const [selectedCountries, setSelectedCountries] = useState<string[]>(['Global']);
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>(['English']);
  const availableCountries = ['Global', ...GEO_MARKETS.map(market => market.country)];
  const availableLanguages = ['English', 'Spanish', 'French', 'German', 'Portuguese', 'Japanese', 'Chinese', 'Arabic', 'Hindi', 'Russian'];
  const trendingTags = ['#bitcoin', '#nostr', '#lightning', '#plebs', '#zap', '@jack', '@elonmusk', '#crypto', '#localmusic', '#livemusic', '#atx', '#sats'];
  const filteredTags = trendingTags.filter(tag => tag.toLowerCase().includes(hashtagInput.toLowerCase()) && !hashtags.includes(tag));
  const [showPreviewConfirmation, setShowPreviewConfirmation] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'success'>('idle');
  const [projectId] = useState(() => `PRJ-TAD-${Math.random().toString(36).substring(2, 8).toUpperCase()}`);

  useEffect(() => setFiatAmount(btcAmount * rate), [btcAmount, rate]);

  useEffect(() => {
    const slotId = searchParams.get('slot');
    if (slotId) {
      const slot = getMarketplaceSlot(slotId);
      if (slot) setMarketplaceSlot(slot);
    }
    const geoCode = searchParams.get('geo');
    if (geoCode && GEO_MARKETS.some(market => market.code === geoCode)) {
      setSelectedCountries(previous => previous.includes(geoCode) ? previous : [...previous.filter(country => country !== 'Global'), geoCode]);
    }
  }, [searchParams]);

  useEffect(() => {
    const slotId = searchParams.get('slot');
    if (!slotId) return;
    const slot = getMarketplaceSlot(slotId);
    if (!slot) return;
    setMarketplaceSlot(slot);
    setCampaignName(slot.name);
    setSelectedPlatforms(slotToPlatforms(slot));
    setBtcAmount(Math.max(slot.minBidSats / 100_000_000, 0.0001));
    setHeadline(`${slot.publisher} — ${slot.name}`);
    setDescription(`Sample placement concept: ${slot.placement}. Example audience (unverified): ${slot.audience}.`);
    if (slot.geo.length && !slot.geo.includes('Global')) setSelectedCountries(slot.geo);
    const next = new URLSearchParams(searchParams);
    next.delete('slot');
    setSearchParams(next, { replace: true });
  }, [searchParams, setSearchParams]);

  useEffect(() => {
    const geoCode = searchParams.get('geo');
    if (!geoCode) return;
    const market = GEO_MARKETS.find(item => item.code.toUpperCase() === geoCode.toUpperCase());
    if (market) {
      setSelectedCountries(previous => previous.includes(market.country) ? previous : [...previous.filter(country => country !== 'Global'), market.country]);
      setCampaignName(`${market.country} campaign concept`);
      setMode('complex');
      setCurrentStep(3);
    }
    const next = new URLSearchParams(searchParams);
    next.delete('geo');
    setSearchParams(next, { replace: true });
  }, [searchParams, setSearchParams]);

  useEffect(() => {
    const raw = searchParams.get('platforms');
    if (!raw) return;
    const ids = raw.split(',').map(id => id.trim().toLowerCase()).filter(Boolean);
    const valid = ids.filter(id => AD_PLATFORMS.some(platform => platform.id === id));
    if (valid.length) setSelectedPlatforms(valid);
    const next = new URLSearchParams(searchParams);
    next.delete('platforms');
    setSearchParams(next, { replace: true });
  }, [searchParams, setSearchParams]);

  useEffect(() => {
    if (!draft || marketplaceSlot) return;
    setCampaignName(draft.campaignName);
    setHeadline(draft.headline);
    setDescription(draft.description);
    setUrl(draft.url);
    setSelectedPlatforms(draft.selectedPlatforms);
    if (draft.distributionChannels?.length) setSelectedDistributionChannels(draft.distributionChannels);
    setBtcAmount(draft.btcAmount);
    setPaymentMethod(draft.paymentMethod);
    setMode(draft.mode);
  }, []);

  useAutoSaveDraft(
    paymentStatus === 'success' ? null : {
      campaignName, headline, description, url, selectedPlatforms,
      distributionChannels: selectedDistributionChannels, btcAmount, paymentMethod, mode,
      marketplaceSlotId: marketplaceSlot?.id,
    },
    paymentStatus !== 'success',
  );

  useEffect(() => {
    if (mode !== 'simple') return;
    setVariants(previous => [{ ...previous[0], headline, description, url, bgHue: adBgHue, bgLightness: adBgLightness, textColor: adTextColor, hashtags }]);
  }, [headline, description, url, adBgHue, adBgLightness, adTextColor, hashtags, mode]);

  useEffect(() => {
    const nextWeights = { ...platformWeights };
    Object.keys(nextWeights).forEach(id => { if (!selectedPlatforms.includes(id)) delete nextWeights[id]; });
    selectedPlatforms.forEach(id => { if (!(id in nextWeights)) nextWeights[id] = 0; });
    const sum = Object.values(nextWeights).reduce((total, value) => total + value, 0);
    if (sum === 0 && selectedPlatforms.length > 0) nextWeights[selectedPlatforms[0]] = 100;
    setPlatformWeights(nextWeights);
  }, [selectedPlatforms]);

  const handleFiatChange = (value: number) => {
    setFiatAmount(value);
    setBtcAmount(hasLiveRate ? value / rate : 0);
  };
  const handleBtcChange = (value: number) => {
    setBtcAmount(value);
    setFiatAmount(value * rate);
  };
  const handleImageUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setAdImage(reader.result as string);
    reader.readAsDataURL(file);
  };
  const togglePlatform = (id: string) => setSelectedPlatforms(previous => previous.includes(id) && previous.length > 1 ? previous.filter(platform => platform !== id) : previous.includes(id) ? previous : [...previous, id]);
  const toggleDistributionChannel = (id: string) => {
    setSelectedDistributionChannels(previous => previous.includes(id) ? previous.filter(channel => channel !== id) : [...previous, id]);
    if (id === 'nostr') setNostrPublished(null);
  };
  const publishNostrCampaign = async () => {
    const result = await publishCampaignNote({ campaignName, headline, description, url });
    setNostrPublished({ eventId: result.event.id, relays: result.relays });
  };
  const generateAiCopy = async () => {
    setIsAiGenerating(true);
    await new Promise(resolve => setTimeout(resolve, 600));
    setHeadline("Plan a Bitcoin-native campaign");
    setDescription("Coordinate a sponsorship with independent publishers, review delivery evidence, and keep payment status transparent.");
    setIsAiGenerating(false);
  };
  const handleLaunchClick = () => setShowPreviewConfirmation(true);
  const handleContinueToPreview = () => {
    setPaymentStatus('success');
    setShowPreviewConfirmation(false);
  };

  const selectedPlatformsData = platforms.filter(platform => selectedPlatforms.includes(platform.id));
  const budgetInUsd = btcAmount * rate;
  const estimates = useMemo(() => {
    const weightArg: Record<string, number> | 'even' | 'ppq' = budgetAllocMode === 'even' ? 'even' : budgetAllocMode === 'ppq' ? 'ppq' : platformWeights;
    const allocations = allocateBudget(selectedPlatformsData.map(platform => platform.id), budgetInUsd, weightArg);
    const platformBreakdown = allocations.map(allocation => {
      const platform = selectedPlatformsData.find(item => item.id === allocation.platformId)!;
      return { ...platform, weight: allocation.weightPct, impressions: allocation.impressions, budget: allocation.budgetUsd };
    });
    return { platformBreakdown };
  }, [selectedPlatformsData, budgetInUsd, budgetAllocMode, platformWeights]);

  const applyTemplate = (type: 'awareness' | 'direct_sales') => {
    if (type === 'awareness') {
      setHeadline("Discover a Bitcoin-native service");
      setDescription("A sample creative draft for an awareness campaign concept.");
      setSelectedPlatforms(['twitter', 'instagram', 'youtube']);
    } else {
      setHeadline("Explore a Bitcoin-native offer");
      setDescription("A sample promotional draft. No offer, discount, or deadline is active.");
      setSelectedPlatforms(['facebook', 'tiktok']);
    }
  };
  const applyCampaignTemplate = (template: CampaignTemplate) => {
    setHeadline(template.headline);
    setDescription(template.copy);
    setSelectedPlatforms(template.platforms);
    setBtcAmount(template.budgetSats / 100_000_000);
    setFiatAmount((template.budgetSats / 100_000_000) * rate);
    if (template.hashtags?.length) setHashtags(template.hashtags);
  };

  const wizardDraftSnapshot = useMemo(() => ({ campaignName, headline, description, url, selectedPlatforms, selectedDistributionChannels, btcAmount, paymentMethod, hashtags, currentStep }), [campaignName, headline, description, url, selectedPlatforms, selectedDistributionChannels, btcAmount, paymentMethod, hashtags, currentStep]);
  const loadWizardDraft = (data: Record<string, unknown>) => {
    if (typeof data.campaignName === 'string') setCampaignName(data.campaignName);
    if (typeof data.headline === 'string') setHeadline(data.headline);
    if (typeof data.description === 'string') setDescription(data.description);
    if (typeof data.url === 'string') setUrl(data.url);
    if (Array.isArray(data.selectedPlatforms)) setSelectedPlatforms(data.selectedPlatforms as string[]);
    if (Array.isArray(data.selectedDistributionChannels)) setSelectedDistributionChannels(data.selectedDistributionChannels as string[]);
    if (typeof data.btcAmount === 'number') { setBtcAmount(data.btcAmount); setFiatAmount(data.btcAmount * rate); }
    if (typeof data.paymentMethod === 'string') setPaymentMethod(data.paymentMethod);
    if (Array.isArray(data.hashtags)) setHashtags(data.hashtags as string[]);
    if (typeof data.currentStep === 'number') setCurrentStep(data.currentStep);
  };
  const resetForm = () => {
    setPaymentStatus('idle');
    setShowPreviewConfirmation(false);
    setMarketplaceSlot(null);
    clearDraft();
    setCampaignName("My Campaign");
    setHeadline("Stack Sats Smarter — giveabit.io");
    setDescription("Bitcoin tools for the people. No banks. No middlemen.");
    setUrl("https://giveabit.io");
    setSelectedPlatforms(['nostr']);
    setSelectedDistributionChannels(['nostr']);
    setNostrPublished(null);
    setBtcAmount(0.0005);
    setFiatAmount(0.0005 * rate);
    setHashtags([]);
    setAdImage(null);
    setCurrentStep(1);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mx-auto max-w-7xl space-y-6 overflow-x-clip pb-safe">
      {marketplaceSlot && paymentStatus !== 'success' && (
        <Alert variant="info" title={`Example placement concept: ${marketplaceSlot.name}`}>
          {marketplaceSlot.publisher} · {marketplaceSlot.placement} · {marketplaceSlot.format}. This is illustrative sample inventory, not a vendor listing or live offer.
        </Alert>
      )}

      {paymentStatus === 'success' && (
        <SuccessScreen projectId={projectId} campaignName={campaignName} btcAmount={btcAmount} selectedPlatformsData={selectedPlatformsData} outcome={paymentOutcome} onReset={resetForm} />
      )}

      <div id="campaign-builder" className="mb-8 flex flex-col justify-between gap-4 scroll-mt-24 px-safe md:flex-row md:items-center">
        <div className="min-w-0">
          <h2 className="text-2xl font-extrabold tracking-tight md:text-3xl">Campaign planning preview</h2>
          <p className="mb-3 mt-1 text-sm text-muted sm:text-base">Plan a campaign concept, creative, and distribution path. No payment, vendor order, or publication is created here.</p>
          <CurrencyDisplay sats={Math.round(btcAmount * 100_000_000)} btcRate={rate} fiatSymbol={symbol} />
        </div>
        <div aria-hidden className="pointer-events-none hidden shrink-0 select-none items-center lg:flex">
          <ArtMarketplaceScene className="opacity-90" />
        </div>
        <div className="flex w-full items-center rounded-xl border border-border bg-surface p-1 md:w-auto">
          <button type="button" onClick={() => setMode('simple')} className={cn("min-h-[44px] flex-1 rounded-lg px-4 py-2.5 text-sm font-bold transition-all md:flex-none", mode === 'simple' ? "bg-accent text-black shadow-md" : "text-muted hover:text-text")}>Quick Launch</button>
          <button type="button" onClick={() => { setMode('complex'); setCurrentStep(1); }} className={cn("min-h-[44px] flex-1 rounded-lg px-4 py-2.5 text-sm font-bold transition-all md:flex-none", mode === 'complex' ? "bg-accent text-black shadow-md" : "text-muted hover:text-text")}>Full Control</button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {mode === 'complex' ? (
          <motion.div key="full-control" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <FullControlWizard
              currentStep={currentStep} setCurrentStep={setCurrentStep} platforms={platforms} checkoutPaymentMethods={paymentMethods}
              selectedPlatforms={selectedPlatforms} selectedDistributionChannels={selectedDistributionChannels} onToggleDistributionChannel={toggleDistributionChannel}
              onPublishNostr={publishNostrCampaign} nostrPublished={nostrPublished ? { eventId: nostrPublished.eventId, relays: nostrPublished.relays.length } : null}
              onTogglePlatform={togglePlatform} btcAmount={btcAmount} fiatAmount={fiatAmount} currency={currency} symbol={symbol} rate={rate}
              onBtcChange={handleBtcChange} onFiatChange={handleFiatChange} paymentMethod={paymentMethod} setPaymentMethod={setPaymentMethod}
              campaignName={campaignName} setCampaignName={setCampaignName} targeting={targeting} setTargeting={setTargeting}
              selectedCountries={selectedCountries} setSelectedCountries={setSelectedCountries} selectedLanguages={selectedLanguages} setSelectedLanguages={setSelectedLanguages}
              headline={headline} setHeadline={setHeadline} description={description} setDescription={setDescription} url={url} setUrl={setUrl}
              adBgHue={adBgHue} setAdBgHue={setAdBgHue} adBgLightness={adBgLightness} setAdBgLightness={setAdBgLightness} adTextColor={adTextColor} setAdTextColor={setAdTextColor}
              adImage={adImage} setAdImage={setAdImage} hashtags={hashtags} setHashtags={setHashtags} hashtagInput={hashtagInput} setHashtagInput={setHashtagInput}
              isAiGenerating={isAiGenerating} onGenerateAi={generateAiCopy} variants={variants} selectedPlatformsData={selectedPlatformsData} estimates={estimates}
              projectId={projectId} onLaunch={handleLaunchClick} onApplyTemplate={applyCampaignTemplate} draftSnapshot={wizardDraftSnapshot} onLoadDraft={loadWizardDraft}
            />
          </motion.div>
        ) : (
          <motion.div key="simple" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div className="space-y-4">
              <Card className="glass-panel">
                <FormGroup className="mb-5">
                  <Label>Campaign concept name</Label>
                  <Input value={campaignName} onChange={event => setCampaignName(event.target.value)} placeholder="e.g. Bitcoin education campaign" />
                </FormGroup>
                <div className="mb-6">
                  <div className="mb-2 text-xs font-bold uppercase tracking-wider text-muted">Sample campaign templates</div>
                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                    <button type="button" onClick={() => applyTemplate('awareness')} className="rounded-lg border border-border bg-surface py-2 text-xs font-bold text-muted transition-colors hover:border-accent hover:text-accent">Awareness concept</button>
                    <button type="button" onClick={() => applyTemplate('direct_sales')} className="rounded-lg border border-border bg-surface py-2 text-xs font-bold text-muted transition-colors hover:border-accent hover:text-accent">Offer concept · no live discount</button>
                  </div>
                </div>

                <div className="mb-3 flex items-center gap-2">
                  <CardTitle className="mb-0">1. Pick your platform concepts</CardTitle>
                  <InfoTooltip content="Availability, audience, and costs are not verified live inventory or a quote." />
                </div>
                <div className="mb-3 text-xs text-muted">Select platform concepts for this local draft · costs and availability are unverified. <Link to="/platforms" className="text-accent hover:underline">Planning guides</Link></div>
                <div className="mb-4.5 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
                  {platforms.map(platform => (
                    <button key={platform.id} type="button" onClick={() => togglePlatform(platform.id)} className={cn("group relative cursor-pointer overflow-hidden rounded-xl border-2 bg-surface p-3.5 text-center transition-all hover:border-muted", selectedPlatforms.includes(platform.id) ? "border-accent bg-accent/10 shadow-[0_0_15px_rgba(247,147,26,0.1)]" : "border-border")}>
                      {selectedPlatforms.includes(platform.id) && <CheckCircle2 className="absolute right-1.5 top-1.5 h-4 w-4 text-accent" />}
                      <div className={cn("mb-2 flex justify-center transition-colors", selectedPlatforms.includes(platform.id) ? "text-accent" : "text-muted group-hover:text-text")}>{platform.icon}</div>
                      <div className="text-[11px] font-bold text-text">{platform.name}</div>
                      <div className="mt-0.5 text-[10px] text-muted">Example CPM · not a quote</div>
                    </button>
                  ))}
                </div>

                {selectedPlatforms.length > 1 && (
                  <div className="mb-4">
                    <PlatformWeightAllocator platforms={AD_PLATFORMS} selectedIds={selectedPlatforms} weights={platformWeights} mode={budgetAllocMode} onModeChange={setBudgetAllocMode} onWeightChange={(id, pct) => setPlatformWeights(previous => ({ ...previous, [id]: pct }))} budgetUsd={budgetInUsd} budgetSats={Math.round(btcAmount * 100_000_000)} />
                  </div>
                )}

                <div className="mb-3 flex items-center gap-2">
                  <CardTitle className="mb-0">2. Proposed budget</CardTitle>
                  <InfoTooltip content="Illustrative planning budget only. The public exchange-rate reference is not a quote or payment authorization." />
                </div>
                <div className="mb-3.5 flex flex-wrap gap-2">
                  {[
                    { label: `${symbol}10`, btc: 10 / rate }, { label: `${symbol}50`, btc: 50 / rate },
                    { label: `${symbol}100`, btc: 100 / rate }, { label: `${symbol}500`, btc: 500 / rate },
                  ].map(preset => (
                    <button key={preset.label} type="button" disabled={!hasLiveRate} onClick={() => handleBtcChange(preset.btc)} className="rounded-full border border-border bg-surface px-3.5 py-1.5 text-xs font-bold text-muted transition-all hover:border-accent hover:text-accent disabled:cursor-not-allowed disabled:opacity-50">
                      {preset.label}{hasLiveRate ? ` (~${preset.btc.toFixed(4)} BTC)` : ' (rate loading…)'}
                    </button>
                  ))}
                </div>
                <div className="mb-1.5 flex items-end gap-2.5">
                  <FormGroup className="mb-0 flex-1"><Label>Amount (BTC)</Label><Input type="number" aria-label="Amount in BTC" value={btcAmount.toFixed(5)} onChange={event => handleBtcChange(parseFloat(event.target.value) || 0)} step="0.0001" min="0.0001" /></FormGroup>
                  <div className="whitespace-nowrap rounded-lg border border-accent/40 bg-accent/15 px-3.5 py-2.5 font-mono text-xs text-accent">₿ BTC</div>
                  <FormGroup className="mb-0 flex-1"><Label>Reference value in {currency}</Label><Input type="number" aria-label={`Amount in ${currency}`} value={fiatAmount.toFixed(2)} onChange={event => handleFiatChange(parseFloat(event.target.value) || 0)} /></FormGroup>
                </div>
                <div className="mt-1.5 flex flex-wrap items-center justify-between gap-2 font-mono text-[11px] text-muted">
                  <span>Proposed: {btcAmount.toFixed(4)} BTC · {Math.round(btcAmount * 100_000_000).toLocaleString()} sats · {symbol}{fiatAmount.toFixed(2)} {currency} · unpaid</span>
                  <span className="rounded-full border border-border bg-surface px-2 py-0.5 font-sans text-muted">No performance estimate is calculated</span>
                </div>
                <MempoolFeeTip className="mt-3" />

                <div className="mt-4">
                  <div className="mb-3 flex items-center gap-2"><CardTitle className="mb-0">3. Payment preference · disabled</CardTitle><InfoTooltip content="Choose a design preference only; no payment service is connected." /></div>
                  <Alert variant="warning" title="Payment disabled in this preview" className="mb-3">No invoice, payment request, campaign order, or settlement is created.</Alert>
                  <div className="mb-4.5 grid grid-cols-2 gap-2.5 sm:grid-cols-3">
                    {paymentMethods.map(method => (
                      <button key={method.id} type="button" onClick={() => setPaymentMethod(method.id)} className={cn("cursor-pointer rounded-xl border-2 bg-surface p-3.5 text-center transition-all hover:border-muted", paymentMethod === method.id ? cn(method.border, method.bg) : "border-border")}>
                        <div className="mb-1.5 flex justify-center text-2xl">{method.icon}</div><div className={cn("text-[11px] font-bold", paymentMethod === method.id ? method.color : "text-text")}>{method.name}</div><div className="text-[10px] text-muted">Unavailable in this preview</div>
                      </button>
                    ))}
                  </div>
                  {paymentMethod === 'btc' && <div className="rounded-lg border border-accent/20 bg-accent/5 p-3 text-xs text-accent">On-chain is planned; no deposit address, confirmation tracker, or campaign activation is connected.</div>}
                  {paymentMethod === 'lightning' && <div className="flex items-start gap-2.5 rounded-lg border border-lightning/20 bg-lightning/5 p-3.5 text-xs text-lightning"><span className="text-xl leading-none">⚡</span><div>Lightning is the intended fast Bitcoin rail, but Tadbuy cannot accept or verify a payment in this preview. No invoice is created.</div></div>}
                  {paymentMethod === 'fedimint' && <div className="mt-3"><FedimintPanel /></div>}
                  <button type="button" onClick={() => setShowComingSoonPayments(open => !open)} className="mt-3 text-[10px] font-bold text-muted hover:text-accent">{showComingSoonPayments ? 'Hide' : 'Show'} future payment rail concepts</button>
                  <ComingSoonPayments expanded={showComingSoonPayments} />
                </div>
              </Card>

              <Card className="glass-panel">
                <div className="mb-3 flex items-center justify-between">
                  <div className="flex items-center gap-2"><CardTitle className="mb-0">4. Ad copy & media</CardTitle><InfoTooltip content="Craft a local creative preview. Platform-specific automatic formatting is not connected." /></div>
                  <Button size="sm" variant="secondary" onClick={generateAiCopy} disabled={isAiGenerating} className="h-7 gap-1.5 text-[10px]"><Bot className={cn("h-3 w-3", isAiGenerating && "animate-spin")} />{isAiGenerating ? "Thinking…" : "Local copy example"}</Button>
                </div>
                <div className="mb-5 flex items-start gap-3 rounded-lg border border-blue/20 bg-blue/5 p-3.5">
                  <Bot className="mt-0.5 h-5 w-5 shrink-0 text-blue" />
                  <div><div className="mb-1 text-[12px] font-bold text-blue">Local creative suggestion</div><div className="text-[11px] leading-relaxed text-muted">Uses a fixed local example; no PPQ.AI request is made. Vendor publication and provider APIs are not connected.</div></div>
                </div>
                <FormGroup><Label>Headline</Label><Input aria-label="Campaign headline" value={headline} onChange={event => setHeadline(event.target.value)} maxLength={70} /></FormGroup>
                <FormGroup><Label>Description</Label><Textarea aria-label="Campaign description" value={description} onChange={event => setDescription(event.target.value)} rows={2} /></FormGroup>
                <FormGroup><Label>Destination URL</Label><Input type="url" aria-label="Destination URL" value={url} onChange={event => setUrl(event.target.value)} /></FormGroup>
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <FormGroup className="mb-0">
                    <div className="mb-1 flex items-center justify-between"><Label className="mb-0">Ad background color</Label><div className="h-4 w-4 rounded-full border border-white/20" style={{ backgroundColor: `hsl(${adBgHue}, 40%, ${adBgLightness}%)` }} /></div>
                    <div className="space-y-3 rounded-lg border border-border bg-surface/50 p-3">
                      <div><div className="flex justify-between text-[10px] font-bold uppercase text-muted"><span>Hue</span><span>{adBgHue}°</span></div><input type="range" aria-label="Background hue" min="0" max="360" value={adBgHue} onChange={event => setAdBgHue(Number(event.target.value))} className="h-1.5 w-full cursor-pointer accent-accent" /></div>
                      <div><div className="flex justify-between text-[10px] font-bold uppercase text-muted"><span>Lightness</span><span>{adBgLightness}%</span></div><input type="range" aria-label="Background lightness" min="10" max="98" value={adBgLightness} onChange={event => setAdBgLightness(Number(event.target.value))} className="h-1.5 w-full cursor-pointer accent-accent" /></div>
                    </div>
                  </FormGroup>
                  <FormGroup className="mb-0">
                    <Label>Ad text color</Label>
                    <div className="mt-1 flex gap-2"><Input type="color" value={adTextColor} onChange={event => setAdTextColor(event.target.value)} className="h-10 w-12 cursor-pointer border-border bg-surface p-1" /><Input type="text" value={adTextColor} onChange={event => setAdTextColor(event.target.value)} className="font-mono text-xs" placeholder="#000000" /></div>
                    <div className="mt-2 flex gap-1.5">{['#000000', '#FFFFFF', '#F7931A', '#18181b'].map(color => <button key={color} type="button" aria-label={`Ad text color ${color}`} onClick={() => setAdTextColor(color)} className="h-5 w-5 rounded border border-white/10 transition-transform hover:scale-110" style={{ backgroundColor: color }} />)}</div>
                  </FormGroup>
                </div>
                <FormGroup>
                  <Label>Media · local preview only <span className="ml-2 rounded bg-accent/10 px-2 py-0.5 text-[10px] font-normal text-accent">Recommended: 1200 × 628 px</span></Label>
                  <FileInput hint={adImage ? "Image preview loaded · not uploaded" : "Image stays in this browser preview; it is not uploaded or saved."} onChange={handleImageUpload} />
                  {adImage && <div className="relative mt-2 inline-block"><img src={adImage} alt="Local creative preview" className="h-20 w-32 rounded-lg border border-border object-cover" /><button type="button" onClick={() => setAdImage(null)} aria-label="Remove local image preview" className="absolute -right-2 -top-2 rounded-full bg-red p-1 text-white shadow-lg transition-colors hover:bg-red/80"><X className="h-3 w-3" /></button></div>}
                </FormGroup>
                <FormGroup>
                  <Label>Hashtags & mentions · max 3</Label>
                  <div className="mb-2 flex flex-wrap gap-2">{hashtags.map(tag => <span key={tag} className="flex items-center gap-1 rounded-md bg-accent/20 px-2 py-1 text-xs text-accent">{tag}<button type="button" aria-label={`Remove ${tag}`} onClick={() => setHashtags(previous => previous.filter(value => value !== tag))} className="transition-colors hover:text-white"><X className="h-3 w-3" /></button></span>)}</div>
                  {hashtags.length < 3 && (
                    <div className="relative">
                      <Input value={hashtagInput} onChange={event => setHashtagInput(event.target.value)} placeholder="Type # or @ to filter sample suggestions…" onKeyDown={event => { if (event.key === 'Enter' && hashtagInput) { event.preventDefault(); setHashtags(previous => [...previous, hashtagInput]); setHashtagInput(''); } }} />
                      {hashtagInput && filteredTags.length > 0 && <div className="absolute z-10 mt-1 w-full overflow-hidden rounded-md border border-border bg-surface shadow-lg">{filteredTags.slice(0, 5).map(tag => <button type="button" key={tag} className="block w-full cursor-pointer px-3 py-2 text-left text-sm transition-colors hover:bg-accent/10" onClick={() => { setHashtags(previous => [...previous, tag]); setHashtagInput(''); }}>{tag}</button>)}</div>}
                    </div>
                  )}
                </FormGroup>
              </Card>
            </div>

            <div className="space-y-4">
              <Card className="glass-panel">
                <div className="mb-3 flex items-center gap-2"><CardTitle className="mb-0">Audience planning inputs</CardTitle><InfoTooltip content="Draft notes only. No targeting segment or audience activation is connected." /></div>
                <Alert variant="info" title="Draft notes only" className="mb-5">No tracking pixel, audience segment, demographic target, or provider-side campaign is active in this build.</Alert>
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <FormGroup className="mb-0"><div className="mb-1.5 flex items-center gap-2"><Label className="mb-0">Example interest</Label><InfoTooltip content="No live audience segment is applied." /></div><Select aria-label="Target interests" value={targeting.interests} onChange={event => setTargeting({ ...targeting, interests: event.target.value })}>{['Bitcoin & Crypto', 'Finance & Investing', 'Tech & Software', 'Gaming & Esports', 'Small Business & B2B', 'Health & Fitness', 'Travel & Hospitality', 'Real Estate', 'Fashion & Beauty', 'Food & Beverage', 'Automotive', 'Entertainment & Media'].map(option => <option key={option}>{option}</option>)}</Select></FormGroup>
                  <FormGroup className="mb-0"><div className="mb-1.5 flex items-center gap-2"><Label className="mb-0">Contextual keywords</Label><InfoTooltip content="Example draft keywords; no bidding or keyword matching occurs." /></div><Input placeholder="e.g. bitcoin, hardware wallet, security" value={targeting.keywords} onChange={event => setTargeting({ ...targeting, keywords: event.target.value })} /></FormGroup>
                  <FormGroup className="mb-0"><div className="mb-1.5 flex items-center gap-2"><Label className="mb-0">Age range</Label><InfoTooltip content="Draft notes only; no demographic targeting is applied." /></div><div className="flex gap-3"><Input type="number" aria-label="Minimum age" placeholder="Min" value={targeting.ageMin} onChange={event => setTargeting({ ...targeting, ageMin: parseInt(event.target.value) || 0 })} /><Input type="number" aria-label="Maximum age" placeholder="Max" value={targeting.ageMax} onChange={event => setTargeting({ ...targeting, ageMax: parseInt(event.target.value) || 0 })} /></div></FormGroup>
                  <FormGroup className="mb-0 sm:col-span-2">
                    <div className="mb-1.5 flex items-center gap-2"><Label className="mb-0">Example locations</Label><InfoTooltip content="Draft notes only; no geographic targeting is applied." /></div>
                    <div className="mb-2 flex flex-wrap gap-2">{selectedCountries.map(country => <span key={country} className="flex items-center gap-1 rounded-md border border-border bg-surface px-2 py-1 text-xs text-text">{country}<button type="button" aria-label={`Remove ${country}`} onClick={() => setSelectedCountries(previous => previous.filter(value => value !== country))} className="transition-colors hover:text-accent"><X className="h-3 w-3" /></button></span>)}</div>
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3"><Select value="" aria-label="Add example country" onChange={event => { const country = event.target.value; if (country && !selectedCountries.includes(country)) setSelectedCountries(country === 'Global' ? ['Global'] : [...selectedCountries.filter(value => value !== 'Global'), country]); }}><option value="" disabled>+ Add country</option>{availableCountries.map(country => <option key={country}>{country}</option>)}</Select><Input placeholder="State / province · optional" /><Input placeholder="City / local area · optional" /></div>
                  </FormGroup>
                  <FormGroup className="mb-0 sm:col-span-2">
                    <div className="mb-1.5 flex items-center gap-2"><Label className="mb-0">Example languages</Label><InfoTooltip content="Draft notes only; no language targeting is applied." /></div>
                    <div className="mb-2 flex flex-wrap gap-2">{selectedLanguages.map(language => <span key={language} className="flex items-center gap-1 rounded-md border border-border bg-surface px-2 py-1 text-xs text-text">{language}<button type="button" aria-label={`Remove ${language}`} onClick={() => setSelectedLanguages(previous => previous.filter(value => value !== language))} className="transition-colors hover:text-accent"><X className="h-3 w-3" /></button></span>)}</div>
                    <Select value="" aria-label="Add example language" onChange={event => { const language = event.target.value; if (language && !selectedLanguages.includes(language)) setSelectedLanguages([...selectedLanguages, language]); }}><option value="" disabled>+ Add language</option>{availableLanguages.map(language => <option key={language}>{language}</option>)}</Select>
                  </FormGroup>
                  <FormGroup className="mb-0"><Label>Sex · draft note</Label><Select value={targeting.sex} onChange={event => setTargeting({ ...targeting, sex: event.target.value as TargetingSettings['sex'] })}><option value="all">All</option><option value="male">Male</option><option value="female">Female</option></Select></FormGroup>
                  <FormGroup className="mb-0"><Label>Education · draft note</Label><Select value={targeting.education} onChange={event => setTargeting({ ...targeting, education: event.target.value })}>{['All Education Levels', 'High School', 'Some College', 'Bachelors Degree', 'Masters Degree', 'PhD / Doctorate'].map(option => <option key={option}>{option}</option>)}</Select></FormGroup>
                  <FormGroup className="mb-0"><Label>Income · draft note</Label><Select value={targeting.income} onChange={event => setTargeting({ ...targeting, income: event.target.value })}>{['All Incomes', 'Top 10%', 'Top 25%', 'Top 50%', 'Below Average'].map(option => <option key={option}>{option}</option>)}</Select></FormGroup>
                  <FormGroup className="mb-0"><Label>Behaviors · draft note</Label><Select value={targeting.behaviors} onChange={event => setTargeting({ ...targeting, behaviors: event.target.value })}>{['All Behaviors', 'Crypto Traders', 'Frequent Buyers', 'Tech Early Adopters', 'Business Travelers', 'Luxury Shoppers', 'Gamers', 'Investors'].map(option => <option key={option}>{option}</option>)}</Select></FormGroup>
                  <FormGroup className="mb-0"><Label>Industries · draft note</Label><Select value={targeting.industries} onChange={event => setTargeting({ ...targeting, industries: event.target.value })}>{['All Industries', 'Technology & IT', 'Finance & Banking', 'Healthcare & Medical', 'Retail & E-commerce', 'Education', 'Construction & Real Estate', 'Manufacturing', 'Marketing & Advertising', 'Arts & Design'].map(option => <option key={option}>{option}</option>)}</Select></FormGroup>
                </div>
              </Card>

              <Card className="border-accent/30 shadow-[0_0_30px_-10px_rgba(247,147,26,0.15)]">
                <div className="mb-4 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2"><CardTitle className="mb-0">Planning assumptions · not reach</CardTitle><InfoTooltip content="Illustrative planning math only; no publisher audience or campaign performance is connected." /></div>
                  <div className="rounded border border-border bg-surface px-2 py-1 font-mono text-[10px] text-muted">Preview: {projectId}</div>
                </div>
                <Alert variant="warning" title="No measured performance" className="mb-3">No impression, click, conversion, or reach estimate is shown because publisher delivery and audience data are not connected.</Alert>
                <div className="space-y-1 rounded-xl border border-border bg-surface p-4">
                  <div className="flex justify-between py-1 text-[13px]"><span className="text-muted">Selected platform concepts</span><span className="flex gap-1 text-right text-muted">{selectedPlatformsData.map(platform => <span key={platform.id} className="h-4 w-4 [&>svg]:h-4 [&>svg]:w-4">{platform.icon}</span>)}</span></div>
                  <div className="flex justify-between py-1 text-[13px]"><span className="text-muted">Proposed budget · unpaid</span><span>{symbol}{fiatAmount.toFixed(2)} ({btcAmount.toFixed(4)} ₿)</span></div>
                  <div className="flex justify-between py-1 text-[13px]"><span className="text-muted">CPM inputs</span><span>{selectedPlatformsData.length} seeded assumption{selectedPlatformsData.length === 1 ? '' : 's'} · not a quote</span></div>
                  <div className="mt-3 space-y-2 border-t border-border/50 pt-3"><div className="text-[10px] font-bold uppercase tracking-wider text-muted">Selected targeting · not audience data</div><div className="flex justify-between text-[11px]"><span className="text-muted">Interest</span><span>{targeting.interests}</span></div><div className="flex justify-between text-[11px]"><span className="text-muted">Devices</span><span>{targeting.devices.join(', ') || 'None'}</span></div></div>
                  <div className="flex justify-between py-1 text-[13px]"><span className="text-muted">Example schedule</span><span>3–5 days · not scheduled</span></div>
                </div>
              </Card>

              <Card className="glass-panel">
                <CardTitle>Creative preview · {selectedPlatformsData[0]?.name ?? 'platform not selected'}</CardTitle>
                <p className="mb-3 text-[10px] text-muted">Illustrative mockup · not a published ad</p>
                <div className="space-y-4">{variants.map(variant => <div key={variant.id} className="space-y-2">{variants.length > 1 && <div className="text-[10px] font-bold uppercase tracking-widest text-accent">Variant {variant.id} · draft</div>}<div className="relative min-h-[120px] overflow-hidden rounded-xl border border-border p-4 shadow-inner" style={{ backgroundColor: `hsl(${variant.bgHue}, 40%, ${variant.bgLightness}%)`, color: variant.textColor }}><div className="absolute right-2 top-2 rounded bg-black/10 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider opacity-90">Sponsored · mockup</div><div className="mb-2 flex items-center gap-1.5 text-[10px] opacity-80"><span className="h-4 w-4 [&>svg]:h-4 [&>svg]:w-4">{selectedPlatformsData[0]?.icon}</span><strong>Sample advertiser</strong><span>· preview</span></div><div className="mb-1 text-[15px] font-bold leading-tight">{variant.headline || 'Your headline'}</div><div className="text-[13px] leading-relaxed opacity-90">{variant.description || 'Your description'}</div>{adImage && <div className="mt-3 overflow-hidden rounded-lg border border-black/10"><img src={adImage} alt="Local ad creative preview" className="max-h-[200px] w-full object-cover" /></div>}{variant.hashtags.length > 0 && <div className="mt-2 text-[12px] font-medium opacity-80">{variant.hashtags.join(' ')}</div>}<div className="mt-3 text-[11px] font-medium opacity-80">{variant.url.replace(/^https?:\/\//, '') || 'example.com'}</div></div></div>)}</div>
              </Card>

              <Button className="w-full bg-gradient-to-r from-accent to-accent2 text-black shadow-[0_0_20px_rgba(247,147,26,0.3)] transition-opacity hover:opacity-90" size="lg" onClick={handleLaunchClick}>Review local preview</Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <PaymentModal show={showPreviewConfirmation} onClose={() => setShowPreviewConfirmation(false)} btcAmount={btcAmount} paymentMethod={paymentMethod} onContinue={handleContinueToPreview} />
    </motion.div>
  );
}
