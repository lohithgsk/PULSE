# Emergency Access & Contacts (page)

This page (`src/pages/emergency-access-contacts/index.jsx`) manages emergency contacts, break-glass activation, access simulation, medical alerts, and audit views. It’s a mocked, stateful UI wired for future blockchain/IPFS integrations.

## Quick start

- Install deps (once): `npm install`
- Start dev server: `npm run start`
- Open the URL and navigate to `/emergency-access-contacts` (also reachable via in-app links).

## How it works (overview)

- Tabs and layout
  - Five tabs: Emergency Contacts, Break Glass, Access Simulator, Medical Alerts, Audit Log.
  - Active tab is tracked by `activeTab`; mobile layout scrolls horizontally.

- State and data (mocked)
  - `emergencyContacts`: array of contacts with relationship, accessLevel, verification, permissions, dateAdded.
  - `medicalAlerts`: array of alert definitions (condition, severity, flags like immediateAccess/notify/autoActivate).
  - `isBreakGlassActive`: toggles whether break-glass is currently active.
  - `newContact`: form state for adding a contact.
  - `editingContactId`: which card is in edit mode.
  - Wallet/network state is handled via `Header` props.

- Handlers
  - Add/Update/Delete/Verify contacts: `handleAddContact`, `handleUpdateContact`, `handleDeleteContact`, `handleVerifyContact`.
  - Edit toggle per card: `handleEditToggle`.
  - Break-glass: `handleBreakGlassActivate`, `handleBreakGlassDeactivate` (local toggle).
  - Simulate access: `EmergencyAccessSimulator` calls `onSimulate` (console log).
  - From Header: `onEmergencyActivate={() => setActiveTab('break-glass')}` focuses the Break Glass tab.

- Rendering
  - Contacts tab: list of `EmergencyContactCard` with edit/verify/delete controls; includes an add-contact form.
  - Break Glass tab: shows `BreakGlassPanel` with `activationHistory` (mock txHash & timestamp) and activate/deactivate.
  - Simulator tab: select a contact and simulate an access request.
  - Alerts tab: configure medical alerts via `MedicalAlertsConfig` (updates `medicalAlerts`).
  - Audit tab: `EmergencyAccessAuditLog` (mocked component) displays audit entries.

## How to use

1) Manage contacts
- Click “Add Contact”, fill required fields (name, relationship, phone), choose access level and permissions, then save.
- Use verify/edit/delete on each contact card as needed.

2) Break-glass control
- Switch to Break Glass tab; Activate or Deactivate emergency access.
- When active, a banner shows on the page with a Manage button.

3) Access simulation
- Use the Simulator tab to simulate which data a selected contact would access.

4) Medical alerts
- Add/edit alerts that can trigger notifications or break-glass auto-activation in real integrations.

5) Audit log
- Review (mock) emergency access events.

## Where to customize

- Initial data
  - Contacts: `emergencyContacts` state in `index.jsx`.
  - Alerts: `medicalAlerts` state in `index.jsx`.
  - Add-contact defaults: `newContact` state in `index.jsx`.

- Options and UI
  - Relationship options: `relationshipOptions`.
  - Access levels: `accessLevelOptions` (labels/descriptions).
  - Tabs: `tabs` array (labels/icons/order).

- Behavior
  - Break-glass banner and routing to the tab.
  - Validation of required fields for adding contacts.
  - Edit mode toggling and verification.

## Changing the route (path/component)

Route config is in `src/Routes.jsx`:

- Change this page’s path
  - Edit: `<Route path="/emergency-access-contacts" element={<EmergencyAccessContacts />} />`
  - Replace the string with your new path (e.g., `/emergency`).

- Make this page the home route
  - Home is: `<Route path="/" element={<AIHealthAssistantAnalysis />} />`
  - Swap component to `<EmergencyAccessContacts />` if desired.

- Add an alias path
  - Add: `<Route path="/your-alias" element={<EmergencyAccessContacts />} />`

- If you rename/move this page
  - Update the import at the top of `src/Routes.jsx` to the new file path.

- Protect the route (auth-gate)
  - Wrap with `AuthenticationGate` from `src/components/ui/AuthenticationGate.jsx`.

- Lazy-load (optional)
  - `const EmergencyAccessContacts = React.lazy(() => import('./pages/emergency-access-contacts'))` and render inside `<Suspense>`.

- Update links
  - Search for `<Link to="/emergency-access-contacts">` usage and adjust paths.

## Wiring to real services (optional next steps)

- Break-glass on-chain
  - Implement activate/deactivate transactions; capture tx hash, block, and status; reflect failures and confirmations.

- Contact verification
  - Add verification workflow (e.g., email/SMS or on-chain attestations) and persist verification status.

- Alerts integration
  - Hook alerts to monitoring and notification systems; respect `autoActivateBreakGlass`.

- Audit log
  - Persist and fetch audit entries from chain events or a backend indexer.

## Pending work / backlog

- Persist contacts/alerts to a backend or on-chain storage; implement edit history and soft-delete.
- Implement real break-glass protocol with blockchain audit trail; show tx details.
- Add notifications/toasts and error handling for all actions.
- Add form validation, masking for phone, and accessibility for inputs.
- Tests: unit (helpers), component (cards/panels), e2e for add/edit/delete/verify/activate.
- Performance: list virtualization for large contact lists; memoize heavy child components.
- Types: migrate to TS or add JSDoc for contact/alert models and handlers.
- i18n/localization scaffolding.

## Troubleshooting

- If the dev URL/port differs, use the one Vite prints.
- Check the browser console for simulated action logs (add/edit/delete/verify/activate/deactivate/simulate).
- If the Break Glass banner doesn’t appear, ensure `isBreakGlassActive` toggles or activate via the Break Glass tab.
