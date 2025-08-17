# PULSE Frontend Theming Guide

This document explains how theming works across the PULSE frontend and how to create new pages and components that look and feel consistent without changing existing code.

It covers:
- Design tokens (CSS variables + Tailwind theme) and where they live
- Global styles and layout conventions
- Component-level theming patterns (Buttons, Inputs, Selects, Skeleton)
- Toast notifications: how to trigger and what styles/variants exist
- Breakpoints, spacing, shadows, motion, and z-index layering
- Best practices, pitfalls, and extension patterns


## Architecture overview

- Tailwind CSS provides utility classes and a theme extended in `tailwind.config.js`.
- CSS Variables define the design tokens and are consumed via Tailwind’s extended color palette and arbitrary values.
- Global CSS files:
  - `src/styles/tailwind.css` loads Tailwind’s base/components/utilities and defines the core CSS variables under `@layer base`.
  - `src/styles/index.css` adds a reset, safe-area padding helpers, global typography, and “surface” helpers.
- UI primitives (in `src/components/ui/`) implement consistent variants/sizes based on those tokens.
- The application wraps all routes with `AppLayout` (header + main container) and with a global `ToastProvider`.
- Entry point `src/index.jsx` imports `src/styles/tailwind.css` first, then `src/styles/index.css`.

Tip: Use Tailwind utilities that reference tokens (e.g., `bg-background`, `text-foreground`, `border-border`, `focus-visible:ring-ring`) to stay consistent and accessible.


## Design tokens (source of truth)

Tokens are defined as CSS variables and then mapped into Tailwind theme extensions for ergonomic use.

- Primary token definitions live in `src/styles/tailwind.css` under `@layer base :root`.
- They are surfaced in Tailwind via `tailwind.config.js` under `theme.extend.colors` and used as utilities like `bg-background` or `text-primary`.

Color tokens (subset; see files for full list):
- Base/system: `--color-background`, `--color-foreground`, `--color-border`, `--color-input`, `--color-ring`
- Surfaces: `--color-card`, `--color-card-foreground`, `--color-popover`, `--color-popover-foreground`, `--color-muted`, `--color-muted-foreground`
- Brand/semantic: `--color-primary`, `--color-primary-foreground`, `--color-secondary`, `--color-secondary-foreground`, `--color-accent`, `--color-accent-foreground`, `--color-success`, `--color-success-foreground`, `--color-warning`, `--color-warning-foreground`, `--color-error`, `--color-error-foreground`, `--color-destructive`, `--color-destructive-foreground`
- “Medical trust” palette (branding aids): `--color-medical-trust`, `--color-clinical-green`, `--color-clinical-amber`, `--color-clinical-red`, `--color-surface-clean`, `--color-text-primary`, `--color-text-secondary`

Tailwind color aliases (from `tailwind.config.js`):
- `bg-background` → `var(--color-background)`
- `text-foreground` → `var(--color-text-primary)`
- Component aliases: `bg-card`, `text-card-foreground`, `bg-popover`, `text-popover-foreground`, `bg-muted`, `text-muted-foreground`
- Semantic: `bg-primary`, `text-primary-foreground`, `bg-accent`, `bg-warning`, `bg-error`, `bg-success`, `bg-secondary`, etc.
- Input/ring: `border-input`, `ring-ring`, `bg-input`

Typography & fonts (from `tailwind.config.js` + `tailwind.css`):
- Sans stack: Inter, system fonts
- Mono stack: JetBrains Mono, Fira Code, Consolas, etc.
- Tailwind font sizes range from `xs` to `6xl` with balanced line-heights

