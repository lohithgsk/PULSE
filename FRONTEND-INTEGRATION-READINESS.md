# Frontend Integration Readiness (Before Backend Is Ready)

A concise checklist to finish the UI/UX and wiring so backend/blockchain teams can plug in later with minimal churn.

## Global readiness

- Routing and gating
  - Ensure all routes in `src/Routes.jsx` are correct and discoverable from the header.
  - Gate sensitive pages behind `AuthenticationGate` via `ProtectedRoute`.
- Session & wallet UX
  - Keep `SessionProvider` login/logout/update in place with localStorage persistence.
  - Implement connect/disconnect and network switch UX in `Header` (MetaMask + WalletConnect fallback).
  - Show truncated address, network name, and simple diagnostics.
- States, loaders, and empty UI
  - Add skeleton loaders, progress, and empty states for lists/panels on each page.
  - Standardize a few empty-state patterns (primary action + helper text).
- Error handling
  - Centralize toast/notification API (temporary console fallback okay).
  - Show user-friendly messages and retry actions near failing UI.
- Configuration
  - `/.env` keys in place and documented; guard missing keys with clear UI.
  - Use a single config module for reading `import.meta.env` safely.
- Mocks and feature flags
  - Mock services for data (return Promises with realistic latency).
  - Feature-flag real integrations behind env switches to swap mocks → live quickly.
- Types and contracts
  - Add JSDoc or TS-style typedefs for models and service responses.
- Tests (minimal)
  - Unit tests for helpers; component tests for key flows; e2e smoke for nav and connect.

## Per-page checklist

- AI Health Assistant (`src/pages/ai-health-assistant-analysis`)
  - Chat UI: send/receive, multiline input, disabled state when loading.
  - Permissions panel: toggle-only UI with persisted local state.
  - Processing overlay: staged progress and cancel/reset hooks.
  - Summary card & history: render static items and empty states.
  - Ready-to-wire service calls in one place (e.g., `openaiService.generateSummary()`), currently mocked.

- Consent & Access Mgmt (`src/pages/consent-access-management`)
  - Tabs and lists render with pagination affordances (mocked items).
  - Approve/deny/revoke buttons: optimistic UI with rollback hooks and toasts.
  - NFT generation modal: fields validate; submit triggers mocked async result.
  - Explorer links slot (disabled until network known).

- Emergency Access & Contacts (`src/pages/emergency-access-contacts`)
  - Contacts CRUD UI with form validation and masked inputs.
  - Break-glass flow: confirm dialog and result banner (mocked tx hash).
  - Simulator and audit log panels show mocked entries + empty state.

- Health Dashboard (`src/pages/health-dashboard-overview`)
  - Summary, quick actions, and recent activity list with loading/empty UI.
  - Link out targets wired (routes only for now).

- Medical Records (`src/pages/medical-records-management`)
  - Filters UI (text, type, date) with debounced updates.
  - List/grid with selection and bulk actions (disabled when none selected).
  - Detail panel and share modal show mocked metadata.
  - Upload button wired to mocked handler with progress bar.

- Wallet & Auth (`src/pages/wallet-connection-authentication` + `Header`)
  - “Connect Wallet” tries MetaMask first; fallback to WalletConnect QR.
  - “Switch Network” moves to Sepolia and updates session network/chain.
  - “Logout” clears session and UI returns to gated state.

## Service surfaces to keep stable

- `src/utils/blockchainService.js`
  - connectWallet(): { address, did, chainId, network, balance, type }
  - disconnectWallet()
  - switchToSepolia() → boolean
  - getNetworkStatus(): { connected, name, chainId, isTestnet }

- `src/utils/walletConnectService.js`
  - connectWithWalletConnect(): same shape as connectWallet
  - disconnectWalletConnect()

- `src/utils/ipfsService.js` (mocked)
  - add(content) → { cid }
  - get(cid) → content

- `src/utils/openaiService.js` (mocked)
  - generateHealthSummary(input) → { text, tokens, model, durationMs }

- Page-level handlers
  - Keep all network or API calls funneled through a small set of service functions to ease backend swap.

## API contracts (proposed, mock-first)

- Health summaries
  - Request: { prompt: string, permissions: string[] }
  - Response: { text: string, sources: string[], confidence: number, createdAt: string }
- Consents
  - Approve/Deny/Revoke: { consentId: string } → { txHash: string, status: 'approved'|'denied'|'revoked' }
  - NFT Generate: { subjectId: string, permissions: string[], expiryHours: number } → { tokenId: string, txHash: string, metadataCid: string }
- Records
  - List: { filters } → { items: Record[], nextCursor?: string }
  - Upload: { fileMeta } → { cid: string, txHash?: string }
- Emergency
  - BreakGlass: { reason: string } → { txHash: string, activatedAt: string }

Keep these shapes stable in mocks so backend can replace implementations without changing the UI.

