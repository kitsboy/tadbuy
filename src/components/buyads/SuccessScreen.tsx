import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui";

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
  onReset: () => void;
}

const CONFETTI_PIECES = [
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
];

export default function SuccessScreen({
  projectId,
  campaignName,
  btcAmount,
  selectedPlatformsData,
  estimates,
  onReset,
}: SuccessScreenProps) {
  return (
    <AnimatePresence>
      <motion.div
        key="success-overlay"
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-bg overflow-hidden"
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
        {CONFETTI_PIECES.map((c, i) => (
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
              onClick={onReset}
            >
              Launch Another
            </Button>
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
