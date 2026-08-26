/**
 * Open API Key Rotation — Revoke/rotate keys via settings
 * 
 * Manages API keys for developer access to the Tadbuy API.
 * Supports key creation, rotation, expiration, and audit logging.
 * Each key gets a unique identifier and optional label.
 */

export interface ApiKey {
  id: string;
  label: string;
  createdAt: number;
  expiresAt: number;
  lastUsed: number;
  permissions: ('read' | 'write' | 'admin')[];
  ipWhitelist?: string[];
  rateLimitPerMinute: number;
  status: 'active' | 'revoked' | 'expired';
  prefixedKey: string; // Shows only first 8 chars, full key shown once on creation
}

export interface NewApiKeyRequest {
  label: string;
  permissions: ('read' | 'write' | 'admin')[];
  ipWhitelist?: string[];
  ttlHours: number; // Time-to-live in hours
}

export interface ApiKeyRotationResult {
  success: boolean;
  message: string;
  oldKeyId: string;
  newKeyId: string;
  newKey?: string; // Only shown once on initial creation
}

/** Generate a secure random API key (256 bits, base64url encoded) */
export function generateApiKey(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Buffer.from(array).toString('base64url');
}

/** Generate a key prefix for display (first 8 chars) */
export function getPrefix(key: string): string {
  return key.slice(0, 8) + '…' + key.slice(-4);
}

/** Check API key format and validity */
export function validateApiKey(key: string): boolean {
  // Base64url string of 43 characters = 32 bytes = 256 bits
  return typeof key === 'string' && key.length === 43 && /^[A-Za-z0-9_-]+$/.test(key);
}

/** Compare two timestamps for rotation timing */
export function shouldRotateKey(lastUsed: number, maxAgeHours: number = 24*30): boolean {
  return Date.now() - lastUsed > maxAgeHours * 3600 * 1000;
}

/** Mock database of API keys */
const mockKeys: ApiKey[] = [
  {
    id: 'key_001',
    label: 'Development API Key',
    createdAt: Date.now() - 14 * 24 * 3600 * 1000, // 14 days ago
    expiresAt: Date.now() + 10 * 24 * 3600 * 1000, // 10 days from now
    lastUsed: Date.now() - 6 * 3600 * 1000, // 6 hours ago
    permissions: ['read', 'write'],
    rateLimitPerMinute: 60,
    status: 'active',
    prefixedKey: 'abcd1234…XYZ9',
  },
  {
    id: 'key_002',
    label: 'Production Campaign API',
    createdAt: Date.now() - 5 * 24 * 3600 * 1000, // 5 days ago
    expiresAt: Date.now() + 25 * 24 * 3600 * 1000, // 25 days from now
    lastUsed: Date.now() - 30 * 60 * 1000, // 30 mins ago
    permissions: ['read'],
    ipWhitelist: ['10.0.0.0/8'],
    rateLimitPerMinute: 120,
    status: 'active',
    prefixedKey: 'efgh5678…ABC1',
  },
];

/** Mock API for key operations */
export class ApiKeyManager {
  private keys = mockKeys;

  listKeys(): ApiKey[] {
    return this.keys;
  }

  getByKeyId(keyId: string): ApiKey | undefined {
    return this.keys.find(k => k.id === keyId);
  }

  revokeKey(keyId: string): boolean {
    const key = this.keys.find(k => k.id === keyId);
    if (key) {
      key.status = 'revoked';
      return true;
    }
    return false;
  }

  rotateKey(keyId: string): ApiKeyRotationResult {
    const oldKey = this.keys.find(k => k.id === keyId);
    if (!oldKey) {
      return { success: false, message: 'Key not found', oldKeyId: keyId, newKeyId: '' };
    }

    // Generate new key
    const newKeyStr = generateApiKey();
    const newKey: ApiKey = {
      id: `key_${Date.now()}`,
      label: oldKey.label,
      createdAt: Date.now(),
      expiresAt: Date.now() + (30 * 24 * 3600 * 1000), // 30 days
      lastUsed: 0,
      permissions: [...oldKey.permissions],
      ipWhitelist: [...oldKey.ipWhitelist || []],
      rateLimitPerMinute: oldKey.rateLimitPerMinute,
      status: 'active',
      prefixedKey: getPrefix(newKeyStr),
    };

    // Deactivate old key
    oldKey.status = 'revoked';
    this.keys.push(newKey);

    return {
      success: true,
      message: 'Key rotated successfully. Save the new key now — it will not be shown again.',
      oldKeyId: keyId,
      newKeyId: newKey.id,
      newKey: newKeyStr, // Only shown once
    };
  }

  createKey(req: NewApiKeyRequest): { requestId: string; nextStep: 'verify_2fa' | 'auto_create' } {
    console.log('Creating new API key:', req);
    // In production: would require 2FA verification
    return {
      requestId: `req_${Date.now()}`,
      nextStep: 'verify_2fa',
    };
  }

  revokeAllExcept(idsToKeep: string[]): void {
    this.keys = this.keys.filter(k => !idsToKeep.includes(k.id));
  }
}