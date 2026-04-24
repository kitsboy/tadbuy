import { useState } from "react";
import { BITCOIN_ADDRESS } from "@/constants";
import { motion } from "motion/react";
import { Card, CardTitle, Button, FormGroup, Label } from "@/components/ui";
import { User, Key, Bell, Save, Wallet } from "lucide-react";
import { cn } from "@/lib/utils";

export default function ProfileSettings() {
  const [notifications, setNotifications] = useState({ bids: true, campaigns: false, reports: true });
  const [wallets, setWallets] = useState([
    { name: 'Main Ledger', address: BITCOIN_ADDRESS },
    { name: 'Savings', address: BITCOIN_ADDRESS },
  ]);

  const connectWallet = () => {
    const address = prompt("Enter your Bitcoin address:");
    if (address) {
      setWallets([...wallets, { name: 'New Wallet', address }]);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8 max-w-3xl mx-auto pb-20">
      <h1 className="text-2xl font-extrabold tracking-tight">Profile & Settings</h1>

      <Card className="glass-panel">
        <CardTitle className="flex items-center gap-2 mb-6"><User className="w-5 h-5 text-accent" /> Account Information</CardTitle>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <FormGroup>
            <Label>Full Name</Label>
            <input type="text" defaultValue="Felix Bitcoin" className="w-full bg-surface p-3 rounded-xl border border-border focus:border-accent outline-none" />
          </FormGroup>
          <FormGroup>
            <Label>Email Address</Label>
            <input type="email" defaultValue="kitsboy@gmail.com" className="w-full bg-surface p-3 rounded-xl border border-border focus:border-accent outline-none" />
          </FormGroup>
        </div>
      </Card>

      <Card className="glass-panel">
        <CardTitle className="flex items-center gap-2 mb-6"><Wallet className="w-5 h-5 text-accent" /> Connected Wallets</CardTitle>
        <div className="space-y-4">
          {wallets.map((wallet, i) => (
            <div key={i} className="flex items-center justify-between p-4 bg-surface rounded-xl border border-border">
              <div>
                <div className="font-bold text-sm">{wallet.name}</div>
                <div className="font-mono text-xs text-muted">{wallet.address}</div>
              </div>
              <Button variant="secondary" size="sm">Disconnect</Button>
            </div>
          ))}
          <Button variant="secondary" onClick={connectWallet} className="w-full flex items-center gap-2 justify-center">
            <Wallet className="w-4 h-4" /> Connect New Wallet
          </Button>
        </div>
      </Card>

      <Card className="glass-panel">
        <CardTitle className="flex items-center gap-2 mb-6"><Key className="w-5 h-5 text-accent" /> API Key Management</CardTitle>
        <div className="bg-surface p-4 rounded-xl border border-border flex items-center justify-between">
          <div className="font-mono text-xs text-muted">sk_live_51P...a8b9c0d1e2f3g4h5</div>
          <Button variant="secondary" size="sm">Regenerate</Button>
        </div>
        <p className="text-xs text-muted mt-3">Use this key to integrate Tadbuy with your own Bitcoin-native applications.</p>
      </Card>

      <Card className="glass-panel">
        <CardTitle className="flex items-center gap-2 mb-6"><Bell className="w-5 h-5 text-accent" /> Notification Preferences</CardTitle>
        <div className="space-y-4">
          {[
            { id: 'bids', label: 'New Bids', desc: 'Get notified when a new bid is placed on your ad slots.' },
            { id: 'campaigns', label: 'Campaign Updates', desc: 'Get notified about campaign status changes.' },
            { id: 'reports', label: 'Weekly Reports', desc: 'Receive a summary of your ad performance every Monday.' },
          ].map(n => (
            <div key={n.id} className="flex items-center justify-between p-4 bg-surface rounded-xl border border-border">
              <div>
                <div className="font-bold text-sm">{n.label}</div>
                <div className="text-xs text-muted">{n.desc}</div>
              </div>
              <button 
                onClick={() => setNotifications(prev => ({ ...prev, [n.id]: !prev[n.id as keyof typeof notifications] }))}
                className={cn("w-12 h-6 rounded-full transition-colors relative", notifications[n.id as keyof typeof notifications] ? "bg-accent" : "bg-border")}
              >
                <div className={cn("w-4 h-4 rounded-full bg-white absolute top-1 transition-all", notifications[n.id as keyof typeof notifications] ? "left-7" : "left-1")} />
              </button>
            </div>
          ))}
        </div>
      </Card>

      <div className="flex justify-end gap-3">
        <Button variant="secondary">Cancel</Button>
        <Button className="flex items-center gap-2"><Save className="w-4 h-4" /> Save Changes</Button>
      </div>
    </motion.div>
  );
}
