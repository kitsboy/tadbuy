import { useState } from "react";
import { motion } from "motion/react";
import { Card, CardTitle, Button } from "@/components/ui";
import { DollarSign, Monitor, Zap } from "lucide-react";

export default function PublisherPortal() {
  const [earnings, setEarnings] = useState(0.0012);

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <h1 className="text-2xl font-extrabold tracking-tight">Publisher Portal</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="glass-panel p-4">
          <div className="text-muted text-xs font-bold uppercase tracking-wider">Total Earnings</div>
          <div className="text-2xl font-extrabold tracking-tight text-green">{earnings} BTC</div>
          <Button size="sm" className="mt-4 gap-2"><DollarSign className="w-4 h-4" /> Withdraw</Button>
        </Card>
        <Card className="glass-panel p-4">
          <div className="text-muted text-xs font-bold uppercase tracking-wider">Active Ad Slots</div>
          <div className="text-2xl font-extrabold tracking-tight">4</div>
          <Button size="sm" className="mt-4 gap-2" variant="secondary"><Monitor className="w-4 h-4" /> Manage Slots</Button>
        </Card>
      </div>
    </motion.div>
  );
}
