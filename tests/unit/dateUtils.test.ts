import { describe, it, expect } from 'vitest';
import { formatPostingAge, isWithinFreshness, formatDate } from '../../src/features/jobs/utils/dateUtils';

describe('dateUtils - Relative posting age and freshness window calculations', () => {
  const REF_TIME = new Date('2026-10-18T12:00:00.000Z').getTime();

  it('formats posting age correctly', () => {
    // 30 mins ago
    const m30 = new Date(REF_TIME - 30 * 60 * 1000).toISOString();
    expect(formatPostingAge(m30, REF_TIME)).toBe('30m ago');

    // 4 hours ago
    const h4 = new Date(REF_TIME - 4 * 60 * 60 * 1000).toISOString();
    expect(formatPostingAge(h4, REF_TIME)).toBe('Today');

    // 16 hours ago
    const h16 = new Date(REF_TIME - 16 * 60 * 60 * 1000).toISOString();
    expect(formatPostingAge(h16, REF_TIME)).toBe('16h ago');

    // 1 day ago
    const d1 = new Date(REF_TIME - 28 * 60 * 60 * 1000).toISOString();
    expect(formatPostingAge(d1, REF_TIME)).toBe('1d ago');

    // 4 days ago
    const d4 = new Date(REF_TIME - 4 * 24 * 60 * 60 * 1000).toISOString();
    expect(formatPostingAge(d4, REF_TIME)).toBe('4d ago');
  });

  it('evaluates freshness window accurately', () => {
    const fresh2h = new Date(REF_TIME - 2 * 60 * 60 * 1000).toISOString();
    const fresh30h = new Date(REF_TIME - 30 * 60 * 60 * 1000).toISOString();
    const fresh5d = new Date(REF_TIME - 5 * 24 * 60 * 60 * 1000).toISOString();
    const stale10d = new Date(REF_TIME - 10 * 24 * 60 * 60 * 1000).toISOString();

    expect(isWithinFreshness(fresh2h, '24h', REF_TIME)).toBe(true);
    expect(isWithinFreshness(fresh30h, '24h', REF_TIME)).toBe(false);

    expect(isWithinFreshness(fresh30h, '3d', REF_TIME)).toBe(true);
    expect(isWithinFreshness(fresh5d, '3d', REF_TIME)).toBe(false);

    expect(isWithinFreshness(fresh5d, '7d', REF_TIME)).toBe(true);
    expect(isWithinFreshness(stale10d, '7d', REF_TIME)).toBe(false);

    expect(isWithinFreshness(stale10d, 'all', REF_TIME)).toBe(true);
  });

  it('handles invalid dates gracefully without throwing', () => {
    expect(formatPostingAge('invalid-date-string')).toBe('Recently');
    expect(isWithinFreshness('garbage', '24h')).toBe(false);
    expect(formatDate('garbage')).toBe('N/A');
  });
});
