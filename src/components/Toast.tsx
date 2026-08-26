import React, { useState, useEffect, createContext, useContext } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, CheckCircle2, AlertCircle, Info } from 'lucide-react';

type ToastType = 'success' | 'info' | 'error' | 'warning';
type Toast = { id: number; message: string; type: ToastType; duration?: number };

const ToastContext = createContext<{
  addToast: (msg: string, type?: ToastType, durationMs?: number) => void;
} | null>(null);

const ICONS: Record<ToastType, React.ComponentType<{ className?: string }>> = {
  success: CheckCircle2,
  error: AlertCircle,
  info: Info,
  warning: AlertCircle,
};

const STYLES: Record<ToastType, string> = {
  success: 'border-green/30 bg-zinc-950/95 shadow-[0_0_0_1px_rgba(74,222,128,0.15)]',
  error: 'border-red/40 bg-zinc-950/95 shadow-[0_0_0_1px_rgba(248,113,113,0.20)]',
  info: 'border-blue/30 bg-zinc-950/95',
  warning: 'border-amber-400/40 bg-zinc-950/95',
};

const DOT: Record<ToastType, string> = {
  success: 'bg-green text-green',
  error: 'bg-red text-red',
  info: 'bg-blue text-blue',
  warning: 'bg-amber-400 text-amber-400',
};

export const ToastProvider = ({ children }: { children: React.ReactNode }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = (message: string, type: ToastType = 'info', durationMs = 5000) => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type, duration: durationMs }]);
    setTimeout(
      () => setToasts((prev) => prev.filter((t) => t.id !== id)),
      durationMs
    );
  };

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <div
        className="pointer-events-none fixed bottom-14 md:bottom-4 right-4 left-4 md:left-auto z-50 pb-safe max-w-sm md:max-w-md ml-auto space-y-2"
        role="region"
        aria-label="Notifications"
        aria-live="polite"
        aria-relevant="additions"
      >
        <AnimatePresence>
          {toasts.map((t) => {
            const Icon = ICONS[t.type];
            return (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, x: 40, scale: 0.95 }}
                transition={{ type: 'spring', stiffness: 300, damping: 28 }}
                role="status"
                className={`pointer-events-auto flex items-start gap-3 rounded-xl border ${STYLES[t.type]} p-4 backdrop-blur-md shadow-2xl`}
              >
                <Icon className={`mt-0.5 h-4 w-4 shrink-0 ${DOT[t.type].split(' ')[1]}`} />
                <div className="flex-1 min-w-0">
                  <div className="sr-only">
                    {t.type === 'success'
                      ? 'Success: '
                      : t.type === 'error'
                      ? 'Error: '
                      : t.type === 'warning'
                      ? 'Warning: '
                      : 'Info: '}
                  </div>
                  <p className="text-sm font-medium text-white leading-snug">{t.message}</p>
                </div>
                <button
                  onClick={() => setToasts((prev) => prev.filter((x) => x.id !== t.id))}
                  className="shrink-0 rounded p-1 text-zinc-500 transition-colors hover:bg-white/5 hover:text-white touch-target touch-manipulation"
                  aria-label="Dismiss notification"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
};