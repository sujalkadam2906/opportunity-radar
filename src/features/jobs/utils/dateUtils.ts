import { FreshnessWindow } from '../../../types';

/**
 * Returns human-readable relative time string.
 * Allows passing an optional reference timestamp for predictable testing.
 */
export function formatPostingAge(
  isoDate: string,
  referenceTimeMs: number = Date.now()
): string {
  try {
    const timestamp = new Date(isoDate).getTime();
    if (isNaN(timestamp)) {
      return 'Recently';
    }

    const diffMs = referenceTimeMs - timestamp;
    if (diffMs < 0) {
      return 'Just now';
    }

    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffHours < 1) {
      const diffMins = Math.max(1, Math.floor(diffMs / (1000 * 60)));
      return `${diffMins}m ago`;
    }

    if (diffHours < 24) {
      return diffHours <= 12 ? 'Today' : `${diffHours}h ago`;
    }

    if (diffDays === 1) {
      return '1d ago';
    }

    if (diffDays < 30) {
      return `${diffDays}d ago`;
    }

    return '30d+ ago';
  } catch {
    return 'Recently';
  }
}

/**
 * Determines whether a job posting falls within the selected freshness window.
 */
export function isWithinFreshness(
  isoDate: string,
  window: FreshnessWindow,
  referenceTimeMs: number = Date.now()
): boolean {
  if (window === 'all') {
    return true;
  }

  const timestamp = new Date(isoDate).getTime();
  if (isNaN(timestamp)) {
    return false;
  }

  const diffHours = (referenceTimeMs - timestamp) / (1000 * 60 * 60);

  switch (window) {
    case '24h':
      return diffHours <= 24;
    case '3d':
      return diffHours <= 72;
    case '7d':
      return diffHours <= 168;
    default:
      return true;
  }
}

/**
 * Formats date into standard readable Indian English format: e.g. "18 Oct 2026"
 */
export function formatDate(isoDate: string): string {
  try {
    const d = new Date(isoDate);
    if (isNaN(d.getTime())) {
      return 'N/A';
    }
    return d.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return 'N/A';
  }
}
