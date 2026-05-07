import { useState, useMemo, type ElementType } from "react";
import { usePageTitle } from "@/hooks/usePageTitle";
import { motion, AnimatePresence } from "motion/react";
import { Card, Button, Modal, CardTitle, FormGroup, Label, Select, InfoTooltip } from "@/components/ui";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";
import {
  Twitter, Facebook, Instagram, Zap, Youtube, MessageSquare,
  Linkedin, Music, Plus, Play, Pause, Edit3, X, Download,
  Share2, Code, ExternalLink, FileText, Table as TableIcon,
  CheckCircle2, Copy, Globe, MoreVertical, Sparkles, CopyPlus,
  ChevronUp, ChevronDown
} from "lucide-react";
import { campaigns as initialCampaigns, getPlatformIcon, Campaign } from "@/data/campaigns";
import { generateAdCreative, OptimizationSuggestion } from "@/services/geminiService";
import { useToast } from "@/components/Toast";
import React from 'react';

export default function Campaigns() {
  usePageTitle('Campaigns');
  const [campaignsList, setCampaignsList] = useState<Campaign[]>(initialCampaigns);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [showExportModal, setShowExportModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState<string | null>(null);
  const [showOptimizeModal, setShowOptimizeModal] = useState<{ campaign: Campaign, suggestion: OptimizationSuggestion } | null>(null);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [exportFormat, setExportFormat] = useState<'csv' | 'excel' | 'gdocs'>('csv');
  const [copied, setCopied] = useState(false);
  const [sortCol, setSortCol] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  const { addToast } = useToast();

  const toggleSelectAll = () => {
    if (selectedIds.length === campaignsList.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(campaignsList.map(c => c.id));
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const toggleStatus = (id: string) => {
    setCampaignsList(prev => prev.map(c => {
      if (c.id !== id) return c;
      const next = c.status === 'live' ? 'paused' : c.status === 'paused' ? 'live' : 'live';
      return { ...c, status: next };
    }));
  };

  const pauseSelected = () => {
    setCampaignsList(prev => prev.map(c =>
      selectedIds.includes(c.id) && c.status === 'live' ? { ...c, status: 'paused' as const } : c
    ));
    setSelectedIds([]);
  };

  const handleSort = (col: string) => {
    if (sortCol === col) {
      setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    } else {
      setSortCol(col);
      setSortDir('asc');
    }
  };

  const handleDuplicate = (campaign: Campaign) => {
    const newCampaign = {
      ...campaign,
      id: String(Date.now()),
      name: `${campaign.name} (Copy)`,
      status: 'draft' as const,
      spendBtc: 0,
      impressions: 0,
      clicks: 0,
      ctr: 0,
      pacing: 0
    };
    setCampaignsList([newCampaign, ...campaignsList]);
    addToast('Campaign duplicated successfully', 'success');
  };

  const handleCopyEmbed = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleOptimize = async (campaign: Campaign) => {
    setIsOptimizing(true);
    try {
      const suggestion = await generateAdCreative(campaign);
      setShowOptimizeModal({ campaign, suggestion });
    } catch (error) {
      console.error("Optimization failed:", error);
    } finally {
      setIsOptimizing(false);
    }
  };

  const currentOrigin = window.location.origin;

  const totalSpendBtc = campaignsList.reduce((sum, c) => sum + (c.spendBtc || 0), 0);
  const totalImpressions = campaignsList.reduce((sum, c) => sum + (c.impressions || 0), 0);
  const totalClicks = campaignsList.reduce((sum, c) => sum + (c.clicks || 0), 0);
  const liveCampaigns = campaignsList.filter(c => c.status === 'live').length;
  const pausedCampaigns = campaignsList.filter(c => c.status === 'paused').length;
  const draftCampaigns = campaignsList.filter(c => c.status === 'draft').length;
  const avgCpc = totalClicks > 0 ? (totalSpendBtc / totalClicks) : 0;

  const sortedCampaigns = useMemo(() => {
    if (!sortCol) return campaignsList;
    return [...campaignsList].sort((a, b) => {
      let av: number | string = 0;
      let bv: number | string = 0;
      if (sortCol === 'name')        { av = a.name;        bv = b.name; }
      else if (sortCol === 'spend')  { av = a.spendBtc;    bv = b.spendBtc; }
      else if (sortCol === 'impr')   { av = a.impressions;  bv = b.impressions; }
      else if (sortCol === 'clicks') { av = a.clicks;       bv = b.clicks; }
      else if (sortCol === 'ctr')    { av = a.ctr;          bv = b.ctr; }
      if (typeof av === 'string' && typeof bv === 'string') {
        return sortDir === 'asc' ? av.localeCompare(bv) : bv.localeCompare(av);
      }
      return sortDir === 'asc' ? (av as number) - (bv as number) : (bv as number) - (av as number);
    });
  }, [campaignsList, sortCol, sortDir]);

  const SortIcon = ({ col }: { col: string }) => {
    if (sortCol !== col) return <ChevronUp className="w-3 h-3 opacity-20" />;
    return sortDir === 'asc'
      ? <ChevronUp className="w-3 h-3 text-accent" />
      : <ChevronDown className="w-3 h-3 text-accent" />;
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 pb-20">
      {/* ... (keep existing header and stats cards) ... */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight">Active Campaigns</h1>
          <p className="text-sm text-muted mt-1">Manage, export, and share your Bitcoin-native ad performance.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="secondary" onClick={() => setShowExportModal(true)} disabled={selectedIds.length === 0} className="flex items-center gap-2">
            <Download className="w-4 h-4" /> Export Selected ({selectedIds.length})
          </Button>
          <Link to="/">
            <Button className="flex items-center gap-2"><Plus className="w-4 h-4" /> New campaign</Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card className="glass-panel relative group hover:border-accent/50 transition-all duration-300 before:absolute before:top-0 before:left-0 before:right-0 before:h-0.5 before:bg-green before:rounded-t-xl">
          <div className="flex items-center gap-1.5">
            <div className="text-[10px] text-muted uppercase tracking-widest font-bold">Total spend (BTC)</div>
            <InfoTooltip content="The total amount of Bitcoin spent across all your active and past ad campaigns." />
          </div>
          <div className="text-[26px] font-extrabold my-1">{totalSpendBtc.toFixed(4)}</div>
          <div className="text-[11px] text-muted font-mono">₿ this month</div>
          <div className="text-[11px] font-bold text-green mt-2">↑ +12.4% vs last month</div>
        </Card>
        <Card className="glass-panel relative group hover:border-accent/50 transition-all duration-300 before:absolute before:top-0 before:left-0 before:right-0 before:h-0.5 before:bg-blue before:rounded-t-xl">
          <div className="flex items-center gap-1.5">
            <div className="text-[10px] text-muted uppercase tracking-widest font-bold">Total impressions</div>
            <InfoTooltip content="Total number of times your ads were displayed to users across all platforms." />
          </div>
          <div className="text-[26px] font-extrabold my-1">
            {totalImpressions >= 1_000_000
              ? `${(totalImpressions / 1_000_000).toFixed(2)}M`
              : totalImpressions.toLocaleString()}
          </div>
          <div className="text-[11px] text-muted font-mono">across all platforms</div>
          <div className="text-[11px] font-bold text-green mt-2">↑ +8.1%</div>
        </Card>
        <Card className="glass-panel relative group hover:border-accent/50 transition-all duration-300 before:absolute before:top-0 before:left-0 before:right-0 before:h-0.5 before:bg-accent before:rounded-t-xl">
          <div className="flex items-center gap-1.5">
            <div className="text-[10px] text-muted uppercase tracking-widest font-bold">Total clicks</div>
            <InfoTooltip content="The number of times users clicked on your ads to visit your destination URL." />
          </div>
          <div className="text-[26px] font-extrabold my-1">{totalClicks.toLocaleString()}</div>
          <div className="text-[11px] text-muted font-mono">avg CPC: {avgCpc.toFixed(8)} ₿</div>
          <div className="text-[11px] font-bold text-green mt-2">↑ +18.2%</div>
        </Card>
        <Card className="glass-panel relative group hover:border-accent/50 transition-all duration-300 before:absolute before:top-0 before:left-0 before:right-0 before:h-0.5 before:bg-purple before:rounded-t-xl">
          <div className="flex items-center gap-1.5">
            <div className="text-[10px] text-muted uppercase tracking-widest font-bold">Active campaigns</div>
            <InfoTooltip content="The number of ad campaigns currently running or scheduled to run." />
          </div>
          <div className="text-[26px] font-extrabold my-1">{campaignsList.length}</div>
          <div className="text-[11px] text-muted font-mono">{liveCampaigns} live · {pausedCampaigns} paused · {draftCampaigns} draft</div>
          <div className="text-[11px] font-bold text-muted mt-2">→ stable</div>
        </Card>
      </div>

      <Card className="glass-panel p-0 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-[13px] border-collapse">
            <thead>
              <tr className="bg-surface/40">
                <th className="p-4 border-b border-border text-left w-10">
                  <input 
                    type="checkbox" 
                    className="w-4 h-4 rounded border-border bg-card accent-accent cursor-pointer"
                    checked={selectedIds.length === campaignsList.length && campaignsList.length > 0}
                    onChange={toggleSelectAll}
                  />
                </th>
                <th className="text-left p-4 text-[10px] uppercase tracking-widest text-muted border-b border-border font-bold">
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleSort('name')}
                      className="flex items-center gap-1 hover:text-text transition-colors"
                    >
                      Campaign
                      <SortIcon col="name" />
                    </button>
                    <InfoTooltip content="The unique name identifying your ad campaign." />
                  </div>
                </th>
                <th className="text-left p-4 text-[10px] uppercase tracking-widest text-muted border-b border-border font-bold">
                  <div className="flex items-center gap-1">
                    Platforms
                    <InfoTooltip content="The social media or web networks where your ads are being served." />
                  </div>
                </th>
                <th className="text-left p-4 text-[10px] uppercase tracking-widest text-muted border-b border-border font-bold">
                  <div className="flex items-center gap-1">
                    Status
                    <InfoTooltip content="Current state of the campaign: Live (running), Paused (stopped), or Draft (not yet deployed)." />
                  </div>
                </th>
                <th className="text-left p-4 text-[10px] uppercase tracking-widest text-muted border-b border-border font-bold">
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleSort('spend')}
                      className="flex items-center gap-1 hover:text-text transition-colors"
                    >
                      Spend (BTC)
                      <SortIcon col="spend" />
                    </button>
                    <InfoTooltip content="Total Bitcoin consumed by this campaign to date." />
                  </div>
                </th>
                <th className="text-left p-4 text-[10px] uppercase tracking-widest text-muted border-b border-border font-bold">
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleSort('impr')}
                      className="flex items-center gap-1 hover:text-text transition-colors"
                    >
                      Impressions
                      <SortIcon col="impr" />
                    </button>
                    <InfoTooltip content="Number of times this specific campaign's ads have been seen." />
                  </div>
                </th>
                <th className="text-left p-4 text-[10px] uppercase tracking-widest text-muted border-b border-border font-bold">
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleSort('clicks')}
                      className="flex items-center gap-1 hover:text-text transition-colors"
                    >
                      Clicks
                      <SortIcon col="clicks" />
                    </button>
                    <InfoTooltip content="Number of user interactions (clicks) with this campaign's ads." />
                  </div>
                </th>
                <th className="text-left p-4 text-[10px] uppercase tracking-widest text-muted border-b border-border font-bold">
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleSort('ctr')}
                      className="flex items-center gap-1 hover:text-text transition-colors"
                    >
                      CTR
                      <SortIcon col="ctr" />
                    </button>
                    <InfoTooltip content="Click-Through Rate: The percentage of impressions that resulted in a click." />
                  </div>
                </th>
                <th className="text-left p-4 text-[10px] uppercase tracking-widest text-muted border-b border-border font-bold">
                  <div className="flex items-center gap-1">
                    Pacing
                    <InfoTooltip content="How quickly your budget is being spent relative to the campaign duration." />
                  </div>
                </th>
                <th className="text-right p-4 text-[10px] uppercase tracking-widest text-muted border-b border-border font-bold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {sortedCampaigns.map(c => (
                <tr key={c.id} className={cn(
                  "hover:bg-accent/5 transition-colors group border-b border-border/50",
                  selectedIds.includes(c.id) && "bg-accent/5"
                )}>
                  <td className="p-4">
                    <input
                      type="checkbox"
                      className="w-4 h-4 rounded border-border bg-card accent-accent cursor-pointer"
                      checked={selectedIds.includes(c.id)}
                      onChange={() => toggleSelect(c.id)}
                    />
                  </td>
                  <td className="p-4 relative">
                    {/* Hover tooltip */}
                    <div className="absolute left-1/2 -translate-x-1/2 -top-16 w-48 bg-card border border-border rounded-xl p-2 text-[11px] hidden group-hover:block z-50 shadow-xl pointer-events-none">
                      <div className="font-bold text-text truncate mb-1">{c.name}</div>
                      <div className="flex gap-1 text-muted mb-1.5">
                        {c.platforms.map((pid, i) => {
                          const Icon = getPlatformIcon(pid);
                          return <Icon key={i} className="w-3.5 h-3.5" />;
                        })}
                      </div>
                      <div className="flex items-center justify-between">
                        <span className={cn(
                          "inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] font-bold",
                          c.status === 'live' ? "bg-green/15 text-green" :
                          c.status === 'paused' ? "bg-accent/15 text-accent" :
                          "bg-muted/15 text-muted"
                        )}>
                          {c.status === 'live' && <Play className="w-2.5 h-2.5" />}
                          {c.status === 'paused' && <Pause className="w-2.5 h-2.5" />}
                          {c.status === 'draft' && <Edit3 className="w-2.5 h-2.5" />}
                          {c.status}
                        </span>
                        <span className="text-muted font-mono">CTR: {c.ctr > 0 ? `${c.ctr}%` : '—'}</span>
                      </div>
                    </div>
                    <div className="font-bold text-text">{c.name}</div>
                    <div className="text-[10px] text-muted mt-0.5">{c.dates}</div>
                  </td>
                  <td className="p-4">
                    <div className="flex gap-1.5 text-muted">
                      {c.platforms.map((pid, i) => {
                        const Icon = getPlatformIcon(pid);
                        return <Icon key={i} className="w-4 h-4" />;
                      })}
                    </div>
                  </td>
                  <td className="p-4">
                    <span
                      onClick={() => toggleStatus(c.id)}
                      title={c.status !== 'draft' ? 'Click to toggle status' : 'Draft — click to go live'}
                      className={cn(
                        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold cursor-pointer select-none transition-opacity hover:opacity-75",
                        c.status === 'live' ? "bg-green/15 text-green" :
                        c.status === 'paused' ? "bg-accent/15 text-accent" :
                        "bg-muted/15 text-muted"
                      )}
                    >
                      {c.status === 'live' && <Play className="w-3 h-3 animate-pulse" />}
                      {c.status === 'paused' && <Pause className="w-3 h-3" />}
                      {c.status === 'draft' && <Edit3 className="w-3 h-3" />}
                      {c.status}
                    </span>
                  </td>
                  <td className="p-4 font-mono text-accent">{c.spendBtc > 0 ? c.spendBtc.toFixed(4) : '0.0000'}</td>
                  <td className="p-4">{c.impressions > 0 ? c.impressions.toLocaleString() : '—'}</td>
                  <td className="p-4">{c.clicks > 0 ? c.clicks.toLocaleString() : '—'}</td>
                  <td className={cn("p-4", c.ctr > 5 ? "text-green" : c.ctr > 0 ? "text-muted" : "")}>
                    {c.ctr > 0 ? `${c.ctr}%` : '—'}
                  </td>
                  <td className="p-4 w-32">
                    <div className="bg-surface rounded h-1.5 overflow-hidden mb-1">
                      <div 
                        className={cn("h-full rounded transition-all", c.status === 'live' ? "bg-green" : c.status === 'paused' ? "bg-blue" : "bg-muted")}
                        style={{ width: `${c.pacing}%` }} 
                      />
                    </div>
                    <span className="text-[10px] text-muted">{c.pacing}%</span>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex justify-end gap-2">
                      <Button 
                        variant="secondary" 
                        size="sm" 
                        className="h-8 w-8 p-0"
                        onClick={() => handleDuplicate(c)}
                        title="Duplicate Campaign"
                      >
                        <CopyPlus className="w-3.5 h-3.5" />
                      </Button>
                      <Button 
                        variant="secondary" 
                        size="sm" 
                        className="h-8 w-8 p-0"
                        onClick={() => handleOptimize(c)}
                        disabled={isOptimizing}
                      >
                        <Sparkles className={cn("w-3.5 h-3.5", isOptimizing && "animate-pulse")} />
                      </Button>
                      <Button 
                        variant="secondary" 
                        size="sm" 
                        className="h-8 w-8 p-0"
                        onClick={() => setShowShareModal(c.id)}
                      >
                        <Share2 className="w-3.5 h-3.5" />
                      </Button>
                      {c.status !== 'draft' ? (
                        <Link to="/wallet">
                          <Button size="sm" className="text-[10px] px-3 h-8 bg-accent/10 text-accent border border-accent/30 hover:bg-accent hover:text-black shadow-none">
                            ⚡ Top Up
                          </Button>
                        </Link>
                      ) : (
                        <Link to="/">
                          <Button variant="secondary" size="sm" className="text-[10px] px-3 h-8">
                            Edit
                          </Button>
                        </Link>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Export Modal */}
      <Modal isOpen={showExportModal} onClose={() => setShowExportModal(false)}>
        <div className="p-6">
          <CardTitle>Export Campaign Data</CardTitle>
          <p className="text-xs text-muted mb-6">Exporting {selectedIds.length} selected campaigns. Choose your scope and format.</p>
          
          <div className="space-y-4 mb-8">
            <FormGroup className="mb-0">
              <Label>Export Scope</Label>
              <Select defaultValue="selected">
                <option value="selected">Selected Campaigns ({selectedIds.length})</option>
                <option value="account">Entire Account (All Campaigns)</option>
                <option value="company">Company Level (giveabit.io)</option>
              </Select>
            </FormGroup>

            <div>
              <Label>Format</Label>
              <div className="grid grid-cols-3 gap-3 mt-2">
                {([
                  { id: 'csv', name: 'CSV', icon: FileText },
                  { id: 'excel', name: 'Excel', icon: TableIcon },
                  { id: 'gdocs', name: 'GDocs', icon: Globe },
                ] as { id: 'csv' | 'excel' | 'gdocs'; name: string; icon: ElementType }[]).map(f => (
                  <button
                    key={f.id}
                    onClick={() => setExportFormat(f.id)}
                    className={cn(
                      "flex flex-col items-center gap-2 p-4 rounded-xl border transition-all",
                      exportFormat === f.id ? "border-accent bg-accent/5 text-accent" : "border-border hover:border-muted"
                    )}
                  >
                    <f.icon className="w-6 h-6" />
                    <span className="text-xs font-bold">{f.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <Button className="w-full" onClick={() => {
              if (exportFormat === 'gdocs') {
                addToast('Google Sheets export coming soon', 'success');
                setShowExportModal(false);
              } else {
                addToast(`Exporting to ${exportFormat.toUpperCase()}...`, 'success');
                setShowExportModal(false);
              }
            }}>
              Confirm Export
            </Button>
            <Button variant="secondary" className="w-full" onClick={() => setShowExportModal(false)}>
              Cancel
            </Button>
          </div>
        </div>
      </Modal>

      {/* Share & Embed Modal */}
      <Modal isOpen={showShareModal !== null} onClose={() => setShowShareModal(null)}>
        {showShareModal && (
          <div className="p-6">
            <CardTitle>Share & Embed</CardTitle>
            <p className="text-xs text-muted mb-6">Share real-time metrics for <strong>{campaignsList.find(c => c.id === showShareModal)?.name}</strong>.</p>
            
            <div className="space-y-6">
              <div>
                <Label>Social Share</Label>
                <div className="flex gap-2 mt-2">
                  <Button variant="secondary" size="sm" className="flex-1 gap-2" onClick={() => window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(`Check out my campaign on Tadbuy — Bitcoin-native advertising! https://tadbuy.giveabit.io`)}`, '_blank')}><Twitter className="w-4 h-4" /> X</Button>
                  <Button variant="secondary" size="sm" className="flex-1 gap-2" onClick={() => window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent('https://tadbuy.giveabit.io')}`, '_blank')}><Linkedin className="w-4 h-4" /> LinkedIn</Button>
                  <Button variant="secondary" size="sm" className="flex-1 gap-2" onClick={() => window.open(`https://njump.me/`, '_blank')}><Zap className="w-4 h-4" /> Nostr</Button>
                </div>
              </div>

              <div>
                <Label>Embed Real-time Metrics (iFrame)</Label>
                <div className="relative mt-2">
                  <pre className="bg-surface p-3 rounded-lg text-[10px] font-mono text-muted border border-border overflow-x-auto">
                    {`<iframe src="${currentOrigin}/embed/metrics/${showShareModal}" width="100%" height="400" frameborder="0"></iframe>`}
                  </pre>
                  <Button 
                    variant="secondary" 
                    size="sm" 
                    className="absolute top-2 right-2 h-7 px-2"
                    onClick={() => handleCopyEmbed(`<iframe src="${currentOrigin}/embed/metrics/${showShareModal}" width="100%" height="400" frameborder="0"></iframe>`)}
                  >
                    {copied ? <CheckCircle2 className="w-3.5 h-3.5 text-green" /> : <Copy className="w-3.5 h-3.5" />}
                  </Button>
                </div>
              </div>

              <div>
                <Label>Ad Summary Box (iFrame)</Label>
                <div className="relative mt-2">
                  <pre className="bg-surface p-3 rounded-lg text-[10px] font-mono text-muted border border-border overflow-x-auto">
                    {`<iframe src="${currentOrigin}/embed/ad/${showShareModal}" width="400" height="250" frameborder="0"></iframe>`}
                  </pre>
                  <Button 
                    variant="secondary" 
                    size="sm" 
                    className="absolute top-2 right-2 h-7 px-2"
                    onClick={() => handleCopyEmbed(`<iframe src="${currentOrigin}/embed/ad/${showShareModal}" width="400" height="250" frameborder="0"></iframe>`)}
                  >
                    {copied ? <CheckCircle2 className="w-3.5 h-3.5 text-green" /> : <Copy className="w-3.5 h-3.5" />}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Bulk Actions Floating Bar */}
      <AnimatePresence>
        {selectedIds.length > 0 && (
          <motion.div 
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 bg-card border border-accent/30 rounded-2xl px-6 py-4 shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex items-center gap-8"
          >
            <div className="flex items-center gap-3">
              <div className="bg-accent text-black w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold">
                {selectedIds.length}
              </div>
              <span className="text-sm font-bold">Campaigns selected</span>
            </div>
            <div className="w-px h-6 bg-border" />
            <div className="flex gap-2">
              <Button size="sm" variant="secondary" onClick={() => setShowExportModal(true)} className="gap-2">
                <Download className="w-4 h-4" /> Export
              </Button>
              <Button size="sm" variant="secondary" onClick={pauseSelected} className="gap-2 text-red hover:bg-red/10 hover:border-red/30">
                <Pause className="w-4 h-4" /> Pause
              </Button>
              <Button size="sm" variant="secondary" onClick={() => setSelectedIds([])}>
                Clear
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
