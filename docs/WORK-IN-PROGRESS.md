# Tadbuy — Work In Progress & Future Ideas

> **Status:** All items below are **SAVED BUT NOT DEPLOYED**. This is a parking lot for ideas, research, and infrastructure that's been researched and/or built but not yet ready for production.

---

## 📋 **SAVED FOR FUTURE DEPLOYMENT**

### 1. **Social Media Integration** (Research Complete, Infrastructure Ready)

**Status:** ✅ **All planning, research, and infrastructure complete. Ready to deploy when Cam gives green light.**

#### What's Saved:
- **Research Prompt:** `docs/GEMINI-RESEARCH-PROMPT.md` (580+ lines)
  - Comprehensive Gemini research request for social integration
  - Covers 12+ platforms, corporate accounts, auth strategy, Bitcoin integration
  - Includes AI/LLM options, automation, legal/regulatory questions

- **Geographic Strategy:** `docs/GEOGRAPHIC-STRATEGY.md`
  - 8 Tier-1 jurisdictions identified (US, Japan, Germany, NL, Portugal, Singapore, El Salvador, Argentina)
  - 67% of global Bitcoin users covered
  - TikTok explicitly avoided (Chinese ownership risks)

- **Nostr Relay Infrastructure:** `infrastructure/nostr-relay/`
  - 8 production-ready TOML configs (one per Tier-1 jurisdiction)
  - Docker Compose setup
  - Nginx reverse proxy with SSL/TLS
  - Health check and update scripts
  - Full deployment documentation
  - **Cost:** ~$100-180/month to run all 8 relays

- **Improvement Roadmap:** `docs/IMPROVEMENT-ROADMAP.md`
  - Q4 2026 - Q1 2027 priorities
  - Performance, accessibility, testing, features

#### Deployment Checklist (When Ready):
- [ ] Provision 8 VPS instances (1GB RAM, 20GB SSD each)
- [ ] Point DNS: `us.tadbuy.io`, `jp.tadbuy.io`, etc.
- [ ] Obtain SSL certificates
- [ ] Copy `.env.example` to `.env` and fill values
- [ ] Run `docker-compose up -d`
- [ ] Verify with `./scripts/health-check.sh`
- [ ] Integrate with Tadbuy frontend (NIP-07 login)
- [ ] Launch and announce to Bitcoin/Nostr community

---

## 🎯 **When You're Ready**

### **To Resume This Work:**

1. **Review the research:**
   - Read `docs/GEMINI-RESEARCH-PROMPT.md`
   - Send to Gemini for deep research
   - Integrate findings into `docs/GEOGRAPHIC-STRATEGY.md`

2. **Deploy infrastructure:**
   - Start with one relay (US Wyoming recommended)
   - Test for 2-4 weeks
   - Roll out remaining 7 regions

3. **Frontend integration:**
   - Add NIP-07 browser extension login
   - Implement NIP-57 Zaps (Lightning tips)
   - Add Nostr profile linking

4. **Community launch:**
   - Announce on Bitcoin Twitter
   - Post on Nostr with NIP-42 tags
   - Partner with Nostr-native projects

---

## 💡 **Other Ideas In Progress**

*None at the moment. Add new ideas here as they come up.*

---

## 📝 **Notes**

- This document is the **parking lot** for deferred work
- Update this when new ideas come up or status changes
- All committed work is in git history and won't be lost
- Don't deploy anything from here without explicit Cam approval

---

**Last Updated:** 2026-09-01
**Current Version:** v5.0.149
**Saved By:** Grok (M3)
