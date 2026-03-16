import React, { useState, useEffect, createContext, useContext } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';

type Toast = { id: number; message: string; type: 'success' | 'info' };
const ToastContext = createContext<{ addToast: (msg: string, type?: Toast['type']) => void } | null>(null);

export const ToastProvider = ({ children }: { children: React.ReactNode }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const addToast = (message: string, type: Toast['type'] = 'info') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 5000);
  };
  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <div className="fixed bottom-4 right-4 space-y-2 z-50">
        <AnimatePresence>
          {toasts.map((t) => (
            <motion.div key={t.id} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="bg-surface border border-border p-4 rounded-lg shadow-lg flex items-center gap-3">
              <span className={`w-2 h-2 rounded-full ${t.type === 'success' ? 'bg-green' : 'bg-blue'}`} />
              <p className="text-sm font-medium">{t.message}</p>
              <button onClick={() => setToasts(prev => prev.filter(x => x.id !== t.id))}><X className="w-4 h-4 text-muted" /></button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};
export const useToast = () => useContext(ToastContext)!;
