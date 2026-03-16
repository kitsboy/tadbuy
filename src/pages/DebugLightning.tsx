import { useState } from 'react';
import { motion } from "motion/react";
import { Card } from "@/components/ui";

export default function DebugLightning() {
  const [info, setInfo] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const testConnection = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/lightning/info');
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to connect');
      setInfo(data);
    } catch (e: any) {
      setError(e.message || 'Failed to connect');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <h1 className="text-2xl font-extrabold tracking-tight">Debug Lightning Connection</h1>
      <Card className="p-6">
        <button 
          onClick={testConnection}
          disabled={loading}
          className="bg-accent text-white px-4 py-2 rounded-lg font-bold hover:bg-accent/90 disabled:opacity-50"
        >
          {loading ? 'Testing...' : 'Test Connection'}
        </button>
        
        {error && <div className="mt-4 text-red-500 text-sm font-mono bg-red-50 p-3 rounded">Error: {error}</div>}
        {info && <div className="mt-4 text-green-500 text-sm font-mono bg-green-50 p-3 rounded">Connected to: {info.alias}</div>}
      </Card>
    </motion.div>
  );
}
