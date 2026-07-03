# tadbuy — Context Map

## Stack
| Layer | Technology |
|-------|-----------|
| Frontend | React |
| Styling | Tailwind CSS |
| Backend | Firebase / Firestore |
| Payments | Lightning Network |
| Identity | Nostr Zaps |

## Ports
| Service | Port |
|---------|------|
| Dev server | 5173 |
| Firebase | Cloud-hosted |

## Key Architecture
- Bitcoin-native advertising DSP (Demand-Side Platform)
- Lightning Network for ad micropayments
- Nostr Zaps integration for creator payouts
- Multi-platform ad buying (web, Nostr, Lightning)
- Privacy-first: no user tracking, no surveillance
- Zero KYC: no registration data stored

## External Services
| Service | Purpose |
|---------|---------|
| Firebase/Firestore | Ad data, campaign storage |
| Lightning Network | Ad payment settlement |

## Hosting
Cloudflare Pages — manual deploy from M4
Custom domain: tadbuy.giveabit.io
