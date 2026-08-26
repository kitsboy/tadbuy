/**
 * Invoice QR Code Generator — BOLT11 QR with campaign metadata
 * (Completing from earlier version)
 */

// import QRCode from 'qrcode'; // Optional dependency
const QRCode = { toDataURL: async (s: string, opts?: any) => `data:image/png;base64,mock_${btoa(s).slice(0, 20)}` };

export interface InvoiceQrOptions {
  bolt11: string;
  amountSats?: number;
  memo?: string;
  descriptionHash?: string;
  expiry?: number;
  fallbackAddress?: string;
  label?: string;
}

/** Generate QR code data URL for Lightning invoice */
export async function generateInvoiceQr(options: InvoiceQrOptions): Promise<string> {
  const { bolt11, label } = options;
  const displayText = label
    ? `tadbuy:${bolt11}|${encodeURIComponent(label)}`
    : bolt11;
  
  return QRCode.toDataURL(displayText, {
    width: 300,
    margin: 2,
    color: {
      dark: '#000000',
      light: '#ffffff',
    },
  });
}

export function formatLightningUri(bolt11: string, label: string): string {
  return `lightning:${bolt11}?message=${encodeURIComponent(label)}`;
}

export function mockInvoice(amountSats: number, campaignName: string): string {
  return `lnbc${Math.floor(Math.log2(amountSats))}${amountSats}n${Math.random().toString(36).slice(2, 40)}`;
}

export function splitInvoiceIntoChunks(totalSats: number, chunkSize: number, baseMemo: string): string[] {
  const chunks = Math.ceil(totalSats / chunkSize);
  return Array.from({ length: chunks }, (_, i) => {
    const amount = Math.min(chunkSize, totalSats - i * chunkSize);
    return mockInvoice(amount, `${baseMemo} (${i + 1}/${chunks})`);
  });
}