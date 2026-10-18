# Reference Audit: Product Interfaces & Engineering Standards

*Project: Opportunity Radar*  
*Role: Senior Frontend Engineer & UI Architect*  
*Date: October 2026*

---

## 1. Executive Summary

Before writing a single line of React code for **Opportunity Radar**, we conducted a structured research audit inspecting real production products and authoritative web engineering specifications. 

The objective was not to copy visual templates or superficial aesthetics, but to extract **proven interface architectures, density models, URL synchronization patterns, keyboard workflows, and accessibility baselines** appropriate for an information-dense, freshness-first job discovery application.

---

## 2. Product Interface Audits

### 2.1 Linear (Disciplined Density, Typographic Restraint, Navigation Feedback)
* **Observed Patterns:**
  * **Zero Hero Syndrome:** Linear opens directly into work views. There are no decorative giant hero banners or floating gradient orbs wasting screen real estate.
  * **Strict Spatial Rhythm:** Standardized row heights (e.g., 36px–40px in tables, 44px for primary interactive targets), 4px grid increments, and borders (`1px solid var(--border)`) providing separation rather than heavy drop shadows.
  * **Status & Priority Encoding:** Small, high-contrast, semantic tokens (icon + neutral text) rather than oversized brightly colored pills that distract the eye.
  * **Keyboard-First Design:** Global shortcuts, focus indicators that do not clip (`outline-offset: 2px`), and clear visual affordances for interactive elements.
* **Adopted for Opportunity Radar:**
  * Direct route launch into the discovery workspace (results + filters immediately visible above the fold).
  * Monospaced/structured metadata rows for posting freshness, location, and salary.
  * Restrained badge styles: soft tint backgrounds (`#E6F4F1`) with deep accessible foreground colors (`#0F766E`) and subtle border radii (`6px`), eliminating bubbly neon pill tags.
* **Deliberately Rejected:**
  * Modal-heavy editing for every quick action (instead we use an inline details pane and persistent drawer on mobile).
  * Dark-mode-only assumption: we build with a high-contrast, light-first editorial system (`#F8FAFB` surface, `#131C1A` text) tested for 7:1+ contrast ratios.

---

### 2.2 GitHub (Data-Heavy Search, URL Filter State, Faceted Navigation)
* **Observed Patterns:**
  * **URL as Canonical State:** Every filter (e.g., `is:issue is:open label:bug`) is reflected in the URL query string. Refreshing the browser or sharing a URL reconstructs the exact filter tree.
  * **Faceted Navigation with Counts:** Filter panels indicate result availability and allow multi-select without triggering full-page layout jumps.
  * **Debounced Query Execution:** Search input feels immediate while shielding downstream query pipelines from excessive re-computations.
  * **Clear Zero-State Actions:** When zero items match, GitHub explicitly specifies which criteria yielded zero results and offers a single-click "Clear filters" action.
* **Adopted for Opportunity Radar:**
  * Bidirectional URL search parameter synchronization (`useSearchParams`) for search query (`q`), location (`loc`), work arrangement (`mode`), experience level (`exp`), role type (`role`), freshness window (`fresh`), and sort order (`sort`).
  * Dedicated empty state displaying active filter chips and a "Reset all filters" button that restores default discovery state.
  * Fast client-side normalized search indexing title, company, required skills, and location tokens.
* **Deliberately Rejected:**
  * Cryptic query DSL (e.g., `is:pr author:@me`) for early-career candidates. Instead, we use approachable, accessible form controls (selects, toggle buttons, segmented pills) backed by clean URL parameters.

---

### 2.3 Wellfound (formerly AngelList Talent) & LinkedIn Jobs (Job Discovery & Fit Cards)
* **Observed Patterns:**
  * **Two-Pane Master-Detail View:** Desktop viewport splits into a scrollable list of job cards (left, 420px–480px) and a fixed-height scrollable details pane (right, flexible 1fr). This enables rapid scanning without page thrashing.
  * **Freshness Prominence:** Jobs posted within 24–48 hours are prioritized because early applicants receive significantly higher review rates.
  * **Job-Fit Indicators:** Wellfound explicitly shows overlap between candidate profile skills and role requirements.
* **Adopted for Opportunity Radar:**
  * Responsive split layout: persistent 2-pane view on viewports ≥ 1024px; auto-collapsing to single-column card list with accessible slide-over/dialog details on mobile (< 1024px).
  * Prominent freshness indicators ("Posted today", "2d ago") with chronological/freshness sorting.
  * Transparent, deterministic match-fit explanation card (showing matched skills, missing skills, and preference alignment) rather than opaque AI percentages.
* **Deliberately Rejected:**
  * Intrusive popups prompting login/sign-up. Opportunity Radar operates friction-free with full local persistence (IndexedDB).
  * Promoted/sponsored fake listings that dilute signal.

---

### 2.4 Ashby & Greenhouse (Structured Job Descriptions & Tracking Pipelines)
* **Observed Patterns:**
  * **Structured Role Details:** Clear separation between Role Overview, Core Responsibilities, Must-Have Qualifications, Nice-to-Have Skills, Compensation, and Benefits.
  * **Application Funnel Stages:** Standard hiring progression: *Saved* → *Applied* → *Interviewing* → *Offer* / *Rejected*.
  * **Applicant Notes & Dates:** Candidates need personal context (date applied, interview rounds, custom notes).
* **Adopted for Opportunity Radar:**
  * Clean, scannable job details typography with distinct sections for responsibilities and skills chips.
  * Dedicated Application Tracker featuring 5 canonical statuses (`saved`, `applied`, `interview`, `rejected`, `offer`), status counters, applied date tracking, and personal interview notes.
  * Local CSV export for candidates to back up their job search trail.
