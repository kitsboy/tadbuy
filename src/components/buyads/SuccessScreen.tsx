import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { CheckCircle2, Sparkles, LogIn, BarChart2 } from "lucide-react";
import { Button } from "@/components/ui";
import { Badge } from "@/components/ui/Badge";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import {
  type PaymentOutcome,
  outcomeHeadline,
  outcomeDescription,
  outcomeBadge,
} from "@/lib/campaignPaymentStatus";

interface PlatformData {
  id: string;
  name: string;
  icon: ReactNode;
  cpm: number;
}

interface EstimatesData {
  totalImpressions: number;
  totalClicks: number;
  cpbtc: number;
  platformBreakdown: Array<PlatformData & { weight: number; impressions: number; budget: number }>;
  audience: {
    malePct: number;
    femalePct: number;
    topInterestPct: number;
  };
}

interface SuccessScreenProps {
  projectId: string;
  campaignName: string;
  btcAmount: number;
  selectedPlatformsData: PlatformData[];
  estimates: EstimatesData;
  outcome: PaymentOutcome;
  isAuthenticated: boolean;
  onReset: () => void;
}

const CONFETTI_PIECES = [
  { color: '#ff9f1c', tx: '-180px', ty: '-220px', rot: '720deg',  delay: '0s'    },
  { color: '#4ade80', tx:  '190px', ty: '-200px', rot: '-540deg', delay: '0.05s' },
  { color: '#38bdf8', tx: '-150px', ty:  '230px', rot: '480deg',  delay: '0.1s'  },
  { color: '#c084fc', tx:  '160px', ty:  '210px', rot: '-600deg', delay: '0.05s' },
  { color: '#ff9f1c', tx:   '80px', ty: '-260px', rot: '360deg',  delay: '0.15s' },
  { color: '#4ade80', tx:  '-90px', ty: '-240px', rot: '-420deg', delay: '0.2s'  },
];

export default function SuccessScreen({
  projectId,
  campaignName,
  btcAmount,
  selectedPlatformsData,
  estimates,
  outcome,
  isAuthenticated,
  onReset,
}: SuccessScreenProps) {
  const reducedMotion = usePrefersReducedMotion();
  const badge = outcomeBadge(outcome);
  const analyticsUrl = `/analytics?campaign=${encodeURIComponent(projectId)}`;
  const campaignsUrl = isAuthenticated ? '/campaigns' : `/profile?return=${encodeURIComponent(analyticsUrl)}`;

  return (
    <AnimatePresence>
      <motion.div
        key="success-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: reducedMotion ? 0 : 0.4 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-bg overflow-hidden"
      >
        <motion.div
          className="absolute inset-0 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: reducedMotion ? 0 : [0, 0.6, 0.3] }}
          transition={{ duration: 2, ease: 'easeOut' }}
        >
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-accent/10 blur-3xl" />
        </motion.div>

        {!reducedMotion && outcome === 'live' && (
          <>
            <style>{`
              @keyframes confetti-fly {
                0%   { transform: translate(0,0) rotate(0deg) scale(1); opacity: 1; }
                100% { transform: translate(var(--tx), var(--ty)) rotate(var(--rot)) scale(0); opacity: 0; }
              }
              .confetti-piece {
                position: absolute; top: 50%; left: 50%;
                width: 10px; height: 10px; border-radius: 2px;
                animation: confetti-fly 1.4s ease-out forwards;
              }
            `}</style>
            {CONFETTI_PIECES.map((c, i) => (
              <div key={i} className="confetti-piece" style={{
                backgroundColor: c.color, '--tx': c.tx, '--ty': c.ty, '--rot': c.rot,
                animationDelay: c.delay,
              } as object} />
            ))}
          </>
        )}

        <motion.div
          initial={reducedMotion ? false : { opacity: 0, scale: 0.92, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 200, damping: 22, delay: 0.1 }}
          className="relative z-10 text-center px-6 max-w-md w-full"
        >
          <motion.div
            initial={reducedMotion ? false : { scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 260, damping: 20, delay: 0.15 }}
            className="mx-auto mb-6 relative w-28 h-28"
          >
            <div className={outcome === 'live' ? 'absolute inset-0 rounded-full bg-green/20 animate-pulse' : 'absolute inset-0 rounded-full bg-accent/15'} />
            <div className={`absolute inset-2 rounded-full flex items-center justify-center border-4 ${outcome === 'live' ? 'bg-green/10 border-green' : 'bg-accent/10 border-accent'}`}>
              <CheckCircle2 className={`w-14 h-14 ${outcome === 'live' ? 'text-green' : 'text-accent'}`} strokeWidth={1.5} />
            </div>
            {!reducedMotion && outcome === 'live' && (
              <Sparkles className="absolute -top-2 -right-2 w-6 h-6 text-accent animate-pulse" />
            )}
          </motion.div>

          <Badge variant={badge.variant} className="mb-4">{badge.label}</Badge>

          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-2">
            {outcomeHeadline(outcome)}
          </h1>
          <p className="text-muted text-sm mb-2 leading-relaxed">
            {outcomeDescription(outcome)}
          </p>
          <p className="text-[10px] font-mono text-muted mb-6">
            Campaign ID: {projectId}
          </p>

          {!isAuthenticated && (
            <div className="bg-surface border border-border rounded-xl p-4 mb-6 text-left">
              <p className="text-xs text-muted mb-3">
                Sign in to claim this campaign and view analytics in your dashboard.
              </p>
              <Link to={`/profile?return=${encodeURIComponent(analyticsUrl)}`}>
                <Button size="sm" className="w-full gap-2">
                  <LogIn className="w-4 h-4" />
                  Sign in to claim campaign
                </Button>
              </Link>
            </div>
          )}

          <div className="bg-surface border border-border rounded-2xl p-5 mb-6 text-left space-y-3">
            <div className="text-[10px] uppercase tracking-widest text-muted font-bold">Campaign Summary</div>
            <div className="flex justify-between text-sm">
              <span className="text-muted">Name</span>
              <span className="font-bold">{campaignName}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted">Budget</span>
              <span className="font-bold text-accent">{btcAmount.toFixed(8)} ₿</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted">Est. impressions</span>
              <span className="font-bold text-green">~{estimates.totalImpressions.toLocaleString()}</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Link to={analyticsUrl} className="flex-1">
              <Button className="w-full gap-2" size="lg">
                <BarChart2 className="w-4 h-4" />
                View Analytics
              </Button>
            </Link>
            <Link to={campaignsUrl} className="flex-1">
              <Button variant="secondary" size="lg" className="w-full">
                {isAuthenticated ? 'All Campaigns' : 'Sign in & Campaigns'}
              </Button>
            </Link>
          </div>
          <Button variant="ghost" size="sm" className="mt-4 text-muted" onClick={onReset}>
            Launch another campaign
          </Button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}