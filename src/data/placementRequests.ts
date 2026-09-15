import type { MarketplaceSlot } from '@/data/marketplaceSlots';

export const PLACEMENT_REQUESTS_KEY = 'tadbuy:placement_requests';

export type PlacementStatus =
  | 'offered'
  | 'accepted'
  | 'declined'
  | 'published'
  | 'proof_submitted'
  | 'verified';

export interface PlacementProof {
  url: string;
  screenshotRef: string;
  publishedAt: string;
  notes: string;
  disclosureConfirmed: boolean;
}

export interface PlacementRequest {
  id: string;
  slotId: string;
  slotName: string;
  publisher: string;
  channel: string;
  format: string;
  audience: string;
  budgetSats: number;
  advertiserLabel: string;
  advertiserId?: string;
  message: string;
  disclosureRequired: boolean;
  proofRequirements: string[];
  status: PlacementStatus;
  createdAt: string;
  acceptedAt?: string;
  publishedAt?: string;
  proof?: PlacementProof;
  /** Present when this request is backed by the durable vendor marketplace. */
  durable?: boolean;
  vendorId?: string;
  inventoryId?: string;
}

export const PLACEMENT_STATUS_ORDER: PlacementStatus[] = [
  'offered',
  'accepted',
  'published',
  'proof_submitted',
  'verified',
];

export const PLACEMENT_STATUS_LABELS: Record<PlacementStatus, string> = {
  offered: 'Offered',
  accepted: 'Accepted',
  declined: 'Declined',
  published: 'Published',
  proof_submitted: 'Proof submitted',
  verified: 'Verified',
};

export const PLACEMENT_STATUS_HELP: Record<PlacementStatus, string> = {
  offered: 'Waiting for the vendor to review the request.',
  accepted: 'The vendor accepted the placement request.',
  declined: 'The vendor declined this placement request.',
  published: 'The vendor reports that the placement was published.',
  proof_submitted: 'Evidence was submitted and is ready for review.',
  verified: 'Tadbuy has a reviewable proof record; this is not an audience metric.',
};

export function placementProofRequirements(channel: string): string[] {
  const normalized = channel.toLowerCase();
  if (normalized.includes('podcast')) {
    return ['Episode URL', 'Timestamp', 'Vendor delivery note'];
  }
  if (normalized.includes('newsletter')) {
    return ['Issue URL or screenshot', 'Send date', 'Vendor delivery note'];
  }
  if (normalized.includes('nostr')) {
    return ['Published event URL or ID', 'Publication date', 'Vendor delivery note'];
  }
  return ['Published URL', 'Placement screenshot', 'Publication date'];
}

function requestId(): string {
  const suffix = typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID().slice(0, 8)
    : Math.random().toString(36).slice(2, 10);
  return `plr_${Date.now().toString(36)}_${suffix}`;
}

export function createPlacementRequest(input: {
  slot: MarketplaceSlot;
  advertiserLabel: string;
  budgetSats: number;
  message: string;
}): PlacementRequest {
  const channel = input.slot.platformType || input.slot.category;
  return {
    id: requestId(),
    slotId: input.slot.id,
    slotName: input.slot.name,
    publisher: input.slot.publisher,
    channel,
    format: input.slot.format,
    audience: input.slot.audience,
    budgetSats: Math.max(0, Math.floor(input.budgetSats)),
    advertiserLabel: input.advertiserLabel.trim() || 'Anonymous advertiser',
    message: input.message.trim(),
    disclosureRequired: true,
    proofRequirements: placementProofRequirements(channel),
    status: 'offered',
    createdAt: new Date().toISOString(),
    ...(input.slot.durable ? { durable: true, vendorId: input.slot.vendorId, inventoryId: input.slot.inventoryId ?? input.slot.id } : {}),
  };
}

export function nextPlacementStatus(
  request: PlacementRequest,
  status: PlacementStatus,
  proof?: PlacementProof
): PlacementRequest {
  const updated: PlacementRequest = { ...request, status };
  if (status === 'accepted') updated.acceptedAt = new Date().toISOString();
  if (status === 'published') updated.publishedAt = new Date().toISOString();
  if (status === 'proof_submitted' && proof) updated.proof = proof;
  return updated;
}

export function canAdvancePlacement(request: PlacementRequest, status: PlacementStatus): boolean {
  if (status === 'declined') return request.status === 'offered';
  const currentIndex = PLACEMENT_STATUS_ORDER.indexOf(request.status);
  const nextIndex = PLACEMENT_STATUS_ORDER.indexOf(status);
  return currentIndex >= 0 && nextIndex === currentIndex + 1;
}
