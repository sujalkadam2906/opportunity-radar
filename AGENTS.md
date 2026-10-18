# AI Agent Guidance & Codebase Standards: Opportunity Radar

*This file provides context, rules, and commands for autonomous AI coding agents inspecting or contributing to Opportunity Radar.*

---

## 1. Project Principles

1. **Portfolio Quality:** This project serves as an Associate Frontend Developer portfolio demonstration. Code must be clean, maintainable, strictly typed, and explainable by an early-career engineer.
2. **Product Integrity:** The job listings are explicitly labelled demonstration records. Do not remove demo labels, invent fake hiring partners, or fabricate real-time claims.
3. **Strict TypeScript:** No `any` shortcuts. Use explicit domain models from `src/types/index.ts`.
4. **No Suppressions:** Never suppress TypeScript checks (`@ts-ignore`) or ESLint warnings to make builds pass.
5. **Accessibility First:** Semantic HTML (`button`, `select`, `input`, `header`, `nav`, `main`, `article`), visible focus outlines (`:focus-visible`), and ARIA live regions (`aria-live="polite"`).

---

## 2. Directory Structure & Modular Boundaries

```text
src/
├── app/               # Application shell, router configuration, QueryClient providers
├── components/
│   ├── ui/            # Design-system primitives (Button, Input, Select, Badge, Card, Modal, Drawer)
│   ├── layout/        # AppHeader, PageContainer
│   └── feedback/      # ToastContext, useToast, EmptyState, SkeletonLoader, StreamStatusPill
├── features/
│   ├── jobs/          # JobCard, JobDetailView, JobFitExplainer, calculation utilities
│   ├── search/        # SearchBar, FilterBar, ActiveFilterChips, useJobFilters
│   ├── saved/         # useSavedJobs (IndexedDB optimistic updates)
│   ├── applications/  # ApplicationTable, useApplications (Funnel status, notes, CSV export)
│   └── preferences/   # PreferencesModal, usePreferences
├── services/
│   ├── jobService.ts  # Asynchronous data access boundary (simulated latency & abort support)
│   └── storage/       # idbStorage.ts (typed IndexedDB wrapper + in-memory fallback)
├── types/             # Domain TypeScript interfaces
└── styles/            # tokens.css, global.css, utilities.css
```

---

## 3. Essential Verification Commands

Always run these commands to verify any changes:

```bash
# Typecheck
npm run typecheck

# Linting
npm run lint

# Unit & Component Tests
npm test

# Production Build
npm run build

# Standalone WebSocket Server
npm run server
```

---

## 4. State Management Guidelines

- **Remote/Seed Data:** Managed exclusively via TanStack Query (`queryKey: ['jobs']`).
- **Discovery Filter State:** Kept in URL search parameters (`useSearchParams` in `useJobFilters.ts`).
- **User Persistence:** Managed via IndexedDB (`storage` in `idbStorage.ts`) wrapped in TanStack Query optimistic mutations.
- **Form State:** Kept local until submitted or blurred.
