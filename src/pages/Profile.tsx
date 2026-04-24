import { useState } from "react";
import { motion } from "motion/react";
import { Card, CardTitle, Button, Input, Label, FormGroup } from "@/components/ui";
import { User, Bell, Copy, CheckCircle2, ShieldCheck, Save } from "lucide-react";
import { BITCOIN_ADDRESS } from "@/constants";
import { usePageTitle } from "@/hooks/usePageTitle";
import { useToast } from "@/components/Toast";

// Simple bech32 / native segwit address validator
function isValidBitcoinAddress(addr: string): boolean {
  return /^(bc1|[13])[a-zA-HJ-NP-Z0-9]{25,89}$/.test(addr.trim());
}

export default function Profile() {
  usePageTitle('Profile');
  const { addToast } = useToast();

  const [address, setAddress]       = useState(BITCOIN_ADDRESS);
  const [addressError, setAddressError] = useState('');
  const [copied, setCopied]         = useState(false);
  const [notifications, setNotifications] = useState({
    settlements: true,
    bids: true,
    weekly: false,
  });

  const handleAddressChange = (val: string) => {
    setAddress(val);
    if (val && !isValidBitcoinAddress(val)) {
      setAddressError('Invalid Bitcoin address format');
    } else {
      setAddressError('');
    }
  };

  const handleSaveAddress = () => {
    if (addressError || !address) return;
    addToast('Bitcoin address saved', 'success');
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 max-w-2xl mx-auto">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight">User Profile</h1>
        <p className="text-sm text-muted mt-1">Manage your wallet address and notification preferences.</p>
      </div>

      {/* Bitcoin Wallet */}
      <Card className="glass-panel">
        <CardTitle><ShieldCheck className="w-4 h-4 inline mr-1.5 text-accent" />Bitcoin Address</CardTitle>
        <div className="space-y-4 mt-2">
          <FormGroup>
            <Label>Payout Address</Label>
            <div className="relative">
              <Input
                value={address}
                onChange={e => handleAddressChange(e.target.value)}
                className={`font-mono text-xs pr-10 ${addressError ? 'border-red focus-visible:border-red focus-visible:ring-red/30' : ''}`}
                placeholder="bc1q..."
              />
              <button
                onClick={handleCopy}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-accent transition-colors"
                title="Copy address"
              >
                {copied ? <CheckCircle2 className="w-4 h-4 text-green" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
            {addressError && (
              <p className="text-[11px] text-red mt-1.5 font-mono">{addressError}</p>
            )}
            {!addressError && address && (
              <p className="text-[11px] text-green mt-1.5 font-mono flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> Valid Bitcoin address
              </p>
            )}
          </FormGroup>
          <Button onClick={handleSaveAddress} disabled={!!addressError || !address} className="gap-2">
            <Save className="w-4 h-4" /> Save Address
          </Button>
        </div>
      </Card>

      {/* Account Info */}
      <Card className="glass-panel">
        <CardTitle><User className="w-4 h-4 inline mr-1.5 text-accent" />Account</CardTitle>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
          <FormGroup>
            <Label>Display Name</Label>
            <Input defaultValue="Felix Bitcoin" />
          </FormGroup>
          <FormGroup>
            <Label>Email</Label>
            <Input type="email" defaultValue="kitsboy@gmail.com" />
          </FormGroup>
        </div>
        <Button className="gap-2 mt-2">
          <Save className="w-4 h-4" /> Save Account
        </Button>
      </Card>

      {/* Notification Preferences */}
      <Card className="glass-panel">
        <CardTitle><Bell className="w-4 h-4 inline mr-1.5 text-accent" />Notifications</CardTitle>
        <div className="space-y-3 mt-2">
          {[
            { key: 'settlements', label: 'Settlement Alerts',   desc: 'Notify me when payments are confirmed on-chain.' },
            { key: 'bids',        label: 'New Bids',            desc: 'Notify me when a new bid is placed on my slots.'  },
            { key: 'weekly',      label: 'Weekly Summary',      desc: 'Receive a Monday morning performance digest.'     },
          ].map(item => (
            <div key={item.key} className="flex items-center justify-between p-4 bg-surface rounded-xl border border-border">
              <div>
                <div className="font-bold text-sm">{item.label}</div>
                <div className="text-xs text-muted">{item.desc}</div>
              </div>
              <button
                onClick={() => setNotifications(prev => ({ ...prev, [item.key]: !prev[item.key as keyof typeof notifications] }))}
                className={`w-12 h-6 rounded-full transition-colors relative flex-shrink-0 ${notifications[item.key as keyof typeof notifications] ? 'bg-accent' : 'bg-border'}`}
              >
                <div className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-all ${notifications[item.key as keyof typeof notifications] ? 'left-7' : 'left-1'}`} />
              </button>
            </div>
          ))}
        </div>
        <Button className="gap-2 mt-4">
          <Save className="w-4 h-4" /> Save Preferences
        </Button>
      </Card>
    </motion.div>
  );
}
