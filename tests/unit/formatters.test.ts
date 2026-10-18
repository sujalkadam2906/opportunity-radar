import { describe, it, expect } from 'vitest';
import {
  formatSalary,
  formatWorkMode,
  formatExperience,
  formatCategory,
  formatApplicationStatus,
} from '../../src/features/jobs/utils/formatters';

describe('formatters - Domain and presentation formatters', () => {
  it('formats salary with display override or fallback calculations', () => {
    expect(
      formatSalary({
        min: 600000,
        max: 1000000,
        currency: 'INR',
        period: 'yearly',
        display: '₹6.0 – 10.0 LPA',
      })
    ).toBe('₹6.0 – 10.0 LPA');

    // Monthly stipend fallback
    expect(
      formatSalary({
        min: 25000,
        max: 35000,
        currency: 'INR',
        period: 'monthly',
        display: '',
      })
    ).toBe('₹25,000 – ₹35,000/mo');

    // Yearly fallback
    expect(
      formatSalary({
        min: 800000,
        max: 1200000,
        currency: 'INR',
        period: 'yearly',
        display: '',
      })
    ).toBe('₹8.0 – 12.0 LPA');
  });

  it('formats work arrangement labels', () => {
    expect(formatWorkMode('remote')).toBe('Remote');
    expect(formatWorkMode('hybrid')).toBe('Hybrid');
    expect(formatWorkMode('onsite')).toBe('On-site');
    expect(formatWorkMode('all')).toBe('All Work Modes');
  });

  it('formats experience levels', () => {
    expect(formatExperience('internship')).toBe('Internship');
    expect(formatExperience('entry')).toBe('Entry-Level (0–1y)');
    expect(formatExperience('junior')).toBe('Junior (1–2y)');
    expect(formatExperience('mid')).toBe('Mid-Level (2y+)');
  });

  it('formats categories', () => {
    expect(formatCategory('frontend')).toBe('Frontend');
    expect(formatCategory('fullstack')).toBe('Full-Stack');
    expect(formatCategory('backend')).toBe('Backend');
  });

  it('formats application statuses', () => {
    expect(formatApplicationStatus('saved')).toBe('Saved');
    expect(formatApplicationStatus('applied')).toBe('Applied');
    expect(formatApplicationStatus('interview')).toBe('Interviewing');
    expect(formatApplicationStatus('offer')).toBe('Offer Received');
    expect(formatApplicationStatus('rejected')).toBe('Not Selected');
  });
});
