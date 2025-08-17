# Consent & Access Management (page)

This page (`src/pages/consent-access-management/index.jsx`) lets you manage who can access your medical data: view active consents, approve/deny pending requests, review audit history, toggle emergency (break-glass) access, and generate consent NFTs. It’s currently a mocked UI with realistic flows and placeholders for blockchain/IPFS integrations.

## Quick start

- Install deps (once): `npm install`
- Start dev server: `npm run start`
- Open the URL shown in the terminal and navigate to `/consent-access-management` (also linked from the app’s navigation).

## How it works (overview)

- Tabs and layout
  - Five tabs: Active Consents, Pending Requests, Consent History, Emergency Access, Generate NFT.
  - Tab state is local (`activeTab`). Desktop shows tabs across the top; mobile scrolls horizontally.

- Data model (mocked, in-memory)
  - `activeConsents`: list of granted consents (with provider, type, categories, expiry, NFT tokenId, and isMultiSig).
  - `pendingRequests`: inbound requests awaiting action (priority, duration, justification, license, multi-sig details, request hash, block).
  - `consentHistory`: prior actions with chain metadata (tx hash, block, gas used) and details.
  - `emergencyContacts`: list for break-glass context.

- Actions and processing
  - Button actions (approve/deny/revoke/generate) simulate network/blockchain calls using `setTimeout` with loading state (`isLoading`).
  - Emergency toggle sets `emergencyActive` after a simulated delay.
  - "View Transaction" opens Etherscan for Sepolia with the given tx hash.

- Header controls
  - Wallet connect, network switch (Sepolia/Mainnet), and emergency activate hooks are passed into the shared `Header` component.

## What you can do

1) Active Consents
- View your active consents with scope (data categories), expiry, and NFT token ID.
- Revoke consent (simulated, logs to console).
- If none exist, a call-to-action appears to generate a new consent.

2) Pending Requests
- Review incoming requests with provider details, priority, requested data, duration, and justification.
- Approve or Deny (simulated, logs to console; shows a loading spinner while “processing”).
- Basic sort selector is present (UI only).

3) Consent History
- See a chronological list of consent actions (granted/revoked/emergency access) including chain metadata.
- Open a transaction on Etherscan via "View Transaction".
- Export/Filter buttons are UI placeholders.

4) Emergency Access
- Toggle the break-glass protocol. Activation/deactivation is simulated with loading state.
- Link to manage emergency contacts in the dedicated page.

5) Generate NFT
- Open the NFT Consent Generator.
- Submit to "mint" a consent NFT (simulated) with loading state.

## Where to customize

- Initial data
  - Active consents: `activeConsents` array in `index.jsx`.
  - Pending requests: `pendingRequests` array in `index.jsx`.
  - Consent history: `consentHistory` array in `index.jsx`.
  - Emergency contacts: `emergencyContacts` array in `index.jsx`.

- Handlers and flows
  - Revoke: `handleRevokeConsent(consentId)`
  - Approve/Deny: `handleApproveRequest(requestId)`, `handleDenyRequest(requestId)`
  - Emergency activate/deactivate: `handleEmergencyActivate()`, `handleEmergencyDeactivate()`
  - View transaction: `handleViewTransaction(txHash)`
  - Generate NFT consent: `handleGenerateNFTConsent(consentData)`

- UI and behavior
  - Tabs: `tabs` array controls labels/icons/order.
  - Loading: `isLoading` gates buttons and shows progress during simulations.
  - Network: `currentNetwork` toggles Sepolia/Mainnet (UI-only for now).

## Changing the route (path/component)

Route config lives in `src/Routes.jsx`:

- Change this page’s path
  - Edit: `<Route path="/consent-access-management" element={<ConsentAccessManagement />} />`
  - Replace the string with your new path (e.g., `/consents`).

- Make this (or another) page the home route
  - Home is: `<Route path="/" element={<AIHealthAssistantAnalysis />} />`
  - Swap the component to `ConsentAccessManagement` (or any other page) as desired.

- Add an alias path
  - Add: `<Route path="/your-alias" element={<ConsentAccessManagement />} />`

- If you rename/move this page
  - Update the import at the top of `src/Routes.jsx` to the new path.

- Protect the route (auth-gate)
  - Wrap the element with `AuthenticationGate` from `src/components/ui/AuthenticationGate.jsx`.

- Lazy-load (optional)
  - Use `React.lazy(() => import('./pages/consent-access-management'))` and wrap in `<Suspense>`.

- Update links
  - Search for any `<Link to="/consent-access-management">` and update paths accordingly.

## Wiring to real services (optional next steps)

- Blockchain/Audit (`src/utils/blockchainService.js`)
  - Implement revoke/approve/deny/emergency/generate flows with actual transactions via ethers + wagmi.
  - Return and persist tx hash, block number, gas used; surface failures and confirmations.

- NFT Consent (`NFTConsentGenerator`)
  - Define a contract and mint function; optionally pin consent metadata to IPFS first, then include CID in tokenURI.

- IPFS (`src/utils/ipfsService.js`)
  - Store consent artifacts and audit records; render returned CIDs and link to gateways.

- Security and compliance
  - Validate inputs, sanitize text, enforce scopes and expiries; handle multi-sig approvals where `requiresMultiSig` is true.

## Pending work / backlog

- Replace simulated timeouts with real blockchain and IPFS integrations.
- Implement multi-signature approval flow for requests marking `requiresMultiSig`.
- Persist data (active/pending/history) to a backend or on-chain event indexer; add pagination and filters.
- Robust error states, retries, and optimistic updates with rollback on failure.
- Notifications/toasts for actions (approved/denied/revoked/minted) with details.
- Access scope enforcement and validation of requested categories vs granted consent.
- Tests: unit (helpers/formatters), component (cards and tabs), e2e for approve/deny/revoke/mint.
- Accessibility: focus management, ARIA for tabs/buttons, keyboard navigation.
- Performance: list virtualization for history and pending, memoization of heavy components.
- Types: adopt TS or add JSDoc for consent/request/history models and handlers.
- i18n/localization scaffolding.

## Troubleshooting

- If the dev URL/port differs, use the one Vite prints.
- Check the browser console for simulated action logs (approve/deny/revoke/mint/emergency).
- If chain links don’t open, ensure the tx hash is valid or your network is set to Sepolia (for the provided links).