Spacing, radii, shadows, motion, z-index, and screens (`tailwind.config.js`):
- Spacing: includes fine steps (`0.5`, `1.5`, `2.5`, `3.5`) and larger (`18`, `88`)
- Radius: `lg`, `xl`, `2xl`, `3xl`
- Shadows: `sm`, `DEFAULT`, `md`, `lg`, `xl`, `2xl` plus custom: `shadow-medical-card`, `shadow-medical-modal`, `shadow-medical-focus`
- Motion: keyframes for `fade-in/out`, `slide-up/down`, `scale-in/out`, `pulse-subtle`; durations (150–500ms) and timing functions
- Z-index scale with semantic names: `z-header`, `z-dropdown`, `z-sticky`, `z-banner`, `z-overlay`, `z-modal`, `z-popover`, `z-skipLink`, `z-toast`, `z-tooltip`
- Screens: `xs(475px)`, `sm(640px)`, `md(768px)`, `lg(1024px)`, `xl(1280px)`, `2xl(1536px)`

Custom utilities (`src/styles/tailwind.css`):
- Shadows: `.shadow-medical-card`, `.shadow-medical-modal`
- Transitions: `.transition-clinical`, `.transition-clinical-slow`, `.transition-blockchain`

Note on `src/styles/index.css`: This file also sets variables and component helpers (`.card`, `.panel`, `.bg-dark`, etc.). Prefer the variables defined in `tailwind.css` as the canonical source. You may see a few placeholder-like values (e.g., `#[var(--color-surface-alt)]F`); treat them as anomalies and avoid copying. Use the tokens from `tailwind.css` or Tailwind utilities.


## Global styles and layout

- Reset: `index.css` resets box model and removes default margins/padding.
- Body: `bg-background text-foreground`, scrollbar stabilization (`scrollbar-gutter: stable`), and safe-area helpers `.safe-x`, `.safe-t`.
- Root container: `#root { min-height: 100vh; }`
- Layout wrapper: `src/components/ui/AppLayout.jsx` applies a persistent `Header` (sticky, translucent) and a padded `main` container (`px-4 sm:px-6 lg:px-8 py-8`).
- Header: sticky at top with `z-header`, translucent `bg-background/95` + `backdrop-blur-sm`, and a border bottom. Navigation items use token-driven states.

Recommendation: When building new pages, rely on the protected routes wrapper (`<ProtectedRoute><AppLayout /></ProtectedRoute>`) so you inherit header, spacing, and background automatically.


## Component theming patterns

### Buttons (`src/components/ui/Button.jsx`)

- Built with `class-variance-authority` (CVA) and the `cn()` utility for safe class merging.
- Variants: `default`, `destructive`, `outline`, `secondary`, `ghost`, `link`, `success`, `warning`, `danger`.
- Sizes: `xs`, `sm`, `default`, `lg`, `xl`, `icon`.
- Tokens used: colors (`bg-primary`, `text-primary-foreground`, etc.), borders (`border-input`), focus (`focus-visible:ring-ring`, `ring-offset-background`).
- Icons: optional via `iconName` prop (renders `AppIcon`), position left/right, autoscales by size.
- Loading state: spinner prepended, disables interactions, keeps spacing.
- `asChild` support: Allows making any child element adopt button styles.

Usage example:

```jsx
import Button from "../components/ui/Button";

function Actions() {
  return (
    <div className="flex gap-2">
      <Button>Primary</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="success" iconName="Check">Saved</Button>
      <Button variant="destructive" loading>Deleting…</Button>
    </div>
  );
}
```

Design tips:
- Prefer variants over ad-hoc colors.
- Use `focus-visible` ring utilities for accessibility.
- For full-width CTAs, pass `fullWidth`.


### Inputs and form fields

Inputs (`src/components/ui/Input.jsx`):
- Default text inputs style: `bg-background`, `border-input`, `placeholder:text-muted-foreground`, focus ring uses `--color-ring`.
- Inline label/description/error rendering built-in. Error state swaps to `border-destructive` and `focus-visible:ring-destructive`.
- Supports `type="checkbox"` and `type="radio"` with compact tokenized styles.

Checkbox (`src/components/ui/Checkbox.jsx`):
- Custom visual with `Check`/`Minus` icons, sizes `sm|default|lg`.
- Colors align to tokens (`bg-primary`, `text-primary-foreground`, border variants). Label/description/error slots included.

