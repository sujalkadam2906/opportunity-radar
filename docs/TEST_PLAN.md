# Comprehensive Test Plan: Opportunity Radar

*Role: Quality-Assurance & Performance Engineer*  
*Date: October 2026*

---

## 1. Testing Philosophy & Pyramid

Opportunity Radar adopts the Testing Library philosophy: **"The more your tests resemble the way your software is used, the more confidence they can give you."**

```
             / \
            /   \
           / E2E \       Playwright: Complete User Journeys (Search, Save, Stage, Refresh)
          /-------\
         / Integr- \     React Testing Library: Filter combinations, Detail drawers,
        /   ation   \    Optimistic update rollbacks, URL searchParams sync
       /-------------\
      /   Unit Tests  \  Vitest: Search normalization, Heuristic match scoring,
     /                 \ Formatters, Date freshness calculations, Storage validators
    ---------------------
```

---

## 2. Unit Testing Scope (Vitest)

Target coverage: 100% of pure domain and calculation logic in `src/features/jobs/utils/` and `src/services/storage/`.

### 2.1 Deterministic Heuristic Match-Score Engine (`scoreCalculator.test.ts`)
- Case 1: Perfect match (all required skills + preferred skills + matched experience + preferred work mode + location) yields 100/100.
- Case 2: Zero overlapping skills yields base points for location/mode only with detailed missing skills list.
- Case 3: Remote role automatically satisfies location compatibility.
- Case 4: Adjacent experience level awards partial points (15 pts vs 25 pts).
- Case 5: Empty user skills produces graceful output with zero exceptions.

### 2.2 Search Normalization & Filter Engine (`searchFilter.test.ts`)
- Case 1: Case-insensitive query matches title ("react" matches "Junior React Developer").
- Case 2: Query matches tech skill tokens ("typescript" matches requiredSkills).
- Case 3: Combined filters (location + workMode + freshness) apply strict intersection (logical AND).
- Case 4: Empty query with default filters returns all valid listings.
- Case 5: Zero-match criteria returns empty array without throwing.

### 2.3 Date & Freshness Utilities (`dateUtils.test.ts`)
- Case 1: Posted < 24 hours ago formats as "Today" and flags `isFresh = true`.
- Case 2: Posted 2 days ago formats as "2d ago" and flags `isFresh = true`.
- Case 3: Posted 8 days ago formats as "8d ago" and flags `isFresh = false`.
- Case 4: Invalid date string returns safe fallback without NaN or crashes.

### 2.4 Currency & Salary Formatters (`formatters.test.ts`)
- Case 1: Yearly LPA formatting (e.g., 800000 -> "₹8.0 LPA").
- Case 2: Monthly stipend formatting (e.g., 25000 -> "₹25,000/mo").

---

## 3. Component & Integration Testing (Vitest + React Testing Library)

Using real user interactions via `@testing-library/user-event`.

### 3.1 Job Discovery & URL Filtering Integration (`DiscoverPage.test.tsx`)
- Verify initial rendering of results header and seed job cards.
- User types in search input -> results filter accordingly.
- User selects "Remote" filter pill -> non-remote listings disappear.
- User clicks "Clear all filters" -> result set resets to original list.
- User clicks a job card -> detail pane updates with the selected job's title, description, and match score breakdown.

### 3.2 Bookmarking & Optimistic Persistence (`SavedJobs.test.tsx`)
- User clicks "Save" bookmark icon on a job card -> button state toggles to "Saved" with `aria-label="Remove [Job Title] from saved jobs"`.
- User navigates to the Saved Jobs route -> bookmarked job is visible in the list.
- User removes the saved job -> list updates and shows the empty state when empty.

### 3.3 Application Tracker & Stage Transitions (`ApplicationsPage.test.tsx`)
- Changing application status from "Saved" to "Applied" updates the status badge.
- Adding personal interview notes and changing interview date updates the record in storage.
- Filter by status tab ("Applied", "Interview", "Offer") isolates the appropriate records.

### 3.4 Error Handling & Rollback Simulation
- Simulated storage failure during status change triggers error toast notification and reverts optimistic UI to previous status.

---

## 4. End-to-End Testing (Playwright)

Complete user journey executed against a real production build running on localhost:

1. **Journey 1: Discovery & Filtering**
   * Visit `/` route.
   * Verify header, search bar, and sample data disclaimer are visible.
   * Search for `"Frontend"`.
   * Apply filter `"Remote"`.
   * Verify matching cards and active filter tags.
2. **Journey 2: Job Inspection & Bookmarking**
   * Select the first matching card.
   * Verify detail pane displays role responsibilities, required skills, and explainable match score.
   * Click "Save Job".
   * Verify toast notification "Job bookmarked".
3. **Journey 3: Application Funnel Tracking & Persistence**
   * Navigate to `/applications`.
   * Locate the bookmarked job.
   * Change status to `"Applied"`.
   * Enter custom interview note: `"Submitted portfolio via careers portal"`.
   * Refresh the page (`page.reload()`).
   * Verify the status remains `"Applied"` and notes are preserved.
4. **Journey 4: Mobile Responsive Navigation**
   * Viewport set to 390×844 (Mobile).
   * Verify layout stacks into single column.
   * Click card to trigger full-screen detail view with accessible close/back button.

---

## 5. Accessibility & Performance Verification

- **Keyboard Tab Order Check:** Verify complete keyboard traversability without mouse intervention.
- **Focus Trap in Modals:** Preferences modal traps focus and closes cleanly with `Escape`.
- **Contrast Ratios:** Automated and manual token validation against WCAG 2.2 AA (4.5:1 text, 3:1 controls).
- **Core Web Vitals:** Fixed-size skeletons prevent Cumulative Layout Shift (CLS < 0.05). Debounced queries prevent Interaction to Next Paint delays (INP < 150ms).
