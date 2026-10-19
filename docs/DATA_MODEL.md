# Data Model Specification: Opportunity Radar

_Role: Senior Frontend Engineer & UI Architect_  
_Date: October 2026_

---

## 1. Domain Types & Schemas

The TypeScript data models are strictly defined in `src/types/index.ts` and separated from presentation concerns.

### 1.1 Enumerations and Core Literals

```typescript
export type WorkMode = 'remote' | 'hybrid' | 'onsite';

export type ExperienceLevel = 'internship' | 'entry' | 'junior' | 'mid';

export type JobCategory =
  'frontend' | 'fullstack' | 'backend' | 'mobile' | 'devops' | 'qa';

export type ApplicationStatus = 'saved' | 'applied' | 'interview' | 'offer' | 'rejected';

export type FreshnessWindow = 'all' | '24h' | '3d' | '7d';

export type SortOption =
  'freshness_desc' | 'freshness_asc' | 'score_desc' | 'salary_desc';
```

### 1.2 Company & Salary Models

```typescript
export interface SalaryRange {
  min: number; // In INR (e.g., 600000 for 6 LPA, or 25000 for 25k/mo intern)
  max: number; // In INR (e.g., 1000000 for 10 LPA, or 40000 for 40k/mo intern)
  currency: 'INR';
  period: 'yearly' | 'monthly';
  display: string; // e.g. "₹6.0 – 10.0 LPA" or "₹25,000 – 40,000/mo"
}

export interface Company {
  id: string;
  name: string;
  location: string; // e.g. "Bengaluru, Karnataka"
  websiteUrl?: string;
  tagline: string;
  size: '1-10' | '11-50' | '51-200' | '201-1000' | '1000+';
  industry: string;
}
```

### 1.3 Job Listing Model (`JobListing`)

```typescript
export interface JobListing {
  id: string;
  title: string;
  company: Company;
  location: string;
  workMode: WorkMode;
  experienceLevel: ExperienceLevel;
  category: JobCategory;
  salary: SalaryRange;
  requiredSkills: string[];
  preferredSkills: string[];
  description: string;
  responsibilities: string[];
  qualifications: string[];
  benefits: string[];
  postedAt: string; // ISO 8601 string, e.g. "2026-10-18T10:00:00.000Z"
  isFresh: boolean; // Computed or flagged (< 48h)
  isFeatured?: boolean;
  demoNotice: string; // Explicit indicator: "Demonstration listing for portfolio testing"
}
```

### 1.4 User Preferences Model (`UserPreferences`)

```typescript
export interface UserPreferences {
  targetRole: string; // e.g. "Frontend Engineer"
  targetExperience: ExperienceLevel;
  preferredLocations: string[]; // e.g. ["Bengaluru", "Remote", "Pune"]
  preferredWorkModes: WorkMode[]; // e.g. ['remote', 'hybrid']
  skills: string[]; // e.g. ["React", "TypeScript", "JavaScript", "HTML", "CSS", "Git"]
  minSalaryInr: number; // e.g. 500000
}
```

### 1.5 Match-Fit Breakdown (`FitScoreBreakdown`)

```typescript
export interface FitScoreBreakdown {
  score: number; // 0 to 100
  matchedSkills: string[];
  missingSkills: string[];
  workModeMatch: boolean;
  locationMatch: boolean;
  experienceMatch: boolean;
  summary: string;
}
```

### 1.6 Saved Job & Tracked Application (`JobApplication`)

```typescript
export interface SavedJobRecord {
  jobId: string;
  savedAt: string; // ISO 8601
  jobSnapshot: JobListing;
}

export interface JobApplicationRecord {
  id: string; // Application UUID or jobId
  jobId: string;
  jobTitle: string;
  companyName: string;
  location: string;
  status: ApplicationStatus;
  appliedDate?: string; // YYYY-MM-DD
  interviewDate?: string; // YYYY-MM-DD
  notes: string;
  updatedAt: string; // ISO 8601
  createdAt: string; // ISO 8601
}
```

### 1.7 URL Filter State (`FilterState`)

```typescript
export interface FilterState {
  query: string;
  location: string;
  workMode: WorkMode | 'all';
  experienceLevel: ExperienceLevel | 'all';
  category: JobCategory | 'all';
  freshness: FreshnessWindow;
  minSalary: number;
  sort: SortOption;
  selectedJobId?: string;
}
```

### 1.8 Real-Time Stream Event (`WebSocketEvent`)

```typescript
export type WebSocketStreamEvent =
  | { type: 'CONNECTED'; payload: { clientCount: number; timestamp: string } }
  | { type: 'NEW_JOB_OPPORTUNITY'; payload: JobListing }
  | { type: 'HEARTBEAT'; payload: { timestamp: string } };
```

---

## 2. IndexedDB Schema Architecture

Opportunity Radar uses an IndexedDB database named `OpportunityRadarDB` at version `1`:

1. **Object Store `saved_jobs`:**
   - Primary Key: `jobId` (string)
   - Indices:
     - `savedAt` (for chronological listing)
2. **Object Store `applications`:**
   - Primary Key: `id` (string, jobId)
   - Indices:
     - `status` (for quick filtering by stage: `applied`, `interview`, etc.)
     - `updatedAt` (for reverse-chronological activity sorting)
3. **Object Store `user_preferences`:**
   - Primary Key: `id` (fixed key `'current_preferences'`)

If IndexedDB is unavailable (e.g. strict security mode or private browsing quota restriction), the storage service transparently degrades to an in-memory and `localStorage` cache with a recorded diagnostic notice.
