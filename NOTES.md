# UI Review & Working Paths

## Overview
A comprehensive UI review was conducted across the Tadbuy platform, focusing on clickability, z-index issues, routing, and mobile responsiveness.

## Recent Enhancements (April 2026)
1. **Real-time BTC Ticker:** The global currency dropdown now fetches live Bitcoin prices from `blockchain.info`, ensuring accurate fiat conversions across the platform.
2. **Live Mempool Fees:** The "On-Chain" payment method in the BuyAds checkout now fetches real-time recommended fees from `mempool.space`, providing advertisers with accurate cost estimates.
3. **PDF Client Reports:** Added a professional PDF export option in the Campaigns dashboard using `jspdf`. It generates a branded report with the Tadbuy logo, URL, and selected campaign metrics.
4. **Campaign Duplication:** Added a "Duplicate" quick action in the Campaigns table, allowing users to instantly clone existing campaigns as drafts.
5. **Pulsing Live Badges:** Added a subtle pulsing animation to the "Live" status badges in the Campaigns dashboard for better visual hierarchy.
6. **Removed Pulse Tab:** Temporarily removed the "Pulse" tab from the main navigation to streamline the UI.
7. **Empty States:** Added a beautiful empty state to the Settlements page for when no data is present.

## Fixes Implemented
1. **Button `asChild` Issue:** Fixed a critical issue where the custom `Button` component was wrapping `<Link>` elements using an unsupported `asChild` prop. This resulted in invalid HTML (`<button><a href="...">...</a></button>`) which broke clicks and navigation on the **Marketplace** and **Campaigns** pages. The links now correctly wrap the buttons.
2. **Mobile Navigation:** The main header navigation was overflowing on mobile devices. Implemented a responsive hamburger menu (`Menu` / `X` icons) that toggles a mobile-friendly dropdown overlay, ensuring all paths are accessible on smaller screens.
3. **Alerts to Toasts:** Replaced native `window.alert` calls in `PublisherPortal.tsx` and `Campaigns.tsx` with the custom `useToast` hook, as native alerts do not work reliably within the AI Studio iframe environment.
4. **ProfileSettings Responsiveness:** Adjusted the grid layout in `ProfileSettings.tsx` from a strict 2-column layout to a responsive 1-column (mobile) to 2-column (tablet/desktop) layout.

## Working Paths & User Flows

### 1. Global Navigation & Layout
- **Header:** Desktop navigation links work correctly. Mobile hamburger menu toggles correctly and closes upon navigation.
- **Currency Selector:** Dropdown works and updates the global currency state.
- **Command Menu (Cmd+K):** Opens a global search/action palette. On mobile, it can be triggered via the "Search (Cmd+K)" button in the mobile menu.
- **Live Activity Widget:** Displays simulated real-time events. Hidden on mobile to prevent screen clutter.

### 2. Campaign Creation (`/` -> BuyAds)
- **Stepper UI:** The 4-step process (Platform & Budget -> Targeting -> Creative -> Review & Pay) navigates correctly using "Next" and "Back" buttons.
- **Platform Selection:** Clicking platform cards toggles their selection state.
- **Budget Input:** Preset buttons and custom input correctly update the BTC and fiat amounts.
- **Advanced Targeting:** Toggles for devices, networks, and advanced options work.
- **Creative Variants:** Adding, removing, and updating A/B test variants works correctly.
- **Payment Flow:** Selecting a payment method (Lightning, On-Chain, Zap, PPQ.AI) updates the final review screen. The "Deploy Campaign" button opens the payment modal.
- **Success Modal:** After confirming payment, the success modal appears with a link to view the campaign in the Campaigns dashboard.

### 3. Campaigns Dashboard (`/campaigns`)
- **Table Selection:** Checkboxes for individual rows and "Select All" work correctly.
- **Export:** The "Export Selected" button opens a modal. Confirming export triggers a success toast.
- **New Campaign:** The "New campaign" button correctly routes back to the BuyAds page.
- **Action Menus:** Dropdowns for individual campaigns (Pause, Edit, Share) are accessible.

### 4. Marketplace (`/marketplace`)
- **Listings:** Cards display correctly with the new `glass-panel` styling.
- **Bid Now:** The "Bid Now" buttons correctly route to the BuyAds page.

### 5. Publisher Portal (`/publisher`)
- **Live Bids:** The simulated live bids list updates every 3 seconds.
- **Settlement:** Clicking "Accept & Settle" triggers a simulated API call and displays a success/error toast.

### 6. Metrics & Analytics (`/metrics`, `/analytics`)
- **Charts:** Recharts components render correctly and are responsive to container width.
- **Filters:** Date range and platform dropdowns are clickable.

### 7. Hubhash (`/hubhash`)
- **Campaign Cards:** Display correctly with progress bars.
- **Pledge Buttons:** Clickable and styled correctly based on campaign status (Funding vs. Unleashed).

### 8. Profile & Settings (`/profile`, `/dashboard`)
- **Forms:** Inputs and save buttons are accessible. Layouts stack correctly on mobile.

## Mobile UI Status
- **Header:** Fully responsive with a hamburger menu.
- **BuyAds Stepper:** Stacks into a single column. Navigation buttons remain accessible at the bottom of the form.
- **Tables:** Wrapped in `overflow-x-auto` to allow horizontal scrolling without breaking the page layout.
- **Grids:** All major grids (`grid-cols-*`) use responsive prefixes (`md:`, `lg:`, `sm:`) to ensure cards stack vertically on mobile screens.
- **Modals:** Modals are centered and have max-width constraints, ensuring they fit within mobile viewports.
