/**
 * NIP-01 Geolocation Relay — Publish location via Nostr
 * 
 * Implements NIP-01 (Basic channel) for geolocation events (kind 0).
 * Allows users to share their location via Nostr profiles which
 * enables geo-targeted ad campaigns and proximity-based bidding.
 */

import { nip19 } from 'nostr-tools';

export interface GeoLocationEvent {
  kind: 0; // NIP-01 metadata
  pubkey: string;
  content: string; // NIP-01 profile JSON
  tags: [['location', string, string?]]; // [latitude, longitude, optional place name]
  created_at: number;
  sig: string;
}

/** Convert coordinates to Nostr geotag format */
export function createGeoTag(lat: number, lng: number, placeName?: string): [string, string, string?] {
  return ['location', `${lat},${lng}`, placeName ?? undefined];
}

/** Generate a NIP-01 profile with location */
export function createGeolocationProfile(
  pubkey: string,
  lat: number,
  lng: number,
  placeName: string,
  displayName?: string,
  about?: string,
  picture?: string
): GeoLocationEvent {
  const profile = {
    name: displayName || `User_${pubkey.slice(0, 8)}`,
    about: about || `Bitcoin advertiser near ${placeName}`,
    picture: picture || '',
    naddr: `note1...${pubkey.slice(-8)}`, // simplified
    lud16: `${pubkey}@wallet.example.com`, // Lightning address placeholder
  };

  return {
    kind: 0,
    pubkey,
    content: JSON.stringify(profile),
    tags: [["location", `${lat},${lng}`, placeName]],
    created_at: Math.floor(Date.now() / 1000),
    sig: 'placeholder_sig_needs_real_signature', // would be signed with private key
  };
}

/** Parse location from NIP-01 event tags */
export function extractLocation(event: GeoLocationEvent): { lat: number; lng: number; placeName?: string } | null {
  const locationTag = event.tags.find(([k]) => k === 'location');
  if (!locationTag) return null;
  
  const [, coordString, placeName] = locationTag;
  const [latStr, lngStr] = coordString.split(',');
  
  return {
    lat: parseFloat(latStr),
    lng: parseFloat(lngStr),
    placeName: placeName ?? undefined,
  };
}

/** Calculate distance between two points (Haversine formula) */
export function haversineDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371e3; // Earth radius in meters
  const φ1 = lat1 * Math.PI / 180;
  const φ2 = lat2 * Math.PI / 180;
  const Δφ = (lat2 - lat1) * Math.PI / 180;
  const Δλ = (lon2 - lon1) * Math.PI / 180;

  const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ/2) * Math.sin(Δλ/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

  return R * c; // distance in meters
}

/** Check if user is within campaign geo-target */
export function isWithinGeoTarget(
  userLat: number,
  userLng: number,
  targetLat: number,
  targetLng: number,
  radiusKm: number
): boolean {
  const distanceM = haversineDistance(userLat, userLng, targetLat, targetLng);
  return distanceM <= radiusKm * 1000;
}

/** Mock geolocation events for nearby advertisers */
export const MOCK_GEO_EVENTS: GeoLocationEvent[] = [
  createGeolocationProfile(
    'npub1advertiser1aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaam45vyaz',
    37.7749, -122.4194, 'San Francisco, CA',
    'BitcoinMaxi_SF',
    'Bitcoin advertiser targeting SF tech workers',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150'
  ),
  createGeolocationProfile(
    'npub1advertiser2bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb3kx6tz',
    40.7128, -74.0060, 'New York, NY',
    'WallStreetSatoshi',
    'Lightning Network expert in NYC',
    'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150'
  ),
];