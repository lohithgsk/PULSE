# PULSE Frontend — Demo Guide

Use this as your script and quick-reference during the demo. It maps routes to pages, calls out key files, and highlights the interaction patterns and design system.

---

## 1) Elevator Pitch
- **PULSE** is a privacy-first, wallet-based health platform.  
- Users control medical data access via:
  - Granular consents  
  - Emergency break-glass  
  - Auditable history  
- **Stack:** React + Tailwind + lightweight design system.  
  - Tokens, shadows, spacing, and motion live in `THEME.md` and `styles`.

---

## 2) App Shell and Routing
- **Entry:** `index.html` bootstraps React root with Tailwind styles.  
- **App entry:** `index.jsx` mounts `App` and Tailwind CSS.  
- **Shell:** `App.jsx` wraps the application with `ToastProvider` for global toasts.  
- **Layout + Header:** Managed globally by `AppLayout.jsx` and `src/components/ui/Header.jsx`.  
- **Routing:** `Routes.jsx` defines routes and wraps protected pages with `ProtectedRoute` and `AppLayout`.  

### Route Map (for demo navigation)

**Public**
- `/wallet-connection-authentication` → Wallet connection onboarding.

**Protected (inside AppLayout + Header)**
- `/` → AI Health Assistant (alias for `/ai-health-assistant-analysis`)  
- `/ai-health-assistant-analysis` → Chat-like AI health insights and summary  
- `/health-dashboard-overview` → Overview with key metrics and recent activity  
- `/medical-records-management` → Records library, filters, and actions  
- `/consent-access-management` → Consents (active, pending, history, emergency)  
- `/emergency-access-contacts` → Manage emergency contacts & simulate break-glass  
- `/profile` → User profile & settings  
- `NotFound` → Fallback

---

## 3) Design System and Primitives
- **THEME:** `THEME.md` defines tokens, z-index layers (`z-header`, `z-dropdown`, `z-popover`, `z-toast`), and design patterns (focus rings, shadows, translucent surfaces).  

**Styles**
- `styles/tailwind.css` + `styles/index.css` → Tailwind layers.  
- `tailwind.config.js` → Semantic z-index scale and theme tokens.  

**Core UI Primitives (`src/components/ui`)**
- `Button.jsx` → Variants (default, outline, destructive, ghost, link, success, warning, danger) and sizes (xs → xl, icon). Icon + loading support.  
- `Input.jsx`, `Checkbox.jsx`, `Select.jsx` → Consistent form primitives.  
- `Skeleton.jsx` → Async loading skeletons.  
- `Toast.jsx` + `ToastProvider.jsx` → Global notifications (`success`, `error`, `info`, `warning`).  
- `ProtectedRoute.jsx` → Wallet-gated access wrapper with WalletConnect/MetaMask support.  
- `AppLayout.jsx` → Provides sticky header + container spacing.  
- `Header.jsx` → Sticky translucent nav shell with wallet controls + nav.  
- `EmergencyAccessIndicator.jsx` → Header indicator for emergency state.  

**Support Components**
- `AppIcon.jsx` → Unified icon renderer.  
- `AppImage.jsx` → Image wrapper with fallback.  
- `ErrorBoundary.jsx` → Catch render errors with fallback UI.  
- `ScrollToTop.jsx` → Restores scroll position across routes.  

---

## 4) Utilities and Services
- `utils/config.js` → Centralized env/config helpers.  
- `utils/apiClient.js` → API abstraction wrapper.  
- `utils/openaiClient.js` + `utils/openaiService.js` → Mock AI assistant.  
- `utils/ipfsService.js` → Placeholder IPFS integration.  
- `utils/blockchainService.js` → Wallet connect/network helpers (MetaMask).  
- `utils/walletConnectService.js` → WalletConnect v2 abstraction.  
- `utils/activityService.js` → Mock activity/data generator.  
- `utils/cn.js` → Classname merge helper.  

---

## 5) Pages — What to Showcase
### Health Dashboard Overview
- Wallet status, security indicators, recent activity, summaries.  
- Show token-based colors, `shadow-medical-card`.  

### AI Health Assistant Analysis
- `ChatInterface.jsx`, `ProcessingIndicator.jsx`, `HealthSummaryCard.jsx`.  
- Show skeletons while “thinking”, then toasts when results arrive.  

### Medical Records Management
- Record cards, filters, detail panel, `ShareModal.jsx`.  
- Toasts for actions, skeletons on loading.  

