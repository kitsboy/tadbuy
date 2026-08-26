/**
 * Lightning SMS Gateway — Send/receive Lightning via SMS
 * 
 * Enables Lightning payments via USSD/SMS for feature phone users
 * in emerging markets without smartphone access.
 */

export interface SmsPaymentRequest {
  requestId: string;
  phoneNumber: string;
  amountSats: number;
  message: string; // USSD command
  status: 'pending' | 'sent' | 'delivered' | 'failed' | 'expired';
  createdAt: number;
  expiresAt: number;
  lightningInvoice?: string;
  paymentHash?: string;
}

export interface SmsGatewayProvider {
  id: string;
  name: string;
  apiUrl: string;
  supportedCountries: string[];
  costPerSms: number; // in sats
  requiresRegistration: boolean;
}

/** Format phone number for SMS gateway */
export function formatPhoneNumber(phone: string): string {
  // Remove non-digits and add + if missing
  const digits = phone.replace(/\D/g, '');
  return digits.startsWith('+') ? digits : `+${digits}`;
}

/** Create SMS payment request */
export function createSmsPaymentRequest(
  phoneNumber: string,
  amountSats: number,
  message: string = 'LIGHTNING'
): SmsPaymentRequest {
  return {
    requestId: `sms_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    phoneNumber: formatPhoneNumber(phoneNumber),
    amountSats,
    message,
    status: 'pending',
    createdAt: Date.now(),
    expiresAt: Date.now() + 300000, // 5 minutes
  };
}

/** Mock SMS providers */
export const MOCK_SMS_PROVIDERS: SmsGatewayProvider[] = [
  {
    id: 'provider_001',
    name: 'Twilio',
    apiUrl: 'https://api.twilio.com/2010-04-01/Accounts',
    supportedCountries: ['US', 'CA', 'GB', 'DE', 'FR'],
    costPerSms: 10,
    requiresRegistration: true,
  },
  {
    id: 'provider_002',
    name: 'Africa's Talking',
    apiUrl: 'https://api.africastalking.com/version1',
    supportedCountries: ['KE', 'UG', 'TZ', 'RW', 'NG'],
    costPerSms: 5,
    requiresRegistration: false,
  },
];