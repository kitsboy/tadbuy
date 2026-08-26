import React, { useState, useEffect } from 'react';
import { generateTaprootEscrow, generatePaynymCode, generateSilentPaymentAddress, fetchMempoolFeeEstimates, MempoolFeeEstimates } from '@/lib/bitcoin/l1Advanced';
import { createBolt12Offer, generateLsatToken, initiateSubmarineSwap } from '@/lib/lightning/l2Advanced';
import { LIQUID_ASSETS, convertSatsToLiquidUsdt, generateConfidentialLiquidAddress } from '@/lib/liquid/liquidAdvanced';
import { generateZkImpressionProof } from '@/lib/privacy/zkProofEngine';
import { evaluatePpqBidEnhanced } from '@/lib/adEngine/ppqEngine';
import { issueEcashAdVoucher } from '@/services/fedimintService';
import { Shield, Zap, Layers, Lock, Cpu, CheckCircle2, Copy, Sparkles, RefreshCw, Key, FileCode } from 'lucide-react';

export const BitcoinProtocolSuite: React.FC<{ defaultTab?: string }> = ({ defaultTab = 'l1' }) => {
  const [activeTab, setActiveTab] = useState(defaultTab);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  // L1 State
  const [escrowSatoshis, setEscrowSatoshis] = useState(100000);
  const [paynymLabel, setPaynymLabel] = useState('SatoshiMedia');
  const [feeEstimates, setFeeEstimates] = useState<MempoolFeeEstimates | null>(null);

  // L2 & Liquid State
  const [nwcUri, setNwcUri] = useState('nostr+walletconnect://b84...relay=wss://relay.getalby.com/v1');
  const [ppqQuery, setPpqQuery] = useState('bitcoin dsp advertising');

  useEffect(() => {
    fetchMempoolFeeEstimates().then(setFeeEstimates);
  }, []);

  const handleCopy = (text: string, fieldKey: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldKey);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const taprootDemo = generateTaprootEscrow({
    advertiserPubKey: '03a34b99f22c790c4e36b2b3c2c3525a143b999',
    publisherPubKey: '02b11c22d33e44f55a66b77c88d99e001122334',
    platformPubKey: '02c99d88e77f66a55b44c33d22e11f009988776',
    timelockBlocks: 144,
    escrowSatoshis,
  });

  const paynymDemo = generatePaynymCode('03a34b99f22c790c4e36b2b3c2c3525a143b999', paynymLabel);
  const silentPaymentDemo = generateSilentPaymentAddress('02scankey1234567890abcdef', '03spendkey1234567890abcdef');
  const bolt12Demo = createBolt12Offer('TadbuyDspNode', 'Continuous Banner Campaign Topup', escrowSatoshis);
  const lsatDemo = generateLsatToken('tadbuy-analytics-v1', 50);
  const swapDemo = initiateSubmarineSwap(escrowSatoshis, 'l1_to_l2');
  const liquidAddress = generateConfidentialLiquidAddress('03liquidkey999888777');
  const liquidUsdtDemo = convertSatsToLiquidUsdt(escrowSatoshis);
  const zkProofDemo = generateZkImpressionProof('cmp_demo_v5', 'publisher.giveabit.io', 12500, 3500);
  const ppqDemo = evaluatePpqBidEnhanced(ppqQuery, 25, { keywords: ['bitcoin', 'advertising', 'dsp'] });
  const ecashDemo = issueEcashAdVoucher(escrowSatoshis);

  return (
    <div className="glass-panel p-5 md:p-6 rounded-2xl border border-white/10 shadow-2xl space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent text-xs font-semibold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            Bitcoin Sovereign Protocol Architecture
          </div>
          <h2 className="text-xl md:text-2xl font-black text-white tracking-tight">
            Protocol & Payment Layer Matrix
          </h2>
          <p className="text-xs md:text-sm text-zinc-400">
            Native Taproot, Miniscript, Lightning BOLT12, Liquid Assets, Paynyms BIP-47, Silent Payments, & zk-Proofs.
          </p>
        </div>

        {/* Tab Selector */}
        <div className="flex flex-wrap gap-1.5 bg-zinc-900/90 p-1.5 rounded-xl border border-white/10">
          {[
            { id: 'l1', label: 'Layer 1 & Privacy', icon: Lock },
            { id: 'l2', label: 'Lightning & Swaps', icon: Zap },
            { id: 'liquid', label: 'Liquid & Assets', icon: Layers },
            { id: 'zk', label: 'zk-Proofs & PPQ', icon: Cpu },
            { id: 'ecash', label: 'Fedimint Ecash', icon: Shield },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all touch-manipulation ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-accent to-fuchsia-500 text-zinc-950 font-bold shadow-md'
                    : 'text-zinc-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab 1: Layer 1 & Privacy */}
      {activeTab === 'l1' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fade-in">
          {/* Taproot P2TR Escrow */}
          <div className="bg-zinc-900/60 p-4 md:p-5 rounded-xl border border-white/5 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <FileCode className="w-4 h-4 text-accent" />
                Taproot (P2TR) Miniscript Ad Escrow
              </h3>
              <span className="text-[10px] font-mono text-zinc-400 bg-white/5 px-2 py-0.5 rounded border border-white/10">
                144 Blocks (~24h) Timelock
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <div>
                <label className="text-[11px] text-zinc-400">Escrow Satoshis:</label>
                <input
                  type="number"
                  value={escrowSatoshis}
                  onChange={(e) => setEscrowSatoshis(Number(e.target.value))}
                  className="w-full mt-1 bg-zinc-950 border border-white/10 rounded-lg px-3 py-1.5 text-accent font-mono focus:outline-none focus:border-accent"
                />
              </div>

              <div>
                <span className="text-[11px] text-zinc-400">P2TR Bech32m Address:</span>
                <div className="flex items-center gap-2 mt-1 bg-zinc-950 p-2 rounded-lg font-mono text-[11px] text-emerald-400 overflow-x-auto border border-white/5">
                  <span className="truncate">{taprootDemo.escrowAddress}</span>
                  <button
                    onClick={() => handleCopy(taprootDemo.escrowAddress, 'taproot')}
                    className="p-1 text-zinc-400 hover:text-white ml-auto"
                  >
                    {copiedField === 'taproot' ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div>
                <span className="text-[11px] text-zinc-400">Miniscript Spending Policy:</span>
                <p className="font-mono text-[10px] text-purple-300 bg-zinc-950/80 p-2 rounded border border-white/5 overflow-x-auto">
                  {taprootDemo.miniscriptPolicy}
                </p>
              </div>
            </div>
          </div>

          {/* BIP-47 & BIP-352 */}
          <div className="bg-zinc-900/60 p-4 md:p-5 rounded-xl border border-white/5 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Key className="w-4 h-4 text-purple-400" />
              Paynyms (BIP-47) & Silent Payments (BIP-352)
            </h3>

            {/* Paynym */}
            <div className="space-y-1.5 text-xs">
              <div className="flex items-center gap-3">
                <img src={paynymDemo.avatarUrl} alt="Paynym" className="w-9 h-9 rounded-lg border border-white/10 bg-zinc-950 p-0.5" />
                <div className="flex-1">
                  <input
                    type="text"
                    value={paynymLabel}
                    onChange={(e) => setPaynymLabel(e.target.value)}
                    className="bg-zinc-950 border border-white/10 rounded px-2 py-0.5 text-xs text-white focus:outline-none focus:border-accent w-full"
                    placeholder="Paynym Label"
                  />
                  <div className="text-[10px] text-zinc-400 font-mono mt-0.5">{paynymDemo.paynymId}</div>
                </div>
              </div>

              <div className="flex items-center gap-2 bg-zinc-950 p-2 rounded font-mono text-[10px] text-purple-300 border border-white/5">
                <span className="truncate">{paynymDemo.paymentCode}</span>
                <button
                  onClick={() => handleCopy(paynymDemo.paymentCode, 'paynym')}
                  className="p-1 text-zinc-400 hover:text-white ml-auto"
                >
                  {copiedField === 'paynym' ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            {/* Silent Payment */}
            <div className="space-y-1 text-xs pt-2 border-t border-white/5">
              <span className="text-[11px] text-zinc-400 font-medium">BIP-352 Stealth Address:</span>
              <div className="flex items-center gap-2 bg-zinc-950 p-2 rounded font-mono text-[10px] text-sky-300 border border-white/5">
                <span className="truncate">{silentPaymentDemo.stealthAddress}</span>
                <button
                  onClick={() => handleCopy(silentPaymentDemo.stealthAddress, 'silent')}
                  className="p-1 text-zinc-400 hover:text-white ml-auto"
                >
                  {copiedField === 'silent' ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            {/* Mempool Fee Tip */}
            {feeEstimates && (
              <div className="flex items-center justify-between text-[11px] bg-zinc-950/80 p-2.5 rounded-lg border border-white/5 font-mono text-zinc-300">
                <span>Mempool Fee Rates:</span>
                <div className="flex gap-2 text-accent">
                  <span>Fast: {feeEstimates.fastestFee} sat/vB</span>
                  <span>Med: {feeEstimates.halfHourFee} sat/vB</span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 2: Lightning & Swaps */}
      {activeTab === 'l2' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fade-in">
          {/* BOLT12 Static Offer */}
          <div className="bg-zinc-900/60 p-4 md:p-5 rounded-xl border border-white/5 space-y-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Zap className="w-4 h-4 text-lightning" />
              BOLT12 Static Offer (`lno1...`)
            </h3>
            <p className="text-xs text-zinc-400">
              Reusable payment offer for ongoing campaign funding without creating new invoices.
            </p>
            <div className="bg-zinc-950 p-2.5 rounded-lg font-mono text-xs text-amber-300 border border-white/5 flex items-center justify-between">
              <span className="truncate">{bolt12Demo.offerString}</span>
              <button
                onClick={() => handleCopy(bolt12Demo.offerString, 'bolt12')}
                className="p-1 text-zinc-400 hover:text-white ml-2"
              >
                {copiedField === 'bolt12' ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
            <div className="text-[11px] text-zinc-400 flex justify-between font-mono">
              <span>Issuer: {bolt12Demo.issuer}</span>
              <span>Min Sats: {bolt12Demo.minSatoshis?.toLocaleString()}</span>
            </div>
          </div>

          {/* Submarine Swap */}
          <div className="bg-zinc-900/60 p-4 md:p-5 rounded-xl border border-white/5 space-y-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <RefreshCw className="w-4 h-4 text-sky-400" />
              Boltz Submarine Swap (L1 ↔ Lightning)
            </h3>
            <p className="text-xs text-zinc-400">
              Cross-layer atomic swap order for instant liquidity bridging.
            </p>
            <div className="bg-zinc-950 p-2.5 rounded-lg font-mono text-[11px] space-y-1 text-zinc-300 border border-white/5">
              <div className="flex justify-between">
                <span className="text-zinc-500">Order ID:</span>
                <span className="text-accent">{swapDemo.swapId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">Deposit Address:</span>
                <span className="text-sky-300 truncate max-w-[200px]">{swapDemo.onChainAddress}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Liquid & Assets */}
      {activeTab === 'liquid' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fade-in">
          {/* Confidential Liquid Address */}
          <div className="bg-zinc-900/60 p-4 md:p-5 rounded-xl border border-white/5 space-y-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-emerald-400" />
              Liquid Network Confidential Address
            </h3>
            <p className="text-xs text-zinc-400">
              Blind amounts and asset types with Sub-minute finality and zero public visibility.
            </p>
            <div className="bg-zinc-950 p-2.5 rounded-lg font-mono text-xs text-emerald-300 border border-white/5 flex items-center justify-between">
              <span className="truncate">{liquidAddress}</span>
              <button
                onClick={() => handleCopy(liquidAddress, 'liquid')}
                className="p-1 text-zinc-400 hover:text-white ml-2"
              >
                {copiedField === 'liquid' ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
            <div className="flex gap-2">
              {Object.values(LIQUID_ASSETS).map((asset) => (
                <div key={asset.ticker} className="flex-1 bg-zinc-950 p-2 rounded border border-white/5 text-center">
                  <div className="text-sm">{asset.icon}</div>
                  <div className="text-xs font-bold text-white mt-1">{asset.ticker}</div>
                  <div className="text-[10px] text-zinc-400">{asset.name}</div>
                </div>
              ))}
            </div>
          </div>

          {/* L-USDt Stability */}
          <div className="bg-zinc-900/60 p-4 md:p-5 rounded-xl border border-white/5 space-y-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Lock className="w-4 h-4 text-emerald-400" />
              Liquid USDt Campaign Hegding
            </h3>
            <p className="text-xs text-zinc-400">
              Peg ad budgets to Liquid Tether (L-USDt) to hedge against BTC price fluctuations.
            </p>
            <div className="bg-zinc-950 p-3 rounded-lg border border-white/5 text-center">
              <div className="text-xs text-zinc-400">Current Escrow Pegged Value:</div>
              <div className="text-2xl font-black text-emerald-400 font-mono mt-1">
                {liquidUsdtDemo.formattedUsdt}
              </div>
              <div className="text-[11px] text-zinc-500 font-mono mt-1">
                Equivalent to {escrowSatoshis.toLocaleString()} sats @ $95,000/BTC
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: zk-Proofs & PPQ */}
      {activeTab === 'zk' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fade-in">
          {/* zk-SNARK PoV */}
          <div className="bg-zinc-900/60 p-4 md:p-5 rounded-xl border border-white/5 space-y-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Cpu className="w-4 h-4 text-fuchsia-400" />
              Zero-Knowledge Proof-of-Viewability (zk-SNARK)
            </h3>
            <p className="text-xs text-zinc-400">
              Cryptographically prove 12,500 impressions verified without disclosing viewer IPs.
            </p>
            <div className="bg-zinc-950 p-2.5 rounded-lg font-mono text-[10px] space-y-1 text-zinc-300 border border-white/5">
              <div className="flex justify-between">
                <span className="text-zinc-500">Proof ID:</span>
                <span className="text-fuchsia-300">{zkProofDemo.proofId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">Public Status:</span>
                <span className="text-emerald-400 font-bold">VERIFIED (100% Valid)</span>
              </div>
            </div>
          </div>

          {/* Pay-Per-Query (PPQ) */}
          <div className="bg-zinc-900/60 p-4 md:p-5 rounded-xl border border-white/5 space-y-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              Pay-Per-Query (PPQ) AI & Search Engine
            </h3>
            <div>
              <label className="text-[11px] text-zinc-400">Simulate Query:</label>
              <input
                type="text"
                value={ppqQuery}
                onChange={(e) => setPpqQuery(e.target.value)}
                className="w-full mt-1 bg-zinc-950 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-accent"
              />
            </div>

            {ppqDemo && (
              <div className="bg-zinc-950 p-3 rounded-lg border border-amber-500/20 text-xs space-y-1">
                <div className="font-bold text-amber-300">{ppqDemo.adPayload.title}</div>
                <div className="text-zinc-400 text-[11px]">{ppqDemo.adPayload.description}</div>
                <div className="text-[10px] font-mono text-emerald-400 pt-1">
                  Matched keyword: "{ppqDemo.keywordMatch}" @ 25 sats/query
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 5: Fedimint Ecash */}
      {activeTab === 'ecash' && (
        <div className="bg-zinc-900/60 p-5 rounded-xl border border-white/5 space-y-4 animate-fade-in">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Shield className="w-5 h-5 text-emerald-400" />
              Chaumian Ecash Blind Token Ad Voucher
            </h3>
            <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
              Give A Bit Mint v1
            </span>
          </div>

          <div className="bg-zinc-950 p-3.5 rounded-lg border border-white/5 space-y-2 font-mono text-xs">
            <div className="flex justify-between">
              <span className="text-zinc-400">Voucher ID:</span>
              <span className="text-white">{ecashDemo.voucherId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-400">Value (Sats):</span>
              <span className="text-emerald-400 font-bold">{ecashDemo.valueSats.toLocaleString()} sats</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-400">Redeemable Impressions:</span>
              <span className="text-purple-300">~{ecashDemo.redeemableImpressions.toLocaleString()} views</span>
            </div>
            <div>
              <span className="text-zinc-400">Ecash Note:</span>
              <div className="flex items-center justify-between bg-zinc-900 p-2 rounded mt-1 text-[10px] text-emerald-300 truncate">
                <span className="truncate">{ecashDemo.notes}</span>
                <button
                  onClick={() => handleCopy(ecashDemo.notes, 'ecash')}
                  className="p-1 text-zinc-400 hover:text-white ml-2"
                >
                  {copiedField === 'ecash' ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
