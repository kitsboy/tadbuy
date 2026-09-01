# 🔬 COMPREHENSIVE RESEARCH PROMPT FOR GEMINI

**Project:** Tadbuy Social Media Integration Strategy & Bitcoin-ization
**Prepared for:** Gemini Deep Research
**Date:** 2026-09-01
**Project Owner:** Cam (Give A Bit / Tadbuy)
**Current Version:** v5.0.145 (live at https://tadbuy.giveabit.io)

**Geographic Strategy:** See `docs/GEOGRAPHIC-STRATEGY.md` for Phase 1 launch targets
**Phase 1 Targets:** US, Japan, Germany, Netherlands, Portugal, Singapore, El Salvador, Argentina
**TikTok Status:** ❌ AVOID — Chinese ownership, crypto content restrictions

---

## 🎯 MISSION STATEMENT

Tadbuy is a **Bitcoin-native advertising platform** where advertisers buy ad space with Bitcoin (Lightning, BOLT12, on-chain, or Nostr Zaps) and creators earn in sats. We're researching how to **seamlessly integrate social media** (Twitter/X, Facebook, Nostr, and potentially others) to:

1. **Acquire users** who are already active on these platforms
2. **Distribute content** automatically across our social presence
3. **Enable social login** so users don't need yet another password
4. **Allow social sharing** of campaigns and earnings
5. **Create a social layer** that rewards users in Bitcoin for engagement
6. **Build a social network effect** around Bitcoin-native advertising

We want to **Bitcoin-ize the entire user flow** while making social integration feel **seamless and native**.

---

## 🌍 SCOPE OF RESEARCH

We need you to research **EVERYTHING** related to social media integration for a Bitcoin-native platform. This includes:

### **Platform-Specific Deep Dives**

For **EACH** of these platforms, provide:
- API capabilities and limitations
- Authentication methods
- Cost structures
- Corporate account requirements
- Bitcoin/crypto content policies
- Developer experience
- Integration complexity
- User experience implications

**Platforms to research:**

#### **1. Twitter/X**
- Current API pricing tiers (Free, Basic, Pro, Enterprise)
- Authentication: OAuth 2.0, OAuth 1.0a, API keys
- Posting capabilities: text, images, video, threads
- Analytics API access
- Webhook support
- Rate limits
- **CRITICAL:** Bitcoin/crypto advertising policy on X
- **CRITICAL:** Can we run a "Grok Bot" that auto-responds to Bitcoin-related queries?
- **CRITICAL:** Integration with Grok AI for automated content generation
- Account verification requirements (Blue check, Gold, etc.)
- Developer portal access
- Costs for posting, reading, analytics

#### **2. Facebook/Meta**
- Meta Business Suite requirements
- Facebook Pages API
- Instagram Graph API (related)
- WhatsApp Business API (if relevant)
- Authentication: Facebook Login, OAuth
- Posting capabilities
- Advertising policies for crypto/Bitcoin
- Corporate account requirements (Meta Business Manager)
- App review process
- Costs and rate limits
- **CRITICAL:** Can we run automated Bitcoin content posting?
- **CRITICAL:** Crypto ad approval process on Facebook

#### **3. Nostr**
- Protocol overview (NIP-01, NIP-05, NIP-19, etc.)
- Relay infrastructure (damus.io, nos.lol, etc.)
- NIP-05 verification (Bitcoin Lightning address as identity)
- Zap integration (Lightning Network micropayments)
- Client compatibility (Damus, Amethyst, Iris, etc.)
- Posting capabilities (text, images, long-form)
- Direct messaging (NIP-04, NIP-17)
- Cost: Effectively free (pay relay operators or self-host)
- **CRITICAL:** How does Nostr work for user acquisition?
- **CRITICAL:** Can users log in with their Nostr identity?
- **CRITICAL:** How do we make Tadbuy content discoverable on Nostr?

#### **4. LinkedIn** (if relevant for B2B)
- API access tiers
- Company page requirements
- Content posting capabilities
- Advertising policies for crypto
- Authentication: OAuth 2.0
- Corporate account requirements

#### **5. YouTube** (if relevant for video content)
- YouTube Data API v3
- Channel requirements
- Monetization policies for crypto content
- Live streaming capabilities
- Cost structure

#### **6. TikTok** (if relevant for younger audience)
- TikTok for Business API
- Content posting capabilities
- Crypto content policies
- Developer access requirements

#### **7. Telegram** (highly relevant for crypto)
- Bot API vs User API
- Channel management
- Payment integration (TON, Bitcoin via Lightning)
- Inline keyboards
- Webhook support
- **CRITICAL:** Can we run a Tadbuy Telegram bot?
- **CRITICAL:** Bitcoin tipping in Telegram

#### **8. Discord** (highly relevant for crypto)
- Bot API
- Server management
- Webhook support
- Authentication via OAuth2
- **CRITICAL:** Can we run a Tadbuy Discord bot?
- **CRITICAL:** Role-based access for Bitcoin rewards

#### **9. Mastodon/Fediverse** (decentralized alternative)
- ActivityPub protocol
- Instance federation
- API access
- Bitcoin integration possibilities

#### **10. Other Crypto-Native Platforms**
- **Lens Protocol** (decentralized social)
- **Farcaster** (decentralized social)
- **BlueSky** (AT Protocol)
- **Steemit/Hive** (blockchain social)
- **Plebs.app** (Nostr client)
- **Bitcoin-focused social networks**

---

## 🏢 CORPORATE ACCOUNT REQUIREMENTS

### **Critical Questions:**

For **EACH** major platform (Twitter/X, Facebook, Telegram, Discord, YouTube, TikTok, LinkedIn), answer:

1. **Do we need a corporate/developer account?**
   - Is it required or can we use personal accounts?
   - What's the cost difference?
   - What are the legal/tax implications?
   - Can a solo founder operate without a registered business?

2. **What documents/information do we need?**
   - Business registration (LLC, C-Corp, etc.)
   - Tax ID (EIN, VAT, etc.)
   - Bank account for ad spend
   - Identity verification
   - Registered agent (if applicable)
   - Privacy policy URL
   - Terms of service URL

3. **What's the approval process?**
   - Timeline (days, weeks, months?)
   - Success rate
   - Common rejection reasons
   - Appeal process

4. **What are the costs?**
   - API access fees
   - Verification fees
   - Ad spend requirements (minimums)
   - Ongoing operational costs
   - Payment processing fees

5. **What are the restrictions?**
   - Content moderation policies
   - Automated posting limits
   - User data access limits
   - Geographic restrictions
   - Age restrictions

---

## 🔐 AUTHENTICATION STRATEGY

### **Research the following:**

1. **OAuth 2.0 implementation** for each platform
   - Flow types (authorization code, implicit, PKCE)
   - Token refresh strategies
   - Scope management
   - Security best practices

2. **Social login best practices**
   - Which platforms support it natively?
   - How to handle multi-platform identities?
   - Account linking strategies
   - User profile unification
   - Privacy implications

3. **Bitcoin-native authentication**
   - **Nostr NIP-07** (browser extension signing)
   - **Lightning Address** as identity
   - **Bitcoin message signing** (sign-in with Bitcoin)
   - **WebAuthn** with hardware wallets
   - **Slashtags** (Blockstream)
   - Compare UX, security, adoption

4. **Hybrid approaches**
   - Social login + Bitcoin wallet connection
   - Email + Bitcoin wallet
   - Magic links + Lightning payments
   - Progressive identity (start simple, add security)

---

## 💰 BITCOIN INTEGRATION DEEP DIVE

### **For EACH platform, research:**

1. **Current Bitcoin/crypto policies**
   - Are Bitcoin mentions allowed?
   - Are Lightning payment links allowed?
   - Are on-chain addresses allowed?
   - Are crypto ads allowed?
   - What triggers account suspension?

2. **Workarounds and best practices**
   - How do other Bitcoin projects handle restrictions?
   - Examples: Strike, Cash App, River, Swan, Fold
   - Examples: Bitcoin Twitter, Bitcoin Magazine
   - Examples: Nostr-native Bitcoin projects

3. **Alternative platforms for Bitcoin content**
   - Where do Bitcoin projects thrive?
   - Where do they get censored?
   - What are the backup platforms?

---

## 🤖 AUTOMATION & AI INTEGRATION

### **Grok Bot Research:**

1. **What is the Grok API?**
   - Access tiers and pricing
   - API capabilities
   - Rate limits
   - Content generation quality
   - **CRITICAL:** Can we use Grok to generate Bitcoin-related content?
   - **CRITICAL:** Can we build a "Grok Bot" that responds to Bitcoin queries?
   - **CRITICAL:** Twitter/X integration with Grok (native vs. third-party)

2. **Other AI/LLM options for content generation**
   - GPT-4, Claude, Gemini, etc.
   - Cost comparison
   - Bitcoin-specific training data
   - Content quality
   - Rate limits
   - **CRITICAL:** Which LLM is best for Bitcoin content?

3. **Bot architecture**
   - How to build a social media bot
   - Best practices for engagement
   - Avoiding spam filters
   - Rate limiting
   - Error handling
   - Monitoring and analytics

---

## 📊 ANALYTICS & TRACKING

### **For each platform, research:**

1. **Analytics API access**
   - Impressions, reach, engagement
   - Follower demographics
   - Content performance
   - Conversion tracking
   - Cost per acquisition

2. **Cross-platform analytics**
   - How to unify data from multiple platforms
   - Attribution modeling
   - UTM parameter strategies
   - Bitcoin conversion tracking

3. **Privacy-compliant tracking**
   - GDPR compliance
   - CCPA compliance
   - Cookie consent
   - Data minimization

---

## 🛠️ TECHNICAL INTEGRATION PLAN

### **Provide a detailed technical roadmap:**

1. **Phase 1: Foundation (Week 1-2)**
   - Which platform to integrate first?
   - What's the MVP?
   - What can we build in 2 weeks?
   - Required infrastructure
   - Team requirements

2. **Phase 2: Expansion (Month 1-2)**
   - Adding more platforms
   - Automation
   - Analytics
   - User acquisition campaigns

3. **Phase 3: Scale (Month 3-6)**
   - Advanced features
   - AI integration
   - Cross-platform identity
   - Monetization

### **For each platform, provide:**

1. **Integration complexity** (1-10 scale)
2. **Time to implement** (hours/days)
3. **Ongoing maintenance** (hours/week)
4. **Cost to operate** (monthly)
5. **User acquisition potential** (low/medium/high)
6. **Bitcoin-friendliness** (1-10 scale)
7. **Technical risks**
8. **Compliance risks**

---

## 👥 USER EXPERIENCE DESIGN

### **Research and recommend:**

1. **Onboarding flow**
   - How to make social login feel seamless
   - When to ask for Bitcoin wallet
   - Progressive disclosure of features
   - Onboarding completion rates
   - Best practices from crypto apps (Strike, Cash App, etc.)

2. **Social sharing**
   - When to prompt users to share
   - What content to share (campaigns, earnings, milestones)
   - Incentive structures (Bitcoin rewards for sharing)
   - Viral mechanics
   - Referral programs

3. **Social feed integration**
   - Can we embed social feeds in Tadbuy?
   - Should we have a native social layer?
   - Nostr integration as a social feed
   - Twitter timeline integration

---

## 💼 BUSINESS & LEGAL

### **Critical questions:**

1. **Do we need a registered business entity?**
   - LLC, C-Corp, DAO, etc.
   - Wyoming, Delaware, Switzerland, Portugal?
   - Tax implications
   - Banking for crypto businesses

2. **Legal compliance for each platform**
   - Terms of service
   - Content policies
   - Data protection (GDPR, CCPA)
   - Securities law (is our token a security?)
   - Money transmission licenses (US state-by-state)
   - KYC/AML requirements

3. **Bitcoin-specific legal considerations**
   - FinCEN guidance
   - State money transmitter laws
   - OFAC compliance
   - Travel rule compliance
   - Tax reporting (1099, etc.)

4. **Insurance and risk management**
   - Cyber liability insurance
   - Errors and omissions
   - Crypto-specific insurance
   - Platform-specific insurance

---

## 🌍 GEOGRAPHIC STRATEGY

### **Research:**

1. **Which countries allow Bitcoin advertising?**
   - Prohibited jurisdictions
   - Restricted jurisdictions
   - Friendly jurisdictions
   - Tax havens for crypto

2. **Social media availability by region**
   - Where is Twitter/X blocked?
   - Where is Facebook blocked?
   - Where is Telegram blocked?
   - Nostr availability globally

3. **Language support**
   - Which languages should we prioritize?
   - Translation costs
   - Cultural considerations
   - Local community building

---

## 💡 BITCOIN-IZATION STRATEGY

### **Core questions:**

1. **How do we make social media feel "Bitcoin-native"?**
   - Lightning payment links in bios
   - LNURL support
   - Zap integration on Nostr
   - Bitcoin address in profiles
   - Satoshi-denominated pricing
   - Bitcoin-themed content

2. **How do we reward users in Bitcoin for social engagement?**
   - Zaps for content
   - Bitcoin tips for referrals
   - Sats rewards for sharing
   - Lightning payments for engagement

3. **How do we make the user flow feel seamless?**
   - One-click social login
   - Automatic Bitcoin wallet creation
   - Embedded Lightning addresses
   - Social-to-Bitcoin bridges
   - Progressive identity

4. **What infrastructure do we need?**
   - Lightning node (LND, c-lightning, Core Lightning)
   - Nostr relay
   - Bitcoin payment processor (LNBits, OpenNode, etc.)
   - Custodial vs. non-custodial wallets
   - Fedimint integration
   - Liquid Network (for faster settlements)

---

## 📈 SUCCESS METRICS

### **Define KPIs for:**

1. **User acquisition**
   - Cost per acquisition (CPA) by platform
   - Conversion rate from social to Tadbuy
   - Time to first Bitcoin transaction
   - Retention rates

2. **Engagement**
   - Daily active users (DAU)
   - Monthly active users (MAU)
   - Session duration
   - Pages per session
   - Social shares per user

3. **Revenue**
   - Ad spend driven by social
   - Bitcoin transaction volume
   - Average revenue per user (ARPU)
   - Lifetime value (LTV)

4. **Brand awareness**
   - Social mentions
   - Follower growth rate
   - Share of voice
   - Sentiment analysis

---

## 🎯 SPECIFIC RECOMMENDATIONS NEEDED

### **For each platform, provide:**

1. **Go/No-Go recommendation** (should we integrate?)
2. **Priority ranking** (which to do first?)
3. **MVP requirements** (minimum viable integration)
4. **Cost estimate** (setup + monthly)
5. **Time estimate** (hours to implement)
6. **Risk assessment** (low/medium/high)
7. **Bitcoin-friendliness score** (1-10)
8. **User acquisition potential** (low/medium/high)

### **Overall strategy recommendations:**

1. **Which 3 platforms should we prioritize?**
2. **What's the MVP timeline?** (weeks/months)
3. **What's the budget requirement?** (initial + monthly)
4. **What team do we need?** (developers, marketers, legal)
5. **What are the biggest risks?**
6. **What's the biggest opportunity?**

---

## 🔍 RESEARCH METHODOLOGY

Please:
1. **Use the latest 2026 data** - APIs and policies change rapidly
2. **Cite sources** - Official documentation, developer forums, recent blog posts
3. **Include real examples** - Other Bitcoin/crypto projects' integrations
4. **Provide code examples** - Where relevant, show API calls
5. **Include cost calculators** - Real pricing tiers and examples
6. **Compare alternatives** - Don't just list one option
7. **Highlight risks** - Be honest about challenges
8. **Be exhaustive** - We want a comprehensive document we can reference for years

---

## 📚 DELIVERABLES

Please provide a **comprehensive research document** that includes:

1. **Executive Summary** (1-2 pages)
   - Top 3 recommendations
   - Total estimated cost
   - Total estimated time
   - Biggest risks and opportunities

2. **Platform-by-Platform Deep Dive** (10-20 pages)
   - For each platform: API, costs, risks, recommendations

3. **Bitcoin-ization Strategy** (3-5 pages)
   - How to make social media feel Bitcoin-native
   - User flow diagrams
   - Technical architecture

4. **Implementation Roadmap** (2-3 pages)
   - Phase 1, 2, 3 timeline
   - Resource requirements
   - Success metrics

5. **Risk Assessment & Mitigation** (2-3 pages)
   - Legal risks
   - Technical risks
   - Platform risks
   - Mitigation strategies

6. **Budget & Resource Plan** (1-2 pages)
   - Initial costs
   - Monthly operational costs
   - Team requirements

7. **Appendices**
   - API comparison tables
   - Cost calculators
   - Code examples
   - Reference links

---

## 💭 FINAL THOUGHTS

We're building something **revolutionary** - the first truly **Bitcoin-native advertising platform** with **seamless social integration**. We want to:

- **Make Bitcoin feel normal** (not scary or complex)
- **Reward users in sats** for their engagement
- **Build a social layer** that aligns with Bitcoin values (sovereignty, privacy, decentralization)
- **Acquire users** from the existing crypto community
- **Create network effects** that drive organic growth

Help us **figure out the best path forward** by providing **exhaustive, actionable research** that we can use to make informed decisions.

**Thank you for your comprehensive research!**

---

**Project:** Tadbuy (Bitcoin-Native Ad Buying Platform)
**Live:** https://tadbuy.giveabit.io
**GitHub:** https://github.com/kitsboy/tadbuy
**Current Version:** v5.0.143
**Document Version:** 1.0
**Date:** 2026-09-01
