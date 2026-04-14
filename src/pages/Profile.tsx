import { motion } from "motion/react";
import { Card, CardTitle, Button } from "@/components/ui";

export default function Profile() {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <h1 className="text-2xl font-extrabold tracking-tight">User Profile</h1>
      <Card className="glass-panel">
        <CardTitle>Bitcoin Wallet</CardTitle>
        <div className="space-y-4 mt-4">
          <div>
            <label className="block text-sm font-bold text-muted mb-1">Bitcoin Address</label>
            <input type="text" className="w-full bg-surface border border-border rounded-lg p-2 font-mono text-sm" defaultValue="bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh" />
          </div>
          <Button>Save Address</Button>
        </div>
      </Card>
      <Card className="glass-panel">
        <CardTitle>Notifications</CardTitle>
        <div className="space-y-4 mt-4">
          <label className="flex items-center gap-2">
            <input type="checkbox" defaultChecked />
            <span className="text-sm">Email notifications for settlements</span>
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" defaultChecked />
            <span className="text-sm">Push notifications for new bids</span>
          </label>
          <Button>Save Preferences</Button>
        </div>
      </Card>
    </motion.div>
  );
}