* **Deliberately Rejected:**
  * Rigid drag-and-drop-only Kanban interfaces that fail keyboard accessibility standards (WCAG 2.1.1). Opportunity Radar provides accessible native `<select>` / button controls for stage transitions, keyboard navigable in any order.

---

### 2.5 Radix UI & W3C ARIA APG (Accessible Primitives & Interaction Patterns)
* **Observed Patterns:**
  * Dialog & Drawer mechanics: `aria-modal="true"`, `role="dialog"`, focus trap within the container, restoration of focus to triggering element upon unmount, and `Escape` key listeners.
  * Live regions: `aria-live="polite"` for non-disruptive feedback (e.g., "Job saved to bookmarks", "4 listings found").
  * Native interactive tags: Always use `<button type="button">` over `<div onClick=...>` to guarantee Tab navigation, Space/Enter activation, and screen reader recognition.
* **Adopted for Opportunity Radar:**
  * Strict semantic HTML baseline (`<main>`, `<header>`, `<nav>`, `<aside>`, `<article>`, `<button>`, `<fieldset>`).
  * Accessible Toast system with `aria-live="polite"` and automatic timer dismissal with pause-on-hover.
  * Modal and Drawer components implementing focus trapping, `Escape` key close, and `aria-labelledby`.

---

## 3. Authoritative Engineering Documentation Consulted

| Topic / Specification | Canonical Source | Key Technical Guidelines Applied |
| :--- | :--- | :--- |
| **React + TypeScript** | [react.dev/learn/typescript](https://react.dev/learn/typescript) | Strict type definitions for props, events (`React.ChangeEvent<HTMLInputElement>`), hooks (`useCallback`, `useMemo`), discriminated unions for asynchronous states (`idle \| loading \| success \| error`). No `any` shortcuts. |
| **WCAG 2.2 AA Guidelines** | [w3.org/WAI/WCAG22/quickref](https://www.w3.org/WAI/WCAG22/quickref/) | 4.5:1 minimum text contrast; 3:1 for UI controls and focus rings. Visible focus outlines (`2px solid #0F766E`). Explicit `<label>` association via `htmlFor`. `prefers-reduced-motion` media queries disabling animations. Touch target minimum 44×44px. |
| **Core Web Vitals** | [web.dev/articles/vitals](https://web.dev/articles/vitals) | Maintain LCP under 2.5s (no giant hero images, system font stack to prevent FOIT/FOUT). INP under 200ms (debounced search input, memoized filter pipeline). Zero CLS (fixed-dimension skeletons, stable list keys). |
| **IndexedDB API & Storage** | [MDN IndexedDB API](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API) | Asynchronous object store transactions; versioned migrations (`onupgradeneeded`); typed stores for `saved_jobs`, `applications`, and `user_preferences`. Graceful in-memory fallback if IndexedDB is disabled in restricted browser environments. |
| **HTTP Caching & Service Workers** | [MDN Caching](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Caching) & [Service Worker API](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API) | Immutable hashed assets for production bundles (`Cache-Control: max-age=31536000, immutable`). Cache-first for local static assets; network-first for live data; stale-while-revalidate for read-only listings. |
| **WebSocket API** | [MDN WebSocket API](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket) | Exponential backoff reconnection loop; heartbeat/ping validation; explicit connection state machine (`CONNECTING`, `OPEN`, `CLOSING`, `CLOSED`); unmount cleanup to avoid memory leaks. |
| **Playwright Testing** | [playwright.dev/docs/best-practices](https://playwright.dev/docs/best-practices) | Rely on user-visible locators (`getByRole`, `getByLabel`, `getByText`) rather than CSS class names or DOM hierarchies. Test real end-to-end user journeys including offline reload. |

---

## 4. Synthesis: Patterns Selected vs. Patterns Rejected

### Selected Patterns
1. **Direct Discovery Workspace:** Immediate immersion in searchable, filterable job listings.
2. **Deterministic Heuristic Match-Fit:** Transparent skill comparison (+35% required skills, +25% preferred skills, +20% experience band match, +20% work-mode match) with visual badges showing why a score was calculated.
3. **Dual Master-Detail Responsive Layout:** Synchronized list and inspection pane on desktop; single-column list with slide-over drawer on mobile.
4. **URL-Synchronized Filter Engine:** Bookmarking or sharing any search query preserves exact filter and sort state.
5. **Robust Local-First Storage:** IndexedDB storage for bookmarks, application statuses, and interview notes, guaranteeing zero data loss on browser refresh.
6. **Gracefully Degrading Real-Time Stream:** Local WebSocket server broadcasts new candidate opportunities; UI displays a live pulse badge and cleanly switches to "Offline/Local Mode" if the server is stopped.

### Deliberately Rejected Patterns
1. **Generic AI Template Clichés:** No neon purple gradients, no floating decorative glass orbs, no meaningless analytics line charts, no centered 72px marketing hero headings.
2. **Fake Metrics & Mock Testimonials:** Strictly no "99.8% placement rate", "trusted by 50,000 engineers", or fabricated quotes. Sample data is honestly labelled as demonstration records.
3. **Drag-and-Drop Kanban without Accessible Fallbacks:** Avoid inaccessible mouse-only board drag interactions; provide keyboard-operable stage pickers with immediate ARIA announcements.
4. **External Auth or Cloud BaaS Requirements:** Zero API keys required; 100% runnable locally with instant out-of-the-box readiness.
