# Utils module

This folder contains shared service clients, helpers, and mock data used across pages. Most services are scaffolded for demo and can be wired to real infra (OpenAI, IPFS, blockchain) when ready.

## Files at a glance

- `blockchainService.js` — wallet/network helpers and stubs for chain interactions (connect/disconnect, switch network, status, tx logging).
- `ipfsService.js` — helper functions to store/fetch content on IPFS (mocked; replace with a real gateway/pinning service).
- `openaiClient.js` — initializes an OpenAI client from environment/config.
- `openaiService.js` — higher-level functions that call the client to generate analyses/summaries.
- `mockHealthData.js` — sample data for health metrics, records, etc., to power the UI without a backend.
- `cn.js` — classnames utility for composing Tailwind classes.

## Quick start

- Environment (optional but recommended when wiring real services):
  - OpenAI: set `OPENAI_API_KEY` in your environment (or integrate a backend proxy if you don’t want keys in the client).
  - IPFS: set your pinning/gateway credentials if your implementation requires them.
  - Blockchain: ensure a provider is available (e.g., MetaMask injects `window.ethereum`).

- Start the app:
  - `npm install`
  - `npm run start`

## How to use (common patterns)

- Importing services
  - `import { blockchainService } from '@/utils/blockchainService'`
  - `import { ipfsService } from '@/utils/ipfsService'`
  - `import { openaiService } from '@/utils/openaiService'`
  - `import { cn } from '@/utils/cn'`

- blockchainService (typical API surface)
  - `connect()` — connect a wallet and return `{ address, chainId, network, balance }`.
  - `disconnectWallet()` — clear any held connections/sessions.
  - `switchToSepolia()` — request chain switch to Sepolia.
  - `getNetworkStatus()` — returns `{ connected: boolean, chainId, name }`.
  - Usage example:
    - ```js
      const info = await blockchainService.connect();
      const status = await blockchainService.getNetworkStatus();
      if (status?.name !== 'Sepolia') await blockchainService.switchToSepolia();
      ```

- ipfsService (typical API surface)
  - `addJSON(obj)` — store JSON content; returns a CID/hash.
  - `addFile(file|blob)` — store a file; returns a CID/hash.
  - `get(cid)` — fetch content by CID.
  - Usage example:
    - ```js
      const cid = await ipfsService.addJSON({ foo: 'bar' });
      const data = await ipfsService.get(cid);
      ```

- openaiClient/openaiService
  - `openaiClient.js` initializes the SDK; `openaiService.js` exposes domain functions like `generateHealthSummary(input)` or `analyzeRecord(record)`.
  - Usage example:
    - ```js
      const summary = await openaiService.generateHealthSummary({ records: [...] });
      ```

- mockHealthData
  - Import and use to populate components without making network calls.

- cn
  - `cn('base', condition && 'modifier')` to compose class names safely.

## Changing these utilities (extending/replacing)

- Update or replace a service
  - Keep function names stable if pages already import them (e.g., `getNetworkStatus`, `switchToSepolia`).
  - If you must change names or signatures, search usages and update imports and calls in pages/components.

- Add a new function
  - Export it from the service file and write a small usage doc snippet in this README to keep conventions clear.

- Environment & security
  - Don’t expose private keys in the client. Prefer backend proxies for sensitive operations.
  - Validate inputs, handle timeouts, and sanitize outputs before rendering.

- Route impacts (when services affect navigation)
  - Routes live in `src/Routes.jsx`. If a service change requires new pages or paths, add/update `<Route>` entries and fix incoming links.

## Pending work / backlog

- Implement real `blockchainService` adapters (wagmi/ethers or viem), including network switch and error cases.
- Implement `ipfsService` with a pinning provider (e.g., web3.storage, Pinata) and robust fetch with fallbacks.
- Implement `openaiService` with streaming, safety filters, and cost controls; consider server-side proxying.
- Add retries, exponential backoff, and user-visible errors for all network-bound functions.
- Add unit tests for each service; mock external deps.
- Add TypeScript types or JSDoc for public service contracts.
- Rate limiting and debouncing where needed (OpenAI, IPFS writes).
- Centralized config for endpoints, API keys, and feature flags.

## Troubleshooting

- OpenAI errors: ensure `OPENAI_API_KEY` is set and CORS isn’t blocking browser calls; prefer a backend proxy.
- IPFS fetch failures: verify gateway/pinning provider availability and CIDs; add multiple gateways as fallback.
- Wallet issues: ensure a provider is present (MetaMask), check network chain ID, and verify permissions.
- Import errors: confirm path aliases (e.g., `@/utils/...`) match your `jsconfig.json` or adjust to relative paths.
