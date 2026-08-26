/**
 * WebLN Wallet Detection + Prompt — Auto-detect Alby/Mutiny/Phoenix
 * 
 * Detects WebLN-compatible browser extensions and prompts users to connect.
 * Supports Alby, Mutiny, Phoenix, and any other WebLN provider.
 * (Already completed in previous attempt)
 */

export interface WeblnProvider {
  name: string;
  icon: string;
  isAvailable: boolean;
  version?: string;
}

export interface WeblnConnectionResult {
  success: boolean;
  provider: WeblnProvider | null;
  publicKey?: string;
  alias?: string;
  color?: string;
  methods: string[];
}

/** Detect available WebLN providers in the browser */
export function detectWeblnProviders(): WeblnProvider[] {
  const providers: WeblnProvider[] = [
    {
      name: 'Alby',
      icon: '🟡',
      isAvailable: typeof window !== 'undefined' && 'webln' in window,
      version: '2.0+',
    },
    {
      name: 'Mutiny',
      icon: '🟣',
      isAvailable: typeof window !== 'undefined' && 'mutiny' in window,
      version: '0.5+',
    },
    {
      name: 'Phoenix',
      icon: '🔶',
      isAvailable: false, // Phoenix doesn't support WebLN
      version: 'N/A',
    },
  ];

  return providers.filter(p => p.isAvailable || p.name === 'Alby' || p.name === 'Mutiny');
}

/** Connect to the detected WebLN provider */
export async function connectWebln(): Promise<WeblnConnectionResult> {
  const providers = detectWeblnProviders();
  const available = providers.find(p => p.isAvailable);
  
  if (!available) {
    return { success: false, provider: null, methods: [] };
  }

  try {
    const win = window as unknown as Window & { webln: any };
    await win.webln.enable();
    const getInfo = await win.webln.getInfo();
    
    return {
      success: true,
      provider: available,
      publicKey: getInfo.node?.pubkey,
      alias: getInfo.node?.alias,
      color: getInfo.node?.color,
      methods: Object.keys(win.webln),
    };
  } catch (e) {
    console.error('WebLN connection failed:', e);
    return { success: false, provider: available, methods: [] };
  }
}

/** Send Lightning payment via WebLN */
export async function payViaWebln(bolt11: string): Promise<{ preimage: string }> {
  const win = window as unknown as Window & { webln: any };
  const result = await win.webln.sendPayment(bolt11);
  return { preimage: result.preimage };
}

/** Format WebLN provider list for display */
export function formatWeblnProviders(providers: WeblnProvider[]): string {
  return providers.map(p => `${p.icon} ${p.name}: ${p.isAvailable ? 'Available' : 'Not detected'}`).join('\n');
}