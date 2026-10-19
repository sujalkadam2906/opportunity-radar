import {
  FilterState,
  WorkMode,
  ExperienceLevel,
  JobCategory,
  FreshnessWindow,
  SortOption,
} from '../../types';
import { Select } from '../../components/ui/Select';
import { Button } from '../../components/ui/Button';
import { RotateCcw, Clock, Sparkles } from 'lucide-react';
import styles from './FilterBar.module.css';

export interface FilterBarProps {
  filters: FilterState;
  onWorkModeChange: (mode: WorkMode | 'all') => void;
  onFreshnessChange: (freshness: FreshnessWindow) => void;
  onExperienceChange: (exp: ExperienceLevel | 'all') => void;
  onLocationChange: (loc: string) => void;
  onCategoryChange: (cat: JobCategory | 'all') => void;
  onSortChange: (sort: SortOption) => void;
  onResetFilters: () => void;
  activeFilterCount: number;
}

const LOCATION_OPTIONS = [
  { value: 'all', label: 'All Locations' },
  { value: 'Bengaluru', label: 'Bengaluru' },
  { value: 'Pune', label: 'Pune' },
  { value: 'Hyderabad', label: 'Hyderabad' },
  { value: 'Gurugram', label: 'Gurugram / NCR' },
  { value: 'Mumbai', label: 'Mumbai' },
  { value: 'Chennai', label: 'Chennai' },
  { value: 'Remote', label: 'Remote India' },
];

const EXPERIENCE_OPTIONS = [
  { value: 'all', label: 'All Experience' },
  { value: 'internship', label: 'Internship' },
  { value: 'entry', label: 'Entry-Level (0–1y)' },
  { value: 'junior', label: 'Junior (1–2y)' },
];

const CATEGORY_OPTIONS = [
  { value: 'all', label: 'All Domains' },
  { value: 'frontend', label: 'Frontend' },
  { value: 'fullstack', label: 'Full-Stack' },
  { value: 'backend', label: 'Backend' },
];

const SORT_OPTIONS = [
  { value: 'freshness_desc', label: 'Freshness (Newest)' },
  { value: 'score_desc', label: 'Highest Match Score' },
  { value: 'salary_desc', label: 'Highest CTC / Stipend' },
  { value: 'freshness_asc', label: 'Oldest First' },
];

export function FilterBar({
  filters,
  onWorkModeChange,
  onFreshnessChange,
  onExperienceChange,
  onLocationChange,
  onCategoryChange,
  onSortChange,
  onResetFilters,
  activeFilterCount,
}: FilterBarProps) {
  return (
    <div className={styles.filterBar} role="search" aria-label="Job filters">
      <div className={styles.row}>
        {/* Freshness Window Control */}
        <div className={styles.filterGroup}>
          <span className={styles.groupLabel}>
            <Clock
              size={12}
              style={{ display: 'inline', marginRight: 4 }}
              aria-hidden="true"
            />
            Freshness:
          </span>
          <div
            className={styles.segmentedControl}
            role="group"
            aria-label="Freshness window filter"
          >
            {(
              [
                { value: 'all', label: 'All' },
                { value: '24h', label: '⚡ 24h Fresh' },
                { value: '3d', label: '3 Days' },
                { value: '7d', label: '7 Days' },
              ] as { value: FreshnessWindow; label: string }[]
            ).map((opt) => {
              const active = filters.freshness === opt.value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => onFreshnessChange(opt.value)}
                  className={`${styles.segmentButton} ${active ? styles.segmentButtonActive : ''}`}
                  aria-pressed={active}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Work Arrangement Control */}
        <div className={styles.filterGroup}>
          <span className={styles.groupLabel}>Work Mode:</span>
          <div
            className={styles.segmentedControl}
            role="group"
            aria-label="Work arrangement filter"
          >
            {(
              [
                { value: 'all', label: 'All' },
                { value: 'remote', label: 'Remote' },
                { value: 'hybrid', label: 'Hybrid' },
                { value: 'onsite', label: 'On-site' },
              ] as { value: WorkMode | 'all'; label: string }[]
            ).map((opt) => {
              const active = filters.workMode === opt.value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => onWorkModeChange(opt.value)}
                  className={`${styles.segmentButton} ${active ? styles.segmentButtonActive : ''}`}
                  aria-pressed={active}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className={styles.row}>
        <div className={styles.dropdowns}>
          <div className={styles.selectWrapper}>
            <Select
              value={filters.location}
              options={LOCATION_OPTIONS}
              onChange={(e) => onLocationChange(e.target.value)}
              aria-label="Filter by location"
            />
          </div>

          <div className={styles.selectWrapper}>
            <Select
              value={filters.experienceLevel}
              options={EXPERIENCE_OPTIONS}
              onChange={(e) =>
                onExperienceChange(e.target.value as ExperienceLevel | 'all')
              }
              aria-label="Filter by experience level"
            />
          </div>

          <div className={styles.selectWrapper}>
            <Select
              value={filters.category}
              options={CATEGORY_OPTIONS}
              onChange={(e) => onCategoryChange(e.target.value as JobCategory | 'all')}
              aria-label="Filter by domain"
            />
          </div>

          {activeFilterCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onResetFilters}
              aria-label={`Reset filters (${activeFilterCount})`}
            >
              <RotateCcw size={13} aria-hidden="true" />
              <span>Reset Filters ({activeFilterCount})</span>
            </Button>
          )}
        </div>

        <div className={styles.sortGroup}>
          <Sparkles size={14} color="var(--color-brand-primary)" aria-hidden="true" />
          <span className={styles.sortLabel}>Sort By:</span>
          <div style={{ minWidth: 170 }}>
            <Select
              value={filters.sort}
              options={SORT_OPTIONS}
              onChange={(e) => onSortChange(e.target.value as SortOption)}
              aria-label="Sort jobs by"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