Select (`src/components/ui/Select.jsx`):
- Styled trigger uses `border-input` + `bg-[var(--color-surface)]` to sit on top of surfaces.
- Dropdown uses a translucent `bg-popover/80` and `backdrop-blur-md`, with hover/selected using `accent`/`primary` tokens.
- Features: `multiple`, `searchable`, `clearable`, loading indicator; includes a hidden native `<select>` for form submission.

Skeleton (`src/components/ui/Skeleton.jsx`):
- Uses `animate-pulse rounded bg-muted` — place as a drop-in for loading states.

Cards and panels:
- Use tokenized surfaces and borders. Pattern:

```jsx
<section className="bg-card text-card-foreground border border-border rounded-xl shadow-medical-card p-4 md:p-6">
  {/* content */}
  <h2 className="text-lg font-semibold mb-2">Section title</h2>
  <p className="text-muted-foreground">Description or helper text</p>
  <div className="mt-4"><Button>Action</Button></div>
  {/* footer, etc. */}
  </section>
```

Motion:
- Use `transition-clinical` for a consistent snappy 200ms easing.
- Tailwind animations (e.g., `animate-[fade-in|slide-up|pulse-subtle]`) are available via config.


## Toast notifications

Provider and hook:
- `ToastProvider` is mounted in `App.jsx`. All pages/components can call the `useToast()` hook.
- API: `{ show, hide, success, error, info, warning }`.

Usage:

```jsx
import { useToast } from "../components/ui/ToastProvider";

function Example() {
  const toast = useToast();

  const handleSave = async () => {
    try {
      // await save…
      toast.success("Saved successfully", { duration: 3000 });
    } catch (e) {
      toast.error(e?.message || "Save failed");
    }
  };

  return <Button onClick={handleSave}>Save</Button>;
}
```

Styling and behavior (`src/components/ui/Toast.jsx`):
- Position: fixed bottom-right (`bottom-6 right-6`).
- Variants: `success`, `error`, `info`, `warning` each with semantic colors and an icon.
- Duration: default 4000ms; configurable via hook.
- Motion: slide-in + progress bar that depletes over time.
- Accessibility: the root has `role="alert"`; ensure messages are concise. For important flows, consider complementing with inline status near the action.
- Layering: uses `z-50` internally; if you add global overlays, prefer staying below the configured `z-toast` or adjust as needed.


## Breakpoints, spacing, and containers

- Use responsive paddings and gaps to scale layout (`px-4 sm:px-6 lg:px-8`, `space-y-2/3/4`).
- Cards/panels: rounded `rounded-xl` with `shadow-medical-card` work well on most surfaces.
- Limit widths with `max-w-*` scale from the theme for readable content (e.g., forms `max-w-lg` / `max-w-xl`).


## Building a new page (checklist)

1) Routing and layout
- For protected routes, add your page under the `<ProtectedRoute><AppLayout /></ProtectedRoute>` outlet to inherit header/background.
- For public routes, apply `min-h-screen bg-background px-4 sm:px-6 lg:px-8 py-8` at the page root to match spacing.

2) Surface + content structure
- Wrap content in a card/panel with tokens:

```jsx
<main className="space-y-6">
  <header className="flex items-center justify-between">
    <h1 className="text-2xl font-semibold text-foreground">Page title</h1>
  </header>

  <section className="bg-card text-card-foreground border border-border rounded-xl shadow-medical-card p-6">
    {/* Your content */}
  </section>
</main>
```

3) Forms and actions
- Use `Input`, `Checkbox`, and `Select` components to get correct focus, spacing, and error states.
- Use `Button` variants instead of custom colors. Prefer `success/warning/destructive` for status alignment.

4) Feedback
- Use `useToast()` for transient feedback. Pick variant by semantics and keep messages brief.

5) Motion and states
- Add `transition-clinical` to interactive elements; use `animate-pulse` for skeletons.


## Best practices

