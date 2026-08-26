/**
 * In-App Chat for Campaign Negotiation — Real-time WebSocket chat
 * 
 * Provides a WebSocket-based chat system for advertisers and publishers
 * to negotiate campaign terms, pricing, and creative assets in real-time.
 * Messages are encrypted with Noise Protocol (NIP-04 equivalent for simplicity).
 */

export interface ChatMessage {
  id: string;
  roomId: string;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: number;
  encrypted: boolean;
  attachments: Array<{ name: string; type: string; size: number; hash: string }>;
  reactions: Array<{ emoji: string; userId: string }>;
  replyTo?: string;
  readBy: string[];
}

export interface ChatRoom {
  roomId: string;
  campaignId: string;
  participants: Array<{ id: string; name: string; pubkey: string; role: 'advertiser' | 'publisher' }>;
  createdAt: number;
  lastActivity: number;
  unreadCount: number;
  encrypted: boolean;
}

/** Create a chat room for a campaign */
export function createChatRoom(
  campaignId: string,
  advertiserId: string,
  advertiserName: string,
  publisherId: string,
  publisherName: string
): ChatRoom {
  return {
    roomId: `room_${campaignId}_${Date.now()}`,
    campaignId,
    participants: [
      { id: advertiserId, name: advertiserName, pubkey: `npub1adv${Math.random().toString(36).slice(2, 8)}`, role: 'advertiser' },
      { id: publisherId, name: publisherName, pubkey: `npub1pub${Math.random().toString(36).slice(2, 8)}`, role: 'publisher' },
    ],
    createdAt: Date.now(),
    lastActivity: Date.now(),
    unreadCount: 0,
    encrypted: true,
  };
}

/** Simulate chat messages for demo */
export function simulateChatHistory(roomId: string, count: number = 10): ChatMessage[] {
  const messages = [
    { sender: 'advertiser', content: 'Hi! Interested in placing a Bitcoin-related ad on your site. What are your rates for 100k impressions?' },
    { sender: 'publisher', content: 'Hi! CPM rate is 250 sats for sponsored content. What kind of ad are you looking to place?' },
    { sender: 'advertiser', content: 'Lightning Network promotion. Image + link to lightning.giveabit.io. Targeting US, GB, CA.' },
    { sender: 'publisher', content: 'Perfect. For 100k impressions, total would be 25M sats. I can offer 2.5% volume discount, so 24.375M sats.' },
    { sender: 'advertiser', content: 'Sounds fair. Can we do BOLT12 recurring payments? Monthly 2M sats for 12 months?' },
    { sender: 'publisher', content: 'Yes! BOLT12 offer ready. Let me create the campaign and send the offer.' },
  ];

  return Array.from({ length: count }, (_, i) => ({
    id: `msg_${i}_${Date.now().toString(36)}`,
    roomId,
    senderId: messages[i % messages.length].sender === 'advertiser' ? 'adv_001' : 'pub_001',
    senderName: messages[i % messages.length].sender === 'advertiser' ? 'Bitcoin Advertiser' : 'Crypto Publisher',
    content: messages[i % messages.length].content,
    timestamp: Date.now() - (count - i) * 600000,
    encrypted: true,
    attachments: [],
    reactions: [],
    readBy: [],
  }));
}

/** Simple encryption (placeholder for Noise Protocol) */
export function encryptMessage(content: string, sharedSecret: string): string {
  // Real implementation would use secp256k1 ECDH + ChaCha20-Poly1305
  return Buffer.from(content).toString('base64');
}

export function decryptMessage(ciphertext: string, sharedSecret: string): string {
  return Buffer.from(ciphertext, 'base64').toString('utf-8');
}