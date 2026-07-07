import { useState } from 'react';
import { Download, Link2, Printer, Check } from 'lucide-react';
import { Button } from '@/components/ui';
import { exportGeoCsv, type GeoMarket } from '@/data/geoMarkets';
import { cn } from '@/lib/utils';

type GeoExportBarProps = {
  markets: GeoMarket[];
  className?: string;
};

export function GeoExportBar({ markets, className }: GeoExportBarProps) {
  const [copied, setCopied] = useState(false);

  const handleExportCsv = () => {
    const csv = exportGeoCsv(markets);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `tadbuy-geo-markets-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard unavailable */
    }
  };

  return (
    <div className={cn('flex flex-wrap items-center gap-2', className)}>
      <Button
        variant="secondary"
        size="sm"
        onClick={handleExportCsv}
        className="gap-2 min-h-[44px] touch-target touch-manipulation"
      >
        <Download className="w-4 h-4" />
        Export CSV
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={handleCopyLink}
        className="gap-2 min-h-[44px] touch-target touch-manipulation"
      >
        {copied ? <Check className="w-4 h-4 text-green" /> : <Link2 className="w-4 h-4" />}
        {copied ? 'Copied!' : 'Copy page link'}
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => window.print()}
        className="gap-2 min-h-[44px] touch-target touch-manipulation"
      >
        <Printer className="w-4 h-4" />
        Print
      </Button>
    </div>
  );
}