# Associate Frontend Developer Interview Guide: Opportunity Radar

_Project: Opportunity Radar — Freshness-First Job Discovery Cockpit_  
_Target Role: Associate / Junior Frontend Engineer (React, TypeScript, Web Standards)_  
_Author & Architect: Senior Frontend Engineer_

---

## 1. High-Yield Interview Q&A

### Architecture & Technology Choices

#### Q1: Why did you choose React and TypeScript in strict mode for this project?

**Answer:**  
React was selected for its component composability, mature ecosystem, and efficient virtual DOM reconciliation, which is ideal for a multi-paned dashboard with frequently updating filter criteria and streaming feeds.  
TypeScript with `strict: true` was chosen to guarantee compile-time type safety across complex domain models (such as `JobListing`, `SalaryRange`, `FitScoreBreakdown`, and `JobApplicationRecord`). Strict mode enforces `noImplicitAny`, strict null checks, and `noUncheckedIndexedAccess`, preventing runtime `undefined is not a function` or property access crashes on optional fields like application dates or external links.

---

#### Q2: How is the codebase organized and what are its architectural boundaries?

**Answer:**  
The repository follows a feature-driven modular architecture under `src/`:

- `src/types/`: Centralized domain models and interfaces, decoupled from UI components.
- `src/services/`: Asynchronous data boundaries (`jobService.ts`) and persistence engines (`storage/idbStorage.ts`). UI components never interact with raw browser databases directly.
- `src/features/`: Feature modules (`jobs`, `search`, `saved`, `applications`, `preferences`) grouping domain-specific components, custom hooks, and utility functions.
- `src/components/ui/` & `src/components/layout/`: Reusable, design-token-driven presentation components (Button, Input, Select, Badge, Card, Modal, Drawer, AppHeader).
- `src/pages/`: Routed page views (`DiscoverPage`, `SavedPage`, `ApplicationsPage`, `NotFoundPage`).
  This structure prevents monolithic files, eliminates circular dependencies, and enables team scalability.

---

### State Management & URL Synchronization

#### Q3: Why are discovery filters synchronized with the URL search parameters rather than kept in local component state?

**Answer:**  
In a job search tool, the URL is the single source of truth for the user's intent. Storing filter criteria (`?q=react&mode=remote&fresh=24h&sort=score_desc`) in URL search parameters via React Router:

1. **Enables Deep Linking & Sharing:** Users can share a URL with a colleague or bookmark a specific query.
2. **Preserves Browser History:** Standard Back and Forward browser buttons step through previous search refinements naturally.
3. **Guarantees Refresh Resilience:** Reloading the browser page does not wipe the candidate's active search state.

---

#### Q4: How does the search input handle typing performance without lagging or thrashing the URL?

**Answer:**  
We implement a **debounced search input model** in `SearchBar.tsx`. The component maintains an immediate local state for the `<input>` element so keystrokes register at 60 FPS without input lag. A 250ms `setTimeout` debounce delay gates updates to the URL query string (`?q=...`), preventing unnecessary re-filtering on every keystroke and avoiding polluting the browser's navigation history stack with single-character states.

---

#### Q5: What role does TanStack Query play versus your storage layer?

**Answer:**  
TanStack Query manages **remote server cache state** for job listings (`['jobs']`), handling loading states, error catching, caching (`staleTime: 2m`, `gcTime: 10m`), automatic retries, and cache invalidation when live listings are pushed via WebSocket.  
Conversely, IndexedDB (`idbStorage.ts`) manages **user-generated persistence** (saved job bookmarks, application tracker stages, personal interview notes, and career preferences). TanStack Query mutations orchestrate optimistic updates over this storage layer.

---

### Persistence & Storage

#### Q6: Why did you use IndexedDB instead of `localStorage` for saved jobs and applications?

**Answer:**

