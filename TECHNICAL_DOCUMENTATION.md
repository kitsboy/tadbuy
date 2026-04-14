# Tadbuy Technical Documentation

## Overview
Tadbuy is a decentralized demand-side platform (DSP) for Bitcoin-native advertising. It abstracts cross-platform marketing complexity using Bitcoin, Lightning, and AI.

## Tech Stack
- **Frontend:** React 19, Vite, Tailwind CSS, Motion (framer-motion), Lucide React
- **Backend:** Node.js, Express, TypeScript
- **Database:** Firestore (NoSQL)
- **Payments:** Lightning Network (ln-service, BOLT 12)
- **AI/ML:** Gemini API, PPQ.AI (Proprietary edge-based Federated Learning)
- **Infrastructure:** Cloud Run (Containerized)

## Core Architecture
- **Repository Pattern:** Decouples business logic from database implementation for swappability.
- **Serverless API:** Express-based backend for handling sensitive operations (payments, API key management).
- **Edge AI:** PPQ.AI runs quantized models on publisher nodes to ensure user privacy.

## Implementation Status (20-Point Roadmap)
1. [x] Setup secure backend (Express/Node.js)
2. [x] Configure Firestore database (Repository pattern)
3. [x] Develop campaign creation API (Backend)
4. [x] Implement user authentication (Firebase Auth)
5. [x] Develop campaign management dashboard
6. [x] Implement BOLT 12 Offer generation
7. [x] Implement Lightning invoice generation
8. [x] Setup payment webhook listeners
9. [x] Develop settlement logic
10. [x] Integrate Gemini API for ad creative
11. [x] Implement In-app Lightning Wallet
12. [ ] Implement PPQ.AI optimization logic
13. [ ] Create publisher portal
14. [ ] Implement ad slot bidding/auction logic
15. [ ] Connect frontend forms to API
16. [ ] Implement real-time metrics updates
17. [ ] Finalize and deploy firestore.rules
18. [x] Implement error handling/logging
19. [ ] Set up Production Monitoring (Sentry)
20. [x] Enforce server-side Environment Variable management
21. [ ] Load/Security testing

## Agent API (For AI Agents)
The Tadbuy platform provides a secure API for AI agents (e.g., Nostr agents) to interact with the platform.
- **Authentication**: Requires `x-agent-api-key` header with a valid API key.
- **Base URL**: `/api/agent`
- **Endpoints**:
  - `POST /api/agent/campaigns`: Create a campaign.
  - `GET /api/agent/metrics`: Fetch real-time performance metrics.
  - `POST /api/agent/topup`: Trigger a Lightning payment to top up a campaign.

### Targeting Capabilities
The platform supports granular targeting, including:
- Interest-based targeting
- Age range
- Sex (All, Male, Female)
- Geographic (Country/State/City)
- Language
- Device/Network
- Socio-economic (Education, Income, Behaviors, Industries)

### Future Path: Agent Admin Control
To grant an agent (e.g., `kimi@giveabit.io`) administrative control, we will:
1. Update `AGENT_API_KEYS` environment variable to a JSON object mapping keys to roles: `{"key": "admin"}`.
2. Use `agentAuthMiddleware('admin')` in the router for privileged endpoints.
3. Implement new `/api/admin` routes for site-wide management.

## Hardening Improvements
To ensure platform security and reliability, the following hardening measures have been implemented:
- **Input Validation**: All API endpoints now use `Joi` schema validation to prevent malformed data and injection attacks.
- **Centralized Error Handling**: A global error handling middleware has been implemented to capture and log errors, preventing sensitive information leakage.
- **Role-Based Access Control (RBAC)**: The Agent API now supports role-based access, allowing us to distinguish between `agent` and `admin` roles.
- **Atomic Transactions**: Critical Firestore operations (create, update) now use atomic transactions to guarantee data consistency and prevent race conditions.
- **Real-Time Metrics**: The dashboard now implements polling (every 5 seconds) to fetch and display real-time ad performance metrics from the backend.
- **Centralized Error Logging**: A new `/api/logs` endpoint allows client-side errors to be captured and logged on the server, facilitating easier debugging and future integration with Sentry.
