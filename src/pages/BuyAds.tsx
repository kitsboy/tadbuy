import { useState, useEffect, useMemo, useRef, ChangeEvent } from "react";
import { BITCOIN_ADDRESS, BITCOIN_URI } from "@/constants";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { Card, CardTitle, Button, Input, Textarea, Select, Label, FormGroup, Modal, FileInput, InfoTooltip } from "@/components/ui";
import { cn } from "@/lib/utils";
import { QRCodeSVG } from "qrcode.react";
import { Twitter, Facebook, Instagram, Zap, Youtube, MessageSquare, Linkedin, Music, CheckCircle2, Bot, X, Monitor, Smartphone, Wifi, Globe, Calendar, Layers, Activity, Target, Settings2, Plus, Trash2, ShieldAlert } from "lucide-react";
import { FirestoreCampaignRepository } from "@/lib/db/firestore";

// --- Types & Interfaces ---

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
  devices: string[]; // 'ios', 'android', 'desktop'
  networks: string[]; // 'wifi', 'cellular'
  pixelUrl: string;
  education: string;
  income: string;
  behaviors: string;
  industries: string;
}

interface SchedulingSettings {
  mode: 'calendar' | 'block';
  startDate: string;
  endDate: string;
  startBlock: number;
  endBlock: number;
}

interface PPQConfig {
  autoRebalance: boolean;
  sentimentFilter: boolean;
  optimizationGoal: 'cpc' | 'roas' | 'reach';
}

interface CampaignState {
  id: string;
  mode: 'simple' | 'complex';
  platforms: string[];
  platformWeights: Record<string, number>; // platformId -> percentage (0-100)
  variants: AdVariant[];
  targeting: TargetingSettings;
  scheduling: SchedulingSettings;
  ppq: PPQConfig;
  budgetBtc: number;
  paymentMethod: string;
}

const platforms = [
  { id: 'twitter', name: 'Twitter/X', icon: <Twitter className="w-6 h-6" />, cpm: 2.50 },
  { id: 'facebook', name: 'Facebook', icon: <Facebook className="w-6 h-6" />, cpm: 5.20 },
  { id: 'instagram', name: 'Instagram', icon: <Instagram className="w-6 h-6" />, cpm: 6.80 },
  { id: 'nostr', name: 'Nostr', icon: <Zap className="w-6 h-6" />, cpm: 0.80 },
  { id: 'youtube', name: 'YouTube', icon: <Youtube className="w-6 h-6" />, cpm: 8.50 },
  { id: 'reddit', name: 'Reddit', icon: <MessageSquare className="w-6 h-6" />, cpm: 1.90 },
  { id: 'linkedin', name: 'LinkedIn', icon: <Linkedin className="w-6 h-6" />, cpm: 12.40 },
  { id: 'tiktok', name: 'TikTok', icon: <Music className="w-6 h-6" />, cpm: 3.40 },
];

const paymentMethods = [
  { id: 'btc', name: 'Bitcoin', sub: 'On-chain', icon: '₿', color: 'text-accent', border: 'border-accent', bg: 'bg-accent/10' },
  { id: 'lightning', name: 'Lightning', sub: 'Instant / Low fee', icon: <Zap className="w-6 h-6 text-lightning mx-auto" />, color: 'text-lightning', border: 'border-lightning', bg: 'bg-lightning/10' },
  { id: 'bolt12', name: 'BOLT 12', sub: 'Offers / Recurring', icon: '🔮', color: 'text-purple', border: 'border-purple', bg: 'bg-purple/10' },
  { id: 'zap', name: 'Nostr Zap', sub: 'Social / Tipping', icon: '⚡💜', color: 'text-purple-400', border: 'border-purple-400', bg: 'bg-purple-400/10' },
];

