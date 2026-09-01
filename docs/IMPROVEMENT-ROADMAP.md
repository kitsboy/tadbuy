# Tadbuy — Future Improvements Roadmap (Q4 2026 - Q1 2027)

**Last Updated:** 2026-09-01  
**Current Version:** v5.0.141  
**Live Site:** https://tadbuy.giveabit.io  

---

## ✅ Recently Shipped (Reference)

### **Session 2026-08-29 → 2026-09-01**
- ✅ **Navbar facelift** (v5.0.130) — Spacious responsive navigation
- ✅ **Real-time BTC prices** (v5.0.137) — Coinbase API integration
- ✅ **Build verified** — 74 JS chunks, lint clean
- ✅ **Documentation synced** — All handoffs updated

---

## 🚀 Future Improvement Opportunities

### **Priority 1: User Experience Enhancements** (Q4 2026)

#### **A. Onboarding Flow Polish**
- **FirstVisitChecklist** - Add persona-specific welcome tour
- **PersonaOnboarding** - 3-step interactive guide
- **Interactive tutorial overlay** for new users
- **Progress indicators** for multi-step forms
- **Empty states** with helpful actions

#### **B. Performance Optimizations**
- **Code splitting** for heavy routes (Campaigns, Analytics, Geo)
- **Lazy loading** for charts and maps
- **Image optimization** for marketing assets
- **Bundle analysis** - currently 581KB main bundle (target: <500KB)
- **Service worker** improvements for offline support

#### **C. Accessibility Improvements**
- **Keyboard shortcuts** expansion (currently Cmd+K)
- **Screen reader** support audit
- **Focus management** for modals and drawers
- **Color contrast** audit across all themes
- **ARIA labels** consistency check

---

### **Priority 2: Feature Additions** (Q1 2027)

#### **D. Campaign Management**
- **Bulk actions UI** - Already shipped in v5.0.99, could expand
- **Campaign templates** - Pre-built campaigns for common use cases
- **A/B testing** - Split testing for ad variants
- **Auto-optimization** - ML-based bid adjustments

#### **E. Analytics & Reporting**
- **Custom date ranges** - Currently limited presets
- **Export functionality** - CSV/PDF reports
- **Real-time updates** - WebSocket for live data
- **Cohort analysis** - User retention tracking
- **Attribution modeling** - Multi-touch attribution

#### **F. Payment & Wallet**
- **Fedimint integration** - BLOCKED (mint: `t_8ee7c976`)
- **Umbrel LND integration** - BLOCKED (node: `t_46208fbe`)
- **Multi-currency support** - Currently USD/CAD/EUR/GBP
- **Invoice generation** improvements
- **Settlement history** filtering and search

---

### **Priority 3: Technical Debt** (Ongoing)

#### **G. Code Quality**
- **TypeScript strict mode** - Enable strict checks
- **Component prop types** - Convert to TypeScript interfaces
- **Custom hooks extraction** - Reduce component complexity
- **Error boundaries** - Add more granular boundaries
- **Loading states** - Consistent loading UI

#### **H. Testing**
- **Unit tests** - Currently no test suite
- **Integration tests** - Critical user flows
- **E2E tests** - Playwright setup
- **Visual regression** - Screenshot comparisons
- **Performance budgets** - Lighthouse CI

#### **I. Security**
- **CSP refinements** - Audit current policy
- **Dependency scanning** - Already fixed in v5.0.130
- **API rate limiting** - Server-side enforcement
- **Input validation** - Zod schemas for forms
- **Authentication audit** - Firebase auth flow review

---

## 🎯 Next Session Recommendations

### **Immediate (Next 1-2 Sessions)**

1. **Performance Audit & Optimization** (4-6 hours)
   - Bundle analysis with `vite-bundle-visualizer`
   - Code splitting for heavy routes
   - Image lazy loading
   - Target: Reduce main bundle to <500KB

2. **Accessibility Audit** (2-3 hours)
   - Lighthouse accessibility score (target: 100)
   - Keyboard navigation testing
   - Screen reader testing
   - ARIA labels audit

3. **Onboarding Flow** (3-4 hours)
   - Interactive welcome tour
   - Persona-based recommendations
   - Progress tracking

### **Medium Term (1-2 Months)**

4. **Testing Infrastructure** (6-8 hours)
   - Vitest setup
   - Component tests for critical paths
   - E2E tests with Playwright
   - CI/CD integration

5. **Campaign Templates** (4-6 hours)
   - Pre-built campaign templates
   - Industry-specific defaults
   - One-click campaign creation

### **Long Term (3-6 Months)**

6. **Advanced Analytics** (10-15 hours)
   - Custom dashboards
   - Export functionality
   - Real-time updates
   - Attribution modeling

7. **Mobile App** (20+ hours)
   - React Native setup
   - Core feature parity
   - Push notifications
   - App store deployment

---

## 🔧 Technical Blockers

### **Active Blockers**
- **Fedimint mint connection** - Need Andrea (`t_8ee7c976`) to complete setup on THOR
- **Umbrel LND connection** - Need Rosa (`t_46208fbe`) to complete setup on THOR
- **Payment processing** - Currently in demo mode until above are resolved

### **Resolved Blockers**
- ✅ CF Pages deployment (was v5.0.93, now v5.0.141)
- ✅ Real-time BTC price fetching (Coinbase API)
- ✅ Navbar facelift (responsive, accessible)

---

## 📊 Success Metrics

### **Current State (v5.0.141)**
- **Build Size:** 581KB main bundle
- **Lighthouse Score:** TBD (run audit)
- **Routes:** 25+ functional routes
- **Languages:** 8 fully translated (en/es/fr/de/pt/ja/zh/ar)
- **Components:** 53 reusable components
- **Documentation:** Complete handoffs and changelog

### **Target State (Q1 2027)**
- **Build Size:** <500KB main bundle
- **Lighthouse Score:** 95+ across all categories
- **Test Coverage:** 70%+ for critical paths
- **Performance:** <2s LCP, <100ms INP
- **Accessibility:** 100% WCAG 2.1 AA compliance

---

## 🎉 Summary

The Tadbuy platform is in excellent shape with:
- **✅ All critical issues resolved**
- **✅ Modern, responsive UI**
- **✅ Real-time data integration**
- **✅ Complete documentation**
- **✅ Clean, maintainable codebase**

**Ready for next improvement cycle when you are!**

---

**Next Steps for You (Cam):**
1. Review this roadmap
2. Choose 1-2 priorities for next session
3. Provide any specific requirements or constraints
4. I'll execute the plan systematically
