import { useState, useEffect, useRef } from 'react';
import { Bell } from 'lucide-react';

// ── Types ─────────────────────────────────────────────────────────────────────
type NotificationType = 'success' | 'warning' | 'info';

interface Notification {
  id: number;
  type: NotificationType;
  title: string;
  body: string;
  time: string;
  read: boolean;
}

// ── Mock data ─────────────────────────────────────────────────────────────────
const MOCK_NOTIFICATIONS: Notification[] = [
  { id: 1, type: 'success', title: 'Campaign Live',       body: '"Bitcoin Summer" is now live and running.',      time: '2m ago',  read: false },
  { id: 2, type: 'success', title: 'Payment Received',    body: '₿0.0025 received for campaign top-up.',          time: '18m ago', read: false },
  { id: 3, type: 'warning', title: 'Low Balance Warning', body: 'Wallet balance below 5,000 sats. Top up soon.',  time: '1h ago',  read: false },
  { id: 4, type: 'info',    title: 'New Bid on Slot',     body: 'Someone outbid you on "Nostr.com Sidebar".',     time: '3h ago',  read: true  },
  { id: 5, type: 'success', title: 'Publisher Approved',  body: 'Bitcoin.org approved your placement request.',   time: '1d ago',  read: true  },
];

// ── Dot colour map ────────────────────────────────────────────────────────────
const TYPE_COLOR: Record<NotificationType, string> = {
  success: '#4ade80',
  warning: '#facc15',
  info:    '#38bdf8',
};

// ── Component ─────────────────────────────────────────────────────────────────
export function NotificationCenter() {
  const [notifications, setNotifications] = useState<Notification[]>(MOCK_NOTIFICATIONS);
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter(n => !n.read).length;

  // Mark all as read when the panel opens
  useEffect(() => {
    if (open && unreadCount > 0) {
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    }
  }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

  // Close on outside click
  useEffect(() => {
    if (!open) return;

    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  const markAllRead = () =>
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));

  const allRead = notifications.every(n => n.read);

  return (
    <div ref={containerRef} className="relative">
      {/* Bell button */}
      <button
        onClick={() => setOpen(prev => !prev)}
        aria-label="Notifications"
        className="relative flex items-center justify-center p-1.5 rounded-lg hover:bg-surface/50 transition-colors border border-transparent hover:border-border"
      >
        <Bell
          className={`w-4 h-4 transition-colors ${unreadCount > 0 ? 'text-accent' : 'text-muted'}`}
        />

        {/* Unread badge */}
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 min-w-[14px] h-[14px] flex items-center justify-center bg-red-500 text-white text-[9px] font-bold rounded-full px-[3px] leading-none pointer-events-none">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown panel */}
      {open && (
        <div className="absolute right-0 top-8 w-72 bg-card border border-border rounded-[16px] shadow-2xl z-50">
          {/* Header */}
          <div className="flex items-center justify-between px-4 pt-3.5 pb-2.5 border-b border-border">
            <span className="text-[13px] font-bold text-text">Notifications</span>
            {!allRead && (
              <button
                onClick={markAllRead}
                className="text-[11px] text-accent hover:opacity-70 transition-opacity font-medium"
              >
                Mark all read
              </button>
            )}
          </div>

          {/* List */}
          <ul className="py-1.5 max-h-[340px] overflow-y-auto">
            {allRead ? (
              /* Empty state */
              <li className="px-4 py-6 text-center text-[12px] text-muted">
                You're all caught up ✓
              </li>
            ) : (
              notifications.map(n => (
                <li
                  key={n.id}
                  className={`flex items-start gap-3 px-4 py-2.5 transition-colors ${
                    !n.read ? 'bg-white/[0.03]' : ''
                  }`}
                >
                  {/* Coloured dot */}
                  <span
                    className="mt-[5px] flex-shrink-0 w-2 h-2 rounded-full"
                    style={{ backgroundColor: TYPE_COLOR[n.type] }}
                  />

                  {/* Text */}
                  <div className="flex-1 min-w-0">
                    <p className={`text-[12px] leading-snug ${!n.read ? 'font-bold text-text' : 'font-semibold text-text/70'}`}>
                      {n.title}
                    </p>
                    <p className="text-[12px] text-muted leading-snug mt-0.5 truncate">
                      {n.body}
                    </p>
                    <p className="text-[10px] text-muted/60 mt-1">{n.time}</p>
                  </div>
                </li>
              ))
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
