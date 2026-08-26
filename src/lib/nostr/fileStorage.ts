/**
 * Nostr NIP-96 File Storage — Host creative assets via Nostr file servers
 * 
 * NIP-96 allows storing and serving files (images, videos, JS) through
 * Nostr relay-based storage. Used for hosting campaign creatives.
 */

export interface NostrFile {
  id: string;
  url: string;
  size: number;
  sha256: string;
  type: string;
  dimensions: string;
  alt: string;
  uploadedBy: string;
  uploadedAt: number;
  views: number;
}

export interface Nip96UploadResponse {
  status: 'success' | 'error';
  message?: string;
  url?: string; // the file URL on the relay
}

/** Format file size */
export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  const units = ['KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes / 1024) / 1024);
  return `${(bytes / Math.pow(1024, i + 1)).toFixed(1)} ${units[i]}`;
}

/** Simulate NIP-96 upload */
export function uploadViaNip96(
  fileData: Blob,
  ownerPubkey: string,
  relayUrl: string
): Nip96UploadResponse {
  // In production, POST to relayUrl/.well-known/nostr/nip96 with file data
  const fileUrl = `${relayUrl}/${Math.random().toString(36).slice(2, 32)}`;
  
  return {
    status: 'success',
    message: 'Uploaded successfully',
    url: fileUrl,
  };
}

/** Mock creative assets */
export const MOCK_CREATIVES: NostrFile[] = [
  {
    id: 'file_001',
    url: 'https://nostr.build/i/abc123.jpg',
    size: 48234,
    sha256: 'mock_sha256_hash_abc123',
    type: 'image/jpeg',
    dimensions: '300x250',
    alt: 'Bitcoin wallet ad mockup',
    uploadedBy: 'npub1advertiser...',
    uploadedAt: Date.now() - 86400000,
    views: 12500,
  },
];