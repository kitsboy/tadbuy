import { useCallback, useState } from 'react'
import { ShieldCheck, FileCheck2, Handshake, Scale, CircleDashed, ExternalLink, Loader2 } from 'lucide-react'
import HowProofWorks from '@/components/trust/HowProofWorks'
import { verifyHash } from '@/lib/satohash'

/**
 * TrustProofMoments — Tadbuy's four "sealed to a block" proof moments.
 *
 * The four moments of a placement lifecycle, each of which is anchored to a
 * Bitcoin block with an OpenTimestamps proof:
 *
 *   listing  — the marketplace inventory record (who offered that slot, when)
 *   offer    — the advertiser's offer/placement request (what was proposed)
 *   order    — the accepted order (what was agreed)
 *   dispute  — the dispute record (what was contested, when it was raised)
 *
 * How it is honest:
 *   * Every verdict is resolved against the LIVE Satohash /api/verify API now.
 *   * A moment with no real proof yet renders "Not proven" (or "Waiting for
 *     Bitcoin" while a stamp confirms) — never an inflated verdict.
 *   * The verify method (own node `bitcoind` vs public explorer `esplora`) is
 *     shown whenever the API says verified.
 *   * Wherever a verdict appears, the `.ots` download link is present.
 *
 * In demo mode (no operating backend yet) the four moments carry placeholder
 * digests that are not anchored, so they resolve honestly as "Not proven".
 * The identical code path is what seals them the moment real proofs exist.
 */

const MOMENTS = [
  {
    id: 'listing',
    label: 'Listing',
    icon: ShieldCheck,
    description: 'The inventory record — who offered this slot, and when it was listed. Sealed so the listing itself is anchored.',
    hash: '70c53f41a238ac1c9d17f2f9145afeaaf538c57e17348f47d43fdfefb61fbce7',
  },
  {
    id: 'offer',
    label: 'Offer',
    icon: Handshake,
    description: "The advertiser's offer — what was proposed, at what budget, at that point in time.",
    hash: '3cc900a151ef44340e471ae809acf8f96e50adae19c8be790c2f9f8ebd4b3316',
  },
  {
    id: 'order',
    label: 'Order',
    icon: FileCheck2,
    description: 'The accepted order — what was agreed, by whom. Sealed so an order cannot be silently changed.',
    hash: '50b7c8f8a3e0c2e9eb5824687266d998aee1582277598063ed03894cbb015caf',
  },
  {
    id: 'dispute',
    label: 'Dispute',
    icon: Scale,
    description: "The dispute record — what was contested, and when it was raised. Sealed so both sides share one timeline.",
    hash: 'f6035ce4e4a61c1af78a972f201825a7aef244720949cd73189d6f7b161eb14e',
  },
]

/** Derive the honest HowProofWorks state from a verify result. Never soften. */
function stateFromVerify(result) {
  if (!result) return 'pending'
  if (result.verified === true) return 'confirmed'
  // A successfully-resolved but unanchored/forged hash is simply "Not proven".
  // A network/API failure differs: we cannot check it, so "not-proven" is the
  // honest label — never pretend it is awaiting confirmation.
  return 'not-proven'
}

function MomentCard({ moment }) {
  const [result, setResult] = useState(null)
  const [busy, setBusy] = useState(false)
  const [checked, setChecked] = useState(false)
  const Icon = moment.icon

  const check = useCallback(async () => {
    setBusy(true)
    setChecked(true)
    try {
      setResult(await verifyHash(moment.hash))
    } finally {
      setBusy(false)
    }
  }, [moment.hash])

  return (
    <div className="trust-proof-surface rounded-2xl border border-border/80 bg-surface/50 p-4 sm:p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-accent/25 bg-accent/10 text-accent">
            <Icon className="h-4.5 w-4.5" />
          </span>
          <div className="min-w-0">
            <p className="text-[10px] font-black uppercase tracking-widest text-muted">Proof moment</p>
            <h4 className="text-sm font-extrabold leading-tight">{moment.label}</h4>
          </div>
        </div>
        {checked && !busy ? (
          <span className="shrink-0">
            <p className="text-[10px] font-black uppercase tracking-widest text-muted">Status</p>
            <p className="text-xs font-extrabold">
              {result && result.verified === true
                ? <span className="text-green">Verified</span>
                : result ? <span className="text-red">Not proven</span>
                  : <span className="text-muted">Unchecked</span>}
            </p>
          </span>
        ) : null}
      </div>

      <p className="mt-3 text-xs leading-relaxed text-muted">{moment.description}</p>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={check}
          disabled={busy}
          data-testid={`proof-check-${moment.id}`}
          className="inline-flex min-h-[36px] items-center gap-2 rounded-full border border-accent/40 bg-accent/10 px-3.5 text-[11px] font-black uppercase tracking-wider text-accent transition-all hover:border-accent/70 hover:bg-accent/15 disabled:opacity-60"
        >
          {busy ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <CircleDashed className="h-3.5 w-3.5" />}
          {busy ? 'Checking Bitcoin…' : 'Check on Bitcoin'}
        </button>
        <code className="hidden sm:inline-block max-w-[240px] truncate rounded-lg border border-border bg-black/20 px-2 py-1 font-mono text-[10px] text-muted">
          {moment.hash}
        </code>
      </div>

      {checked ? (
        <div className="mt-3">
          <HowProofWorks
            verdict={result?.data ? { ...result.data, verified: result.verified, verified_method: result.verified_method, bitcoin_block_height: result.bitcoin_block_height, explainer: result.explainer } : null}
            state={stateFromVerify(result)}
            hash={moment.hash}
            otsUrl={result?.ots_download_url || undefined}
            variant="full"
          />
        </div>
      ) : null}
    </div>
  )
}

export function TrustProofMoments() {
  return (
    <section aria-label="Proof of trust — moments sealed to a Bitcoin block" className="space-y-3">
      <div className="flex items-center gap-2">
        <ShieldCheck className="h-4 w-4 text-accent" />
        <h3 className="text-sm font-extrabold">Sealed to a Bitcoin block</h3>
        <span className="text-[10px] font-black uppercase tracking-widest text-muted">· four proof moments</span>
      </div>
      <p className="text-xs leading-relaxed text-muted max-w-3xl">
        Listing, offer, order, and dispute — each is anchored to a Bitcoin block with an OpenTimestamps proof,
        so the timeline cannot be rewritten. Every verdict here is resolved live against a real Bitcoin node.
        In demo mode these digests are not yet anchored, so they honestly read “Not proven” — the same code
        seals them the moment a real proof exists.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {MOMENTS.map(moment => (
          <MomentCard key={moment.id} moment={moment} />
        ))}
      </div>
      <p className="flex items-center gap-1.5 text-[10px] text-muted">
        <ExternalLink className="h-3 w-3" />
        Proofs resolve against the public Satohash verify API (api.satohash.io). Your own copy always proves without it.
      </p>
    </section>
  )
}