1. **Asynchronous & Non-Blocking:** `localStorage` is synchronous and operates on the browser's main thread. Parsing and stringifying large JSON arrays blocks UI rendering, causing frame drops (Interaction to Next Paint delays). IndexedDB is fully asynchronous.
2. **Rich Structured Storage:** IndexedDB stores native JavaScript objects, dates, and blobs without manual JSON serialization.
3. **Indexing Capabilities:** IndexedDB supports indexed queries (e.g. `by_status` or `by_updatedAt`), allowing high-performance filtering.
4. **Storage Quotas:** `localStorage` is capped at ~5MB, whereas IndexedDB supports hundreds of megabytes of structured data.

---

#### Q7: How does your storage layer handle private browsing or restricted environments where IndexedDB might fail?

**Answer:**  
The storage layer (`idbStorage.ts`) implements a **graceful fallback pattern**. It tests for IndexedDB availability inside a `try/catch` block. If IndexedDB fails to initialize (e.g., Firefox private browsing mode or restricted iframe policies), it transparently delegates to an in-memory and `localStorage` fallback cache (`MemoryFallbackStorage`). The application continues functioning without throwing unhandled exceptions.

---

### Optimistic Updates & Failure Handling

#### Q8: How do optimistic updates work in your bookmarks and application stage tracking?

**Answer:**  
When a candidate toggles a bookmark or shifts an application stage:

1. `onMutate`: We cancel any outgoing queries for the cache key, capture a snapshot of the current state (`context.previous`), and immediately write the optimistic update into the TanStack Query cache (`queryClient.setQueryData`).
2. The UI reflects the change instantaneously (e.g. icon fills or stage badge shifts) with 0ms visual latency.
3. The asynchronous write to IndexedDB is dispatched in the background.

---

#### Q9: What happens if the background persistence operation fails?

**Answer:**  
If the persistence promise rejects (e.g., disk full, transaction abort, or simulated failure):

1. `onError` fires with the error, the variables, and the `context.previous` snapshot.
2. We roll back the cache to `context.previous`, restoring the previous UI state.
3. We dispatch an accessible error toast notification: `"Failed to save changes. Reverting."` so the candidate is honestly informed that their change could not be saved.

---

### Job-Fit Matching Algorithm

#### Q10: How does the explainable job-match algorithm work?

**Answer:**  
The algorithm in `scoreCalculator.ts` is a **100% deterministic heuristic scoring model** (scale 0 to 100), composed of four weighted components:

1. **Technical Skill Match (Max 40 points):** Compares user skills to job required skills (overlap ratio $\times$ 30 pts) plus up to 10 bonus points for preferred skills (2 pts each).
2. **Seniority / Experience Match (Max 25 points):** Exact match yields 25 pts; adjacent levels (e.g. Entry vs Internship or Entry vs Junior) yield 15 pts; non-adjacent yields 5 pts.
3. **Work Mode Match (Max 20 points):** 20 pts if job mode is in user preferences; 18 pts if candidate accepts hybrid and job is remote.
4. **Location Match (Max 15 points):** Universal 15 pts for remote jobs; 15 pts if job city matches preferred Indian cities; 0 pts otherwise.

Every calculation returns a `FitScoreBreakdown` object displaying matched skills, missing skills, and alignment reasons. We deliberately avoid claiming this is an "AI model."

---

### Real-Time Streaming & WebSockets

#### Q11: How does the demonstration WebSocket stream work, and how does the frontend handle disconnects?

**Answer:**  
The project includes a standalone Node.js WebSocket server (`server/demoJobStream.ts`, runnable via `npm run server`) on port 4001. It sends a welcome handshake, heartbeats every 30s, and emits fresh demonstration job listings every 25s.  
The frontend hook `useJobStream`:

1. Connects to `ws://localhost:4001`.
2. Updates connection status: `connecting` → `connected` → `disconnected` → `offline_mode`.
3. Implements **exponential backoff reconnection** (1s, 2s, 4s, 8s, max 10s, max 3 attempts).
4. **Graceful Degradation:** If the server is offline (e.g., deployed as a static site on Vercel), it switches to `offline_mode`. The header pill displays "Local Mode (Stream Inactive)", and the application runs 100% reliably using seed data.

---

### Performance & Rendering Efficiency

