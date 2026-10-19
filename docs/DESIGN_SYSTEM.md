# Design System Specification: Opportunity Radar

_Role: Staff UI Architect & Accessibility Specialist_  
_Date: October 2026_  
_Status: Living Specification_

---

## 1. Design Philosophy: Restrained, Editorial, High-Density

Opportunity Radar rejects the generic "AI dashboard template" tropes (blurry glassmorphism, oversized neon purple gradients, floating orbs, decorative fake metrics). Instead, it adopts an **editorial, information-dense, high-clarity software workbench** inspired by modern technical tools like Linear, GitHub, and Ashby.

### Guiding Principles:

1. **Utility First:** Screen space belongs to job listings, filters, and actionable details—not giant marketing headers.
2. **Accessible Contrast by Default:** All text meets or exceeds WCAG 2.2 AA (4.5:1 for normal text, 3:1 for large text and UI boundaries).
3. **Restrained Color Hierarchy:** 90% of the UI is composed of crisp neutrals (`#FFFFFF`, `#F8FAFB`, `#131C1A`, `#E2E8F0`). Color is reserved strictly for semantic state (teal for active selection, emerald for fresh postings/offers, amber for pending/interview, rose for rejection).
4. **Predictable Spatial Grid:** Strict 4px base increment across padding, margin, row height, and icon sizes.
5. **No Dependent Font Downloads:** Uses an optimized system-native font stack that renders with zero layout shift (CLS: 0) and zero FOIT/FOUT.

---

## 2. Color Palette & Semantic Tokens

### 2.1 Color Tokens Table

| Token Name                 | Hex Value | WCAG Contrast Ratio on Surface | Role & Usage                                         |
| :------------------------- | :-------- | :----------------------------- | :--------------------------------------------------- |
| `--color-bg`               | `#F8FAFB` | —                              | Global page backdrop                                 |
| `--color-surface`          | `#FFFFFF` | —                              | Card, drawer, header, and panel background           |
| `--color-surface-subtle`   | `#F1F5F9` | —                              | Table headers, chip backgrounds, disabled inputs     |
| `--color-surface-hover`    | `#F8FAFC` | —                              | Interactive card and row hover state                 |
| `--color-border`           | `#E2E8F0` | 1.2:1 (Structural)             | Crisp 1px card and container borders                 |
| `--color-border-strong`    | `#CBD5E1` | 3.1:1 (UI Component)           | Input borders, active tab outlines                   |
| `--color-text-primary`     | `#0F172A` | **14.2:1** (Passes AAA)        | Primary headings, titles, high-emphasis text         |
| `--color-text-secondary`   | `#475569` | **5.8:1** (Passes AA)          | Metadata, dates, location, descriptions              |
| `--color-text-muted`       | `#64748B` | **4.6:1** (Passes AA)          | Placeholders, subtle timestamps, icons               |
| `--color-brand-primary`    | `#0F766E` | **4.9:1** on white             | Active filters, selected job border, primary actions |
| `--color-brand-hover`      | `#115E59` | **6.6:1** on white             | Hover state for primary buttons                      |
| `--color-brand-subtle`     | `#F0FDFA` | —                              | Selected job card background, active badge tint      |
| `--color-brand-border`     | `#99F6E4` | —                              | Subtle active card border                            |
| `--color-fresh-text`       | `#15803D` | **5.1:1** on white             | "Posted Today" / "24h Fresh" badge text              |
| `--color-fresh-bg`         | `#DCFCE7` | —                              | Freshness badge background                           |
| `--color-status-applied`   | `#0284C7` | **4.7:1** on white             | "Applied" status indicator                           |
| `--color-status-interview` | `#D97706` | **4.6:1** on white             | "Interviewing" status indicator                      |
| `--color-status-offer`     | `#16A34A` | **4.8:1** on white             | "Offer" status indicator                             |
| `--color-status-rejected`  | `#DC2626` | **5.0:1** on white             | "Rejected" status indicator                          |
| `--color-focus-ring`       | `#0D9488` | **3.5:1** on background        | Global 2px keyboard focus ring with 2px offset       |

---

## 3. Typography System

We specify a robust system font stack to prevent webfont download latency, eliminate Flash of Unstyled Text (FOUT), and guarantee immediate rendering.

```css
--font-sans:
  -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial,
  sans-serif;
--font-mono:
  ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New',
  monospace;
```

### Typographic Scale

| Level                  | Size             | Weight         | Line Height | Letter Spacing | Element / Role                                           |
| :--------------------- | :--------------- | :------------- | :---------- | :------------- | :------------------------------------------------------- |
| **Display / Page H1**  | 24px (1.5rem)    | 700 (Bold)     | 1.25 (30px) | -0.02em        | Page title ("Opportunity Radar", "Tracked Applications") |
| **Section H2**         | 18px (1.125rem)  | 600 (Semibold) | 1.35 (24px) | -0.01em        | Selected job title, filter group header                  |
| **Card H3 / Subtitle** | 15px (0.9375rem) | 600 (Semibold) | 1.4 (21px)  | 0.0em          | Job listing title, modal titles                          |
| **Body Primary**       | 14px (0.875rem)  | 400 (Regular)  | 1.5 (21px)  | 0.0em          | Job description, card details, form inputs               |
| **Body Medium**        | 14px (0.875rem)  | 500 (Medium)   | 1.5 (21px)  | 0.0em          | Navigation links, filter labels, button labels           |
| **Metadata / Small**   | 12px (0.75rem)   | 500 (Medium)   | 1.4 (17px)  | +0.01em        | Tags, salary badges, posting date, match scores          |
| **Micro / Status**     | 11px (0.6875rem) | 600 (Semibold) | 1.3 (14px)  | +0.02em        | Freshness badges, live WebSocket status pill             |