- Prefer tokens over raw colors: use Tailwind utilities like `bg-background`, `text-foreground`, `border-border`, `bg-card`, etc.
- Respect contrast: foreground tokens are chosen for sufficient contrast against their paired backgrounds.
- Keep focus visible: use `focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2` on custom controls.
- Merge classes safely with `cn()` to avoid conflicting Tailwind utilities.
- Use `backdrop-blur-md` with low opacity backgrounds for overlays/popovers to preserve depth while maintaining readability.
- Keep spacing consistent: reuse `px-4 sm:px-6 lg:px-8 py-8` pattern and `space-y-*` between sections.
- Use semantic z-index utilities (`z-header`, `z-dropdown`, `z-modal`, `z-toast`) to avoid stacking conflicts.


## Common pitfalls to avoid

- Duplicate token definitions: `tailwind.css` and `index.css` both define variables. Treat `tailwind.css` as the source of truth. If values differ, prefer the Tailwind one.
- Placeholder-like variable values: If you see values such as `#[var(--color-surface-alt)]F`, don’t copy them; instead, reference the proper token directly or use Tailwind’s color utilities.
- Non-standard class names: avoid using classes like `bg-clinical-green` unless they exist in Tailwind’s theme. Prefer `bg-[var(--color-clinical-green)]` or semantic `bg-success`.
- Overriding button colors locally: use Button variants; don’t hardcode brand hex codes.
- Forgetting focus styles: ensure interactive elements visibly indicate focus for keyboard users.


## Extending the theme (without breaking consistency)

Add a new semantic color:
1) Define a CSS variable in `src/styles/tailwind.css` under `:root`, e.g. `--color-info-strong`.
2) Map it in `tailwind.config.js` under `theme.extend.colors`, e.g. `info: 'var(--color-info-strong)'` and/or `info-foreground`.
3) Consume with utilities: `bg-info text-info-foreground`.

Add a new Button variant:
1) Extend the `variant` section in `Button.jsx`’s CVA with your `bg-*`/`text-*` classes and hover state.
2) Prefer using existing token aliases and state colors.

Dark mode strategy:
- Currently there’s no Tailwind `dark` mode toggle. To add it without refactoring components, define a `[data-theme="dark"]` block that overrides CSS variables (e.g., set darker surfaces and lighter foregrounds). Toggling `data-theme` on `<html>` or `<body>` will cascade theme changes app-wide.


## File reference

- Tailwind config (tokens, screens, z-index, motion): `tailwind.config.js`
- Global Tailwind + tokens (source of truth): `src/styles/tailwind.css`
- Global reset/typography/helpers: `src/styles/index.css`
- Layout shell: `src/components/ui/AppLayout.jsx`, `src/components/ui/Header.jsx`
- UI primitives:
  - `src/components/ui/Button.jsx`
  - `src/components/ui/Input.jsx`
  - `src/components/ui/Checkbox.jsx`
  - `src/components/ui/Select.jsx`
  - `src/components/ui/Skeleton.jsx`
- Toast system: `src/components/ui/ToastProvider.jsx`, `src/components/ui/Toast.jsx`
- Utilities: `src/utils/cn.js` (class merge helper)


## Quick reference snippets

Card surface:

```jsx
<section className="bg-card text-card-foreground border border-border rounded-xl shadow-medical-card p-6">
  {/* content */}
</section>
```

Primary form input with label and error:

```jsx
<Input label="Email" type="email" required error={form.errors.email} />
```

Select with search and clear:

```jsx
<Select
  label="Doctor"
  options={[{ label: 'Dr. Smith', value: 'smith' }]}
  searchable
  clearable
  value={value}
  onChange={setValue}
/>
```

Toast feedback:

```jsx
const toast = useToast();
toast.info('Syncing records…');
toast.success('Records updated');
```

Motion on interactive elements:

```jsx
<button className="transition-clinical hover:bg-muted">Hover me</button>
```


---

By following these conventions and reusing the primitives/utilities above, you’ll get pages that match the app’s visual language, spacing, and accessibility out of the box.
