/**
 * Tadbuy inline SVG illustration kit.
 *
 * Design rules for these scenes:
 * - Pure inline SVG: zero network requests, no CSP connect-src/img-src impact,
 *   no service-worker precache weight, crisp at any density.
 * - Jewel accents (pink/fuchsia/purple/lightning/blue/green) are the brand and
 *   are identical in every theme — they carry their own contrast on both the
 *   dark and light backgrounds.
 * - Structural colors (surfaces, strokes, star dots) come from the --art-*
 *   CSS variables defined in src/index.css, with dark defaults plus
 *   [data-theme="light"] and [data-contrast="high"] overrides, so one kit
 *   holds on dark, light and high-contrast themes.
 * - Hardcoded on purpose: dark ink details inside bright shapes (#18181b
 *   badge/window fills, pencil-tip dot), amber coin rims (#854d0e), and white
 *   marks on colored fills — dark ink and white-on-color work on light too.
 * - Decorative: every scene renders with aria-hidden and pointer-events-none
 *   by its wrapper; sizing is controlled by the consumer via className.
 * - Gradient ids are prefixed per scene; the same scene twice on one page is
 *   safe because duplicated ids resolve to identical definitions.
 */
import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

type ArtProps = { className?: string };

const PINK = '#f472b6';
const FUCHSIA = '#e879f9';
const PURPLE = '#c084fc';
const YELLOW = '#facc15';
const BLUE = '#38bdf8';
const GREEN = '#4ade80';
const SURFACE = 'var(--art-scene)';
const CARD = 'var(--art-card)';
const STROKE = 'var(--art-stroke)';
const STROKE_SOFT = 'var(--art-stroke-soft)';
const STAR = 'var(--art-star)';

function ArtScene({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <svg
      viewBox="0 0 240 120"
      aria-hidden="true"
      focusable="false"
      className={cn('h-20 w-auto md:h-24', className)}
    >
      {children}
    </svg>
  );
}

function Sparkle({ x, y, r = 4, fill = PINK, opacity = 0.9 }: { x: number; y: number; r?: number; fill?: string; opacity?: number }) {
  return (
    <path
      d={`M${x} ${y - r} Q${x + r * 0.22} ${y - r * 0.22} ${x + r} ${y} Q${x + r * 0.22} ${y + r * 0.22} ${x} ${y + r} Q${x - r * 0.22} ${y + r * 0.22} ${x - r} ${y} Q${x - r * 0.22} ${y - r * 0.22} ${x} ${y - r} Z`}
      fill={fill}
      opacity={opacity}
    />
  );
}

/** Billboard with a bolt on screen + stacked sats — marketplace / listings. */
export function ArtMarketplaceScene({ className }: ArtProps) {
  return (
    <ArtScene className={className}>
      <defs>
        <linearGradient id="tadArtMktScreen" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={PINK} />
          <stop offset="100%" stopColor={FUCHSIA} />
        </linearGradient>
      </defs>
      <ellipse cx="120" cy="102" rx="84" ry="12" fill={PINK} opacity="0.12" />
      {/* billboard */}
      <rect x="36" y="14" width="168" height="68" rx="14" fill={SURFACE} stroke={STROKE} strokeWidth="1.5" />
      <rect x="50" y="26" width="94" height="44" rx="8" fill="url(#tadArtMktScreen)" opacity="0.9" />
      {/* bolt on the screen */}
      <path d="M103 32 L88 52 h9 L93 64 L112 43 h-9 L107 32 Z" fill="#fff" opacity="0.95" />
      {/* caption bars under the screen */}
      <rect x="152" y="28" width="42" height="6" rx="3" fill={STROKE} />
      <rect x="152" y="40" width="30" height="6" rx="3" fill={STROKE} opacity="0.7" />
      <rect x="152" y="52" width="36" height="6" rx="3" fill={STROKE} opacity="0.5" />
      {/* sat coins */}
      <circle cx="178" cy="86" r="10" fill={YELLOW} stroke="#854d0e" strokeWidth="1.5" />
      <circle cx="194" cy="76" r="10" fill={YELLOW} stroke="#854d0e" strokeWidth="1.5" />
      <circle cx="187" cy="96" r="10" fill={YELLOW} stroke="#854d0e" strokeWidth="1.5" />
      <circle cx="194" cy="76" r="5" fill="none" stroke="#854d0e" strokeWidth="1.2" />
      <circle cx="178" cy="86" r="5" fill="none" stroke="#854d0e" strokeWidth="1.2" />
      {/* legs + sparkle */}
      <path d="M70 82 L62 100 M170 82 L178 100" stroke={STROKE_SOFT} strokeWidth="3" strokeLinecap="round" />
      <Sparkle x={216} y={24} r={5} fill={FUCHSIA} />
      <Sparkle x={26} y={34} r={3.5} fill={BLUE} opacity={0.8} />
    </ArtScene>
  );
}

