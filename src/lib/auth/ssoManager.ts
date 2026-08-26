/**
 * SSO with Google/GitHub/Nostr — One-click login
 * 
 * Handles authentication flows for:
 * - Google OAuth 2.0
 * - GitHub OAuth 2.0
 * - Nostr NIP-07 (browser extension) / NIP-98 (HTTP auth)
 * 
 * Returns a unified user session object with provider info.
 */

export type AuthProvider = 'google' | 'github' | 'nostr' | 'nip98' | 'email';

export interface AuthUser {
  id: string;
  provider: AuthProvider;
  providerId: string;
  email?: string;
  name?: string;
  picture?: string;
  pubkey?: string; // for Nostr
  lightningAddress?: string; // lud-16
  accessToken?: string; // provider-specific
  refreshToken?: string;
  createdAt: number;
  lastLoginAt: number;
  roles: ('user' | 'advertiser' | 'publisher' | 'admin')[];
}

/** Google OAuth configuration */
export const GOOGLE_OAUTH_CONFIG = {
  clientId: import.meta.env.VITE_GOOGLE_CLIENT_ID || 'dev-google-client-id',
  redirectUri: `${window.location.origin}/auth/google/callback`,
  scope: 'openid email profile',
  authUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
};

/** GitHub OAuth configuration */
export const GITHUB_OAUTH_CONFIG = {
  clientId: import.meta.env.VITE_GITHUB_CLIENT_ID || 'dev-github-client-id',
  redirectUri: `${window.location.origin}/auth/github/callback`,
  scope: 'read:user user:email',
  authUrl: 'https://github.com/login/oauth/authorize',
};

/** Generate OAuth authorization URL */
export function generateOAuthUrl(provider: 'google' | 'github'): string {
  const config = provider === 'google' ? GOOGLE_OAUTH_CONFIG : GITHUB_OAUTH_CONFIG;
  const params = new URLSearchParams({
    client_id: config.clientId,
    redirect_uri: config.redirectUri,
    scope: config.scope,
    response_type: 'code',
    state: crypto.randomUUID(),
    access_type: 'offline',
    prompt: 'consent',
  });
  return `${config.authUrl}?${params.toString()}`;
}

/** Simulate Nostr NIP-07 browser extension login */
export async function loginWithNostr(): Promise<AuthUser | null> {
  // Check for Nostr extension (Alby, nos2x, etc.)
  const windowWithNostr = window as Window & { nostr?: any };
  
  if (!windowWithNostr.nostr) {
    throw new Error('No Nostr extension detected. Install Alby, nos2x, or Amber.');
  }

  try {
    // Get public key via NIP-07
    const pubkey = await windowWithNostr.nostr.getPublicKey();
    
    return {
      id: `nostr_${pubkey.slice(0, 16)}`,
      provider: 'nostr',
      providerId: pubkey,
      pubkey,
      name: `Nostr User ${pubkey.slice(0, 8)}`,
      picture: `https://api.dicebear.com/7.x/avataaars/svg?seed=${pubkey}`,
      createdAt: Date.now(),
      lastLoginAt: Date.now(),
      roles: ['user'],
    };
  } catch (e) {
    throw new Error(`Nostr login failed: ${e}`);
  }
}

/** Simulate NIP-98 HTTP authentication */
export function verifyNip98Auth(authHeader: string): { valid: boolean; pubkey?: string } {
  // Real implementation would verify Nostr event signature
  // NIP-98: Authorization: Nostr <base64_event>
  if (!authHeader.startsWith('Nostr ')) return { valid: false };
  
  // For demo, accept any valid-looking auth header
  return { valid: true, pubkey: `npub1${Math.random().toString(36).slice(2, 58)}` };
}

/** Unified logout across all providers */
export async function logoutAll(): Promise<void> {
  // In production, this would call provider-specific logout endpoints
  console.log('Logging out from all providers...');
  // Clear local storage, cookies, etc.
}

/** Mock user for demo */
export const MOCK_AUTH_USER: AuthUser = {
  id: 'mock_user_123',
  provider: 'nostr',
  providerId: 'npub1abcdefghijklmnopqrstuvwxyz1234567890',
  pubkey: 'npub1abcdefghijklmnopqrstuvwxyz1234567890',
  name: 'Bitcoin Advertiser',
  picture: 'https://api.dicebear.com/7.x/avataaars/svg?seed=bitcoinadvertiser',
  lightningAddress: 'advertiser@getalby.com',
  createdAt: Date.now() - 86400000 * 30,
  lastLoginAt: Date.now(),
  roles: ['user', 'advertiser'],
};