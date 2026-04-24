/**
 * LocalAvatar — deterministic initials avatar generated entirely in the browser.
 * Replaces the external api.dicebear.com CDN call with zero network requests.
 *
 * Usage: <LocalAvatar seed="Felix" size={24} className="rounded-full border border-border" />
 */

interface LocalAvatarProps {
  seed?: string;
  size?: number;
  className?: string;
}

// Generate a stable HSL hue from any string
function seedToHue(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash) % 360;
}

function getInitials(str: string): string {
  const parts = str.trim().split(/\s+/);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return str.slice(0, 2).toUpperCase();
}

export function LocalAvatar({ seed = "User", size = 24, className = "" }: LocalAvatarProps) {
  const hue = seedToHue(seed);
  const bg  = `hsl(${hue}, 55%, 28%)`;
  const fg  = `hsl(${hue}, 90%, 85%)`;
  const initials = getInitials(seed);

  return (
    <div
      className={className}
      style={{
        width:           size,
        height:          size,
        backgroundColor: bg,
        display:         "flex",
        alignItems:      "center",
        justifyContent:  "center",
        fontSize:        size * 0.38,
        fontWeight:      700,
        color:           fg,
        userSelect:      "none",
        flexShrink:      0,
        fontFamily:      "inherit",
      }}
      aria-label={`Avatar for ${seed}`}
    >
      {initials}
    </div>
  );
}