## Env keys (frontend)

- VITE_WALLETCONNECT_PROJECT_ID
- VITE_OPENAI_API_KEY (if using client-side; otherwise proxy)
- VITE_IPFS_ENDPOINT / pinning creds (if client-side; otherwise proxy)
- VITE_RPC_ENDPOINT (optional; provider usually injected)

Guard missing envs with clear errors and disable dependent actions.

## Definition of done (before backend)

- All pages render with loaders, empty states, and errors wired.
- Connect/Disconnect and network switch UX working with MetaMask or WalletConnect.
- Service functions return mocked Promises with realistic latency and stable shapes.
- Minimal tests: nav smoke, connect flow, one list empty + loading.
- Docs updated (this file and per-page READMEs); env keys present and explained.

Once backend is ready, swap mock functions with real calls behind a feature flag and remove the flag after validation.

-------------------
## Do-Now Checklist (No Backend Needed)

### 1. Global UX and Infra
- Create a config helper to read `import.meta.env` safely with defaults and user-facing warnings.
- Centralize Toast into a lightweight provider/hook; standardize success/error/info usage.
- Add ErrorBoundary at app root and a friendly fallback UI per page when something throws.
- Build shared Skeleton and EmptyState components and wire them across lists/panels.
- Add a simple feature flag switch (env/localStorage) to flip between mock vs. live services.

### 2. Service Layer (Mock-First, Stable Contracts)
- Keep `blockchainService` and `walletConnectService` as-is; add missing no-op disconnect/status helpers if needed.
- Flesh out mocks in `utils/*`:
  - `openaiService`: deterministic summary/chat mock with variable latency; optional “stream” via setInterval callbacks.
  - `ipfsService`: mock add/get with in-memory map and fake CIDs.
  - Add small mock files (if you want) for: consents, emergency, records, activity (return `Promise<{ items, nextCursor? }>`), with realistic shapes matching `BACKEND-INTEGRATION-READINESS.md`.
  - Add a tiny “api client” shim that picks mock vs. live by flag; keep function signatures stable.

### 3. Session & Wallet Polish
- Finalize WalletConnect cancel/timeout handling (done in ProtectedRoute + Header; quickly retest).
- Add error toasts for network switch failures and a retry action.
- Improve address/network display (copy-to-clipboard, tooltip with full address).
- Show DID and balance where helpful; gracefully handle “unknown network”.

### 4. Accessibility & Performance
- Add keyboard navigation and focus rings for all interactive elements (Header menu, wallet dropdown, modals).
- ARIA labels for toasts, buttons, dialogs; ensure tab order is logical.
- Prefetch key routes on hover; lazy-load heavy page chunks; verify no layout shift with Skeletons.
- Optimize images and add sizes; confirm responsive breakpoints.

### 5. Testing (Minimal but Useful)
- Nav smoke test (routes render, header links work).
- Connect flow unit/integration: render gate, trigger connect (mock success and cancel).
- One page component test with loading + empty state (e.g., Records list).
- Optional: a tiny Playwright e2e that visits 2-3 routes and exercises the connect cancel path.

### 6. Documentation & Dev UX
- Update `FRONTEND-INTEGRATION-READINESS.md` status markers (what’s done vs. pending).
- Add short README notes to each page folder about mock switches and test coverage.
- Add a Troubleshooting section (envs, WalletConnect project id required, common errors).

---

## Per-Page Work You Can Finish Now

### AI Health Assistant
- Chat UI with multiline input, loading state, and mock streaming; permissions panel state persists locally.
- Summary card and history with skeletons/empty state; hook to `openaiService` (mock).

### Consent & Access Management
- Tabs, list with pagination affordances; optimistic approve/deny/revoke UI with rollback via mock error.
- NFT consent modal with form validation and mocked async result; toast on success/error.

### Emergency Access & Contacts
- Contacts CRUD forms with masked inputs and validation; mock list and persistence.
- Break-glass confirm dialog + result banner (mock tx hash) and audit log panel with empty state.

### Health Dashboard
- Compose summary cards, quick actions, recent activity with skeletons; use mock activity feed.

### Medical Records
- Filters (text/type/date) with debounced updates; list/grid with selection and disabled bulk actions when none.
- Detail panel and share modal using mocked metadata; upload button with fake progress and result.

### Wallet & Auth (Header + Gate)
- Ensure “Connect Wallet” → MetaMask first, WalletConnect fallback; cancel/timeout covered.
- “Switch Network” to Sepolia with user feedback; “Logout” clears session and returns to gate.

---

### Suggested Order of Work
1. Global primitives (Skeleton, EmptyState, Toast provider, config helper)
2. Page skeletons + empty states + loaders
3. Mock services wired per page (records, consents, emergency, activity, AI)
4. Accessibility pass and micro-interactions (tooltips, copy, focus states)
5. Minimal tests and docs update