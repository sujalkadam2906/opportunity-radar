import { describe, it, expect } from 'vitest';
import { calculateFitScore, normalizeSkill } from '../../src/features/jobs/utils/scoreCalculator';
import { JobListing, UserPreferences } from '../../src/types';

describe('scoreCalculator - Deterministic Match Engine', () => {
  const basePreferences: UserPreferences = {
    targetRole: 'Frontend Engineer',
    targetExperience: 'entry',
    preferredLocations: ['Bengaluru', 'Remote'],
    preferredWorkModes: ['remote', 'hybrid'],
    skills: ['React', 'TypeScript', 'JavaScript', 'HTML', 'CSS', 'Git'],
    minSalaryInr: 600000,
  };

  const sampleJob: JobListing = {
    id: 'test-job-1',
    title: 'Frontend Engineer',
    company: {
      id: 'c1',
      name: 'Tech Labs',
      location: 'Bengaluru, Karnataka',
      tagline: 'Building great software',
      size: '51-200',
      industry: 'Software',
    },
    location: 'Bengaluru, Karnataka',
    workMode: 'hybrid',
    experienceLevel: 'entry',
    category: 'frontend',
    salary: {
      min: 800000,
      max: 1200000,
      currency: 'INR',
      period: 'yearly',
      display: '₹8.0 – 12.0 LPA',
    },
    requiredSkills: ['React', 'TypeScript', 'CSS'],
    preferredSkills: ['Git', 'Next.js'],
    description: 'Job description text',
    responsibilities: ['Build features'],
    qualifications: ['B.Tech / MCA'],
    benefits: ['Health Insurance'],
    postedAt: new Date().toISOString(),
    isFresh: true,
    demoNotice: 'Demo listing',
  };

  it('normalizes skill strings consistently', () => {
    expect(normalizeSkill('React.js')).toBe('react');
    expect(normalizeSkill(' TypeScript ')).toBe('typescript');
    expect(normalizeSkill('Node.js')).toBe('node');
    expect(normalizeSkill('Tailwind CSS')).toBe('tailwindcss');
  });

  it('awards full score (100) when all skills, experience, mode, and location align', () => {
    // 30 (req skills) + 2 (1 pref skill: Git) + 25 (exact exp) + 20 (hybrid in preferred) + 15 (Bengaluru in preferred) = 92
    // If all preferred match:
    const perfectJob: JobListing = {
      ...sampleJob,
      preferredSkills: ['Git', 'HTML', 'JavaScript', 'TypeScript', 'React'], // up to 10 bonus
    };
    const result = calculateFitScore(perfectJob, basePreferences);
    expect(result.score).toBe(100);
    expect(result.workModeMatch).toBe(true);
    expect(result.locationMatch).toBe(true);
    expect(result.experienceMatch).toBe(true);
    expect(result.matchedSkills).toEqual(['React', 'TypeScript', 'CSS']);
    expect(result.missingSkills).toHaveLength(0);
  });

  it('calculates partial score when skills are missing', () => {
    const jobWithMissingSkills: JobListing = {
      ...sampleJob,
      requiredSkills: ['React', 'Rust', 'Kubernetes'],
      preferredSkills: ['Go'],
    };
    const result = calculateFitScore(jobWithMissingSkills, basePreferences);

    // 1 of 3 required matched = 10 pts. 0 preferred = 0 pts. Exp match = 25. Mode = 20. Loc = 15. Total = 70.
    expect(result.score).toBe(70);
    expect(result.matchedSkills).toContain('React');
    expect(result.missingSkills).toEqual(['Rust', 'Kubernetes']);
  });

  it('awards universal location compatibility for remote roles', () => {
    const remoteJobInChennai: JobListing = {
      ...sampleJob,
      location: 'Chennai, Tamil Nadu',
      workMode: 'remote',
    };
    const result = calculateFitScore(remoteJobInChennai, basePreferences);
    expect(result.locationMatch).toBe(true);
  });

  it('handles adjacent seniority compatibility appropriately', () => {
    // basePreferences.targetExperience is 'entry'. Job is 'internship' (adjacent)
    const internJob: JobListing = {
      ...sampleJob,
      experienceLevel: 'internship',
    };
    const result = calculateFitScore(internJob, basePreferences);
    expect(result.experienceMatch).toBe(true); // adjacent awards match with 15 pts
  });

  it('handles empty user preferences safely', () => {
    const emptyPrefs: UserPreferences = {
      targetRole: '',
      targetExperience: 'entry',
      preferredLocations: [],
      preferredWorkModes: [],
      skills: [],
      minSalaryInr: 0,
    };
    const emptyResult = calculateFitScore(sampleJob, emptyPrefs);
    expect(emptyResult.score).toBeGreaterThan(0);
    expect(emptyResult.missingSkills).toEqual(sampleJob.requiredSkills);
  });
});
