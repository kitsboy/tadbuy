import { Link } from 'react-router-dom';
import { ChevronRight, Globe, Megaphone } from 'lucide-react';
import { Button } from '@/components/ui';
import { Badge } from '@/components/ui/index';

type GeoPageHeaderProps = {
  marketCount: number;
  demo?: boolean;
};

export function GeoPageHeader({ marketCount, demo = true }: GeoPageHeaderProps) {
  return (
    <div className="space-y-4">
      <nav className="flex items-center gap-1.5 text-[11px] font-mono text-muted" aria-label="Breadcrumb">
        <Link to="/" className="hover:text-accent transition-colors touch-target inline-flex items-center min-h-[44px]">
          Home
        </Link>
        <ChevronRight className="w-3 h-3 shrink-0" aria-hidden />
        <span className="text-text font-semibold">Geo planning</span>
      </nav>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight flex items-center gap-2">
              <Globe className="w-7 h-7 text-accent shrink-0" />
              Geo planning
            </h1>
            {demo && <Badge variant="warning">Demo data</Badge>}
          </div>
          <p className="text-sm text-muted max-w-2xl">
            Example market-planning data across{' '}
            <span className="text-accent font-semibold">{marketCount} markets</span>.
            No targeting or Lightning spend is activated in this preview.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <Link to="/">
            <Button variant="primary" size="sm" className="gap-2 min-h-[44px] touch-target touch-manipulation">
              <Megaphone className="w-4 h-4" />
              Plan a campaign preview
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}