/** Node → bolt hub → node with a dotted route — payments / settlement / rails. */
export function ArtLightningFlow({ className }: ArtProps) {
  return (
    <ArtScene className={className}>
      <defs>
        <linearGradient id="tadArtFlowRoute" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor={PINK} />
          <stop offset="100%" stopColor={YELLOW} />
        </linearGradient>
      </defs>
      <ellipse cx="120" cy="100" rx="86" ry="12" fill={FUCHSIA} opacity="0.1" />
      {/* dotted route */}
      <path
        d="M46 62 C 88 30, 152 92, 194 58"
        fill="none"
        stroke="url(#tadArtFlowRoute)"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeDasharray="1 8"
        opacity="0.9"
      />
      {/* sender / receiver nodes */}
      <circle cx="34" cy="62" r="14" fill={CARD} stroke={PINK} strokeWidth="2" />
      <circle cx="34" cy="62" r="6" fill={PINK} opacity="0.5" />
      <circle cx="206" cy="60" r="14" fill={CARD} stroke={YELLOW} strokeWidth="2" />
      <circle cx="206" cy="60" r="6" fill={YELLOW} opacity="0.55" />
      {/* hub with bolt */}
      <rect x="100" y="40" width="40" height="40" rx="12" fill={SURFACE} stroke={STROKE} strokeWidth="1.5" />
      <path d="M122 45 L109 62 h8 L114 75 L131 56 h-8 L126 45 Z" fill={YELLOW} />
      {/* packets in flight */}
      <circle cx="80" cy="47" r="3.5" fill={PINK} />
      <circle cx="160" cy="75" r="3.5" fill={FUCHSIA} />
      <Sparkle x={216} y={26} r={4} fill={PURPLE} opacity={0.85} />
      <Sparkle x={24} y={26} r={3} fill={BLUE} opacity={0.7} />
    </ArtScene>
  );
}

/** Mini dashboard with rising trend + bullseye — campaigns / analytics. */
export function ArtCampaignScene({ className }: ArtProps) {
  return (
    <ArtScene className={className}>
      <ellipse cx="120" cy="102" rx="84" ry="12" fill={PURPLE} opacity="0.1" />
      {/* dashboard card */}
      <rect x="28" y="16" width="118" height="86" rx="12" fill={CARD} stroke={STROKE} strokeWidth="1.5" />
      {/* bars */}
      <rect x="44" y="72" width="12" height="20" rx="4" fill={PINK} />
      <rect x="62" y="60" width="12" height="32" rx="4" fill={FUCHSIA} />
      <rect x="80" y="50" width="12" height="42" rx="4" fill={PURPLE} />
      <rect x="98" y="66" width="12" height="26" rx="4" fill={BLUE} />
      <path d="M40 94 H138" stroke={STROKE} strokeWidth="1.5" strokeLinecap="round" />
      {/* trend line */}
      <path d="M46 66 C 68 40, 94 60, 118 42" fill="none" stroke={GREEN} strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="118" cy="42" r="3.5" fill={GREEN} />
      {/* bullseye + arrow */}
      <circle cx="194" cy="44" r="19" fill={CARD} stroke={PURPLE} strokeWidth="2" />
      <circle cx="194" cy="44" r="11" fill="none" stroke={FUCHSIA} strokeWidth="1.5" strokeDasharray="2 4" />
      <circle cx="194" cy="44" r="4.5" fill={PINK} />
      <path d="M164 68 L190 48" stroke={BLUE} strokeWidth="2.5" strokeLinecap="round" />
      <path d="M190 48 l-7 -1 M190 48 l-1 7" stroke={BLUE} strokeWidth="2.5" strokeLinecap="round" />
      <Sparkle x={216} y={88} r={4.5} fill={YELLOW} opacity={0.85} />
      <Sparkle x={24} y={30} r={3.5} fill={FUCHSIA} opacity={0.8} />
    </ArtScene>
  );
}

