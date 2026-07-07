import { Link } from 'react-router-dom';
import { Globe, CheckCircle2, Target } from 'lucide-react';
import { Modal, Button } from '@/components/ui';

type GeoTargetingModalProps = {
  isOpen: boolean;
  onClose: () => void;
  geoCode?: string;
};

const CHECKLIST = [
  'Select target countries or regions in campaign setup',
  'Set bid adjustments per market based on CTR data',
  'Exclude low-performing regions to maximize sats efficiency',
  'Use language targeting for localized creative',
  'Monitor real-time impressions on the activity map',
];

export function GeoTargetingModal({ isOpen, onClose, geoCode }: GeoTargetingModalProps) {
  const configureUrl = geoCode ? `/?geo=${geoCode}` : '/?geo=';

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Geo-Targeting"
      description="Direct your Lightning ad spend toward specific countries and regions."
      size="lg"
      footer={
        <div className="flex flex-col sm:flex-row gap-2">
          <Button variant="secondary" onClick={onClose} className="min-h-[44px] touch-target">
            Close
          </Button>
          <Link to={configureUrl} onClick={onClose} className="flex-1">
            <Button variant="primary" className="w-full gap-2 min-h-[44px] touch-target">
              <Target className="w-4 h-4" />
              Configure targeting
            </Button>
          </Link>
        </div>
      }
    >
      <div className="px-6 pb-6 space-y-4">
        <div className="flex items-start gap-3 p-3 rounded-xl bg-surface/50 border border-border">
          <Globe className="w-5 h-5 text-accent shrink-0 mt-0.5" />
          <p className="text-xs text-muted leading-relaxed">
            <span className="text-text font-semibold">Geo-targeting</span> lets you direct ad spend
            toward specific countries. All campaigns use real-time bidding — your sats go furthest
            in high-CTR markets with strong Bitcoin adoption.
          </p>
        </div>

        <ul className="space-y-2.5">
          {CHECKLIST.map(item => (
            <li key={item} className="flex items-start gap-2.5 text-xs text-muted">
              <CheckCircle2 className="w-4 h-4 text-green shrink-0 mt-0.5" />
              {item}
            </li>
          ))}
        </ul>
      </div>
    </Modal>
  );
}