import { JobListing, FilterState, UserPreferences } from '../../../types';
import { calculateFitScore } from './scoreCalculator';
import { isWithinFreshness } from './dateUtils';

export function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Pure function that filters and sorts job listings based on criteria and user preferences.
 */
export function filterAndSortJobs(
  jobs: JobListing[],
  filters: FilterState,
  preferences: UserPreferences,
  referenceTimeMs: number = Date.now()
): JobListing[] {
  const normQuery = normalizeText(filters.query || '');

  const filtered = jobs.filter((job) => {
    // 1. Text Search across Title, Company, Location, and Required Skills
    if (normQuery) {
      const searchHaystack = normalizeText(
        `${job.title} ${job.company.name} ${job.location} ${job.requiredSkills.join(' ')} ${job.category}`
      );
      if (!searchHaystack.includes(normQuery)) {
        return false;
      }
    }

    // 2. Location Filter
    if (filters.location && filters.location !== 'all') {
      const jobLoc = job.location.toLowerCase();
      const targetLoc = filters.location.toLowerCase();
      if (!jobLoc.includes(targetLoc)) {
        // If target is Remote, also check workMode
        if (targetLoc === 'remote' && job.workMode !== 'remote') {
          return false;
        } else if (targetLoc !== 'remote') {
          return false;
        }
      }
    }

    // 3. Work Mode Filter
    if (filters.workMode && filters.workMode !== 'all') {
      if (job.workMode !== filters.workMode) {
        return false;
      }
    }

    // 4. Experience Level Filter
    if (filters.experienceLevel && filters.experienceLevel !== 'all') {
      if (job.experienceLevel !== filters.experienceLevel) {
        return false;
      }
    }

    // 5. Category / Domain Filter
    if (filters.category && filters.category !== 'all') {
      if (job.category !== filters.category) {
        return false;
      }
    }

    // 6. Freshness Filter
    if (filters.freshness && filters.freshness !== 'all') {
      if (!isWithinFreshness(job.postedAt, filters.freshness, referenceTimeMs)) {
        return false;
      }
    }

    // 7. Minimum Salary Filter (In INR)
    if (filters.minSalary && filters.minSalary > 0) {
      // If yearly, compare max salary; if monthly, convert to approx annualized (x12)
      const annualizedMax =
        job.salary.period === 'monthly'
          ? job.salary.max * 12
          : job.salary.max;

      if (annualizedMax < filters.minSalary) {
        return false;
      }
    }

    return true;
  });

  // Sorting
  const sorted = [...filtered].sort((a, b) => {
    switch (filters.sort) {
      case 'freshness_desc':
        return new Date(b.postedAt).getTime() - new Date(a.postedAt).getTime();
      case 'freshness_asc':
        return new Date(a.postedAt).getTime() - new Date(b.postedAt).getTime();
      case 'score_desc': {
        const scoreA = calculateFitScore(a, preferences).score;
        const scoreB = calculateFitScore(b, preferences).score;
        return scoreB - scoreA;
      }
      case 'salary_desc': {
        const valA = a.salary.period === 'monthly' ? a.salary.max * 12 : a.salary.max;
        const valB = b.salary.period === 'monthly' ? b.salary.max * 12 : b.salary.max;
        return valB - valA;
      }
      default:
        return 0;
    }
  });

  return sorted;
}