/** Drafting sheet with node graph + pencil — docs / plans / architecture. */
export function ArtBlueprint({ className }: ArtProps) {
  return (
    <ArtScene className={className}>
      <ellipse cx="120" cy="102" rx="82" ry="12" fill={BLUE} opacity="0.1" />
      {/* sheet with folded corner */}
      <path d="M56 14 h112 a10 10 0 0 1 10 10 v72 a10 10 0 0 1 -10 10 H66 a10 10 0 0 1 -10 -10 Z" fill={CARD} stroke={STROKE} strokeWidth="1.5" />
      <path d="M158 14 h10 a10 10 0 0 1 10 10 v10 h-20 Z" fill={SURFACE} stroke={STROKE} strokeWidth="1.5" />
      {/* grid */}
      <path d="M64 34 H172 M64 54 H172 M64 74 H172 M88 24 V96 M128 24 V96" stroke={STROKE} strokeWidth="1" strokeDasharray="3 5" opacity="0.8" />
      {/* node graph row 1 */}
      <path d="M84 44 H120 M120 44 H156" stroke={STROKE_SOFT} strokeWidth="1.5" />
      <circle cx="84" cy="44" r="7" fill={BLUE} />
      <circle cx="120" cy="44" r="7" fill={FUCHSIA} />
      <circle cx="156" cy="44" r="7" fill={GREEN} />
      {/* row 2 */}
      <path d="M84 44 L104 74 M156 44 L136 74 M104 74 H136" stroke={STROKE_SOFT} strokeWidth="1.5" opacity="0.8" />
      <circle cx="104" cy="74" r="7" fill={PINK} />
      <circle cx="136" cy="74" r="7" fill={YELLOW} />
      {/* pencil */}
      <path d="M150 100 L184 64" stroke={YELLOW} strokeWidth="6" strokeLinecap="round" />
      <circle cx="150" cy="100" r="4.5" fill={FUCHSIA} />
      <circle cx="184" cy="64" r="2.5" fill="#18181b" />
      <Sparkle x={216} y={30} r={4} fill={PINK} opacity={0.85} />
    </ArtScene>
  );
}

