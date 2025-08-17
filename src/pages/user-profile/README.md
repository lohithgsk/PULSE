# User Profile Page

This module provides a user profile UI with sections for profile header, personal information, contact details, and application settings. It follows the site-wide theming documented in THEME.md (tokens, surfaces, borders, spacing, and motion).

Components:
- `ProfileHeader.jsx` — Displays user name, avatar, and a short summary.
- `PersonalInfoPanel.jsx` — Form for editing personal info (first/last name, DOB).
- `ContactInfoPanel.jsx` — Form for editing email and phone.
- `SettingsPanel.jsx` — App settings (notifications, language). Theme toggle is a placeholder (no dark mode by default).

Page entry:
- `index.jsx` — Assembles the components in a responsive grid with consistent spacing.

Notes:
- This page relies on the global `AppLayout` applied by routing (do not wrap `AppLayout` again inside the page to avoid duplicate headers).
- Uses UI primitives (`Button`, `Input`, `Checkbox`, `Select`) and `useToast` for feedback.
