# Health Dashboard Overview (page)

This page (`src/pages/health-dashboard-overview/index.jsx`) shows a high-level overview of your health status, recent activity, quick actions, wallet/network status, security posture, and consent/sharing summaries. It uses mocked in-memory data and simulated actions; it’s ready to wire to real services.

## Quick start

- Install deps (once): `npm install`
- Start dev server: `npm run start`
- Open the URL and navigate to `/health-dashboard-overview` (also reachable from other pages via navigation).

## How it works (overview)

- State
  - `isRefreshing`: shows loading state when refreshing the health summary.
  - `walletConnected`, `currentNetwork`: header state; network toggles Sepolia/Mainnet (UI only).
  - `emergencyConfigured`: indicates whether emergency is set up (mocked true).

- Mock data rendered on the page
  - `healthSummary`: last updated time, risk level, key insights, and summary metrics.
  - `recentActivities`: mixed events (AI summary, consent granted/revoked, records accessed, secure link created) with timestamps, tx hashes, and storage type (ipfs/blockchain).
  - `approvedProviders`: list of providers with permissions and expiration windows.
  - `activeSharingLinks`: temporary share links with expiry and access count.
  - `securityStatus`: overall security level and features (E2EE, multisig, immutable trail, ZKPs).
  - `recentAccessAttempts`: authorized/blocked attempts displayed in Security panel.
  - `emergencyContacts`: used by header indicator only in this page.

- Handlers (simulated)
  - `handleRefreshSummary`: sets `isRefreshing` briefly.
  - `handleViewAllActivities`: navigates to `/medical-records-management`.
  - `handleEmergencyAccess`: navigates to `/emergency-access-contacts`.
  - `handleManageConsent`: navigates to `/consent-access-management`.
  - `handleRevokeProvider`, `handleRevokeLink`: log placeholders for revocation.
  - Wallet/network: `handleWalletConnect`, `handleNetworkSwitch`.
  - Emergency: `handleEmergencyActivate` logs a message.
  - DID helpers: `handleCopyDID` copies a DID to clipboard; `handleShareDID` uses Web Share API if available.

- Rendering structure
  - Header: passes wallet/network/emergency props and callbacks.
  - Breadcrumb and welcome section.
  - Main grid
    - Left (xl:3 cols):
      - `HealthSummaryCard` with refresh control.
      - `QuickActionCards` (includes emergency access shortcut).
      - `RecentActivityFeed` with a "View All" button.
      - `SecurityStatusIndicator` visible on mobile/tablet here.
    - Right (xl:1 col):
      - `WalletStatusCard` (address, network, DID, actions).
      - `SecurityStatusIndicator` for desktop.
      - `ConsentStatusSidebar` (providers, sharing links, consent management button).

## How to use

- Refresh summary: click refresh on the Health Summary card (shows brief loading).
- Quick actions: open emergency access page via the Quick Actions section.
- Review recent activities: scroll the feed; click View All to go to records management.
- Check wallet/network: switch networks in the Wallet card; copy/share DID.
- Consent & sharing: revoke a provider or link from the sidebar; jump to Consent Management.

## Where to customize

- Data sources
  - Health summary: `healthSummary` object.
  - Recent activity: `recentActivities` array (type, tx hash, storage type).
  - Providers and links: `approvedProviders`, `activeSharingLinks`.
  - Security: `securityStatus`, `recentAccessAttempts`.

- Behavior & navigation
  - Destinations for View All / Manage Consent / Emergency Access.
  - Revocation handlers: `handleRevokeProvider`, `handleRevokeLink`.
  - Header controls: wallet connect, network switch, emergency activation.

- UI components
  - Cards and indicators in `src/pages/health-dashboard-overview/components/`:
    - `HealthSummaryCard.jsx`, `RecentActivityFeed.jsx`, `QuickActionCards.jsx`, `SecurityStatusIndicator.jsx`, `ConsentStatusSidebar.jsx`, `WalletStatusCard.jsx`.

## Changing the route (path/component)

Routes live in `src/Routes.jsx`:

- Change this page’s path
  - Edit: `<Route path="/health-dashboard-overview" element={<HealthDashboardOverview />} />`
  - Replace the string with your new path (e.g., `/dashboard`).

- Make this page the home route
  - Home is: `<Route path="/" element={<AIHealthAssistantAnalysis />} />`
  - Swap the component to `<HealthDashboardOverview />` to set as default landing page.

- Add an alias path
  - Add: `<Route path="/your-alias" element={<HealthDashboardOverview />} />`

- If you rename/move this page
  - Update the import at the top of `src/Routes.jsx` to the new path.

- Protect the route (auth-gate)
  - Wrap with `AuthenticationGate` from `src/components/ui/AuthenticationGate.jsx`.

- Lazy-load (optional)
  - `const HealthDashboardOverview = React.lazy(() => import('./pages/health-dashboard-overview'))` and render in `<Suspense>`.

- Update links
  - Find and update any internal links pointing to the old route string.

## Wiring to real services (optional next steps)

- Activities & summaries
  - Fetch recent activities and summaries from your backend or indexer; link tx hashes to the correct explorer.

- Consent & sharing
  - Implement revoke provider/link flows; persist state and surface errors/success.

- Security indicator
  - Populate real security features, last audit, and recent access attempts.

- Wallet & DID
  - Connect wallet logic (wagmi/ethers), DID resolution, and share helpers.

## Pending work / backlog

- Replace mocked data with live API/chain data; add pagination and filters for activities.
- Implement provider/link revocation with confirmation, optimistic updates, and rollback.
- Error/empty/loading states across all sections; retries and toasts.
- Tests: unit (helpers), component (cards/sidebars), e2e for navigation and key actions.
- Accessibility: headings hierarchy, ARIA on buttons/links/cards, keyboard navigation.
- Performance: memoization, virtualization for long lists, selective re-renders.
- Types: TypeScript or JSDoc models for activities, providers, links, and security items.
- i18n/localization scaffolding.
- Telemetry/privacy review; redact PII in logs; audit handling of tx hashes and links.

## Troubleshooting

- If the dev URL/port differs, use the one Vite prints to the console.
- If navigation buttons don’t work, ensure `react-router-dom` is configured and the routes exist in `src/Routes.jsx`.
- If wallet/DID actions seem no-op, confirm browser permissions for clipboard/share APIs.
