import { FileCheck2, Handshake, ShieldCheck, Scale } from 'lucide-react'

const MOMENTS = [
  { label: 'Listing', icon: ShieldCheck, description: 'Record what a publisher offers and when it was listed.' },
  { label: 'Offer', icon: Handshake, description: 'Keep a dated record of the proposed placement and budget.' },
  { label: 'Delivery', icon: FileCheck2, description: 'Attach a publication reference for human review.' },
  { label: 'Dispute', icon: Scale, description: 'Preserve a shared timeline if a placement is contested.' },
]

export function TrustProofMoments() {
  return (
    <section aria-label="Proof and recordkeeping roadmap" className="space-y-3">
      <div className="flex items-center gap-2">
        <ShieldCheck className="h-4 w-4 text-accent" />
        <h3 className="text-sm font-extrabold">Proof and recordkeeping · planned</h3>
        <span className="text-[10px] font-black uppercase tracking-widest text-muted">· no records anchored in this preview</span>
      </div>
      <p className="max-w-3xl text-xs leading-relaxed text-muted">
        These are workflow concepts, not existing Bitcoin proofs. No listing, offer, delivery, or dispute record on this page is sealed to a block or independently verified. A publication reference can document delivery; it does not prove audience, payment, or campaign performance.
      </p>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {MOMENTS.map(({ label, icon: Icon, description }) => (
          <div key={label} className="rounded-2xl border border-border/80 bg-surface/50 p-4">
            <div className="flex items-center gap-2 text-sm font-extrabold">
              <Icon className="h-4 w-4 text-accent" /> {label}
              <span className="ml-auto rounded-full border border-border px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-muted">Concept</span>
            </div>
            <p className="mt-2 text-xs leading-relaxed text-muted">{description}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
