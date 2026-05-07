/// <reference types="vite/client" />
import { useState } from "react";
import { motion } from "motion/react";
import { Card, Button } from "@/components/ui";
import { ShieldAlert, Home } from "lucide-react";
import { Link } from "react-router-dom";

const isDev = import.meta.env.DEV;

export default function DebugLightning() {
  // Guard: this page is only accessible in development mode
  if (!isDev) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <div className="w-14 h-14 rounded-full bg-red/10 border border-red/30 flex items-center justify-center mx-auto mb-5">
          <ShieldAlert className="w-7 h-7 text-red" />
        </div>
        <h1 className="text-xl font-extrabold tracking-tight mb-2">Access Denied</h1>
        <p className="text-sm text-muted max-w-sm mb-8 leading-relaxed">
          This debug page is only available in development mode and is not accessible in production.
        </p>
        <Link to="/">
          <Button variant="secondary" className="gap-2">
            <Home className="w-4 h-4" /> Back to Home
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex items-center gap-3">
        <h1 className="text-2xl font-extrabold tracking-tight">Debug Lightning Connection</h1>
        <span className="text-[10px] font-bold bg-lightning/20 text-lightning border border-lightning/30 px-2.5 py-0.5 rounded-full uppercase tracking-widest">
          Dev Only
        </span>
      </div>

      <Card className="glass-panel p-6 space-y-4">
        <LightningDebugPanel />
      </Card>
    </motion.div>
  );
}

function LightningDebugPanel() {
  const [info, setInfo]       = useState<Record<string, unknown> | null>(null);
  const [error, setError]     = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const testConnection = async () => {
    setLoading(true);
    setError(null);
    setInfo(null);
    try {
      const response = await fetch('/api/lightning/info');
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Connection failed');
      setInfo(data);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button onClick={testConnection} disabled={loading} className="gap-2">
        {loading ? 'Testing…' : 'Test Lightning Connection'}
      </Button>
      {error && (
        <div className="p-3 bg-red/10 border border-red/30 rounded-lg font-mono text-xs text-red">
          Error: {error}
        </div>
      )}
      {info && (
        <div className="p-3 bg-green/10 border border-green/30 rounded-lg font-mono text-xs text-green">
          <pre>{JSON.stringify(info, null, 2)}</pre>
        </div>
      )}
    </>
  );
}
