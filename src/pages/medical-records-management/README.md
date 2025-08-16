# Medical Records Management (page)

This page (`src/pages/medical-records-management/index.jsx`) lets you browse, filter, select, view details, download, and share medical records. It also supports bulk actions and AI summary generation (mocked). All data and actions here are simulated for demo; wire them to real services as needed.

## Quick start

- Install deps (once): `npm install`
- Start dev server: `npm run start`
- Open the URL and navigate to `/medical-records-management`.

## How it works (overview)

- State
  - `selectedRecords`: array of selected record IDs for bulk actions.
  - `filters`: object driving filtering and sorting (search/category/provider/dates/storage/sortBy/hasAISummary/isEncrypted).
  - `isFiltersCollapsed`: toggles the filters sidebar.
  - `selectedRecord`, `isDetailPanelOpen`: controls the detail drawer for a single record.
  - `isShareModalOpen`, `recordToShare`: controls the share modal and its target record.
  - `isLoading`: initial page load spinner (simulated 1s).

- Data
  - `mockRecords`: local array of records. A record can include: title, category, provider, date, description, isEncrypted, storage (ipfs/onchain), hasAISummary, aiSummary, aiSummaryDate, keyDetails, fullContent, attachments, auditTrail.

- Derived lists and counts
  - `filteredRecords` (useMemo): applies filters and sort.
  - `recordCounts` (useMemo): shows total, filtered, and count with AI summaries.

- Filtering logic
  - Search matches title/description/provider (case-insensitive).
  - Category exact match; provider contains; dateFrom/dateTo range; storage exact match.
  - hasAISummary and isEncrypted are tri-state (true/false/null=ignore).
  - Sorting options: date_desc (default), date_asc, title_asc, title_desc, provider_asc.

- Actions (simulated)
  - View record: opens detail panel.
  - Download: console log placeholder.
  - Share: opens modal; `onShare` resolves a mock link.
  - Generate AI summary: returns after ~2s (placeholder).
  - Bulk download/share: console log placeholders.

- Layout
  - Left: `RecordFilters` sidebar (collapsible).
  - Top: page header with stats (Total/Filtered/AI Summaries/Selected) and quick buttons (Select All/Upload Record).
  - Middle: `BulkActions` toolbar (download/share/deselect).
  - Main list: `RecordCard` items with per-record actions and selection.
  - Drawer: `RecordDetailPanel` shows details and actions.
  - Modal: `ShareModal` to create a share link.

## How to use

- Filter records
  - Use the sidebar to apply filters; collapse/expand as needed.
  - Clear all with the "Clear All Filters" button.

- Select records
  - Click the checkbox on cards to select/deselect.
  - Use "Select All"/"Deselect All" at the top.

- View details
  - Click a card’s View action to open the detail panel; download/share/generate AI summary from there.

- Share records
  - Use per-record Share or bulk Share; the modal returns a mock share link.

- Bulk actions
  - When records are selected, use the Bulk Actions bar for download/share/deselect.

## Where to customize

- Filters defaults: `filters` initial state in `index.jsx`.
- Sort options: `filters.sortBy` default and the switch in the sort function.
- Mock data: `mockRecords` array; add fields like `attachments`, `auditTrail`, or `aiSummary` as needed.
- Cards and panels: components under `src/pages/medical-records-management/components/` (`RecordCard.jsx`, `RecordFilters.jsx`, `RecordDetailPanel.jsx`, `BulkActions.jsx`, `ShareModal.jsx`).
- Loading UX: `isLoading` timing and spinner area.
- Sharing output: shape returned from `handleShare` (e.g., include expiry, permissions).

## Changing the route (path/component)

Routes are in `src/Routes.jsx`:

- Change this page’s path
  - Edit: `<Route path="/medical-records-management" element={<MedicalRecordsManagement />} />`
  - Replace the string with your new path (e.g., `/records`).

- Make this page the home route
  - Home is: `<Route path="/" element={<AIHealthAssistantAnalysis />} />`
  - Swap to `<MedicalRecordsManagement />` to make it the default.

- Add an alias path
  - Add: `<Route path="/your-alias" element={<MedicalRecordsManagement />} />`

- If you rename/move this page
  - Update the import at the top of `src/Routes.jsx` to match the new path.

- Protect the route (auth-gate)
  - Wrap with `AuthenticationGate` from `src/components/ui/AuthenticationGate.jsx`.

- Lazy-load (optional)
  - `const MedicalRecordsManagement = React.lazy(() => import('./pages/medical-records-management'))` and render in `<Suspense>`.

- Update links
  - Search for links/buttons pointing to the old route string and update them.

## Wiring to real services (optional next steps)

- Records API
  - Fetch records from a backend or indexer; add pagination, server-side filters/sorts.
  - Resolve attachments and trigger real downloads.

- Share links
  - Create time-bound, permissioned share links; persist and show access counts/history.

- AI summaries
  - Use your AI service to generate summaries; store the output (IPFS or DB) and display timestamps.

- Blockchain/IPFS
  - Persist records and audit events on-chain/IPFS; replace placeholders with real tx hashes/CIDs.

## Pending work / backlog

- Replace `mockRecords` and timeouts with live services; add error/empty/skeleton states and retries.
- File uploads with progress, validation, and virus scanning.
- Real downloads (attachments, PDFs) and content viewers.
- Bulk operations with streaming/progress and failure handling.
- Toaster notifications for actions (share generated, download started, AI summary ready).
- Accessibility: keyboard/focus for list items, drawer, and modal; ARIA labels.
- Performance: virtualization for large lists, memoize heavy components, debounce filters.
- Tests: unit (filters/sorts), component (cards/panels), and e2e for selection, bulk, and share.
- Types: TS or JSDoc for record/share models and handler contracts.
- i18n/localization scaffolding.

## Troubleshooting

- If the dev URL/port differs, use the one Vite prints.
- If no records show, relax filters or click "Clear All Filters".
- If downloads/shares appear no-op, check the console logs (these are placeholders in the mock).
