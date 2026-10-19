export type WorkMode = 'remote' | 'hybrid' | 'onsite';

export type ExperienceLevel = 'internship' | 'entry' | 'junior' | 'mid';

export type JobCategory =
  'frontend' | 'fullstack' | 'backend' | 'mobile' | 'devops' | 'qa';

export type ApplicationStatus = 'saved' | 'applied' | 'interview' | 'offer' | 'rejected';

export type FreshnessWindow = 'all' | '24h' | '3d' | '7d';

export type SortOption =
  'freshness_desc' | 'freshness_asc' | 'score_desc' | 'salary_desc';

export interface SalaryRange {
  min: number; // in INR
  max: number; // in INR
  currency: 'INR';
  period: 'yearly' | 'monthly';
  display: string; // e.g. "₹6.0 – 10.0 LPA" or "₹25,000 – 40,000/mo"
}

export interface Company {
  id: string;
  name: string;
  location: string;
  tagline: string;
  size: '1-10' | '11-50' | '51-200' | '201-1000' | '1000+';
  industry: string;
  websiteUrl?: string;
}

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
  postedAt: string; // ISO 8601 string
  isFresh: boolean;
  isFeatured?: boolean;
  demoNotice: string;
}

export interface UserPreferences {
  targetRole: string;
  targetExperience: ExperienceLevel;
  preferredLocations: string[];
  preferredWorkModes: WorkMode[];
  skills: string[];
  minSalaryInr: number;
}

export interface FitScoreBreakdown {
  score: number; // 0 to 100
  matchedSkills: string[];
  missingSkills: string[];
  workModeMatch: boolean;
  locationMatch: boolean;
  experienceMatch: boolean;
  summary: string;
}

export interface SavedJobRecord {
  jobId: string;
  savedAt: string;
  jobSnapshot: JobListing;
}

export interface JobApplicationRecord {
  id: string; // Typically matches jobId
  jobId: string;
  jobTitle: string;
  companyName: string;
  location: string;
  status: ApplicationStatus;
  appliedDate?: string;
  interviewDate?: string;
  notes: string;
  updatedAt: string;
  createdAt: string;
}

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

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface ToastMessage {
  id: string;
  type: ToastType;
  title: string;
  description?: string;
  durationMs?: number;
}

export type WebSocketStreamEvent =
  | { type: 'CONNECTED'; payload: { clientCount: number; timestamp: string } }
  | { type: 'NEW_JOB_OPPORTUNITY'; payload: JobListing }
  | { type: 'HEARTBEAT'; payload: { timestamp: string } };

export type StreamConnectionStatus =
  'connecting' | 'connected' | 'disconnected' | 'offline_mode';
