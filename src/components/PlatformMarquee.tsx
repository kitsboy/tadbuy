import { Link } from 'react-router-dom';
import { AD_PLATFORMS } from '@/data/platforms';

export function PlatformMarquee() {
  const items = [...AD_PLATFORMS, ...AD_PLATFORMS];

  return (
    <div className="mb-8 overflow-hidden rounded-xl border border-border bg-surface/30">
      <div className="px-4 py-2 border-b border-border">
        <span className="text-[10px] font-bold uppercase tracking-widest text-muted">
          Deploy to 8 platforms · <Link to="/platforms" className="text-accent hover:underline normal-case">guides</Link>
        </span>
      </div>
      <div className="relative h-12 flex items-center overflow-hidden group">
        <div className="marquee-track flex items-center gap-8 whitespace-nowrap">
          {items.map((p, i) => (
            <Link
              key={`${p.id}-${i}`}
              to={`/platforms/${p.slug}`}
              className="flex items-center gap-2 text-sm font-semibold text-muted hover:text-accent transition-colors"
            >
              <p.icon className={`w-4 h-4 ${p.color}`} />
              {p.name}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}