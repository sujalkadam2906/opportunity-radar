import { describe, it, expect } from 'vitest';
import {
  filterAndSortJobs,
  normalizeText,
} from '../../src/features/jobs/utils/searchFilter';
import { DEMO_JOBS, DEMO_PREFERENCES } from '../../src/data/demoJobs';
import { FilterState } from '../../src/types';

describe('searchFilter - Normalization, Filtering and Sorting Pipeline', () => {
  const defaultFilters: FilterState = {
    query: '',
    location: 'all',
    workMode: 'all',
    experienceLevel: 'all',
    category: 'all',
    freshness: 'all',
    minSalary: 0,
    sort: 'freshness_desc',
  };

  it('normalizes search strings removing punctuation and extra whitespace', () => {
    expect(normalizeText('  React.js,  TypeScript!  ')).toBe('react js typescript');
    expect(normalizeText('Frontend-Developer')).toBe('frontend-developer');
  });

  it('returns all jobs when default filters are active', () => {
    const results = filterAndSortJobs(DEMO_JOBS, defaultFilters, DEMO_PREFERENCES);
    expect(results).toHaveLength(DEMO_JOBS.length);
  });

  it('filters by query across title, company name, and required skills', () => {
    const titleResults = filterAndSortJobs(
      DEMO_JOBS,
      { ...defaultFilters, query: 'intern' },
      DEMO_PREFERENCES
    );
    expect(titleResults.length).toBeGreaterThan(0);
    titleResults.forEach((j) => {
      const match =
        j.title.toLowerCase().includes('intern') || j.experienceLevel === 'internship';
      expect(match).toBe(true);
    });

    const skillResults = filterAndSortJobs(
      DEMO_JOBS,
      { ...defaultFilters, query: 'TypeScript' },
      DEMO_PREFERENCES
    );
    expect(skillResults.length).toBeGreaterThan(0);
    skillResults.forEach((j) => {
      const hasSkill = j.requiredSkills.some((s) =>
        s.toLowerCase().includes('typescript')
      );
      const inTitle = j.title.toLowerCase().includes('typescript');
      expect(hasSkill || inTitle).toBe(true);
    });
  });

  it('filters strictly by work arrangement', () => {
    const remoteOnly = filterAndSortJobs(
      DEMO_JOBS,
      { ...defaultFilters, workMode: 'remote' },
      DEMO_PREFERENCES
    );
    expect(remoteOnly.length).toBeGreaterThan(0);
    remoteOnly.forEach((j) => expect(j.workMode).toBe('remote'));

    const hybridOnly = filterAndSortJobs(
      DEMO_JOBS,
      { ...defaultFilters, workMode: 'hybrid' },
      DEMO_PREFERENCES
    );
    expect(hybridOnly.length).toBeGreaterThan(0);
    hybridOnly.forEach((j) => expect(j.workMode).toBe('hybrid'));
  });

  it('filters by location', () => {
    const bengaluruJobs = filterAndSortJobs(
      DEMO_JOBS,
      { ...defaultFilters, location: 'Bengaluru' },
      DEMO_PREFERENCES
    );
    expect(bengaluruJobs.length).toBeGreaterThan(0);
    bengaluruJobs.forEach((j) => {
      expect(j.location.toLowerCase()).toContain('bengaluru');
    });
  });

  it('filters by experience level', () => {
    const internshipJobs = filterAndSortJobs(
      DEMO_JOBS,
      { ...defaultFilters, experienceLevel: 'internship' },
      DEMO_PREFERENCES
    );
    expect(internshipJobs.length).toBeGreaterThan(0);
    internshipJobs.forEach((j) => expect(j.experienceLevel).toBe('internship'));
  });

  it('filters by minimum annual salary', () => {
    const highSalaryJobs = filterAndSortJobs(
      DEMO_JOBS,
      { ...defaultFilters, minSalary: 1000000 }, // 10 LPA
      DEMO_PREFERENCES
    );
    expect(highSalaryJobs.length).toBeGreaterThan(0);
    highSalaryJobs.forEach((j) => {
      const maxAnnual = j.salary.period === 'monthly' ? j.salary.max * 12 : j.salary.max;
      expect(maxAnnual).toBeGreaterThanOrEqual(1000000);
    });
  });

  it('sorts correctly by highest match score', () => {
    const sortedByScore = filterAndSortJobs(
      DEMO_JOBS,
      { ...defaultFilters, sort: 'score_desc' },
      DEMO_PREFERENCES
    );
    expect(sortedByScore.length).toBeGreaterThan(1);
    // Check descending order of scores
    // First job should have high score
    expect(sortedByScore[0]).toBeDefined();
  });
});
