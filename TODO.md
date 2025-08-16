# PULSE Frontend — TODO & Backlog

A consolidated list of pending work across the app, grouped by area. Use this as a working checklist; move items to "Done" in your PRs.

## Global/platform

- [ ] Environment & configuration
  - [ ] Define and document env variables (OpenAI, IPFS, RPC endpoints, chain IDs)
  - [ ] Decide on client vs server proxy for sensitive keys (OpenAI, pinning services)
  - [ ] Centralize config (env loader + constants)
- [ ] Error handling & notifications
  - [ ] Add a global toast/notification system
  - [ ] Standardize error surfaces and retry guidance
- [ ] Authentication & gating
  - [x] Introduce/authenticate user sessions where required
  - [x] Wrap sensitive routes with `AuthenticationGate`
    - Implemented `SessionProvider` with localStorage persistence and a `ProtectedRoute` wrapper that renders `AuthenticationGate` until authenticated. Sensitive routes in `Routes.jsx` are now gated. Next: replace simulated login with real wallet connect.
- [ ] State management & types
  - [ ] Evaluate lifting cross-page state vs Redux (toolkit already present)
  - [ ] Add TypeScript or JSDoc types for public models and services
- [ ] Testing
  - [ ] Add unit tests (helpers/services)
  - [ ] Add component tests (key pages/cards)
  - [ ] Add E2E smoke (navigation, chat, connect wallet)
  - [ ] Add test script in `package.json` (consider Vitest + RTL)
- [ ] Accessibility
  - [ ] Keyboard nav and focus management for dialogs/menus/drawers
  - [ ] ARIA labels/roles on interactive elements
- [ ] Performance
  - [ ] Memoization of heavy components & selectors
  - [ ] Virtualize long lists (chat, history, records)
  - [ ] Debounce inputs and filters
- [ ] i18n/localization scaffolding
- [ ] Telemetry/analytics (opt-in) with privacy/redaction
- [ ] Security & privacy
  - [ ] Sanitize user inputs and outputs
  - [ ] Enforce data retention policies (e.g., 90-day auto-deletion)
  - [ ] Content Security Policy and dependency audit

## Services (src/utils)

- [ ] `blockchainService.js`
  - [ ] Implement connect/disconnect via wagmi/ethers or viem
  - [ ] Implement `getNetworkStatus` and map chain IDs → names
  - [ ] Implement `switchToSepolia` and generic chain switching
  - [ ] Add transaction logging helpers (and links to explorers)
- [ ] `ipfsService.js`
  - [ ] Implement add/get using a pinning service (web3.storage, Pinata, etc.)
  - [ ] Add multi-gateway read fallback and CID validation
- [ ] `openaiClient.js` & `openaiService.js`
  - [ ] Initialize client from env; support server proxy
  - [ ] Add domain functions (generate health summary, analyze labs)
  - [ ] Consider streaming responses and token/cost guards
- [ ] `mockHealthData.js`
  - [ ] Extend or replace with real API calls progressively
- [ ] `cn.js`
  - [ ] Keep as-is; ensure consistent usage across components

## AI Health Assistant & Analysis (src/pages/ai-health-assistant-analysis)

- [ ] Replace `generateAIResponse` with `openaiService` integration (optionally streaming)
- [ ] Enforce `aiPermissions` when generating responses
- [ ] Display provenance: sources/CIDs, confidence, warnings
- [ ] Persist chat and summaries to IPFS; render returned CIDs
- [ ] Blockchain audit log for actions; show tx hashes
- [ ] Export summaries (PDF/JSON) and share flows
- [ ] Robust loading/errors/empty states
- [ ] Tests (chat routing, permissions enforcement, summary export)

## Consent & Access Management (src/pages/consent-access-management)

- [ ] Approve/deny/revoke flows with real blockchain txs
- [ ] Multi-signature approvals where `requiresMultiSig` is true
- [ ] Persist active/pending/history to backend or indexer; pagination/filters
- [ ] Generate Consent NFT: contract + mint; include IPFS metadata
- [ ] Etherscan/explorer links by network (Sepolia/Mainnet)
- [ ] Error handling and toasts; optimistic updates with rollback
- [ ] Tests (approve/deny/revoke, NFT mint)
- [ ] Accessibility for tabs and buttons

## Emergency Access & Contacts (src/pages/emergency-access-contacts)

- [ ] Persist contacts and verification states (email/SMS or on-chain attestations)
- [ ] Implement real break-glass protocol on-chain with logging
- [ ] Connect `MedicalAlertsConfig` to notification service and auto-activation
- [ ] Fetch and display audit log from chain/backend
- [ ] Form validation/masking (phone/email), permissions semantics
- [ ] Tests (add/edit/delete/verify, activate/deactivate)

## Health Dashboard Overview (src/pages/health-dashboard-overview)

- [ ] Replace mock data with API/chain sources
- [ ] Paginate recent activities; filter by type/date
- [ ] Link tx hashes to correct explorer based on network
- [ ] Wire Quick Actions to real navigation/actions
- [ ] Populate security indicators and access attempts
- [ ] Tests (navigation, refresh summary)

## Medical Records Management (src/pages/medical-records-management)

- [ ] Replace `mockRecords` with records API/indexer
- [ ] File upload (progress, validation, virus scan)
- [ ] Real downloads and viewers (PDF/images)
- [ ] Store records/attachments to IPFS; show CIDs
- [ ] Share links with permissions/expiry; track access counts
- [ ] AI summaries via `openaiService`; persist output and timestamps
- [ ] Virtualize large lists; debounce filters
- [ ] Tests (filters/sorts, bulk actions, share)

## Wallet Connection & Authentication (src/pages/wallet-connection-authentication)

- [ ] Implement real connect across providers (MetaMask, WalletConnect v2, Coinbase)
- [ ] Robust session persistence and reconnection flow
- [ ] Network switching UX (multi-chain, add chain requests)
- [ ] Map additional chain IDs; show fiat balance toggle
- [ ] Error toasts and status area; improve advanced diagnostics
- [ ] Tests (connect/disconnect/switch)

## UI & Navigation (src/components/ui)

- [ ] Header
  - [ ] Show real wallet address (truncate) and DID
  - [ ] Reflect emergency active status from state
  - [ ] Close menus on route change; focus management
  - [ ] A11y attributes on navigation and menus
- [ ] Buttons/Inputs/Selects
  - [ ] Ensure ARIA & keyboard support
  - [ ] Consistent focus rings and sizes

## Styling & assets

- [ ] Dark mode toggle/theme tokens
- [ ] Consistent spacing/typography across pages
- [ ] Validate Tailwind plugin usage; remove unused
- [ ] Asset optimization (images/icons)

## Build, deploy, and docs

- [ ] Add test and lint scripts to `package.json`
- [ ] CI: run build, lint, tests on PRs
- [ ] Deployment: Netlify/Vercel config and docs (preview + production)
- [ ] PWA: validate manifest/icons; consider offline basics
- [ ] CONTRIBUTING.md and CODE_OF_CONDUCT.md
- [ ] Keep page-level READMEs up to date as features land

---

Scope notes
- Much of the app is currently mocked. The first integration passes should focus on: wallet connect, IPFS storage, and basic OpenAI summary generation.
- Ensure security, privacy, and permissions enforcement are considered at each step.
