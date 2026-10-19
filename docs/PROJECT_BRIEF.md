# Product Brief: Opportunity Radar

**Tagline:** _Find better-fit opportunities before they go stale._  
**Target Audience:** Students, fresh graduates, and early-career software developers in India.  
**Domain Focus:** Software engineering internships, entry-level full-stack, frontend, and backend opportunities across major Indian tech hubs (Bengaluru, Pune, Hyderabad, Gurugram, Noida, Chennai, and Remote India).  
**Demonstration Status:** 100% explicit demonstration dataset. Clear labelling in UI and README. No scraped job links, no fake live credentials.

---

## 1. Problem Statement

Early-career job seekers face three acute bottlenecks in the current recruitment landscape:

1. **The Stale Opportunity Trap:** High-volume job portals display listings that are weeks or months old, where candidate backlogs exceed thousands and new submissions are never read. Early applications (submitted within 24–48 hours) yield 4× higher callback rates.
2. **Opaque "AI" Matching:** Existing portals show arbitrary "95% match" percentages without explaining why, misleading candidates on prerequisite skills and seniority alignment.
3. **Fragmented Search and Tracking:** Candidates juggle bookmarks across spreadsheets, browser tabs, and multiple company portals, losing track of application dates, stages, and custom notes.

---

## 2. Product Solution & Key Features

Opportunity Radar solves these challenges with a focused, high-density career cockpit:

1. **Freshness-First Job Discovery:**
   - Prominently highlights postings under 24 hours ("Posted today") and under 72 hours.
   - Chronological and freshness-weighted sorting options.
   - Instant keyword search indexing titles, companies, required technologies, and locations.
2. **URL-Backed Multi-Faceted Filtering:**
   - Filter by Indian Tech Hubs (Bengaluru, Pune, Hyderabad, Gurugram, Mumbai, Chennai, Remote India).
   - Filter by Work Arrangement (On-site, Hybrid, Remote).
   - Filter by Experience Level (Internship, Entry-Level / 0-1 yrs, Junior / 1-2 yrs).
   - Filter by Role Domain (Frontend, Full-Stack, Backend, React/TypeScript).
   - Filter by Minimum Salary / Stipend (INR formatted: ₹30k/mo stipend up to ₹18 LPA CTC).
   - Deep link support: every filter permutation is shareable and survives browser refreshes.
3. **Deterministic, Explainable Match-Fit Engine:**
   - Heuristic comparison between the user's configured career preferences and the listing's parameters.
   - Visual badge breakdown:
     - Overlapping Skills (e.g., React, TypeScript, CSS)
     - Missing Skills (e.g., Next.js, GraphQL)
     - Work Mode Alignment (e.g., Prefers Remote/Hybrid)
     - Experience Match (e.g., Intern / Entry-level matched)
   - Absolutely no opaque "AI black box" claims.
4. **Persistent Bookmarks & Stage Tracker:**
   - One-click bookmarking saved locally in IndexedDB.
   - Dedicated Application Tracker with 5 pipeline statuses:
     - `Saved`
     - `Applied`
     - `Interview`
     - `Rejected`
     - `Offer`
   - Editable applied date and interview preparation notes.
   - CSV export capability for spreadsheet backups.
5. **Real-Time Demonstration Stream (WebSocket):**
   - Companion Node.js WebSocket service broadcasting freshly emitted demo listings.
   - Live connection status indicator (Pulse Green = Connected, Gray = Disconnected).
   - Automatic graceful degradation: if the WebSocket server is offline, the app operates seamlessly in local cache mode without breaking.
6. **Accessible & Responsive:**
   - Full keyboard navigation (Tab, Enter, Escape, Arrow keys).
   - Screen-reader friendly semantic structure and live regions.
   - Optimized for viewports from 360px smartphones to 1440px desktop workstations.