### Consent & Access Management
- Tabs: Active, Pending, History, Emergency, NFT generator.  
- Key Components:  
  - `ActiveConsentCard.jsx` → revoke/view  
  - `PendingRequestCard.jsx` → approve/deny (optimistic + toasts)  
  - `ConsentHistoryCard.jsx` → audit log + explorer links  
  - `EmergencyBreakGlass.jsx` → break-glass flows + audit trail  
  - `NFTConsentGenerator.jsx` → mock NFT consent mint flow  
- UI: simplified glassmorphism → clearer visuals.  

### Emergency Access Contacts
- Manage contacts, simulate break-glass, view audit log.  
- `MedicalAlertsConfig.jsx` → alert preferences.  

### User Profile
- `ProfileHeader.jsx`, `PersonalInfoPanel.jsx`, `ContactInfoPanel.jsx`, `SettingsPanel.jsx`.  
- Update actions trigger toasts.  

### Wallet Connection Authentication
- Public onboarding route.  
- Shows network, trust indicators, wallet selection.  
- Connect MetaMask/WalletConnect.  

---

## 6) Header, Wallet, and Access Control
- **Header.jsx**:  
  - Brand + nav, emergency indicator, wallet menu.  
  - Wallet menu → network, address, DID, balance, network switching.  
  - Toasts for connect/disconnect/switch flows.  

- **ProtectedRoute.jsx**:  
  - Guards authenticated routes.  
  - MetaMask → WalletConnect fallback.  
  - Timeout + error handling → Toasts.  

---

## 7) Error and Loading States
- `ErrorBoundary.jsx` → fatal render errors with friendly fallback.  
- `Skeleton.jsx` → async placeholders.  
- Toasts → confirm actions (approve, revoke, upload, AI complete, network switch, errors).  

---

## 8) Demo Script (7–10 minutes)
1. **Intro & Architecture (1 min)**  
   App shell, design system, routes, public vs protected.  

2. **Onboarding Flow (1–2 min)**  
   - `/wallet-connection-authentication`  
   - Show trust indicators, connect via wallet.  
   - Toasts for success/error.  

3. **Dashboard Snapshot (1 min)**  
   - `/health-dashboard-overview`  
   - Show wallet + security cards.  

4. **AI Assistant (1–2 min)**  
   - `/ai-health-assistant-analysis`  
   - Ask a sample health question, show loading → result.  

5. **Records Management (1 min)**  
   - `/medical-records-management` → filter, preview, share.  

6. **Consent Management (2–3 min)**  
   - Active Consents: revoke/view  
   - Pending: approve/deny  
   - History: modal + explorer link  
   - Emergency Access: break-glass simulation  
   - NFT Consent Generator: show mock mint flow  

7. **Profile & Settings (30s)**  
   - `/profile` → tweak settings, show toasts.  

**Closing Notes**
- Tokens in `THEME.md` ensure consistency.  
- ToastProvider centralizes user feedback.  
- Layering via z-index avoids stacking issues.  

---

## 9) Q&A Cheat Sheet
- **Secure Access?** → Wallet-gated routes, auditable actions.  
- **Errors?** → ErrorBoundary + Toasts + Skeletons.  
- **Backend Integration?** → Swap mock services with real APIs.  
- **Design changes?** → Update THEME.md + Tailwind config; primitives auto-adapt.  

---

## 10) File Index (Quick Reference)
Root
├── index.html # Host page
├── package.json # Scripts & deps
├── THEME.md # Design tokens & guidelines
├── README.md # Project overview
└── src
├── index.jsx
├── App.jsx
├── Routes.jsx
├── components/
│ ├── AppIcon.jsx
│ ├── AppImage.jsx
│ ├── ErrorBoundary.jsx
│ ├── ScrollToTop.jsx
│ └── ui/
│ ├── AppLayout.jsx
│ ├── Header.jsx
│ ├── ProtectedRoute.jsx
│ ├── AuthenticationGate.jsx
│ ├── Button.jsx
│ ├── Input.jsx
│ ├── Checkbox.jsx
│ ├── Select.jsx
│ ├── Skeleton.jsx
│ ├── Toast.jsx
│ ├── ToastProvider.jsx
│ └── EmergencyAccessIndicator.jsx
├── context/
│ └── SessionContext.jsx
├── pages/
│ ├── ai-health-assistant-analysis/
│ ├── consent-access-management/
│ ├── emergency-access-contacts/
│ ├── health-dashboard-overview/
│ ├── medical-records-management/
│ ├── user-profile/
│ ├── wallet-connection-authentication/
│ └── NotFound.jsx
├── utils/
│ ├── apiClient.js
│ ├── config.js
│ ├── cn.js
│ ├── openaiClient.js
│ ├── openaiService.js
│ ├── ipfsService.js
│ ├── blockchainService.js
│ ├── walletConnectService.js
│ └── activityService.js
└── styles/
├── tailwind.css
└── index.css