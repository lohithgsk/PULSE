# AI Health Assistant & Analysis (page)

This page (`src/pages/ai-health-assistant-analysis/index.jsx`) provides an AI-driven health chat, permissions control, health summaries, and analysis history. It’s currently a fully mocked UI with realistic flows, ready to wire to real services.

## Quick start

- Install deps (once): `npm install`
- Start dev server: `npm run start`

## What you can do

- Tabs and layout
  - Four tabs: Chat, Health Summaries, AI Permissions, Analysis History.
  - Desktop shows tabs across the top; mobile uses a segmented control.

- Processing overlay
  - When actions run (sending a message, regenerating or generating a summary), `isProcessing` turns on and a progress/stage cycle runs: analyzing → generating → encrypting → logging → finalizing.
  - `processingProgress` increments on an interval until completion; overlay then hides.

- Chat flow
  - `handleSendMessage` appends the user message and triggers processing.
  - After a delay, `generateAIResponse(userMessage)` returns a keyword-based reply and an AI message is appended.
  - AI messages include meta flags (encrypted, blockchainLogged) and optional `sources`.

- Permissions
  - `aiPermissions` toggles granular data flags in UI only. In the mock, they don’t yet restrict `generateAIResponse`.

  - `healthSummaries` and `analysisHistory` are mock arrays rendered in their respective tabs.
  - Export/View/Delete currently log to the console; Regenerate/Generate trigger the overlay.

- Header controls
  - Wallet connect toggle, network switch (Sepolia/Mainnet), and emergency activation are UI-only with console logs.

The page has four tabs (top-left on desktop; segmented control on mobile):

1) AI Assistant (Chat)
- Type a message and press send.
- A simulated processing overlay runs through stages: analyzing → generating → encrypting → logging → finalizing.
- After ~6s you’ll get an AI response based on simple keyword routing:
  - "blood pressure" → BP insights
  - "medication" or "drugs" → current meds
  - "lab" or "results" → recent lab results
  - "summary" or "doctor" → offer to generate a health summary
  - otherwise → a generic guidance reply
- Each AI message shows meta flags: encrypted, blockchain logged, optional data sources.

2) Health Summaries
- Shows a mock “Comprehensive Health Summary”.
- Actions:
  - Export: simulated (logs to console)
  - Regenerate: triggers the processing overlay
- “Generate New Summary” also triggers the processing overlay.

3) AI Permissions
- Toggle granular data access flags (e.g., medical_records, lab_results, medications, etc.).
- Note: In this mock, toggles update state and UI only; they’re not yet enforced in `generateAIResponse`.

4) Analysis History
- Lists prior analyses with type, confidence, and an IPFS hash placeholder.
- Actions:
  - View: simulated (logs to console)
  - Delete: simulated (logs to console)

## Header controls

- Wallet: toggles connected state
- Network: switches between Sepolia/Mainnet (UI only)
- Emergency: triggers an activation log (placeholder)

## Where to customize

- Initial chat greeting/messages: `messages` state in `index.jsx`
- AI routing/answers: `generateAIResponse(userMessage)` in `index.jsx`
- Permissions defaults: `aiPermissions` state in `index.jsx`
- Health summaries data: `healthSummaries` in `index.jsx`
- Analysis history items: `analysisHistory` in `index.jsx`
- Processing behavior (speed/stages):
  - `isProcessing`, `processingStage`, `processingProgress` state
  - `useEffect` interval that advances progress and stages

## Changing the route (path/component)

Most route changes happen in `src/Routes.jsx`:

- Change this page’s path
  - Edit the line: `<Route path="/ai-health-assistant-analysis" element={<AIHealthAssistantAnalysis />} />`
  - Replace the string with your new path (e.g., `/assistant`).

- Make a different page the home route
  - The home route is `<Route path="/" element={<AIHealthAssistantAnalysis />} />`.
  - Swap the component there to the page you prefer as default.

- Add an additional alias path for this page
  - Add another `<Route path="/your-alias" element={<AIHealthAssistantAnalysis />} />`.

- If you rename/move this page file/folder
  - Update the import at the top of `src/Routes.jsx` to the new path.

- Protect the route (auth-gate)
  - Wrap the element with `AuthenticationGate` (available in `src/components/ui/AuthenticationGate.jsx`).

- Lazy-load the page (optional)
  - Use `React.lazy(() => import('./pages/ai-health-assistant-analysis'))` and wrap in `<Suspense>`.

- Update links
  - Search for links/buttons pointing to the old path and update them to the new route string.

## Wiring to real services (optional next steps)

- OpenAI / LLM: `src/utils/openaiService.js` and `openaiClient.js`
  - Replace `generateAIResponse` with an async call; update `sources`, `confidence`, etc.
- IPFS: `src/utils/ipfsService.js`
  - Store summaries/analyses, then render returned CIDs instead of placeholders.
- Blockchain/Audit: `src/utils/blockchainService.js`
  - Log events and display real transaction hashes.

## Pending work / backlog

- Enforce permissions in responses and data fetches based on `aiPermissions`.
- Replace `generateAIResponse` with real LLM calls (streaming if desired); handle timeouts and errors.
- Persist conversations/summaries to IPFS via `ipfsService`; render real CIDs (and open in a gateway).
- Emit and display real blockchain audit logs (tx hash, link to explorer).
- Robust error/empty/loading states across all tabs; retry flows.
- Tests: unit (helpers), component (tabs/cards), and basic e2e for navigation and chat.
- Accessibility: keyboard/focus management for chat input and controls; ARIA labels.
- Performance: memoization, list virtualization for long chats/history; debounce inputs.
- Types: add TS or JSDoc models for messages, summaries, permissions, and handlers.
- State management: lift shared state or move to Redux if cross-page usage grows.
- i18n/localization scaffolding.
- Telemetry/analytics (opt-in), redaction, and privacy reviews.
- Security: sanitize user input, rate limit API calls, validate IPFS hashes.
- UX polish: skeletons/placeholders for cards, finer mobile spacing, toasts for actions.

## Troubleshooting

- If the dev URL/port differs, use the one Vite prints to the console.
- Check the browser console for the simulated actions (export/view/delete/emergency).
- If Tailwind styles look off, ensure PostCSS/Tailwind config files are present and the dev server restarted.
