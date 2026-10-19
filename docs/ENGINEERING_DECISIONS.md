# Engineering Decisions & Trade-Offs: Opportunity Radar

_Role: Senior Frontend Engineer & UI Architect_  
_Date: October 2026_

---

## 1. Decision Log Architecture

Every major technical decision in Opportunity Radar follows the Architecture Decision Record (ADR) framework: Context, Options Considered, Chosen Approach, Justification, Trade-offs, and Future Evolution at Scale.

---

### ADR-001: Styling Architecture — CSS Modules & Custom Properties vs. Tailwind CSS vs. CSS-in-JS

- **Context:** The application requires high information density, strict WCAG AA contrast compliance, zero runtime CSS injection overhead, and complete independence from heavy third-party UI libraries.
- **Options Considered:**
  1. _Tailwind CSS:_ Highly popular utility-first framework.
  2. _CSS-in-JS (e.g. styled-components / emotion):_ Component-scoped styles with JS runtime.
  3. _CSS Modules + Global Design Tokens (CSS Custom Properties):_ Native CSS scoped per component file, unified by standard CSS variables.
- **Chosen Approach:** CSS Modules + Global Design Tokens (`tokens.css`, `global.css`).
- **Justification:**
  - Zero runtime JavaScript cost.
  - Standard CSS syntax: approachable, cleanly separated from JSX markup, and directly inspectable in browser DevTools.
  - Tokens provide a single source of truth for spacing (4px scale), colors, and typography.
- **Trade-offs:** Writing custom CSS classes requires slightly more initial typing than utility classes, but guarantees precise typographic and responsive control without arbitrary class-name explosion.
- **Scale Consideration:** At a larger organization, this token architecture translates seamlessly into a shared Design Token npm package (e.g., via Style Dictionary or Figma Tokens).

---

### ADR-002: State Management & Persistence — IndexedDB + TanStack Query vs. Redux / Zustand

- **Context:** The application needs to manage server/seed job data with caching and lifecycle states, alongside persistent user-generated data (bookmarked jobs, application funnel stages, interview notes, and career preferences).
- **Options Considered:**
  1. _Redux Toolkit:_ Heavy global state container with boilerplate reducers and actions.
  2. _Zustand / Jotai with localStorage:_ Lightweight state, but `localStorage` is synchronous, blocks the main UI thread during JSON serialization, and has a strict 5MB limit.
  3. _TanStack Query + IndexedDB Repository:_ Separation of asynchronous read-only remote data (TanStack Query) from structured local-first persistence (IndexedDB).
- **Chosen Approach:** TanStack Query for job listing lifecycle management, paired with a typed IndexedDB repository for local user modifications.
- **Justification:**
  - _IndexedDB_ is fully asynchronous, non-blocking, supports indexes for high-speed queries, and handles rich structured objects without manual string serialization.
  - _TanStack Query_ provides out-of-the-box loading, error, success, caching, and invalidation semantics.
- **Trade-offs:** IndexedDB has an asynchronous callback/event-based browser API that requires a clean promise wrapper.
- **Scale Consideration:** With a real backend API, the IndexedDB repository can act as an offline-first sync cache with background synchronization (Service Worker Sync API).

---

### ADR-003: Discovery State — URL Search Parameters vs. React State

- **Context:** Users search by keyword, apply multi-dimensional filters (location, mode, freshness, salary), and inspect individual jobs.
- **Options Considered:**
  1. _In-Memory React State (`useState`):_ Simple to implement, but loses all filters on page refresh and prevents link sharing.
  2. _URL Search Parameters via React Router:_ Serializing search filters into `?q=...&loc=...&mode=...` in the browser address bar.
- **Chosen Approach:** URL Search Parameters via React Router.
- **Justification:**
  - Enables deep linking, browser back/forward history navigation, and tab persistence.
  - Matches production patterns observed in GitHub and Ashby.
- **Trade-offs:** Requires URL serialization and parsing helpers, as well as debouncing on free-text search to avoid thrashing browser history.
- **Scale Consideration:** URL parameters remain the standard architecture across all enterprise search interfaces.

---

### ADR-004: Job Match Scoring — Deterministic Heuristic Algorithm vs. Mock AI Black Box

- **Context:** Candidates need to understand how well a job listing aligns with their qualifications and preferences.
- **Options Considered:**
  1. _Opaque Mock AI Prediction:_ Fabricating a "98% Match by Gemini AI" badge without an explainable algorithm.
  2. _Deterministic Weighted Heuristic:_ A transparent, mathematically defined formula taking into account required skill overlap, preferred skills, seniority level, work arrangement, and location.
- **Chosen Approach:** Deterministic Weighted Heuristic.
- **Justification:**
  - 100% explainable, predictable, and testable via unit tests.
  - Educates the candidate on why they match (e.g. "+30 pts for 3/4 required skills, -10 pts for missing Next.js").
  - Does not violate portfolio integrity rules regarding fake AI claims.
- **Trade-offs:** Does not perform semantic fuzzy matching of alternate skill names (e.g., "JS" vs "JavaScript"), although input normalization mitigates this.
- **Scale Consideration:** In production, this can be complemented by vector embeddings computed on the backend while retaining the explainable breakdown.

---

### ADR-005: Real-Time Stream — WebSocket Demo Server with Graceful Degradation vs. Long-Polling

- **Context:** The application demonstrates real-time capability by receiving newly posted jobs live.
- **Options Considered:**
  1. _Simulated Polling (`setInterval`):_ A client-side fake loop pretending to be a real-time stream.
  2. _Real Node.js WebSocket Server (`ws`) with Client Auto-Reconnect and Graceful Fallback:_ A genuine local WebSocket server communicating via standard `ws://` protocol, backed by frontend fallback if unavailable.
- **Chosen Approach:** Real Node.js WebSocket Server (`server/demoJobStream.ts`) with client hook `useJobStream`.
- **Justification:**
  - Complies strictly with rule #7 ("Do not claim a feature is complete unless its implementation supports that claim") and rule #11 ("Do not create a polling loop and call it a WebSocket").
  - Teaches real WebSocket lifecycle management: handshake, heartbeat ping/pong, connection state machine, exponential backoff, and clean teardown on unmount.
  - When deployed as a static site (where a local WebSocket server is not running), the frontend detects connection failure, displays a transparent "Local Mode (Live Stream Inactive)" status, and continues operating without throwing unhandled exceptions.
- **Trade-offs:** Requires running a second process (`npm run server`) during local evaluation if live streaming is tested.