export default function BuyAds({ currency = 'USD', rate = 96420, symbol = '$' }: { currency?: string, rate?: number, symbol?: string }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [mode, setMode] = useState<'simple' | 'complex'>('simple');
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(['twitter']);
  const [btcAmount, setBtcAmount] = useState(0.0005);
  const [fiatAmount, setFiatAmount] = useState(0.0005 * rate);
  const [paymentMethod, setPaymentMethod] = useState('btc');
  const [campaignName, setCampaignName] = useState("My Campaign");
  // Seconds remaining until invoice expires (3600 = 1 hour)
  const [invoiceSecondsLeft, setInvoiceSecondsLeft] = useState(3600);
  const invoiceTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // --- Simple Mode State ---
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
  const [mempoolFees, setMempoolFees] = useState({ fastestFee: 5, halfHourFee: 4, hourFee: 3 });

  useEffect(() => {
    fetch('https://mempool.space/api/v1/fees/recommended')
      .then(res => res.json())
      .then(data => setMempoolFees(data))
      .catch(console.error);
  }, []);

  // --- Advanced Mode State ---
  const [platformWeights, setPlatformWeights] = useState<Record<string, number>>({ twitter: 100 });
  const [variants, setVariants] = useState<AdVariant[]>([
    {
      id: 'A',
      headline: "Stack Sats Smarter — giveabit.io",
      description: "Bitcoin tools for the people. No banks. No middlemen.",
      url: "https://giveabit.io",
      bgHue: 240,
      bgLightness: 96,
      textColor: "#18181b",
      hashtags: []
    }
  ]);
  const [targeting, setTargeting] = useState<TargetingSettings>({
    interests: 'Bitcoin & Crypto',
    ageMin: 22,
    ageMax: 45,
    sex: 'all',
    countries: ['Global'],
    languages: ['English'],
    devices: ['ios', 'android', 'desktop'],
    networks: ['wifi', 'cellular'],
    pixelUrl: '',
    education: 'All Education Levels',
    income: 'All Incomes',
    behaviors: 'All Behaviors',
    industries: 'All Industries'
  });
  const [scheduling, setScheduling] = useState<SchedulingSettings>({
    mode: 'calendar',
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    startBlock: 834500,
    endBlock: 835500
  });
  const [ppq, setPpq] = useState<PPQConfig>({
    autoRebalance: true,
    sentimentFilter: false,
    optimizationGoal: 'cpc'
  });

  const [selectedCountries, setSelectedCountries] = useState<string[]>(['Global']);
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>(['English']);
  
  const availableCountries = ['Global', 'United States', 'United Kingdom', 'Canada', 'Australia', 'Germany', 'France', 'Spain', 'Mexico', 'Brazil', 'Japan', 'India', 'El Salvador', 'Argentina', 'Colombia', 'Nigeria', 'South Africa'];
  const availableLanguages = ['English', 'Spanish', 'French', 'German', 'Portuguese', 'Japanese', 'Chinese', 'Arabic', 'Hindi', 'Russian'];
  
  const trendingTags = ['#bitcoin', '#nostr', '#lightning', '#plebs', '#zap', '@jack', '@elonmusk', '#crypto', '#localmusic', '#livemusic', '#atx', '#sats'];
  const filteredTags = trendingTags.filter(t => t.toLowerCase().includes(hashtagInput.toLowerCase()) && !hashtags.includes(t));
  
  const [showInvoice, setShowInvoice] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [invoiceCopied, setInvoiceCopied] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'waiting' | 'processing' | 'success'>('idle');
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [bolt11Invoice, setBolt11Invoice] = useState("lnbc1u1pwz5yzpp5w6l... (demo bolt11 invoice)");
  const [invoiceId, setInvoiceId] = useState<string | null>(null);

  const [projectId] = useState(() => `PRJ-TAD-${Math.random().toString(36).substring(2, 8).toUpperCase()}`);
  const [currentBlockHeight, setCurrentBlockHeight] = useState<number | null>(null);

  const bolt12Offer = "lno1qgsqv... (demo bolt12 offer)";

  useEffect(() => {
    setFiatAmount(btcAmount * rate);
  }, [btcAmount, rate]);

  useEffect(() => {
    const fetchBlockHeight = async () => {
      try {
        const res = await fetch('/api/blockchain/info');
        const data = await res.json();
        setCurrentBlockHeight(data.height);
        if (scheduling.mode === 'block' && scheduling.startBlock === 834500) {
          setScheduling(s => ({ ...s, startBlock: data.height + 1, endBlock: data.height + 1000 }));
        }
      } catch (e) {
        console.error('Failed to fetch block height');
      }
    };
    fetchBlockHeight();
  }, []);

  // Sync simple mode state to first variant for consistency
  useEffect(() => {
    if (mode === 'simple') {
      setVariants(prev => [{
        ...prev[0],
        headline,
        description,
        url,
        bgHue: adBgHue,
        bgLightness: adBgLightness,
        textColor: adTextColor,
        hashtags
      }]);
    }
  }, [headline, description, url, adBgHue, adBgLightness, adTextColor, hashtags, mode]);

  // Handle platform changes and weights
  useEffect(() => {
    const newWeights = { ...platformWeights };
    // Remove weights for unselected platforms
    Object.keys(newWeights).forEach(id => {
      if (!selectedPlatforms.includes(id)) delete newWeights[id];
    });
    // Add default weights for new platforms
    selectedPlatforms.forEach(id => {
      if (!(id in newWeights)) newWeights[id] = 0;
    });
    
    // Normalize if needed (e.g. if we just added one and sum is not 100)
    const sum = Object.values(newWeights).reduce((a: number, b: number) => a + b, 0);
    if (sum === 0 && selectedPlatforms.length > 0) {
      newWeights[selectedPlatforms[0]] = 100;
    }
    
    setPlatformWeights(newWeights);
  }, [selectedPlatforms]);

  const handleFiatChange = (val: number) => {
    setFiatAmount(val);
    setBtcAmount(val / rate);
  };

  const handleBtcChange = (val: number) => {
    setBtcAmount(val);
    setFiatAmount(val * rate);
  };

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAdImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const togglePlatform = (id: string) => {
    setSelectedPlatforms(prev => 
      prev.includes(id) && prev.length > 1 
        ? prev.filter(p => p !== id) 
        : prev.includes(id) ? prev : [...prev, id]
    );
  };

  const handleCopyInvoice = () => {
    const textToCopy = paymentMethod === 'bolt12' ? bolt12Offer : (paymentMethod === 'lightning' ? bolt11Invoice : BITCOIN_ADDRESS);
    navigator.clipboard.writeText(textToCopy);
    setInvoiceCopied(true);
    setTimeout(() => setInvoiceCopied(false), 2000);
  };

  const generateAiCopy = async () => {
    setIsAiGenerating(true);
    try {
      // In a real app, this would call a backend endpoint that uses Gemini
      // For now, we simulate the AI response
      await new Promise(resolve => setTimeout(resolve, 1500));
      setHeadline("The Future of Bitcoin Advertising is Here");
      setDescription("Experience seamless, decentralized ad buying with Tadbuy. Instant settlements, global reach, and AI-driven optimization.");
    } catch (e) {
      console.error("AI generation failed");
    } finally {
      setIsAiGenerating(false);
    }
  };

  const startInvoiceCountdown = () => {
    setInvoiceSecondsLeft(3600);
    if (invoiceTimerRef.current) clearInterval(invoiceTimerRef.current);
    invoiceTimerRef.current = setInterval(() => {
      setInvoiceSecondsLeft(s => {
        if (s <= 1) {
          clearInterval(invoiceTimerRef.current!);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
  };

  const stopInvoiceCountdown = () => {
    if (invoiceTimerRef.current) {
      clearInterval(invoiceTimerRef.current);
      invoiceTimerRef.current = null;
    }
  };

  const handleCancelPayment = () => {
    stopInvoiceCountdown();
    setPaymentStatus('idle');
    setPaymentError(null);
  };

  const writeCampaignToFirestore = async () => {
    try {
      const repo = new FirestoreCampaignRepository();
      await repo.create({
        name: campaignName,
        budgetSats: Math.round(btcAmount * 100_000_000),
        status: 'live',
        createdAt: new Date().toISOString(),
        headline,
        description,
        url,
        platforms: selectedPlatforms,
        payment: paymentMethod,
      });
    } catch (err) {
      console.error('Firestore write failed:', err);
    }
  };

  const handleDeploy = async () => {
    setPaymentError(null);

    if (paymentMethod === 'lightning') {
      // Step 1: Fetch a real invoice from the backend
      try {
        const amountSats = Math.round(btcAmount * 100_000_000);
        const res = await fetch('/api/lightning/invoice', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ amountSats, description: `Tadbuy Ad: ${headline}` })
        });
        if (res.ok) {
          const data = await res.json();
          if (data.request) setBolt11Invoice(data.request);
          if (data.id) setInvoiceId(data.id);
        }
      } catch (e) {
        console.warn('Could not fetch real invoice — using demo fallback');
      }

      // Step 2: Show waiting state while user scans / pays
      startInvoiceCountdown();
      setPaymentStatus('waiting');

      // Step 3: Poll for payment confirmation every 3 seconds
      const pollId = await new Promise<'success' | 'timeout'>((resolve) => {
        let attempts = 0;
        const MAX_ATTEMPTS = 40; // 2 minutes max
        const poll = setInterval(async () => {
          attempts++;
          setPaymentStatus('processing');
          try {
            const checkRes = await fetch(`/api/lightning/check/${invoiceId ?? 'pending'}`);
            if (checkRes.ok) {
              const checkData = await checkRes.json();
              if (checkData.paid === true || checkData.status === 'settled') {
                clearInterval(poll);
                resolve('success');
                return;
              }
            }
          } catch (e) {
            // transient error — keep polling
          }
          if (attempts >= MAX_ATTEMPTS) {
            clearInterval(poll);
            resolve('timeout');
          }
        }, 3000);
      });

      stopInvoiceCountdown();

      if (pollId === 'success') {
        await writeCampaignToFirestore();
        setPaymentStatus('success');
        setShowInvoice(false);
      } else {
        setPaymentError('Payment not detected within timeout. Please check your wallet and try again.');
        setPaymentStatus('idle');
      }
    } else {
      // On-chain / BOLT12: user confirms manually
      setPaymentStatus('processing');
      await writeCampaignToFirestore();
      setPaymentStatus('success');
      setShowInvoice(false);
    }
  };

  const selectedPlatformsData = platforms.filter(p => selectedPlatforms.includes(p.id));
  
  // --- Live Estimate Logic ---
  const budgetInUsd = btcAmount * rate;
  
  const estimates = useMemo(() => {
    let totalImpressions = 0;
    const platformBreakdown = selectedPlatformsData.map(p => {
      const weight = mode === 'simple' ? (100 / selectedPlatformsData.length) : (platformWeights[p.id] || 0);
      const platformBudget = (budgetInUsd * weight) / 100;
      const impressions = Math.floor((platformBudget / p.cpm) * 1000);
      totalImpressions += impressions;
      return { ...p, weight, impressions, budget: platformBudget };
    });

    const totalClicks = Math.floor(totalImpressions * 0.012);
    const cpbtc = (btcAmount / totalImpressions) * 1000; // Cost per 1000 impressions in BTC

    // Audience details
    const malePct = 65;
    const femalePct = 35;
    const topInterestPct = 45; // % for the selected interest

    return {
      totalImpressions,
      totalClicks,
      cpbtc,
      platformBreakdown,
      audience: {
        malePct,
        femalePct,
        topInterestPct
      }
    };
  }, [btcAmount, selectedPlatformsData, platformWeights, mode, budgetInUsd]);

  const adBgColor = `hsl(${adBgHue}, 40%, ${adBgLightness}%)`;

  const addVariant = () => {
    if (variants.length >= 2) return;
    setVariants([...variants, {
      id: 'B',
      headline: "Variant B Headline",
      description: "Variant B Description",
      url: url,
      bgHue: 30,
      bgLightness: 90,
      textColor: "#18181b",
      hashtags: []
    }]);
  };

  const removeVariant = (id: string) => {
    if (variants.length <= 1) return;
    setVariants(variants.filter(v => v.id !== id));
  };

  const updateVariant = (id: string, updates: Partial<AdVariant>) => {
    setVariants(variants.map(v => v.id === id ? { ...v, ...updates } : v));
  };

  const toggleDevice = (device: string) => {
    setTargeting(prev => ({
      ...prev,
      devices: prev.devices.includes(device) 
        ? prev.devices.filter(d => d !== device)
        : [...prev.devices, device]
    }));
  };

  const toggleNetwork = (network: string) => {
    setTargeting(prev => ({
      ...prev,
      networks: prev.networks.includes(network) 
        ? prev.networks.filter(n => n !== network)
        : [...prev.networks, network]
    }));
  };

  const totalSteps = 4;

  const nextStep = () => setCurrentStep(p => Math.min(p + 1, totalSteps));
  const prevStep = () => setCurrentStep(p => Math.max(p - 1, 1));

  const formatCountdown = (secs: number) => {
    const m = Math.floor(secs / 60).toString().padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const resetForm = () => {
    setPaymentStatus('idle');
    setCampaignName("My Campaign");
    setHeadline("Stack Sats Smarter — giveabit.io");
    setDescription("Bitcoin tools for the people. No banks. No middlemen.");
    setUrl("https://giveabit.io");
    setSelectedPlatforms(['twitter']);
    setBtcAmount(0.0005);
    setFiatAmount(0.0005 * rate);
    setHashtags([]);
    setAdImage(null);
    setCurrentStep(1);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="max-w-7xl mx-auto space-y-6">

      {/* ── SUCCESS SCREEN ─────────────────────────────────────────────── */}
      <AnimatePresence>
        {paymentStatus === 'success' && (
          <motion.div
            key="success-overlay"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-bg/90 backdrop-blur-sm overflow-hidden"
          >
            {/* CSS confetti burst */}
            <style>{`
              @keyframes confetti-fly {
                0%   { transform: translate(0,0) rotate(0deg) scale(1);   opacity: 1; }
                100% { transform: translate(var(--tx), var(--ty)) rotate(var(--rot)) scale(0); opacity: 0; }
              }
              .confetti-piece {
                position: absolute;
                top: 50%;
                left: 50%;
                width: 10px;
                height: 10px;
                border-radius: 2px;
                animation: confetti-fly 1.2s ease-out forwards;
              }
            `}</style>
            {/* Confetti pieces */}
            {[
              { color: '#F7931A', tx: '-180px', ty: '-220px', rot: '720deg',  delay: '0s'    },
              { color: '#22c55e', tx:  '190px', ty: '-200px', rot: '-540deg', delay: '0.05s' },
              { color: '#3b82f6', tx: '-150px', ty:  '230px', rot: '480deg',  delay: '0.1s'  },
              { color: '#a855f7', tx:  '160px', ty:  '210px', rot: '-600deg', delay: '0.05s' },
              { color: '#F7931A', tx:   '80px', ty: '-260px', rot: '360deg',  delay: '0.15s' },
              { color: '#22c55e', tx:  '-90px', ty: '-240px', rot: '-420deg', delay: '0.2s'  },
              { color: '#f43f5e', tx:  '230px', ty:  '-80px', rot: '660deg',  delay: '0s'    },
              { color: '#3b82f6', tx: '-220px', ty:   '90px', rot: '-360deg', delay: '0.1s'  },
              { color: '#fbbf24', tx:   '50px', ty:  '270px', rot: '540deg',  delay: '0.15s' },
              { color: '#a855f7', tx: '-100px', ty:  '250px', rot: '-480deg', delay: '0.2s'  },
              { color: '#F7931A', tx:  '140px', ty: '-170px', rot: '300deg',  delay: '0.25s' },
              { color: '#22c55e', tx: '-200px', ty: '-140px', rot: '-660deg', delay: '0.1s'  },
            ].map((c, i) => (
              <div
                key={i}
                className="confetti-piece"
                style={{
                  backgroundColor: c.color,
                  '--tx': c.tx,
                  '--ty': c.ty,
                  '--rot': c.rot,
                  animationDelay: c.delay,
                } as object}
              />
            ))}

            <div className="relative z-10 text-center px-6 max-w-md w-full">
              {/* Animated checkmark ring */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 260, damping: 20, delay: 0.1 }}
                className="mx-auto mb-8 relative w-28 h-28"
              >
                <div className="absolute inset-0 rounded-full bg-green/20 animate-pulse" />
                <div className="absolute inset-2 rounded-full bg-green/10 border-4 border-green flex items-center justify-center">
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.3, duration: 0.3 }}
                  >
                    <CheckCircle2 className="w-14 h-14 text-green" strokeWidth={1.5} />
                  </motion.div>
                </div>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 }}
                className="text-4xl font-extrabold tracking-tight mb-2"
              >
                Your campaign is live!
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.45 }}
                className="text-muted text-sm mb-8"
              >
                PPQ.AI is now distributing your ad across the decentralized web.
              </motion.p>

              {/* Campaign summary pill */}
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-surface border border-border rounded-2xl p-5 mb-8 text-left space-y-3"
              >
                <div className="text-[10px] uppercase tracking-widest text-muted font-bold">Campaign Summary</div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted">Name</span>
                  <span className="font-bold">{campaignName}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted">Budget</span>
                  <span className="font-bold text-accent">{btcAmount.toFixed(8)} ₿</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted">Platforms</span>
                  <span className="flex gap-1.5">
                    {selectedPlatformsData.map((p, i) => (
                      <span key={i} className="w-4 h-4 [&>svg]:w-4 [&>svg]:h-4 text-accent">{p.icon}</span>
                    ))}
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted">Est. impressions</span>
                  <span className="font-bold text-green">~{estimates.totalImpressions.toLocaleString()}</span>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="flex gap-3"
              >
                <Link to="/campaigns" className="flex-1">
                  <Button className="w-full bg-gradient-to-r from-accent to-accent2 text-black border-0 hover:opacity-90 shadow-[0_0_20px_rgba(247,147,26,0.3)]" size="lg">
                    View Campaign
                  </Button>
                </Link>
                <Button
                  variant="secondary"
                  size="lg"
                  className="flex-1"
                  onClick={resetForm}
                >
                  Launch Another
                </Button>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Create Campaign</h1>
          <p className="text-muted mt-1">Launch your ad across the decentralized web in minutes.</p>
        </div>
        <div className="flex items-center bg-surface p-1 rounded-xl border border-border">
          <button 
            onClick={() => setMode('simple')}
            className={cn("px-4 py-2 rounded-lg text-sm font-bold transition-all", mode === 'simple' ? "bg-accent text-black shadow-md" : "text-muted hover:text-text")}
          >
            Simple
          </button>
          <button 
            onClick={() => setMode('complex')}
            className={cn("px-4 py-2 rounded-lg text-sm font-bold transition-all", mode === 'complex' ? "bg-accent text-black shadow-md" : "text-muted hover:text-text")}
          >
            Advanced
          </button>
        </div>
      </div>

      {/* ── STEPPER ─────────────────────────────────────────────────── */}
      {(() => {
        const steps = [
          { label: 'Budget',    icon: '₿' },
          { label: 'Targeting', icon: '🎯' },
          { label: 'Creative',  icon: '✏️' },
          { label: 'Payment',   icon: '⚡' },
        ];
        return (
          <div className="flex items-center gap-0 mb-2 select-none">
            {steps.map((step, idx) => {
              const stepNum = idx + 1;
              const isCompleted = currentStep > stepNum;
              const isActive = currentStep === stepNum;
              return (
                <div key={step.label} className="flex items-center flex-1 min-w-0">
                  <button
                    onClick={() => setCurrentStep(stepNum)}
                    className={cn(
                      "flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-bold transition-all w-full",
                      isActive
                        ? "bg-accent/15 text-accent border border-accent/40 shadow-[0_0_12px_rgba(247,147,26,0.15)]"
                        : isCompleted
                          ? "text-green hover:bg-green/10"
                          : "text-muted hover:text-text hover:bg-surface"
                    )}
                  >
                    <span className={cn(
                      "flex items-center justify-center w-6 h-6 rounded-full text-[11px] font-extrabold shrink-0 transition-all",
                      isActive
                        ? "bg-accent text-black"
                        : isCompleted
                          ? "bg-green/20 text-green"
                          : "bg-surface border border-border text-muted"
                    )}>
                      {isCompleted ? <CheckCircle2 className="w-3.5 h-3.5" /> : stepNum}
                    </span>
                    <span className="hidden sm:block truncate">{step.label}</span>
                  </button>
                  {idx < steps.length - 1 && (
                    <div className={cn(
                      "h-px flex-1 mx-1 transition-colors",
                      currentStep > stepNum + 1
                        ? "bg-green/40"
                        : currentStep > stepNum
                          ? "bg-accent/40"
                          : "bg-border"
                    )} />
                  )}
                </div>
              );
            })}
          </div>
        );
      })()}

      <AnimatePresence mode="wait">
        {mode === 'simple' ? (
          <motion.div key="simple" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <Card className="glass-panel">
                <FormGroup className="mb-5">
                  <Label>Campaign name</Label>
                  <Input
                    value={campaignName}
                    onChange={e => setCampaignName(e.target.value)}
                    placeholder="e.g. Summer Bitcoin Push"
                  />
                </FormGroup>
                <div className="flex items-center gap-2 mb-3">
                  <CardTitle className="mb-0">1. Pick your platforms</CardTitle>
                  <InfoTooltip content="Choose where your ads will appear. Each platform has different audiences and costs (CPM)." />
                </div>
                <div className="text-xs text-muted mb-3">Select one or more platforms. Your budget will be distributed evenly.</div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-4.5">
                  {platforms.map(p => {
                    const isSelected = selectedPlatforms.includes(p.id);
                    return (
                      <button
                        key={p.id}
                        onClick={() => togglePlatform(p.id)}
                        className={cn(
                          "bg-surface border-2 rounded-xl p-3.5 text-center cursor-pointer transition-all hover:border-muted relative overflow-hidden group",
                          isSelected ? "border-accent bg-accent/10 shadow-[0_0_15px_rgba(247,147,26,0.1)]" : "border-border"
                        )}
                      >
                        {isSelected && <CheckCircle2 className="absolute top-1.5 right-1.5 w-4 h-4 text-accent" />}
                        <div className={cn("flex justify-center mb-2 transition-colors", isSelected ? "text-accent" : "text-muted group-hover:text-text")}>{p.icon}</div>
                        <div className="text-[11px] font-bold text-text">{p.name}</div>
                        <div className="text-[10px] text-green font-mono mt-0.5">~${p.cpm.toFixed(2)} CPM</div>
                      </button>
                    );
                  })}
                </div>

                <div className="flex items-center gap-2 mb-3">
                  <CardTitle className="mb-0">2. Budget</CardTitle>
                  <InfoTooltip content="Set how much you want to spend. We calculate estimates based on current Bitcoin rates and platform costs." />
                </div>
                <div className="flex flex-wrap gap-2 mb-3.5">
                  {[
                    { label: `${symbol}10`, btc: 10 / rate },
                    { label: `${symbol}50`, btc: 50 / rate },
                    { label: `${symbol}100`, btc: 100 / rate },
                    { label: `${symbol}500`, btc: 500 / rate },
                  ].map(preset => (
                    <button
                      key={preset.label}
                      onClick={() => handleBtcChange(preset.btc)}
                      className="bg-surface border border-border text-muted rounded-full px-3.5 py-1.5 text-xs font-bold transition-all hover:border-accent hover:text-accent"
                    >
                      {preset.label} (~{preset.btc.toFixed(4)} BTC)
                    </button>
                  ))}
                </div>
                <div className="flex items-end gap-2.5 mb-1.5">
                  <FormGroup className="flex-1 mb-0">
                    <Label>Amount (BTC)</Label>
                    <Input type="number" value={btcAmount.toFixed(5)} onChange={e => handleBtcChange(parseFloat(e.target.value) || 0)} step="0.0001" min="0.0001" />
                  </FormGroup>
                  <div className="bg-accent/15 border border-accent/40 text-accent rounded-lg px-3.5 py-2.5 font-mono text-xs whitespace-nowrap">
                    ₿ BTC
                  </div>
                  <FormGroup className="flex-1 mb-0">
                    <Label>Or in {currency}</Label>
                    <Input type="number" value={fiatAmount.toFixed(2)} onChange={e => handleFiatChange(parseFloat(e.target.value) || 0)} />
                  </FormGroup>
                </div>
                <div className="text-[11px] text-muted font-mono mt-1.5">
                  ≈ {btcAmount.toFixed(4)} BTC · {Math.round(btcAmount * 100000000).toLocaleString()} sats · {symbol}{fiatAmount.toFixed(2)} {currency}
                </div>

                <div className="mt-4">
                  <div className="flex items-center gap-2 mb-3">
                    <CardTitle className="mb-0">3. Pay with</CardTitle>
                    <InfoTooltip content="Choose your preferred Bitcoin payment method. Lightning is fastest for small amounts." />
                  </div>
                  <div className="grid grid-cols-3 gap-2.5 mb-4.5">
                    {paymentMethods.map(pm => (
                      <button
                        key={pm.id}
                        onClick={() => setPaymentMethod(pm.id)}
                        className={cn(
                          "bg-surface border-2 rounded-xl p-3.5 text-center cursor-pointer transition-all hover:border-muted",
                          paymentMethod === pm.id ? cn(pm.border, pm.bg) : "border-border"
                        )}
                      >
                        <div className="text-2xl mb-1.5 flex justify-center">{pm.icon}</div>
                        <div className={cn("text-[11px] font-bold", paymentMethod === pm.id ? pm.color : "text-text")}>{pm.name}</div>
                        <div className="text-[10px] text-muted">{pm.sub}</div>
                      </button>
                    ))}
                  </div>
                  
                  {paymentMethod === 'btc' && (
                    <div className="bg-accent/5 border border-accent/20 rounded-lg p-3 text-xs text-accent">
                      ₿ On-chain Bitcoin. Confirmed in ~10 min. Recommended for budgets over $50.
                    </div>
                  )}
                  {paymentMethod === 'lightning' && (
                    <div className="bg-lightning/5 border border-lightning/20 rounded-lg p-3.5 text-xs text-lightning flex items-start gap-2.5">
                      <span className="text-xl leading-none">⚡</span>
                      <div>Lightning Network — Instant settlement, near-zero fees. Best for small spends ($1–$500). Requires Lightning wallet (Phoenix, Breez, Zeus, etc.)</div>
                    </div>
                  )}
                  {paymentMethod === 'bolt12' && (
                    <div className="bg-purple/5 border border-purple/20 rounded-lg p-3.5 text-xs text-purple flex items-start gap-2.5">
                      <span className="text-xl leading-none">🔮</span>
                      <div>BOLT 12 Offers — Supports recurring payments, invoice reuse, and enhanced privacy. Works with compatible wallets (CLN, Phoenix 2.0+). Ideal for recurring ad campaigns.</div>
                    </div>
                  )}
                </div>
              </Card>

              <Card className="glass-panel">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <CardTitle className="mb-0">4. Ad copy & Media</CardTitle>
                    <InfoTooltip content="Craft your message. PPQ.AI will automatically format this for each selected platform." />
                  </div>
                  <Button 
                    size="sm" 
                    variant="secondary" 
                    onClick={generateAiCopy}
                    disabled={isAiGenerating}
                    className="text-[10px] h-7 gap-1.5"
                  >
                    <Bot className={cn("w-3 h-3", isAiGenerating && "animate-spin")} />
                    {isAiGenerating ? "Thinking..." : "AI Suggest"}
                  </Button>
                </div>
                <div className="bg-blue/5 border border-blue/20 rounded-lg p-3.5 mb-5 flex items-start gap-3">
                  <Bot className="w-5 h-5 text-blue shrink-0 mt-0.5" />
                  <div>
                    <div className="text-[12px] font-bold text-blue mb-1">Powered by PPQ.AI</div>
                    <div className="text-[11px] text-muted leading-relaxed">
                      Create once, deploy everywhere. PPQ.AI connects directly to Twitter, Reddit, and other vendors via API. Your ad stays on balance—top it up with Bitcoin anytime to extend its life without recreating it.
                    </div>
                  </div>
                </div>
                <FormGroup>
                  <Label>Headline</Label>
                  <Input value={headline} onChange={e => setHeadline(e.target.value)} maxLength={70} />
                </FormGroup>
                <FormGroup>
                  <Label>Description</Label>
                  <Textarea value={description} onChange={e => setDescription(e.target.value)} rows={2} />
                </FormGroup>
                <FormGroup>
                  <Label>Destination URL</Label>
                  <Input type="url" value={url} onChange={e => setUrl(e.target.value)} />
                </FormGroup>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <FormGroup className="mb-0">
                    <div className="flex justify-between items-center mb-1">
                      <Label className="mb-0">Ad Background Color</Label>
                      <div 
                        className="w-4 h-4 rounded-full border border-white/20" 
                        style={{ backgroundColor: `hsl(${adBgHue}, 40%, ${adBgLightness}%)` }}
                      />
                    </div>
                    <div className="space-y-3 p-3 bg-surface/50 rounded-lg border border-border">
                      <div className="space-y-1">
                        <div className="flex justify-between text-[10px] text-muted uppercase font-bold">
                          <span>Hue</span>
                          <span>{adBgHue}°</span>
                        </div>
                        <input 
                          type="range" 
                          min="0" 
                          max="360" 
                          value={adBgHue} 
                          onChange={e => setAdBgHue(Number(e.target.value))}
                          className="w-full h-1.5 bg-surface rounded-lg appearance-none cursor-pointer accent-accent"
                        />
                      </div>
                      <div className="space-y-1">
                        <div className="flex justify-between text-[10px] text-muted uppercase font-bold">
                          <span>Lightness</span>
                          <span>{adBgLightness}%</span>
                        </div>
                        <input 
                          type="range" 
                          min="10" 
                          max="98" 
                          value={adBgLightness} 
                          onChange={e => setAdBgLightness(Number(e.target.value))}
                          className="w-full h-1.5 bg-surface rounded-lg appearance-none cursor-pointer accent-accent"
                        />
                      </div>
                    </div>
                  </FormGroup>
                  <FormGroup className="mb-0">
                    <Label>Ad Text Color</Label>
                    <div className="flex gap-2 mt-1">
                      <Input 
                        type="color" 
                        value={adTextColor} 
                        onChange={e => setAdTextColor(e.target.value)} 
                        className="w-12 h-10 p-1 bg-surface border-border cursor-pointer"
                      />
                      <Input 
                        type="text" 
                        value={adTextColor} 
                        onChange={e => setAdTextColor(e.target.value)} 
                        className="font-mono text-xs"
                        placeholder="#000000"
                      />
                    </div>
                    <div className="flex gap-1.5 mt-2">
                      {['#000000', '#FFFFFF', '#F7931A', '#18181b'].map(c => (
                        <button 
                          key={c}
                          onClick={() => setAdTextColor(c)}
                          className="w-5 h-5 rounded border border-white/10 hover:scale-110 transition-transform"
                          style={{ backgroundColor: c }}
                        />
                      ))}
                    </div>
                  </FormGroup>
                </div>
                <FormGroup>
                  <Label>Media (Optional) <span className="text-accent font-normal text-[10px] ml-2 bg-accent/10 px-2 py-0.5 rounded">Ad Space: 1200 x 628 px</span></Label>
                  <FileInput 
                    hint={adImage ? "Image uploaded ✓" : "Max size: 5MB • Recommended: 1200 x 628 px"} 
                    onChange={handleImageUpload}
                  />
                  {adImage && (
                    <div className="mt-2 relative inline-block">
                      <img src={adImage} alt="Preview" className="w-32 h-20 object-cover rounded-lg border border-border" />
                      <button 
                        onClick={() => setAdImage(null)}
                        className="absolute -top-2 -right-2 bg-red text-white rounded-full p-1 shadow-lg hover:bg-red/80 transition-colors"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                </FormGroup>
                <FormGroup>
                  <Label>Hashtags & Mentions (Max 3)</Label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {hashtags.map(tag => (
                      <span key={tag} className="bg-accent/20 text-accent px-2 py-1 rounded-md text-xs flex items-center gap-1">
                        {tag} 
                        <button onClick={() => setHashtags(hs => hs.filter(h => h !== tag))} className="hover:text-white transition-colors">
                          <X className="w-3 h-3"/>
                        </button>
                      </span>
                    ))}
                  </div>
                  {hashtags.length < 3 && (
                    <div className="relative">
                      <Input
                        value={hashtagInput}
                        onChange={e => setHashtagInput(e.target.value)}
                        placeholder="Type # or @ to see trending..."
                        onKeyDown={e => {
                          if (e.key === 'Enter' && hashtagInput) {
                            e.preventDefault();
                            setHashtags([...hashtags, hashtagInput]);
                            setHashtagInput('');
                          }
                        }}
                      />
                      {hashtagInput && filteredTags.length > 0 && (
                        <div className="absolute z-10 w-full bg-surface border border-border mt-1 rounded-md shadow-lg overflow-hidden">
                          {filteredTags.slice(0, 5).map(tag => (
                            <div
                              key={tag}
                              className="px-3 py-2 text-sm hover:bg-accent/10 cursor-pointer transition-colors"
                              onClick={() => {
                                setHashtags([...hashtags, tag]);
                                setHashtagInput('');
                              }}
                            >
                              {tag}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </FormGroup>
              </Card>
            </div>

            <div className="space-y-4">
              <Card className="glass-panel">
                <div className="flex items-center gap-2 mb-3">
                  <CardTitle className="mb-0">Target demographics</CardTitle>
                  <InfoTooltip content="Define who should see your ads. Narrow targeting can improve conversion rates." />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <FormGroup className="mb-0">
                  <div className="flex items-center gap-2 mb-1.5">
                    <Label className="mb-0">Audience interest</Label>
                    <InfoTooltip content="Target users based on their hobbies, topics they follow, and content they consume." />
                  </div>
                    <Select value={targeting.interests} onChange={e => setTargeting({ ...targeting, interests: e.target.value })}>
                      <option>Bitcoin & Crypto</option>
                      <option>Finance & Investing</option>
                      <option>Tech & Software</option>
                      <option>Gaming & Esports</option>
                      <option>Small Business & B2B</option>
                      <option>Health & Fitness</option>
                      <option>Travel & Hospitality</option>
                      <option>Real Estate</option>
                      <option>Fashion & Beauty</option>
                      <option>Food & Beverage</option>
                      <option>Automotive</option>
                      <option>Entertainment & Media</option>
                    </Select>
                  </FormGroup>
                  <FormGroup className="mb-0">
                  <div className="flex items-center gap-2 mb-1.5">
                    <Label className="mb-0">Age range</Label>
                    <InfoTooltip content="Specify the age group of the users you want to reach." />
                  </div>
                    <div className="flex gap-3">
                      <Input type="number" placeholder="Min" value={targeting.ageMin} onChange={e => setTargeting({ ...targeting, ageMin: parseInt(e.target.value) || 0 })} />
                      <Input type="number" placeholder="Max" value={targeting.ageMax} onChange={e => setTargeting({ ...targeting, ageMax: parseInt(e.target.value) || 0 })} />
                    </div>
                  </FormGroup>
                  <FormGroup className="mb-0 sm:col-span-2">
                  <div className="flex items-center gap-2 mb-1.5">
                    <Label className="mb-0">Target Countries</Label>
                    <InfoTooltip content="Select the geographic locations where your ads should be displayed." />
                  </div>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {selectedCountries.map(c => (
                        <span key={c} className="bg-surface border border-border text-text px-2 py-1 rounded-md text-xs flex items-center gap-1">
                          {c}
                          <button onClick={() => setSelectedCountries(cs => cs.filter(x => x !== c))} className="hover:text-accent transition-colors">
                            <X className="w-3 h-3"/>
                          </button>
                        </span>
                      ))}
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <Select 
                        value="" 
                        onChange={(e) => {
                          if (e.target.value && !selectedCountries.includes(e.target.value)) {
                            const newCountries = e.target.value === 'Global' 
                              ? ['Global'] 
                              : [...selectedCountries.filter(c => c !== 'Global'), e.target.value];
                            setSelectedCountries(newCountries);
                          }
                        }}
                      >
                        <option value="" disabled>+ Add Country</option>
                        {availableCountries.map(c => <option key={c} value={c}>{c}</option>)}
                      </Select>
                      <Input placeholder="State / Province (Optional)" />
                      <Input placeholder="City / Local Area (Optional)" />
                    </div>
                  </FormGroup>
                  <FormGroup className="mb-0 sm:col-span-2">
                  <div className="flex items-center gap-2 mb-1.5">
                    <Label className="mb-0">Target Languages</Label>
                    <InfoTooltip content="Reach users who speak specific languages." />
                  </div>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {selectedLanguages.map(l => (
                        <span key={l} className="bg-surface border border-border text-text px-2 py-1 rounded-md text-xs flex items-center gap-1">
                          {l}
                          <button onClick={() => setSelectedLanguages(ls => ls.filter(x => x !== l))} className="hover:text-accent transition-colors">
                            <X className="w-3 h-3"/>
                          </button>
                        </span>
                      ))}
                    </div>
                    <Select 
                      value="" 
                      onChange={(e) => {
                        if (e.target.value && !selectedLanguages.includes(e.target.value)) {
                          setSelectedLanguages([...selectedLanguages, e.target.value]);
                        }
                      }}
                    >
                      <option value="" disabled>+ Add Language</option>
                      {availableLanguages.map(l => <option key={l} value={l}>{l}</option>)}
                    </Select>
                  </FormGroup>
                  <FormGroup className="mb-0">
                    <Label>Sex</Label>
                    <Select value={targeting.sex} onChange={e => setTargeting({ ...targeting, sex: e.target.value as 'all' | 'male' | 'female' })}>
                      <option value="all">All</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                    </Select>
                  </FormGroup>
                  <FormGroup className="mb-0">
                    <Label>Education Level</Label>
                    <Select value={targeting.education} onChange={e => setTargeting({ ...targeting, education: e.target.value })}>
                      <option>All Education Levels</option>
                      <option>High School</option>
                      <option>Some College</option>
                      <option>Bachelors Degree</option>
                      <option>Masters Degree</option>
                      <option>PhD / Doctorate</option>
                    </Select>
                  </FormGroup>
                  <FormGroup className="mb-0">
                    <Label>Income Bracket</Label>
                    <Select value={targeting.income} onChange={e => setTargeting({ ...targeting, income: e.target.value })}>
                      <option>All Incomes</option>
                      <option>Top 10%</option>
                      <option>Top 25%</option>
                      <option>Top 50%</option>
                      <option>Below Average</option>
                    </Select>
                  </FormGroup>
                  <FormGroup className="mb-0">
                    <Label>Behaviors</Label>
                    <Select value={targeting.behaviors} onChange={e => setTargeting({ ...targeting, behaviors: e.target.value })}>
                      <option>All Behaviors</option>
                      <option>Crypto Traders</option>
                      <option>Frequent Buyers</option>
                      <option>Tech Early Adopters</option>
                      <option>Business Travelers</option>
                      <option>Luxury Shoppers</option>
                      <option>Gamers</option>
                      <option>Investors</option>
                    </Select>
                  </FormGroup>
                  <FormGroup className="mb-0">
                    <Label>Job Industries</Label>
                    <Select value={targeting.industries} onChange={e => setTargeting({ ...targeting, industries: e.target.value })}>
                      <option>All Industries</option>
                      <option>Technology & IT</option>
                      <option>Finance & Banking</option>
                      <option>Healthcare & Medical</option>
                      <option>Retail & E-commerce</option>
                      <option>Education</option>
                      <option>Construction & Real Estate</option>
                      <option>Manufacturing</option>
                      <option>Marketing & Advertising</option>
                      <option>Arts & Design</option>
                    </Select>
                  </FormGroup>
                </div>
              </Card>
              <Card className="border-accent/30 shadow-[0_0_30px_-10px_rgba(247,147,26,0.15)]">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <CardTitle className="mb-0">Live estimate</CardTitle>
                    <InfoTooltip content="Real-time projection of your campaign's reach based on current budget and targeting." />
                  </div>
                  <div className="text-[10px] font-mono bg-surface px-2 py-1 rounded border border-border text-muted">
                    ID: {projectId}
                  </div>
                </div>
                <div className="bg-green/5 border border-green/20 rounded-xl p-4">
                  <div className="flex justify-between py-1 text-[13px] items-center">
                    <span className="text-muted">Platforms ({selectedPlatformsData.length})</span>
                    <span className="text-accent font-bold text-right flex gap-1">
                      {selectedPlatformsData.map((p, i) => (
                        <span key={i} className="w-4 h-4 [&>svg]:w-4 [&>svg]:h-4">{p.icon}</span>
                      ))}
                    </span>
                  </div>
                  <div className="flex justify-between py-1 text-[13px]">
                    <span className="text-muted">Budget</span>
                    <span>{symbol}{fiatAmount.toFixed(2)} ({btcAmount.toFixed(4)} ₿)</span>
                  </div>
                  <div className="flex justify-between py-1 text-[13px]">
                    <span className="text-muted">Avg CPM</span>
                    <span>~${(selectedPlatformsData.reduce((acc, p) => acc + p.cpm, 0) / selectedPlatformsData.length).toFixed(2)} USD</span>
                  </div>
                  <div className="flex justify-between py-1 text-[13px]">
                    <span className="text-muted">Est. impressions</span>
                    <span className="text-green font-bold">~{estimates.totalImpressions.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between py-1 text-[13px]">
                    <span className="text-muted">Est. clicks (CTR 1.2%)</span>
                    <span className="text-green font-bold">~{estimates.totalClicks.toLocaleString()}</span>
                  </div>
                  
                  <div className="mt-3 pt-3 border-t border-green/10 space-y-2">
                    <div className="text-[10px] uppercase tracking-wider text-muted font-bold">Audience Details</div>
                    <div className="flex justify-between text-[11px]">
                      <span className="text-muted">Gender split</span>
                      <span>{estimates.audience.malePct}% M / {estimates.audience.femalePct}% F</span>
                    </div>
                    <div className="flex justify-between text-[11px]">
                      <span className="text-muted">Interest affinity ({targeting.interests})</span>
                      <span className="text-accent">{estimates.audience.topInterestPct}% high</span>
                    </div>
                    <div className="flex justify-between text-[11px]">
                      <span className="text-muted">Device reach</span>
                      <span>{targeting.devices.join(', ')}</span>
                    </div>
                  </div>

                  {mode === 'complex' && (
                    <div className="mt-2 pt-2 border-t border-green/10 space-y-1">
                      <div className="text-[10px] uppercase tracking-wider text-muted font-bold mb-1">Platform Split</div>
                      {estimates.platformBreakdown.map(p => (
                        <div key={p.id} className="flex justify-between text-[11px]">
                          <span className="flex items-center gap-1">{p.icon} {p.name} ({p.weight}%)</span>
                          <span>~{p.impressions.toLocaleString()} imp</span>
                        </div>
                      ))}
                      {variants.length > 1 && (
                        <div className="flex justify-between text-[11px] text-accent mt-1">
                          <span>A/B Testing Enabled</span>
                          <span>50/50 Split</span>
                        </div>
                      )}
                      {ppq.autoRebalance && (
                        <div className="text-[10px] text-blue italic mt-1">
                          PPQ.AI Auto-Rebalance active
                        </div>
                      )}
                    </div>
                  )}
                  <div className="flex justify-between py-1 text-[13px]">
                    <span className="text-muted">Est. duration</span>
                    <span>3–5 days</span>
                  </div>
                  <div className="flex justify-between pt-3 mt-2 border-t border-green/20 font-extrabold text-[15px]">
                    <span>Total (BTC)</span>
                    <span className="text-accent">{btcAmount.toFixed(8)} ₿</span>
                  </div>
                </div>
              </Card>

              <Card className="glass-panel">
                <CardTitle>Ad preview — {selectedPlatformsData[0]?.name} {selectedPlatformsData.length > 1 ? `(+${selectedPlatformsData.length - 1} more)` : ''}</CardTitle>
                <div className="space-y-4">
                  {variants.map((v, idx) => (
                    <div key={v.id} className="space-y-2">
                      {variants.length > 1 && <div className="text-[10px] font-bold text-accent uppercase tracking-widest">Variant {v.id}</div>}
                      <div 
                        className="rounded-xl p-4 min-h-[120px] relative overflow-hidden shadow-inner border border-border transition-colors duration-200"
                        style={{ backgroundColor: `hsl(${v.bgHue}, 40%, ${v.bgLightness}%)`, color: v.textColor }}
                      >
                        <div className="absolute top-2 right-2 bg-black/10 rounded text-[9px] px-1.5 py-0.5 font-bold tracking-wider uppercase opacity-70">Sponsored</div>
                        <div className="text-[10px] mb-2 flex items-center gap-1.5 opacity-80">
                          <span className="w-4 h-4 [&>svg]:w-4 [&>svg]:h-4">{selectedPlatformsData[0]?.icon}</span> <strong>giveabit.io</strong> <span className="opacity-70">@giveabit · Promoted</span>
                        </div>
                        <div className="text-[15px] font-bold mb-1 leading-tight">{v.headline || "Your Headline Here"}</div>
                        <div className="text-[13px] leading-relaxed opacity-90">{v.description || "Your description will appear here."}</div>
                        
                        {adImage && (
                          <div className="mt-3 rounded-lg overflow-hidden border border-black/10">
                            <img src={adImage} alt="Ad Media" className="w-full h-auto object-cover max-h-[200px]" />
                          </div>
                        )}

                        {v.hashtags.length > 0 && (
                          <div className="text-[12px] mt-2 font-medium opacity-80" style={{ color: v.textColor }}>
                            {v.hashtags.join(' ')}
                          </div>
                        )}
                        
                        <div className="text-[11px] mt-3 font-medium opacity-80" style={{ color: v.textColor }}>🔗 {v.url.replace(/^https?:\/\//, '') || "example.com"}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              <Button className="w-full bg-gradient-to-r from-accent to-accent2 text-black border-0 hover:opacity-90 transition-opacity shadow-[0_0_20px_rgba(247,147,26,0.3)]" size="lg" onClick={() => setShowInvoice(true)}>
                ⚡ Deploy via PPQ.AI — Pay with Bitcoin
              </Button>
            </div>
          </motion.div>
        ) : (
          <motion.div key="complex" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <Card className="glass-panel">
                <div className="flex items-center gap-2 mb-3">
                  <Layers className="w-5 h-5 text-accent" />
                  <CardTitle className="mb-0">Advanced Platform Control</CardTitle>
                  <InfoTooltip content="Manually adjust how much of your budget goes to each platform." />
                </div>
                <div className="text-xs text-muted mb-4 leading-relaxed">
                  Define custom budget weights per platform. PPQ.AI will use these as baselines for optimization.
                </div>
                <div className="space-y-5">
                  {selectedPlatformsData.map(p => (
                    <div key={p.id} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2 text-sm font-bold">
                          {p.icon} {p.name}
                        </div>
                        <div className="text-xs font-mono text-accent">{platformWeights[p.id] || 0}%</div>
                      </div>
                      <input 
                        type="range" 
                        min="0" 
                        max="100" 
                        value={platformWeights[p.id] || 0} 
                        onChange={e => {
                          const val = parseInt(e.target.value);
                          setPlatformWeights({ ...platformWeights, [p.id]: val });
                        }}
                        className="w-full h-1.5 bg-surface rounded-lg appearance-none cursor-pointer accent-accent"
                      />
                    </div>
                  ))}
                  <div className="p-3 bg-accent/5 border border-accent/20 rounded-lg flex justify-between items-center">
                    <span className="text-xs text-muted">Total Weight:</span>
                    <span className={cn("text-sm font-bold font-mono", Object.values(platformWeights).reduce((a: number, b: number) => a + b, 0) === 100 ? "text-green" : "text-red")}>
                      {Object.values(platformWeights).reduce((a: number, b: number) => a + b, 0)}%
                    </span>
                  </div>
                  {Object.values(platformWeights).reduce((a: number, b: number) => a + b, 0) !== 100 && (
                    <Button 
                      variant="secondary" 
                      size="sm" 
                      className="w-full text-[11px]"
                      onClick={() => {
                        const count = selectedPlatformsData.length;
                        const even = Math.floor(100 / count);
                        const newWeights: Record<string, number> = {};
                        selectedPlatformsData.forEach((p, i) => {
                          newWeights[p.id] = i === count - 1 ? 100 - (even * (count - 1)) : even;
                        });
                        setPlatformWeights(newWeights);
                      }}
                    >
                      Auto-Normalize to 100%
                    </Button>
                  )}
                </div>
              </Card>

              <Card className="glass-panel">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Activity className="w-5 h-5 text-accent" />
                    <CardTitle className="mb-0">A/B Testing Suite</CardTitle>
                  </div>
                  <Button 
                    size="sm" 
                    variant={variants.length < 2 ? "secondary" : "ghost"}
                    onClick={addVariant}
                    disabled={variants.length >= 2}
                  >
                    <Plus className="w-4 h-4 mr-1" /> Add Variant
                  </Button>
                </div>
                
                <div className="space-y-6">
                  {variants.map((v, idx) => (
                    <div key={v.id} className="p-4 bg-surface/50 border border-border rounded-xl space-y-4 relative">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-bold uppercase tracking-widest text-accent">Variant {v.id}</span>
                        {idx > 0 && (
                          <button onClick={() => removeVariant(v.id)} className="text-muted hover:text-red transition-colors">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                      <FormGroup>
                        <Label>Headline</Label>
                        <Input value={v.headline} onChange={e => updateVariant(v.id, { headline: e.target.value })} />
                      </FormGroup>
                      <FormGroup>
                        <Label>Description</Label>
                        <Textarea value={v.description} onChange={e => updateVariant(v.id, { description: e.target.value })} rows={2} />
                      </FormGroup>
                      <div className="grid grid-cols-2 gap-4">
                        <FormGroup className="mb-0">
                          <div className="flex justify-between items-center mb-1">
                            <Label className="mb-0">BG Hue</Label>
                            <div className="w-3 h-3 rounded-full border border-white/10" style={{ backgroundColor: `hsl(${v.bgHue}, 40%, ${v.bgLightness}%)` }} />
                          </div>
                          <input 
                            type="range" min="0" max="360" value={v.bgHue} 
                            onChange={e => updateVariant(v.id, { bgHue: parseInt(e.target.value) })}
                            className="w-full h-1.5 bg-surface rounded-lg appearance-none cursor-pointer accent-accent"
                          />
                        </FormGroup>
                        <FormGroup className="mb-0">
                          <Label>BG Lightness</Label>
                          <input 
                            type="range" min="10" max="98" value={v.bgLightness} 
                            onChange={e => updateVariant(v.id, { bgLightness: parseInt(e.target.value) })}
                            className="w-full h-1.5 bg-surface rounded-lg appearance-none cursor-pointer accent-accent"
                          />
                        </FormGroup>
                      </div>
                      <FormGroup className="mb-0">
                        <Label>Text Color</Label>
                        <div className="flex gap-2">
                          <Input type="color" value={v.textColor} onChange={e => updateVariant(v.id, { textColor: e.target.value })} className="w-10 h-8 p-1" />
                          <Input 
                            type="text" 
                            value={v.textColor} 
                            onChange={e => updateVariant(v.id, { textColor: e.target.value })} 
                            className="h-8 text-[10px] font-mono"
                          />
                        </div>
                      </FormGroup>
                    </div>
                  ))}
                </div>
              </Card>

              <Card className="glass-panel">
                <div className="flex items-center gap-2 mb-4">
                  <Target className="w-5 h-5 text-accent" />
                  <CardTitle className="mb-0">Granular Context</CardTitle>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <FormGroup>
                    <Label>Device Targeting</Label>
                    <div className="flex gap-2 mt-2">
                      {[
                        { id: 'ios', icon: <Smartphone className="w-4 h-4" />, label: 'iOS' },
                        { id: 'android', icon: <Smartphone className="w-4 h-4" />, label: 'Android' },
                        { id: 'desktop', icon: <Monitor className="w-4 h-4" />, label: 'Desktop' },
                      ].map(d => (
                        <button
                          key={d.id}
                          onClick={() => toggleDevice(d.id)}
                          className={cn(
                            "flex-1 flex flex-col items-center gap-1 p-2 rounded-lg border transition-all",
                            targeting.devices.includes(d.id) ? "border-accent bg-accent/10 text-accent" : "border-border text-muted"
                          )}
                        >
                          {d.icon}
                          <span className="text-[10px] font-bold">{d.label}</span>
                        </button>
                      ))}
                    </div>
                  </FormGroup>
                  <FormGroup>
                    <Label>Network Type</Label>
                    <div className="flex gap-2 mt-2">
                      {[
                        { id: 'wifi', icon: <Wifi className="w-4 h-4" />, label: 'WiFi' },
                        { id: 'cellular', icon: <Globe className="w-4 h-4" />, label: 'Cellular' },
                      ].map(n => (
                        <button
                          key={n.id}
                          onClick={() => toggleNetwork(n.id)}
                          className={cn(
                            "flex-1 flex flex-col items-center gap-1 p-2 rounded-lg border transition-all",
                            targeting.networks.includes(n.id) ? "border-accent bg-accent/10 text-accent" : "border-border text-muted"
                          )}
                        >
                          {n.icon}
                          <span className="text-[10px] font-bold">{n.label}</span>
                        </button>
                      ))}
                    </div>
                  </FormGroup>
                  <FormGroup className="sm:col-span-2">
                    <Label>Custom Pixel / Webhook URL</Label>
                    <Input 
                      placeholder="https://your-analytics.com/pixel?id=..." 
                      value={targeting.pixelUrl}
                      onChange={e => setTargeting({ ...targeting, pixelUrl: e.target.value })}
                    />
                    <div className="text-[10px] text-muted mt-1">Tadbuy will ping this URL on every click/conversion event.</div>
                  </FormGroup>
                </div>
              </Card>
            </div>

            <div className="space-y-4">
              <Card className="glass-panel">
                <div className="flex items-center gap-2 mb-4">
                  <Calendar className="w-5 h-5 text-accent" />
                  <CardTitle className="mb-0">Campaign Scheduling</CardTitle>
                </div>
                <div className="flex bg-surface rounded-lg p-1 mb-4 border border-border">
                  <button 
                    className={cn("flex-1 py-1.5 text-[11px] font-bold rounded-md transition-all", scheduling.mode === 'calendar' ? "bg-card text-text shadow-sm" : "text-muted")}
                    onClick={() => setScheduling({ ...scheduling, mode: 'calendar' })}
                  >
                    Calendar Date
                  </button>
                  <button 
                    className={cn("flex-1 py-1.5 text-[11px] font-bold rounded-md transition-all", scheduling.mode === 'block' ? "bg-card text-text shadow-sm" : "text-muted")}
                    onClick={() => setScheduling({ ...scheduling, mode: 'block' })}
                  >
                    Block Height
                  </button>
                </div>
                
                {scheduling.mode === 'calendar' ? (
                  <div className="grid grid-cols-2 gap-4">
                    <FormGroup className="mb-0">
                      <Label>Start Date</Label>
                      <Input type="date" value={scheduling.startDate} onChange={e => setScheduling({ ...scheduling, startDate: e.target.value })} />
                    </FormGroup>
                    <FormGroup className="mb-0">
                      <Label>End Date</Label>
                      <Input type="date" value={scheduling.endDate} onChange={e => setScheduling({ ...scheduling, endDate: e.target.value })} />
                    </FormGroup>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-4">
                    <FormGroup className="mb-0">
                      <Label>Start Block</Label>
                      <Input type="number" value={scheduling.startBlock} onChange={e => setScheduling({ ...scheduling, startBlock: parseInt(e.target.value) })} />
                    </FormGroup>
                    <FormGroup className="mb-0">
                      <Label>End Block</Label>
                      <Input type="number" value={scheduling.endBlock} onChange={e => setScheduling({ ...scheduling, endBlock: parseInt(e.target.value) })} />
                    </FormGroup>
                  </div>
                )}
                <div className="mt-3 p-3 bg-accent/5 border border-accent/20 rounded-lg text-[10px] text-muted leading-relaxed">
                  {scheduling.mode === 'block' ? 
                    "Campaign will automatically activate and deactivate based on Bitcoin network block height. Ideal for protocol-native timing." :
                    "Standard calendar-based scheduling. Times are in UTC."
                  }
                </div>
              </Card>

              <Card className="glass-panel">
                <div className="flex items-center gap-2 mb-4">
                  <Settings2 className="w-5 h-5 text-accent" />
                  <CardTitle className="mb-0">PPQ.AI Optimization</CardTitle>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-surface/50 border border-border rounded-xl">
                    <div>
                      <div className="text-xs font-bold">Auto-Rebalance Budget</div>
                      <div className="text-[10px] text-muted">Shift sats to high-performing platforms</div>
                    </div>
                    <button 
                      onClick={() => setPpq({ ...ppq, autoRebalance: !ppq.autoRebalance })}
                      className={cn("w-10 h-5 rounded-full transition-all relative", ppq.autoRebalance ? "bg-green" : "bg-muted/30")}
                    >
                      <div className={cn("absolute top-1 w-3 h-3 bg-white rounded-full transition-all", ppq.autoRebalance ? "right-1" : "left-1")} />
                    </button>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-surface/50 border border-border rounded-xl">
                    <div>
                      <div className="text-xs font-bold">Sentiment Filter</div>
                      <div className="text-[10px] text-muted">Avoid negative-sentiment content adjacency</div>
                    </div>
                    <button 
                      onClick={() => setPpq({ ...ppq, sentimentFilter: !ppq.sentimentFilter })}
                      className={cn("w-10 h-5 rounded-full transition-all relative", ppq.sentimentFilter ? "bg-green" : "bg-muted/30")}
                    >
                      <div className={cn("absolute top-1 w-3 h-3 bg-white rounded-full transition-all", ppq.sentimentFilter ? "right-1" : "left-1")} />
                    </button>
                  </div>

                  <FormGroup className="mb-0">
                    <Label>Optimization Goal</Label>
                    <Select value={ppq.optimizationGoal} onChange={e => setPpq({ ...ppq, optimizationGoal: e.target.value as any })}>
                      <option value="cpc">Maximize Clicks (Lowest CPC)</option>
                      <option value="roas">Maximize ROAS (Conversion Focused)</option>
                      <option value="reach">Maximize Reach (Brand Awareness)</option>
                    </Select>
                  </FormGroup>
                </div>
              </Card>

              {/* Reuse Live Estimate and Preview logic from Simple Mode but adapted */}
              <Card className="border-accent/30 shadow-[0_0_30px_-10px_rgba(247,147,26,0.15)]">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <CardTitle className="mb-0">Live estimate</CardTitle>
                    <InfoTooltip content="Real-time projection of your campaign's reach based on current budget and targeting." />
                  </div>
                  <div className="text-[10px] font-mono bg-surface px-2 py-1 rounded border border-border text-muted">
                    ID: {projectId}
                  </div>
                </div>
                <div className="bg-green/5 border border-green/20 rounded-xl p-4">
                  <div className="flex justify-between py-1 text-[13px] items-center">
                    <span className="text-muted">Platforms ({selectedPlatformsData.length})</span>
                    <span className="text-accent font-bold text-right flex gap-1">
                      {selectedPlatformsData.map((p, i) => (
                        <span key={i} className="w-4 h-4 [&>svg]:w-4 [&>svg]:h-4">{p.icon}</span>
                      ))}
                    </span>
                  </div>
                  <div className="flex justify-between py-1 text-[13px]">
                    <span className="text-muted">Budget</span>
                    <span>{symbol}{fiatAmount.toFixed(2)} ({btcAmount.toFixed(4)} ₿)</span>
                  </div>
                  <div className="mt-2 pt-2 border-t border-green/10 space-y-1">
                    <div className="text-[10px] uppercase tracking-wider text-muted font-bold mb-1">Platform Split</div>
                    {estimates.platformBreakdown.map(p => (
                      <div key={p.id} className="flex justify-between text-[11px]">
                        <span className="flex items-center gap-1">{p.icon} {p.name} ({p.weight}%)</span>
                        <span>~{p.impressions.toLocaleString()} imp</span>
                      </div>
                    ))}
                    {variants.length > 1 && (
                      <div className="flex justify-between text-[11px] text-accent mt-1">
                        <span>A/B Testing Enabled</span>
                        <span>50/50 Split</span>
                      </div>
                    )}
                    {ppq.autoRebalance && (
                      <div className="text-[10px] text-blue italic mt-1">
                        PPQ.AI Auto-Rebalance active
                      </div>
                    )}
                  </div>
                  <div className="flex justify-between pt-3 mt-2 border-t border-green/20 font-extrabold text-[15px]">
                    <span>Total (BTC)</span>
                    <span className="text-accent">{btcAmount.toFixed(8)} ₿</span>
                  </div>
                </div>
              </Card>

              <Card className="glass-panel">
                <CardTitle>Ad preview — {selectedPlatformsData[0]?.name}</CardTitle>
                <div className="space-y-4">
                  {variants.map((v) => (
                    <div key={v.id} className="space-y-2">
                      <div className="text-[10px] font-bold text-accent uppercase tracking-widest">Variant {v.id}</div>
                      <div 
                        className="rounded-xl p-4 min-h-[100px] relative overflow-hidden border border-border"
                        style={{ backgroundColor: `hsl(${v.bgHue}, 40%, ${v.bgLightness}%)`, color: v.textColor }}
                      >
                        <div className="text-[10px] mb-2 flex items-center gap-1.5 opacity-80">
                          <span className="w-4 h-4 [&>svg]:w-4 [&>svg]:h-4">{selectedPlatformsData[0]?.icon}</span> <strong>giveabit.io</strong>
                        </div>
                        <div className="text-[14px] font-bold mb-1">{v.headline || "Headline"}</div>
                        <div className="text-[12px] opacity-90">{v.description || "Description"}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              <Button className="w-full bg-gradient-to-r from-accent to-accent2 text-black border-0" size="lg" onClick={() => setShowInvoice(true)}>
                ⚡ Deploy Advanced Campaign
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <Modal isOpen={showInvoice} onClose={() => {
        if (paymentStatus !== 'processing') setShowInvoice(false);
      }}>
        <div className="p-8 text-center relative overflow-hidden">
          <AnimatePresence mode="wait">
            {paymentStatus === 'waiting' ? (
              /* ── WAITING: scan QR, countdown, pulse ── */
              <motion.div
                key="waiting"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="py-6 flex flex-col items-center"
              >
                <div className="flex items-center justify-between w-full mb-5">
                  <div>
                    <h2 className="text-xl font-extrabold leading-tight">Scan to pay</h2>
                    <p className="text-xs text-muted mt-0.5">Lightning invoice — open in your wallet</p>
                  </div>
                  <div className={cn(
                    "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border",
                    "bg-lightning/10 text-lightning border-lightning/20"
                  )}>
                    Instant
                  </div>
                </div>

                {/* QR code */}
                <div className="bg-white p-4 rounded-2xl inline-block mb-4 shadow-2xl">
                  <QRCodeSVG value={bolt11Invoice} size={200} level="H" includeMargin={false} />
                </div>

                {/* Countdown */}
                <div className="flex items-center gap-2 mb-4">
                  <div className={cn(
                    "font-mono text-3xl font-extrabold tabular-nums",
                    invoiceSecondsLeft < 120 ? "text-red-400" : "text-text"
                  )}>
                    {formatCountdown(invoiceSecondsLeft)}
                  </div>
                  <div className="text-xs text-muted leading-tight">
                    until<br />expires
                  </div>
                </div>

                {/* Pulsing waiting indicator */}
                <div className="flex items-center gap-2.5 mb-6 px-4 py-2.5 bg-lightning/5 border border-lightning/20 rounded-full">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-lightning opacity-75" />
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-lightning" />
                  </span>
                  <span className="text-xs text-lightning font-semibold">Waiting for payment…</span>
                </div>

                {/* Invoice string */}
                <div className="relative w-full mb-5">
                  <div className="bg-bg border border-border rounded-xl p-3 font-mono text-[9px] text-muted break-all text-left pr-10 max-h-16 overflow-hidden">
                    {bolt11Invoice}
                  </div>
                  <button
                    onClick={handleCopyInvoice}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 hover:bg-surface rounded-lg transition-colors text-accent"
                  >
                    {invoiceCopied ? <CheckCircle2 className="w-4 h-4" /> : <Layers className="w-4 h-4" />}
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-3 w-full mb-2 text-left">
                  <div className="bg-surface border border-border rounded-xl p-3">
                    <div className="text-[10px] text-muted uppercase font-bold mb-1">Amount</div>
                    <div className="text-base font-extrabold text-accent">{btcAmount.toFixed(8)} ₿</div>
                    <div className="text-[10px] text-muted">≈ {symbol}{fiatAmount.toFixed(2)}</div>
                  </div>
                  <div className="bg-surface border border-border rounded-xl p-3">
                    <div className="text-[10px] text-muted uppercase font-bold mb-1">Network</div>
                    <div className="text-base font-extrabold text-lightning">Lightning</div>
                    <div className="text-[10px] text-muted">Near-zero fees</div>
                  </div>
                </div>

                <Button
                  variant="secondary"
                  className="w-full mt-2"
                  onClick={handleCancelPayment}
                >
                  Cancel
                </Button>
              </motion.div>
            ) : paymentStatus === 'processing' ? (
              <motion.div
                key="processing"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.1 }}
                className="py-12 flex flex-col items-center"
              >
                <div className="relative w-24 h-24 mb-8">
                  <motion.div
                    className="absolute inset-0 border-4 border-accent/20 rounded-full"
                  />
                  <motion.div
                    className="absolute inset-0 border-4 border-t-accent rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  />
                  <Zap className="absolute inset-0 m-auto w-10 h-10 text-accent animate-pulse" />
                </div>
                <h2 className="text-2xl font-extrabold mb-2">Verifying Payment</h2>
                <p className="text-sm text-muted">Checking the {paymentMethod === 'btc' ? 'Bitcoin network' : 'Lightning Network'} for your transaction...</p>
                <div className="mt-8 flex gap-1 justify-center">
                  {[0, 1, 2].map(i => (
                    <motion.div
                      key={i}
                      className="w-1.5 h-1.5 bg-accent rounded-full"
                      animate={{ opacity: [0.3, 1, 0.3] }}
                      transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                    />
                  ))}
                </div>
              </motion.div>
            ) : (
              <motion.div 
                key="invoice"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="text-left">
                    <h2 className="text-2xl font-extrabold leading-tight">
                      {paymentMethod === 'bolt12' ? 'BOLT 12 Offer' : (paymentMethod === 'lightning' ? 'Lightning Invoice' : 'Bitcoin Invoice')}
                    </h2>
                    <p className="text-xs text-muted">Project: <span className="text-text font-mono">{projectId}</span></p>
                  </div>
                  <div className={cn(
                    "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest",
                    paymentMethod === 'bolt12' ? "bg-purple/10 text-purple border border-purple/20" : 
                    (paymentMethod === 'lightning' ? "bg-lightning/10 text-lightning border border-lightning/20" : "bg-accent/10 text-accent border border-accent/20")
                  )}>
                    {paymentMethod === 'bolt12' ? 'Privacy Enabled' : (paymentMethod === 'lightning' ? 'Instant' : 'On-Chain')}
                  </div>
                </div>
                
                <div className="bg-white p-5 rounded-2xl inline-block mb-8 shadow-2xl relative group">
                  <QRCodeSVG 
                    value={paymentMethod === 'zap' ? `nostr:npub1...` : (paymentMethod === 'bolt12' ? bolt12Offer : (paymentMethod === 'lightning' ? bolt11Invoice : `${BITCOIN_URI}?amount=${btcAmount.toFixed(8)}&message=${projectId}`))} 
                    size={220} 
                    level="H"
                    includeMargin={false}
                  />
                  <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl flex items-center justify-center pointer-events-none">
                    <Zap className="w-12 h-12 text-accent drop-shadow-lg" />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-surface border border-border rounded-xl p-3 text-left">
                    <div className="text-[10px] text-muted uppercase font-bold mb-1">Amount to send</div>
                    <div className="text-lg font-extrabold text-accent">{btcAmount.toFixed(8)} ₿</div>
                    <div className="text-[10px] text-muted">≈ {symbol}{fiatAmount.toFixed(2)}</div>
                  </div>
                  <div className="bg-surface border border-border rounded-xl p-3 text-left">
                    <div className="text-[10px] text-muted uppercase font-bold mb-1">Network Fee</div>
                    <div className="text-lg font-extrabold text-green">
                      {paymentMethod === 'btc' ? `~${((mempoolFees.fastestFee * 140) / 100000000).toFixed(8)} ₿` : '0.00000 ₿'}
                    </div>
                    <div className="text-[10px] text-muted">{paymentMethod === 'btc' ? `Estimated (${mempoolFees.fastestFee} sat/vB)` : 'Lightning Free'}</div>
                  </div>
                </div>
                
                <div className="relative mb-6">
                  <div className="bg-bg p-4 rounded-xl font-mono text-[10px] text-muted break-all border border-border text-left pr-12">
                    {paymentMethod === 'bolt12' ? bolt12Offer : (paymentMethod === 'lightning' ? bolt11Invoice : BITCOIN_ADDRESS)}
                  </div>
                  <button 
                    onClick={handleCopyInvoice}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-2 hover:bg-surface rounded-lg transition-colors text-accent"
                  >
                    {invoiceCopied ? <CheckCircle2 className="w-4 h-4" /> : <Layers className="w-4 h-4" />}
                  </button>
                </div>
                
                <div className="flex gap-3">
                  <Button variant="secondary" className="flex-1" onClick={() => setShowInvoice(false)}>
                    Cancel
                  </Button>
                  <Button className="flex-[2] bg-accent text-black hover:opacity-90" onClick={handleDeploy}>
                    {paymentMethod === 'btc' ? 'I have sent the payment' : 'Confirm Payment'}
                  </Button>
                </div>
                
                <p className="mt-6 text-[10px] text-muted flex items-center justify-center gap-1.5">
                  <ShieldAlert className="w-3 h-3" />
                  Payments are non-reversible. Ensure the amount is exact.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </Modal>

      {/* Success Modal */}
      <Modal isOpen={showSuccessModal} onClose={() => setShowSuccessModal(false)}>
        <div className="p-8 text-center">
          <div className="w-20 h-20 bg-green/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10 text-green" />
          </div>
          <CardTitle className="justify-center text-lg mb-2">Campaign Deployed!</CardTitle>
          <p className="text-sm text-muted mb-8 leading-relaxed">
            Your campaign <strong>{headline}</strong> has been successfully broadcast to the network. 
            PPQ.AI is now optimizing your delivery across {selectedPlatforms.length} platforms.
          </p>
          
          <div className="bg-surface border border-border rounded-xl p-4 mb-8 text-left">
            <div className="text-[10px] uppercase tracking-widest text-muted font-bold mb-3">Campaign Summary</div>
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-muted">Project ID</span>
                <span className="font-mono">{projectId}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-muted">Budget</span>
                <span className="text-accent font-bold">{btcAmount.toFixed(4)} ₿</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-muted">Est. Reach</span>
                <span className="text-green font-bold">{estimates.totalImpressions.toLocaleString()} impressions</span>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <Link to="/campaigns" className="w-full">
              <Button className="w-full">
                View in Campaigns
              </Button>
            </Link>
            <Button variant="secondary" className="w-full" onClick={() => setShowSuccessModal(false)}>
              Create another
            </Button>
          </div>
        </div>
      </Modal>
    </motion.div>
  );
}
