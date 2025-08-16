# Wallet Connection & Authentication (page)

This page (`src/pages/wallet-connection-authentication/index.jsx`) handles connecting a crypto wallet, displaying connection details, basic network status, and guiding users into the app. It uses a hybrid flow: simulated data for legacy selections and real hooks via `blockchainService` when available.

## Quick start

- Install deps (once): `npm install`
- Start dev server: `npm run start`
- Open the URL and navigate to `/wallet-connection-authentication`.

## How it works (overview)

- State
  - `connectionState`: `disconnected | connecting | connected`.
  - `error`: last connection error message (if any).
  - `currentNetwork`: display name (Sepolia/Mainnet/Unknown) derived from chain ID changes or wallet info.
  - `networkStatus`: `connected | disconnected` (from `blockchainService.getNetworkStatus`).
  - `walletInfo`: `{ address, type, did, balance, network, chainId }`.
  - `showAdvanced`: toggles the advanced section with `NetworkStatus`.

- Connection flow (`handleWalletSelect`)
  - Sets `connecting` and clears errors.
  - If `walletData` is a string (e.g., "metamask", "walletconnect", "coinbase", others → "Trust Wallet"):
    - Simulates a 2s connection and builds a mock `walletInfo` (Sepolia, chainId `11155111`).
  - Else treats `walletData` as a real wallet info object (when provided by a concrete wallet adapter/service).
  - On success: saves to localStorage (`walletConnected`, `walletInfo`), sets `connected`, updates `currentNetwork`.
  - On failure: sets `error` and returns to `disconnected`.

- Disconnect (`handleDisconnect`)
  - Calls `blockchainService.disconnectWallet()`.
  - Clears state and removes `walletConnected`/`walletInfo` from localStorage.

- Reconnect on mount
  - Reads saved `walletConnected` and `walletInfo` from localStorage.
  - If a provider exists (`window.ethereum`), tries `eth_accounts` to verify the session is still valid.
  - If valid: queries `blockchainService.getNetworkStatus()` and updates state accordingly.
  - If not: falls back to saved info or clears invalid cache.

- Provider events
  - `accountsChanged`: disconnect if no accounts; otherwise update `walletInfo.address` and `did` when account changes.
  - `chainChanged`: convert hex chainId → decimal and set `currentNetwork` (11155111 → Sepolia, 1 → Mainnet, else Unknown).

- Network switch (`handleNetworkSwitch`)
  - If not on Sepolia, calls `blockchainService.switchToSepolia()` to switch; updates `currentNetwork` or sets `error` on failure.

- UI structure
  - Sticky header with app brand and a small network pill (dot reflects `networkStatus`).
  - Main content:
    - If connected → `ConnectedWalletInfo` with address, type, DID, balance, Disconnect, and Continue to Dashboard.
    - If disconnected → `WalletSelector` (shows error and connecting state if applicable).
    - Advanced toggle reveals `NetworkStatus` panel.
  - Right sidebar (desktop) shows `SecurityFeatures` (when not connected) and `TrustIndicators`.
  - Footer with terms/privacy and small links.

## How to use

- Choose a wallet in `WalletSelector`.
- If prompted, approve in your wallet (MetaMask, Coinbase Wallet, etc.).
- If connected on a different chain, click "Switch to Sepolia".
- Review your address/DID/balance on the connected screen and click Continue to go to the dashboard.
- Use Disconnect to clear the session.
- Toggle Advanced to view network status details.

## Where to customize

- Wallet types and mapping
  - Update the selection list in `WalletSelector` and the type mapping in `handleWalletSelect`.

- Blockchain hooks
  - Implement/extend `blockchainService`: `connect`, `disconnectWallet`, `getNetworkStatus`, `switchToSepolia`.
  - Add balance/chain retrieval via wagmi/ethers and surface into `walletInfo`.

- Navigation
  - Change the dashboard route in `handleNavigateToDashboard`.

- Network names
  - Extend `handleChainChanged` mapping for additional chains.

- UI/Copy
  - Tweak header/footer text, terms links, and sidebar components.

## Changing the route (path/component)

Routes are defined in `src/Routes.jsx`:

- Change this page’s path
  - Edit: `<Route path="/wallet-connection-authentication" element={<WalletConnectionAuthentication />} />`
  - Replace the string with your new path (e.g., `/connect`).

- Make this page the home route
  - Home is: `<Route path="/" element={<AIHealthAssistantAnalysis />} />`
  - Swap the component to `<WalletConnectionAuthentication />` if you want this as the landing page.

- Add an alias path
  - Add: `<Route path="/your-alias" element={<WalletConnectionAuthentication />} />`

- If you rename/move this page
  - Update the import at the top of `src/Routes.jsx` to the new file path.

- Protect the route (auth-gate)
  - Wrap with `AuthenticationGate` from `src/components/ui/AuthenticationGate.jsx`.

- Lazy-load (optional)
  - `const WalletConnectionAuthentication = React.lazy(() => import('./pages/wallet-connection-authentication'))` and render in `<Suspense>`.

- Update links
  - Search for links/buttons pointing to the old route string and update them.

## Wiring to real services (optional next steps)

- Wallet connection
  - Use wagmi + ethers (or viem) to implement connect/disconnect, chain switching, account/chain listeners.
  - Support WalletConnect v2 for mobile/QR connections.

- Session persistence
  - Harden localStorage handling, encrypt sensitive fields if stored, and auto-reconnect with proper prompts.

- DID and profile
  - Resolve DID docs, attach profile metadata, and expose verified credentials.

- Error handling & UX
  - Standardize error messages, add toasts, retries, and a status area.

## Pending work / backlog

- Replace simulated legacy connect with real wallet flows across providers.
- Add WalletConnect v2 and Coinbase Wallet SDK support.
- Improve network switching UX (multi-chain list, auto-detect, chain add requests).
- Robust account/chain change handling with toasts and refresh prompts.
- Balance and token fetch with caching; fiat display toggle.
- Security: never store secrets; validate provider presence; permission prompts; phishing warnings.
- Accessibility: keyboard navigation, ARIA for buttons and toggles, focus management on connect/disconnect.
- Tests: unit (service adapters), component (selector/info panels), and e2e flows for connect/disconnect/switch.
- Types: TypeScript or JSDoc for `walletInfo` and service contracts.
- i18n/localization scaffolding.

## Troubleshooting

- If no wallet is detected, ensure MetaMask or another provider injects `window.ethereum`.
- If saved session doesn’t restore, check localStorage entries and provider account availability.
- If network shows Unknown, verify `chainChanged` mapping and your chain ID.
- If clipboard/share actions fail, check browser permissions or use a fallback.
