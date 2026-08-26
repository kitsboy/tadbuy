import { useState, useEffect, useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import {
  Twitter,
  Zap,
  ChevronDown,
  ChevronUp,
  Heart,
  Briefcase,
  ShieldAlert,
  Mail,
  Copy,
  Check,
  ExternalLink,
  Github,
  Globe,
  Send,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from './ui';
import { BITCOIN_ADDRESS, BITCOIN_URI, APP_VERSION, TWITTER_HANDLE, SUPPORT_EMAIL } from '@/constants';
import { BlockHeightTicker } from '@/components/widgets/BlockHeightTicker';

const JOBS = [
  { title: "Senior DevOps Engineer", desc: "Scale our containerized infrastructure on Cloud Run.", tag: "Remote" },
  { title: "Site Reliability Engineer (SRE)", desc: "Ensure 99.99% uptime for our Lightning nodes.", tag: "Remote" },
  { title: "Cloud Infrastructure Architect", desc: "Design secure, scalable multi-cloud deployments.", tag: "Remote" },
  { title: "DevOps Security Specialist", desc: "Harden our CI/CD pipelines and production environments.", tag: "Remote" },
  { title: "Platform Engineer", desc: "Build developer tools for our internal teams.", tag: "Remote" },
  { title: "Network Operations Engineer", desc: "Optimize Lightning Network routing and node performance.", tag: "Remote" },
  { title: "Automation Engineer", desc: "Automate infrastructure provisioning and monitoring.", tag: "Remote" },
];

const NAV_GROUPS = [
  {
    title: 'Platform',
    items: [
      { label: 'Buy Ads', to: '/' },
      { label: 'Campaigns', to: '/campaigns' },
      { label: 'Metrics', to: '/metrics' },
      { label: 'Global Reach', to: '/geo' },
      { label: 'Hubhash', to: '/hubhash' },
      { label: 'Marketplace', to: '/marketplace' },
    ],
  },
  {
    title: 'Developers',
    items: [
      { label: 'Documentation', to: '/docs' },
      { label: 'API Reference', to: '/api-docs' },
      { label: 'PPQ.AI Guide', to: '/ppq' },
      { label: 'BOLT 12 Info', to: '/bolt12' },
      { label: 'Integrations', to: '/integrations' },
      { label: 'System Health', to: '/health' },
    ],
  },
  {
    title: 'Company',
    items: [
      { label: 'Investor Pitch', to: '/pitch' },
      { label: 'PPQ Intelligence', to: '/intelligence' },
      { label: 'Enterprise', to: '/enterprise' },
      { label: 'BETA Status', to: '/beta' },
      { label: 'Changelog', to: '/changelog' },
      { label: 'Compare DSPs', to: '/compare' },
    ],
  },
];

export default function Footer() {
  const [showQR, setShowQR] = useState(false);
  const [showJobs, setShowJobs] = useState(false);
  const [copied, setCopied] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [emailValue, setEmailValue] = useState('');
  const [emailSent, setEmailSent] = useState(false);
  const qrRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!showQR) return;
    const onClick = (e: MouseEvent) => {
      if (qrRef.current && !qrRef.current.contains(e.target as Node)) {
        setShowQR(false);
      }
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, [showQR]);

  const handleCopy = async (text: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailValue.includes('@')) return;
    setEmailSent(true);
    setEmailValue('');
    setTimeout(() => setEmailSent(false), 4000);
  };

  return (
    <footer className="relative mt-24 overflow-hidden border-t border-white/5">
      {/* Animated background gradient */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            'radial-gradient(circle at 20% 0%, rgba(244,114,182,0.10), transparent 40%), radial-gradient(circle at 80% 100%, rgba(192,132,252,0.08), transparent 40%), linear-gradient(180deg, #0d0d10 0%, #111114 100%)',
        }}
      />
      {/* Subtle grid overlay */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 opacity-[0.04]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />

      {/* Top accent line */}
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 h-px"
        style={{ background: 'linear-gradient(90deg, transparent, #f472b6, #c084fc, transparent)' }}
      />

      <div className="relative mx-auto max-w-[1440px] px-4 sm:px-6 md:px-8 pt-16 pb-10">
        {/* Top bar: brand + tagline + socials */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 pb-12">
          {/* Brand block */}
          <div className="lg:col-span-4">
            <div className="flex items-center gap-3 mb-5">
              <div className="relative">
                <img src="/favicon.png" alt="Tadbuy" className="w-9 h-9 object-contain" />
                <span className="absolute -inset-1 rounded-full bg-accent/20 blur-md -z-10" />
              </div>
              <div>
                <div className="text-[22px] font-extrabold tracking-tight leading-none">Tadbuy</div>
                <div className="text-[10px] text-muted font-mono tracking-wide mt-0.5">by giveabit.io</div>
              </div>
            </div>

            <p className="text-sm text-zinc-400 mb-6 leading-relaxed max-w-sm">
              The <span className="text-accent font-semibold">decentralized ad-buying suite</span>. Pay in sats,
              target the Bitcoin economy, settle on Lightning. No middlemen.
            </p>

            {/* Social icons row */}
            <div className="flex items-center gap-2 mb-8">
              <a
                href={`https://twitter.com/${TWITTER_HANDLE.replace('@', '')}`}
                target="_blank"
                rel="noreferrer"
                aria-label="Twitter"
                className="group inline-flex h-9 w-9 items-center justify-center rounded-lg border border-white/5 bg-white/[0.02] text-zinc-400 transition-all hover:border-accent/40 hover:bg-accent/10 hover:text-accent hover:-translate-y-0.5"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a
                href="https://github.com/kitsboy/tadbuy"
                target="_blank"
                rel="noreferrer"
                aria-label="GitHub"
                className="group inline-flex h-9 w-9 items-center justify-center rounded-lg border border-white/5 bg-white/[0.02] text-zinc-400 transition-all hover:border-accent/40 hover:bg-accent/10 hover:text-accent hover:-translate-y-0.5"
              >
                <Github className="w-4 h-4" />
              </a>
              <a
                href={`mailto:${SUPPORT_EMAIL}`}
                aria-label="Email"
                className="group inline-flex h-9 w-9 items-center justify-center rounded-lg border border-white/5 bg-white/[0.02] text-zinc-400 transition-all hover:border-accent/40 hover:bg-accent/10 hover:text-accent hover:-translate-y-0.5"
              >
                <Mail className="w-4 h-4" />
              </a>
              <a
                href="https://t.me/giveabit"
                target="_blank"
                rel="noreferrer"
                aria-label="Telegram"
                className="group inline-flex h-9 w-9 items-center justify-center rounded-lg border border-white/5 bg-white/[0.02] text-zinc-400 transition-all hover:border-accent/40 hover:bg-accent/10 hover:text-accent hover:-translate-y-0.5"
              >
                <Send className="w-4 h-4" />
              </a>
            </div>

            {/* Newsletter card */}
            <div
              className={cn(
                'rounded-xl border bg-white/[0.02] p-4 transition-all',
                emailFocused ? 'border-accent/40 shadow-[0_0_0_3px_rgba(244,114,182,0.08)]' : 'border-white/5'
              )}
            >
              <div className="text-[11px] font-bold uppercase tracking-widest text-zinc-300 mb-2">
                {emailSent ? '✓ Subscribed' : 'Newsletter'}
              </div>
              {!emailSent ? (
                <>
                  <p className="text-xs text-muted mb-3 leading-relaxed">
                    Quarterly product updates. No spam, unsubscribe any time.
                  </p>
                  <form onSubmit={handleEmailSubmit} className="flex gap-2">
                    <input
                      type="email"
                      required
                      placeholder="you@bitcoin.com"
                      value={emailValue}
                      onChange={(e) => setEmailValue(e.target.value)}
                      onFocus={() => setEmailFocused(true)}
                      onBlur={() => setEmailFocused(false)}
                      className="flex-1 min-w-0 rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-xs text-white placeholder-zinc-500 outline-none transition-colors focus:border-accent/50"
                    />
                    <button
                      type="submit"
                      className="inline-flex items-center justify-center rounded-lg bg-accent px-3 text-xs font-bold text-black transition-all hover:bg-accent/90 active:scale-95"
                    >
                      Join
                    </button>
                  </form>
                </>
              ) : (
                <p className="text-xs text-zinc-300 leading-relaxed">
                  Thanks — we'll send the next product update from <span className="text-accent">@giveabit</span>.
                </p>
              )}
            </div>
          </div>

          {/* Nav grid */}
          <div className="lg:col-span-5">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-8">
              {NAV_GROUPS.map((group) => (
                <div key={group.title}>
                  <h3 className="text-[11px] font-bold uppercase tracking-widest text-white mb-4 flex items-center gap-2">
                    <span className="inline-block h-1 w-3 rounded-full bg-accent" />
                    {group.title}
                  </h3>
                  <ul className="space-y-2.5">
                    {group.items.map((item) => (
                      <li key={item.to}>
                        <Link
                          to={item.to}
                          onClick={() => window.scrollTo(0, 0)}
                          className="group inline-flex items-center text-xs text-zinc-400 transition-colors hover:text-accent"
                        >
                          <span>{item.label}</span>
                          <ExternalLink className="ml-1 h-2.5 w-2.5 opacity-0 transition-all group-hover:opacity-100 group-hover:translate-x-0.5" />
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Jobs card */}
          <div className="lg:col-span-3">
            <button
              onClick={() => setShowJobs(!showJobs)}
              className="group flex w-full items-center justify-between rounded-xl border border-white/5 bg-white/[0.02] p-4 transition-all hover:border-accent/30 hover:bg-white/[0.04]"
            >
              <div className="flex items-center gap-3">
                <div className="relative inline-flex h-9 w-9 items-center justify-center rounded-lg bg-accent/10 text-accent">
                  <Briefcase className="w-4 h-4" />
                  <span className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-green animate-pulse" />
                </div>
                <div className="text-left">
                  <div className="text-sm font-bold text-white">Join the Team</div>
                  <div className="text-[11px] text-muted">{JOBS.length} open roles · Remote</div>
                </div>
              </div>
              {showJobs ? <ChevronUp className="w-4 h-4 text-zinc-400" /> : <ChevronDown className="w-4 h-4 text-zinc-400" />}
            </button>

            <div
              className={cn(
                'mt-2 space-y-2 overflow-hidden transition-all duration-300',
                showJobs ? 'max-h-[600px] opacity-100' : 'max-h-0 opacity-0'
              )}
            >
              {JOBS.map((job) => (
                <a
                  key={job.title}
                  href={`mailto:hello@giveabit.io?subject=Application for ${job.title}`}
                  className="group block rounded-lg border border-white/5 bg-white/[0.02] p-3 transition-all hover:border-accent/40 hover:bg-white/[0.04]"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="text-sm font-bold text-white group-hover:text-accent transition-colors">
                      {job.title}
                    </div>
                    <span className="shrink-0 rounded-full bg-accent/10 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-accent">
                      {job.tag}
                    </span>
                  </div>
                  <div className="mt-0.5 text-[11px] text-muted leading-relaxed">{job.desc}</div>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Mid divider with stats */}
        <div className="my-8 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

        {/* Donate / Safe Harbor row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center pb-8">
          {/* Safe Harbor */}
          <div className="lg:col-span-2 flex items-start gap-3">
            <div className="shrink-0 inline-flex h-9 w-9 items-center justify-center rounded-lg bg-amber-500/10 text-amber-400">
              <ShieldAlert className="w-4 h-4" />
            </div>
            <div className="text-xs text-muted leading-relaxed">
              <strong className="text-zinc-300">Safe Harbor:</strong> Forward-looking statements involve risks and uncertainties.
              Tadbuy and giveabit.io are provided "as is" without warranty. Always verify addresses before sending funds.
            </div>
          </div>

          {/* Donate button + QR */}
          <div className="relative flex justify-start lg:justify-end" ref={qrRef}>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setShowQR(!showQR)}
              className="group relative inline-flex items-center gap-2 overflow-hidden border border-accent/20 bg-accent/5 px-4 text-xs text-accent transition-all hover:border-accent/50 hover:bg-accent/10"
            >
              <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
              <Heart className="h-3.5 w-3.5 text-red-500" fill="currentColor" />
              <span className="font-bold">Donate to Project</span>
              <Zap className="h-3 w-3" />
            </Button>

            {/* QR popover */}
            <div
              className={cn(
                'absolute bottom-full right-0 mb-3 origin-bottom-right rounded-2xl border border-white/10 bg-zinc-950/95 p-5 shadow-2xl backdrop-blur-xl transition-all duration-300',
                showQR ? 'scale-100 opacity-100' : 'pointer-events-none scale-95 opacity-0'
              )}
            >
              <div className="absolute -bottom-2 right-6 h-3 w-3 rotate-45 border-b border-r border-white/10 bg-zinc-950/95" />
              <div className="text-center">
                <div className="text-[10px] font-bold uppercase tracking-widest text-accent mb-1">
                  ⚡ Support Development
                </div>
                <div className="text-sm font-bold text-white mb-1">Send Bitcoin on-chain</div>
                <div className="text-[10px] text-muted mb-3">Or via Lightning to the same address</div>

                <div className="rounded-xl bg-white p-3 inline-block mb-3">
                  <QRCodeSVG
                    value={BITCOIN_URI}
                    size={132}
                    level="M"
                    title="Bitcoin donation address QR code"
                    aria-label="Bitcoin donation address QR code"
                    fgColor="#000000"
                  />
                </div>

                <button
                  onClick={() => handleCopy(BITCOIN_ADDRESS)}
                  className="group flex w-full items-center justify-between gap-2 rounded-lg border border-white/10 bg-black/40 px-3 py-2 font-mono text-[10px] text-zinc-300 transition-colors hover:border-accent/40 hover:text-white"
                  aria-label="Copy Bitcoin address"
                >
                  <span className="truncate">{BITCOIN_ADDRESS.slice(0, 12)}…{BITCOIN_ADDRESS.slice(-6)}</span>
                  {copied ? (
                    <Check className="h-3 w-3 text-green-400" />
                  ) : (
                    <Copy className="h-3 w-3 text-muted group-hover:text-accent" />
                  )}
                </button>
                {copied && (
                  <div className="mt-2 text-[10px] font-bold text-green-400">Copied to clipboard</div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom legal bar */}
        <div className="pt-6 border-t border-white/5">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[11px] text-muted">
              <Link to="/terms" onClick={() => window.scrollTo(0, 0)} className="hover:text-accent transition-colors">
                Terms
              </Link>
              <span className="text-white/10">·</span>
              <Link to="/privacy" onClick={() => window.scrollTo(0, 0)} className="hover:text-accent transition-colors">
                Privacy
              </Link>
              <span className="text-white/10">·</span>
              <Link to="/cookies" onClick={() => window.scrollTo(0, 0)} className="hover:text-accent transition-colors">
                Cookies
              </Link>
              <span className="text-white/10">·</span>
              <a href={`mailto:${SUPPORT_EMAIL}`} className="hover:text-accent transition-colors">
                Contact
              </a>
              <span className="text-white/10">·</span>
              <a
                href="https://github.com/kitsboy/tadbuy/blob/main/LICENSE"
                target="_blank"
                rel="noreferrer"
                className="hover:text-accent transition-colors"
              >
                MIT License
              </a>
            </div>

            <div className="flex items-center gap-3 text-[10px] text-muted">
              <BlockHeightTicker />
              <span className="inline-flex items-center gap-1 rounded-full border border-white/5 bg-white/[0.02] px-2.5 py-1 font-mono">
                <Globe className="h-2.5 w-2.5 text-accent" />
                {APP_VERSION}
              </span>
            </div>
          </div>

          {/* Brand line + copyright */}
          <div className="mt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <a
              href="https://giveabit.io"
              target="_blank"
              rel="noreferrer"
              title="GiveaBit — Bitcoin tools for the people"
              className="group flex items-center gap-2 self-start opacity-40 transition-opacity hover:opacity-100"
            >
              <span className="text-[10px] text-muted font-mono tracking-widest">MADE BY</span>
              <img
                src="/giveabit.png"
                alt="GiveaBit"
                width={670}
                height={335}
                className="h-5 w-auto object-contain transition-transform group-hover:scale-105"
                style={{ filter: 'grayscale(20%) brightness(1.1)' }}
              />
            </a>

            <div className="text-[10px] text-muted font-mono">
              © 2026 GiveaBit Inc. · Bitcoin-native advertising, paid in sats.
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}