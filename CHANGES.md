# dashboard-core — Change Summary

## Files changed / added

### 1. Metronic Structure Compatibility

| File | Change |
|------|--------|
| `src/layouts/DashboardLayout.tsx` | Restructured shell using `.app-shell`, `.topbar`, `.page-shell`, `.page-content` CSS classes that mirror Metronic's `#kt_app_wrapper / #kt_app_header / #kt_app_content` hierarchy. Sticky topbar with `z-50`. |
| `src/components/features/TopBar/TopBar.tsx` | Uses `.topbar` class. Brand mark, horizontal nav, utility actions — compatible with Metronic header slot structure. Notification dot indicator. Keyboard shortcut hint in search. |
| `src/components/primitives/PageShell/PageShell.tsx` | **New.** Reusable page wrapper with breadcrumbs, icon, title, subtitle, and optional action slot. Every new page calls `<PageShell config={...}>` — no repeated header markup. |
| `src/components/primitives/Card/Card.tsx` | **New.** Card with `.card`, `.card-header`, `.card-body`, `.card-footer` CSS component classes. `Card.Header / .Body / .Footer` sub-components. `interactive` prop for hover-lift. |
| `src/components/primitives/Button/Button.tsx` | Rewritten to use global `.btn .btn-{variant} .btn-{size}` classes. Supports `loading` state. |
| `src/components/primitives/Badge/Badge.tsx` | Rewritten to use global `.badge .badge-{variant}` classes. |
| `src/pages/Home/HomePage.tsx` | Refactored to use `<PageShell>` and `<Card>`. |
| `src/context/AppContext.tsx` | Added `layoutMode` state (`topbar \| sidebar \| sidebar-mini`) with localStorage persistence. |
| `src/types/app.types.ts` | Added `LayoutMode`, `PageConfig`, `MenuItem`, `MenuSection`, `styleTokens` — Metronic-compatible abstractions. |

---

### 2. CSP Review & Hardening

**File:** `index.html`

Changes from the original:
- **Removed `'unsafe-inline'` from `script-src`** — the original allowed inline scripts. Vite uses ES modules (`type="module"`) which run as same-origin resources; no inline script execution is needed. This closes the most critical CSP XSS vector.
- **Added `object-src 'none'`** — disables `<object>`, `<embed>`, `<applet>` plugin execution.
- **Added `frame-ancestors 'none'`** — prevents clickjacking (CSP equivalent of `X-Frame-Options: DENY`).
- **Added `form-action 'self'`** — restricts form submission targets.
- **Added `upgrade-insecure-requests`** — forces HTTPS for sub-resources in production.
- **Added `ws://localhost:5173`** to `connect-src` — was missing; Vite HMR uses a WebSocket.
- **Added `X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`** meta tags for older browser coverage.
- Annotated every directive with rationale inline in the file.

---

### 3. i18n — Persian & English translations

**Pattern:** `public/locales/{lang}/{ns}.json` → loaded by `i18next-http-backend` at runtime.

#### New/expanded namespaces

| Namespace | Files | Contents |
|-----------|-------|----------|
| `common`  | `en/common.json`, `fa/common.json` | Buttons, labels, CRUD verbs, status words, placeholders — 55 keys |
| `nav`     | `en/nav.json`, `fa/nav.json` | Navigation labels + aria strings — 13 keys |
| `dashboard` | `en/dashboard.json`, `fa/dashboard.json` | Home page strings — 21 keys |
| `flow`    | `en/flow.json`, `fa/flow.json` | **New.** FlowProgress page strings — 23 keys |
| `tree`    | `en/tree.json`, `fa/tree.json` | **New.** TreeNode page strings — 17 keys |
| `substation` | `en/substation.json`, `fa/substation.json` | **New.** Substation page strings — 16 keys |

**`src/config/i18n.ts`** — added `flow`, `tree`, `substation` to the `ns` array.

**RTL/LTR:** the existing `useDirection` hook writes `document.documentElement.dir` on language change. The CSS in `globals.css` applies `font-family: Vazirmatn` when `html[dir='rtl']` is set. All layout utilities use logical properties (`ps-`, `pe-`, `ms-`, `me-`, `start`, `end`) — never `l-`/`r-` directional Tailwind utilities.

---

### 4. Global Style Configuration

**Files:** `src/styles/globals.css`, `tailwind.config.ts`, `src/config/styleConfig.ts`

#### `globals.css`
- **`:root` CSS custom properties** — 40+ design tokens covering color, spacing, radius, shadow, motion, z-index, and layout dimensions. Single edit point propagates everywhere.
- **`@layer components`** — reusable CSS component classes: `.app-shell`, `.topbar`, `.page-shell`, `.page-content`, `.card`, `.card-header`, `.card-body`, `.card-footer`, `.btn`, `.btn-{variant}`, `.btn-{size}`, `.badge`, `.badge-{variant}`, `.form-control`, `.nav-item`, `.modal-backdrop`, `.panel`, `.skeleton`, `.empty-state`, `.alert`, `.data-table`, `.tooltip-content`.
- **`@layer utilities`** — `.scrollbar-thin`, `.truncate-1`, `.glass`, `.transition-default`, `.indicator-dot-{variant}`.

#### `tailwind.config.ts`
- Extends all tokens (colors, radii, shadows, spacing, height, z-index, duration, easing) so Tailwind utilities match CSS vars.
- Legacy aliases (`core`, `core-lg`) preserved for back-compat with existing component classes.

#### `src/config/styleConfig.ts` (new)
- JavaScript mirror of all CSS tokens — use when raw values are needed (Recharts, React Flow edge stroke, SVG attributes).
- `chartPalette` — accessible 8-color array.
- `statusColor` — maps semantic status strings to hex values.

#### Adding a new page
1. `src/pages/YourPage/YourPage.tsx`
2. Wrap in `<PageShell config={{ titleKey: '...', icon: 'ti-...' }}>`.
3. Use `<Card>`, `<Button>`, `<Badge>` primitives — all tokens inherited automatically.
4. Add strings to `public/locales/en/yourns.json` + `fa/yourns.json`.
5. Register namespace in `src/config/i18n.ts`.
6. Add `<Route>` in `src/app/router.tsx`.
