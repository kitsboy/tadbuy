import { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Twitter, Zap, ChevronDown, ChevronUp, Heart, Briefcase, ShieldAlert, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from './ui';

const JOBS = [
  { title: "Senior DevOps Engineer", desc: "Scale our containerized infrastructure on Cloud Run." },
  { title: "Site Reliability Engineer (SRE)", desc: "Ensure 99.99% uptime for our Lightning nodes." },
  { title: "Cloud Infrastructure Architect", desc: "Design secure, scalable multi-cloud deployments." },
  { title: "DevOps Security Specialist", desc: "Harden our CI/CD pipelines and production environments." },
  { title: "Platform Engineer", desc: "Build developer tools for our internal teams." },
  { title: "Network Operations Engineer", desc: "Optimize Lightning Network routing and node performance." },
  { title: "Automation Engineer", desc: "Automate infrastructure provisioning and monitoring." }
];

export default function Footer() {
  const [showQR, setShowQR] = useState(false);
  const [showJobs, setShowJobs] = useState(false);

  return (
    <footer className="border-t border-border bg-surface/30 mt-20 pt-12 pb-8 relative overflow-hidden">
      <div className="max-w-[1440px] mx-auto px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          
          {/* Brand & Socials */}
          <div className="col-span-1">
            <div className="flex items-center gap-3 text-[22px] font-extrabold tracking-tight mb-4">
              <img src="https://camtaylor.ca/wp-content/uploads/2019/02/Bitcoin.svg.png" alt="Bitcoin" className="w-6 h-6 object-contain" referrerPolicy="no-referrer" />
              <div className="leading-none tracking-tight">Tadbuy</div>
            </div>
            <p className="text-xs text-muted mb-6 leading-relaxed max-w-md">
              The decentralized ad-buying suite. Abstracting away the complexity of cross-platform marketing with Bitcoin, Lightning, and AI.
            </p>
            <div className="flex flex-col gap-3">
              <a href="https://twitter.com/give_bit" target="_blank" rel="noreferrer" className="flex items-center gap-2 text-sm text-muted hover:text-blue transition-colors group">
                <Twitter className="w-4 h-4 group-hover:scale-110 transition-transform" />
                @give_bit
              </a>
              <a href="mailto:Kimi@giveabit.io" className="flex items-center gap-2 text-sm text-muted hover:text-purple transition-colors group">
                <Zap className="w-4 h-4 group-hover:scale-110 transition-transform" />
                Nostr: Kimi@giveabit.io
              </a>
            </div>
          </div>

          {/* Links Column 1 */}
          <div className="col-span-1 grid grid-cols-2 gap-8">
            <div className="space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-widest text-text">Platform</h4>
              <ul className="space-y-2">
                <li><Link to="/" onClick={() => window.scrollTo(0, 0)} className="text-xs text-muted hover:text-accent transition-colors">Buy Ads</Link></li>
                <li><Link to="/campaigns" onClick={() => window.scrollTo(0, 0)} className="text-xs text-muted hover:text-accent transition-colors">Campaigns</Link></li>
                <li><Link to="/metrics" onClick={() => window.scrollTo(0, 0)} className="text-xs text-muted hover:text-accent transition-colors">Metrics</Link></li>
                <li><Link to="/hubhash" onClick={() => window.scrollTo(0, 0)} className="text-xs text-muted hover:text-accent transition-colors">Hubhash</Link></li>
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-widest text-text">Resources</h4>
              <ul className="space-y-2">
                <li><Link to="/docs" onClick={() => window.scrollTo(0, 0)} className="text-xs text-muted hover:text-accent transition-colors">Documentation</Link></li>
                <li><Link to="/api-docs" onClick={() => window.scrollTo(0, 0)} className="text-xs text-muted hover:text-accent transition-colors">API Reference</Link></li>
                <li><Link to="/ppq" onClick={() => window.scrollTo(0, 0)} className="text-xs text-muted hover:text-accent transition-colors">PPQ.AI Guide</Link></li>
                <li><Link to="/bolt12" onClick={() => window.scrollTo(0, 0)} className="text-xs text-muted hover:text-accent transition-colors">BOLT 12 Info</Link></li>
              </ul>
            </div>
          </div>

          {/* Jobs (Expandable) */}
          <div className="col-span-1">
            <button 
              onClick={() => setShowJobs(!showJobs)}
              className="flex items-center gap-2 font-bold mb-4 text-text hover:text-accent transition-colors"
            >
              <Briefcase className="w-4 h-4" />
              Join the Team
              {showJobs ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
            
            <div className={cn("grid gap-3 transition-all duration-300 overflow-hidden", showJobs ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0")}>
              {JOBS.map(job => (
                <div key={job.title} className="bg-card border border-border rounded-lg p-3 flex items-center justify-between group hover:border-accent/50 transition-colors">
                  <div>
                    <div className="text-sm font-bold text-text group-hover:text-accent transition-colors">{job.title}</div>
                    <div className="text-xs text-muted">{job.desc}</div>
                  </div>
                  <a 
                    href={`mailto:hello@giveabit.io?subject=Application for ${job.title}`}
                    className="bg-surface hover:bg-accent/10 text-muted hover:text-accent p-2 rounded-md transition-colors"
                    title="Apply via Email"
                  >
                    <Mail className="w-4 h-4" />
                  </a>
                </div>
              ))}
            </div>
            {!showJobs && (
              <p className="text-xs text-muted">We're hiring 7 open roles. Click to expand.</p>
            )}
          </div>
        </div>

        {/* Bottom Bar: Legal & Donate */}
        <div className="pt-8 border-t border-border flex flex-col items-center justify-center gap-6 text-center">
          <div className="flex flex-col items-center gap-2 text-xs text-muted max-w-2xl">
            <ShieldAlert className="w-5 h-5 mb-1" />
            <span>
              <strong>Safe Harbor Statement:</strong> Forward-looking statements involve risks and uncertainties. Tadbuy and giveabit.io are provided "as is" without warranty.
            </span>
          </div>
          
          <div className="relative flex flex-col items-center">
            <Button 
              variant="secondary" 
              size="sm" 
              onClick={() => setShowQR(!showQR)}
              className="flex items-center gap-2 text-xs border-accent/20 hover:border-accent/50"
            >
              <Heart className="w-3 h-3 text-red" />
              Donate to Project
            </Button>
            
            {/* Expandable QR Card */}
            <div className={cn(
              "absolute bottom-full left-1/2 -translate-x-1/2 mb-4 bg-card border border-border p-4 rounded-xl shadow-2xl transition-all duration-300 origin-bottom",
              showQR ? "scale-100 opacity-100" : "scale-95 opacity-0 pointer-events-none"
            )}>
              <div className="text-center mb-3">
                <div className="text-sm font-bold text-text">Support Tadbuy</div>
                <div className="text-[10px] text-muted">Scan to send Bitcoin</div>
              </div>
              <div className="bg-white p-2 rounded-lg inline-block mb-3">
                <QRCodeSVG value="bitcoin:bc1qhm5ndfjhqxdk3cx0pngyps4f5nnwdckulmge6c8keyf2pk0neqtshjn8ad" size={120} />
              </div>
              <div className="text-[9px] font-mono text-muted bg-surface p-2 rounded break-all text-center">
                bc1qhm5ndfjhqxdk3cx0pngyps4f5nnwdckulmge6c8keyf2pk0neqtshjn8ad
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="text-center text-[10px] text-muted mt-8">Tadbuy v3.9</div>
    </footer>
  );
}
