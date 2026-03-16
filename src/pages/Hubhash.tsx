import { motion } from "motion/react";
import { Card, CardTitle, Button } from "@/components/ui";
import { cn } from "@/lib/utils";
import { Users, Target, Zap, ArrowRight, ShieldCheck } from "lucide-react";

const hubhashCampaigns = [
  {
    id: 1,
    title: "Austin Lightning Concert Promo",
    creator: "@localmusic_atx",
    description: "Raising funds to blast Nostr and Twitter with ads for the upcoming Lightning-powered local music festival in Austin. If we hit the goal, the campaign auto-deploys!",
    targetBtc: 0.05,
    raisedBtc: 0.032,
    hashtags: ["#AustinMusic", "#LightningNetwork", "#Plebs"],
    status: "funding",
    daysLeft: 4
  },
  {
    id: 2,
    title: "Open Source Nostr Client Launch",
    creator: "@dev_nostr",
    description: "Help us fund the launch campaign for our new open-source Nostr client. We want to reach 1M impressions across Twitter and Reddit.",
    targetBtc: 0.1,
    raisedBtc: 0.1,
    hashtags: ["#Nostr", "#FOSS", "#Decentralized"],
    status: "unleashed",
    daysLeft: 0
  },
  {
    id: 3,
    title: "Bitcoin Circular Economy Documentary",
    creator: "@btc_films",
    description: "Funding ad spend to promote our indie documentary about circular economies in El Salvador and Costa Rica.",
    targetBtc: 0.25,
    raisedBtc: 0.015,
    hashtags: ["#Bitcoin", "#ElSalvador", "#Documentary"],
    status: "funding",
    daysLeft: 12
  }
];

export default function Hubhash() {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 bg-gradient-to-r from-accent/20 to-purple/20 p-8 rounded-2xl border border-accent/20">
        <div className="max-w-2xl">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-3xl">🤝</span>
            <h1 className="text-3xl font-extrabold tracking-tight">Hubhash</h1>
            <span className="bg-accent text-black text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-widest">Beta</span>
          </div>
          <p className="text-muted text-sm leading-relaxed">
            Crowdfund ad campaigns using ecash, BTC, or Lightning. Set a threshold, and when the community funds it, the campaign is automatically unleashed onto social platforms via PPQ.AI. If the goal isn't met, funds are cryptographically refunded to the original payers.
          </p>
        </div>
        <Button size="lg" className="shrink-0 shadow-[0_0_20px_rgba(247,147,26,0.3)]">
          Create Hubhash Campaign
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="bg-surface/50">
          <Users className="w-6 h-6 text-blue mb-3" />
          <div className="font-bold mb-1">Community Funded</div>
          <div className="text-xs text-muted">Pool funds together using Lightning or ecash to run massive campaigns you couldn't afford alone.</div>
        </Card>
        <Card className="bg-surface/50">
          <Target className="w-6 h-6 text-accent mb-3" />
          <div className="font-bold mb-1">Threshold Triggers</div>
          <div className="text-xs text-muted">Campaigns only deploy when the target budget is reached, ensuring maximum impact.</div>
        </Card>
        <Card className="bg-surface/50">
          <ShieldCheck className="w-6 h-6 text-green mb-3" />
          <div className="font-bold mb-1">Provable Refunds</div>
          <div className="text-xs text-muted">If a campaign fails to reach its goal, funds are automatically routed back to the original senders.</div>
        </Card>
      </div>

      <h2 className="text-xl font-bold mb-4">Trending Campaigns</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {hubhashCampaigns.map(campaign => {
          const progress = Math.min(100, (campaign.raisedBtc / campaign.targetBtc) * 100);
          const isUnleashed = campaign.status === 'unleashed';

          return (
            <Card key={campaign.id} className={cn("relative overflow-hidden transition-all hover:border-muted", isUnleashed ? "border-green/30 bg-green/5" : "")}>
              {isUnleashed && (
                <div className="absolute top-4 right-4 bg-green/20 text-green text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1.5">
                  <Zap className="w-3 h-3" /> UNLEASHED
                </div>
              )}
              {!isUnleashed && (
                <div className="absolute top-4 right-4 text-[11px] text-muted font-mono">
                  {campaign.daysLeft} days left
                </div>
              )}
              
              <div className="text-sm font-bold text-muted mb-1">{campaign.creator}</div>
              <h3 className="text-lg font-extrabold mb-2">{campaign.title}</h3>
              <p className="text-xs text-muted leading-relaxed mb-4 line-clamp-2">{campaign.description}</p>
              
              <div className="flex flex-wrap gap-1.5 mb-5">
                {campaign.hashtags.map(tag => (
                  <span key={tag} className="bg-surface border border-border text-text text-[10px] px-2 py-1 rounded-md">
                    {tag}
                  </span>
                ))}
              </div>

              <div className="mb-2 flex justify-between text-xs font-mono">
                <span className={isUnleashed ? "text-green font-bold" : "text-accent"}>{campaign.raisedBtc} ₿ raised</span>
                <span className="text-muted">Goal: {campaign.targetBtc} ₿</span>
              </div>
              
              <div className="bg-surface rounded-full h-2 overflow-hidden mb-5 border border-border/50">
                <div 
                  className={cn("h-full rounded-full transition-all duration-1000", isUnleashed ? "bg-green" : "bg-accent")} 
                  style={{ width: `${progress}%` }} 
                />
              </div>

              <Button 
                variant={isUnleashed ? "secondary" : "primary"} 
                className="w-full"
                disabled={isUnleashed}
              >
                {isUnleashed ? "Campaign Live on Platforms" : "Pledge Funds (Refundable)"}
                {!isUnleashed && <ArrowRight className="w-4 h-4 ml-2" />}
              </Button>
            </Card>
          );
        })}
      </div>
    </motion.div>
  );
}