#### Q12: Where is React memoization (`React.memo`, `useMemo`, `useCallback`) used and why?

**Answer:**

1. `JobCard`: Wrapped in `React.memo` because in a list of 10+ cards, when a user selects or bookmarks one card, we avoid re-rendering every other unselected card.
2. `useJobFilters`: Filter state and active filter count calculations are wrapped in `useMemo`, and parameter update setters are wrapped in `useCallback` to avoid re-triggering child effect hooks.
3. `filterAndSortJobs`: Multi-faceted filtering and sorting is memoized in `DiscoverPage` based on `[allJobs, filters, preferences]`.
   We avoid premature memoization on lightweight components where the cost of dependency comparison exceeds the render cost.

---

#### Q13: How do you prevent Cumulative Layout Shift (CLS) during loading states?

**Answer:**  
We use **dimensionally stable skeleton placeholders** (`SkeletonLoader.tsx`). The skeleton cards have fixed heights (`160px`) and margins matching the exact dimensions of actual rendered job cards. When the asynchronous query resolves, the DOM height does not shift, preserving CLS < 0.05.

---

### Accessibility (WCAG 2.2 AA)

#### Q14: How is keyboard accessibility implemented across the application?

**Answer:**

- **Interactive Semantics:** Real `<button>` elements and `<a>` links are used instead of clickable `<div>`s, ensuring native Tab focusing, Space, and Enter key activation.
- **Job Cards:** Cards have `role="button"`, `tabIndex={0}`, and an explicit `onKeyDown` handler listening for `Enter` and `Space`.
- **Visible Focus Rings:** We use a high-contrast `2px solid var(--color-focus-ring)` with `outline-offset: 2px` on `:focus-visible` to satisfy WCAG 2.4.11.
- **Modal & Drawer Dialogs:** Implement an explicit focus trap that cycles Tab navigation inside the open dialog and closes upon pressing `Escape`, returning focus to the element that triggered it.

---

#### Q15: How do screen readers receive status updates without disruptive focus stealing?

**Answer:**

- Results count heading includes `aria-live="polite"` so changes in filtered results are announced smoothly.
- Toasts render within an `aria-live="polite"` container with `role="status"` and `aria-atomic="false"`, ensuring notifications are read without interrupting current user interactions.
- Icon-only buttons (such as bookmark toggles and close buttons) have dynamic accessible names via `aria-label="Save [Title] at [Company]"` and `aria-label="Dismiss notification"`.

---

### Testing Strategy

#### Q16: How do your unit and component tests validate user-visible behavior?

**Answer:**  
We follow React Testing Library best practices:

- We query elements using accessible roles (`getByRole('button', { name: ... })`, `getByRole('searchbox')`, `getByLabelText`), mimicking how screen readers and real users navigate.
- We simulate user events using `@testing-library/user-event` for realistic keystroke and click sequences.
- We test critical business logic (fit score calculations, text normalization, date freshness, salary formatters) in isolation using Vitest with deterministic timestamps.

---

## 2. "Understand Before Claiming"

Before discussing these topics in an interview, be sure you understand the following:

1. **Deterministic Heuristic vs. Machine Learning:**  
   Do _not_ claim Opportunity Radar uses "AI" or "neural networks." Explain clearly that it uses a **transparent weighted heuristic algorithm** (+30% required skills, +10% preferred skills, +25% experience, +20% mode, +15% location) that is deterministic, explainable, and testable.
2. **WebSocket Handshake vs. Polling:**  
   Know that WebSockets start with an HTTP 101 Switching Protocols handshake before upgrading to a persistent, bi-directional TCP socket. In static deployments where the local Node server isn't running, the frontend gracefully falls back to local cache mode.
3. **IndexedDB vs. LocalStorage:**  
   Be able to explain that IndexedDB is an asynchronous, transactional object database with indexes, whereas localStorage is synchronous, string-only, main-thread-blocking, and capped at 5MB.
4. **URL Synchronization vs. Global State:**  
   Understand why search filters belong in URL query parameters (shareability, back/forward cache, refresh safety) rather than hidden inside React state.
