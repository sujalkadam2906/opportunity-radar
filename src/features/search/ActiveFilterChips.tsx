import { FilterState } from '../../types';
import { X } from 'lucide-react';
import styles from './ActiveFilterChips.module.css';

export interface ActiveFilterChipsProps {
  filters: FilterState;
  onRemoveQuery: () => void;
  onRemoveLocation: () => void;
  onRemoveWorkMode: () => void;
  onRemoveExperience: () => void;
  onRemoveCategory: () => void;
  onRemoveFreshness: () => void;
  onRemoveMinSalary: () => void;
}

export function ActiveFilterChips({
  filters,
  onRemoveQuery,
  onRemoveLocation,
  onRemoveWorkMode,
  onRemoveExperience,
  onRemoveCategory,
  onRemoveFreshness,
  onRemoveMinSalary,
}: ActiveFilterChipsProps) {
  const chips: { label: string; onRemove: () => void }[] = [];

  if (filters.query) {
    chips.push({
      label: `"${filters.query}"`,
      onRemove: onRemoveQuery,
    });
  }

  if (filters.location !== 'all') {
    chips.push({
      label: `Location: ${filters.location}`,
      onRemove: onRemoveLocation,
    });
  }

  if (filters.workMode !== 'all') {
    chips.push({
      label: `Mode: ${filters.workMode}`,
      onRemove: onRemoveWorkMode,
    });
  }

  if (filters.experienceLevel !== 'all') {
    chips.push({
      label: `Exp: ${filters.experienceLevel}`,
      onRemove: onRemoveExperience,
    });
  }

  if (filters.category !== 'all') {
    chips.push({
      label: `Domain: ${filters.category}`,
      onRemove: onRemoveCategory,
    });
  }

  if (filters.freshness !== 'all') {
    chips.push({
      label: `Freshness: ${filters.freshness}`,
      onRemove: onRemoveFreshness,
    });
  }

  if (filters.minSalary > 0) {
    chips.push({
      label: `Min CTC: ₹${(filters.minSalary / 100000).toFixed(1)} LPA`,
      onRemove: onRemoveMinSalary,
    });
  }

  if (chips.length === 0) return null;

  return (
    <div className={styles.chipsContainer} aria-label="Active filters">
      <span className={styles.label}>Active Filters:</span>
      {chips.map((chip, idx) => (
        <span key={idx} className={styles.chip}>
          {chip.label}
          <button
            type="button"
            onClick={chip.onRemove}
            className={styles.removeBtn}
            aria-label={`Remove filter ${chip.label}`}
          >
            <X size={12} aria-hidden="true" />
          </button>
        </span>
      ))}
    </div>
  );
}