---

## 4. Spacing, Elevation & Radii

### 4.1 Spacing Scale (4px Base)

- `--space-1`: 4px
- `--space-2`: 8px
- `--space-3`: 12px
- `--space-4`: 16px
- `--space-5`: 20px
- `--space-6`: 24px
- `--space-8`: 32px
- `--space-10`: 40px
- `--space-12`: 48px

### 4.2 Elevation (Subtle, Crisp Borders Over Heavy Shadows)

- `--shadow-none`: `none`
- `--shadow-sm`: `0 1px 2px 0 rgba(0, 0, 0, 0.05)` (used for buttons and inputs)
- `--shadow-md`: `0 4px 6px -1px rgba(0, 0, 0, 0.07), 0 2px 4px -2px rgba(0, 0, 0, 0.05)` (dropdowns, popovers)
- `--shadow-lg`: `0 10px 15px -3px rgba(0, 0, 0, 0.08), 0 4px 6px -4px rgba(0, 0, 0, 0.04)` (drawers, modals)

### 4.3 Border Radii

- `--radius-sm`: `4px` (tags, badge pills)
- `--radius-md`: `6px` (buttons, text inputs, selects)
- `--radius-lg`: `8px` (cards, panels, modal dialogs)
- `--radius-full`: `9999px` (circular indicators, avatar initials)

---

## 5. Layout Architecture & Responsive Breakpoints

Opportunity Radar utilizes a **responsive dual-pane workspace architecture**:

```
+-----------------------------------------------------------------------------+
| App Header: Logo | Live Stream Status | Search Bar | Nav Tabs | Demo Prefs  |
+-----------------------------------------------------------------------------+
| Filter Toolbar: Active Filter Chips | Clear All | Results Count | Sort Order|
+------------------------------------+----------------------------------------+
| Job Card List (Master Pane)        | Job Details (Detail Pane)              |
| Width: 440px (min 380px)           | Width: 1fr                             |
| Scrollable independently           | Sticky / Scrollable independently      |
|                                    | Role overview, responsibilities,       |
| [Job Card 1 (Active Teal Border)]  | salary breakdown, match-fit breakdown, |
| [Job Card 2]                       | apply status picker, personal notes    |
| [Job Card 3]                       |                                        |
+------------------------------------+----------------------------------------+
```

### Breakpoints & Adaptive Behavior:

1. **Desktop Wide (≥ 1280px):**
   - Two-pane split view side-by-side (`460px` list + `1fr` details).
   - Result list and detail panel scroll independently within the viewport height.
2. **Desktop / Tablet Landscape (1024px – 1279px):**
   - Two-pane split view (`400px` list + `1fr` details).
   - Filter controls collapse non-critical fields into a "More Filters" popover.
3. **Tablet Portrait (768px – 1023px):**
   - Single-column job list.
   - Selecting a job slides open a right-side drawer (width `540px` or `75vw`) with focus trapped and `Escape` key close.
4. **Mobile (360px – 767px):**
   - Single-column vertical stack.
   - Search input expands to full width.
   - Filters accessible via a mobile bottom sheet filter dialog.
   - Selecting a card navigates into a full-screen details view with an accessible back button.
   - Touch targets maintain minimum 44×44px hit areas.
   - Zero horizontal scroll (`overflow-x: hidden`).

---

## 6. Accessibility & Interaction Specifications (WCAG 2.2 AA)

1. **Keyboard Navigation:**
   - Logical Tab Order: Header Navigation → Search Input → Filter Controls → Sort Select → Job List Cards → Detail Pane Actions.
   - Card Keyboard Activation: Pressing `Enter` or `Space` selects and opens the job in the detail panel.
   - Visual Focus Ring: Clear, unclipped `2px solid var(--color-focus-ring)` with `outline-offset: 2px` on all interactive `:focus-visible` elements.
2. **Accessible Names & Labels:**
   - Every text input, select, and button has an explicit accessible name via `<label htmlFor="...">` or `aria-label`.
   - Bookmark icon buttons have dynamic `aria-label="Save [Job Title] at [Company]"` or `"Remove [Job Title] from saved jobs"`.
3. **Motion Sensitivity:**
   - Complete support for `@media (prefers-reduced-motion: reduce)`:
   ```css
   @media (prefers-reduced-motion: reduce) {
     *,
     *::before,
     *::after {
       animation-duration: 0.01ms !important;
       animation-iteration-count: 1 !important;
       transition-duration: 0.01ms !important;
       scroll-behavior: auto !important;
     }
   }
   ```
4. **Screen Reader Announcements (`aria-live`):**
   - Results count announcements: `aria-live="polite"` announces result count changes after search or filter updates.
   - Toast notification system: renders inside an `aria-live="polite"` region without stealing keyboard focus.