/** Rocket climbing a dotted sat trail — launches / growth / celebration. */
export function ArtRocket({ className }: ArtProps) {
  return (
    <ArtScene className={className}>
      <defs>
        <linearGradient id="tadArtRocketTrail" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={PURPLE} />
          <stop offset="100%" stopColor={PINK} />
        </linearGradient>
      </defs>
      <ellipse cx="120" cy="104" rx="80" ry="11" fill={PINK} opacity="0.12" />
      {/* stars */}
      <circle cx="30" cy="26" r="1.8" fill={STAR} opacity="0.7" />
      <circle cx="206" cy="96" r="1.8" fill={STAR} opacity="0.6" />
      <circle cx="182" cy="20" r="1.5" fill={STAR} opacity="0.5" />
      <Sparkle x={48} y={52} r={3.5} fill={BLUE} opacity={0.8} />
      <Sparkle x={204} y={52} r={4} fill={FUCHSIA} opacity={0.85} />
      {/* dotted trail with sats */}
      <path d="M104 98 C 74 104, 52 92, 44 70" fill="none" stroke="url(#tadArtRocketTrail)" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="2 7" />
      <circle cx="60" cy="90" r="5" fill={YELLOW} stroke="#854d0e" strokeWidth="1" />
      <circle cx="46" cy="72" r="4" fill={FUCHSIA} />
      {/* orbit hint */}
      <ellipse cx="150" cy="56" rx="36" ry="11" fill="none" stroke={STROKE} strokeWidth="1.2" strokeDasharray="3 6" opacity="0.8" transform="rotate(-18 150 56)" />
      {/* rocket, tilted up-right */}
      <g transform="rotate(40 150 50)">
        <path d="M138 34 Q150 12 162 34 Z" fill={PINK} />
        {/* fuselage uses the star token: the "pops from background" color in
            whichever theme is active (zinc-200 on dark, zinc-600 on light) */}
        <rect x="138" y="32" width="24" height="46" rx="12" fill={STAR} stroke={STROKE_SOFT} strokeWidth="1.5" />
        <circle cx="150" cy="46" r="6" fill="#18181b" stroke={FUCHSIA} strokeWidth="2" />
        <path d="M138 58 L124 76 L138 72 Z" fill={PURPLE} />
        <path d="M162 58 L176 76 L162 72 Z" fill={PURPLE} />
        <path d="M144 78 Q150 96 156 78 Q150 86 144 78 Z" fill={YELLOW} />
        <path d="M147 78 Q150 88 153 78 Q150 82 147 78 Z" fill={FUCHSIA} />
      </g>
    </ArtScene>
  );
}

/** Globe with meridians, zap badge and orbit — global reach / network. */
export function ArtGlobeZap({ className }: ArtProps) {
  return (
    <ArtScene className={className}>
      <defs>
        <linearGradient id="tadArtGlobeFill" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={BLUE} stopOpacity="0.85" />
          <stop offset="100%" stopColor={PURPLE} stopOpacity="0.85" />
        </linearGradient>
      </defs>
      <ellipse cx="120" cy="102" rx="82" ry="12" fill={BLUE} opacity="0.1" />
      {/* orbit + satellites */}
      <ellipse cx="112" cy="62" rx="54" ry="21" fill="none" stroke={STROKE_SOFT} strokeWidth="1.2" strokeDasharray="2 6" transform="rotate(-18 112 62)" />
      <circle cx="162" cy="44" r="3.5" fill={PINK} />
      <circle cx="62" cy="84" r="3" fill={BLUE} />
      {/* globe */}
      <circle cx="110" cy="62" r="34" fill="url(#tadArtGlobeFill)" stroke={BLUE} strokeWidth="2" />
      <ellipse cx="110" cy="62" rx="14" ry="34" fill="none" stroke="#fff" strokeWidth="1.4" opacity="0.35" />
      <path d="M80 52 Q110 42 140 52 M80 72 Q110 82 140 72" fill="none" stroke="#fff" strokeWidth="1.4" opacity="0.3" />
      {/* pins */}
      <circle cx="96" cy="50" r="3" fill={PINK} stroke="#18181b" strokeWidth="1" />
      <circle cx="122" cy="74" r="3" fill={GREEN} stroke="#18181b" strokeWidth="1" />
      {/* zap badge */}
      <rect x="128" y="70" width="28" height="28" rx="9" fill="#18181b" stroke={YELLOW} strokeWidth="2" />
      <path d="M144 74 L134 86 h6 L137 95 L148 82 h-6 L146 74 Z" fill={YELLOW} />
      <Sparkle x={206} y={30} r={4.5} fill={FUCHSIA} opacity={0.85} />
    </ArtScene>
  );
}
