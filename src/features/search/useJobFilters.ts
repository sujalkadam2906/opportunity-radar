import { useMemo, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  FilterState,
  WorkMode,
  ExperienceLevel,
  JobCategory,
  FreshnessWindow,
  SortOption,
} from '../../types';

export function useJobFilters() {
  const [searchParams, setSearchParams] = useSearchParams();

  const filters: FilterState = useMemo(() => {
    return {
      query: searchParams.get('q') || '',
      location: searchParams.get('loc') || 'all',
      workMode: (searchParams.get('mode') as WorkMode) || 'all',
      experienceLevel: (searchParams.get('exp') as ExperienceLevel) || 'all',
      category: (searchParams.get('cat') as JobCategory) || 'all',
      freshness: (searchParams.get('fresh') as FreshnessWindow) || 'all',
      minSalary: Number(searchParams.get('minSal')) || 0,
      sort: (searchParams.get('sort') as SortOption) || 'freshness_desc',
      selectedJobId: searchParams.get('job') || undefined,
    };
  }, [searchParams]);

  const updateParam = useCallback(
    (key: string, value: string | number | undefined, defaultValue?: string | number) => {
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          if (
            value === undefined ||
            value === '' ||
            value === defaultValue ||
            value === 'all' ||
            value === 0
          ) {
            next.delete(key);
          } else {
            next.set(key, String(value));
          }
          return next;
        },
        { replace: true }
      );
    },
    [setSearchParams]
  );

  const setQuery = useCallback((q: string) => updateParam('q', q, ''), [updateParam]);
  const setLocation = useCallback(
    (loc: string) => updateParam('loc', loc, 'all'),
    [updateParam]
  );
  const setWorkMode = useCallback(
    (mode: WorkMode | 'all') => updateParam('mode', mode, 'all'),
    [updateParam]
  );
  const setExperienceLevel = useCallback(
    (exp: ExperienceLevel | 'all') => updateParam('exp', exp, 'all'),
    [updateParam]
  );
  const setCategory = useCallback(
    (cat: JobCategory | 'all') => updateParam('cat', cat, 'all'),
    [updateParam]
  );
  const setFreshness = useCallback(
    (fresh: FreshnessWindow) => updateParam('fresh', fresh, 'all'),
    [updateParam]
  );
  const setMinSalary = useCallback(
    (sal: number) => updateParam('minSal', sal, 0),
    [updateParam]
  );
  const setSort = useCallback(
    (sort: SortOption) => updateParam('sort', sort, 'freshness_desc'),
    [updateParam]
  );
  const setSelectedJobId = useCallback(
    (jobId?: string) => updateParam('job', jobId, undefined),
    [updateParam]
  );

  const resetFilters = useCallback(() => {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams();
        const currentJob = prev.get('job');
        if (currentJob) next.set('job', currentJob);
        return next;
      },
      { replace: true }
    );
  }, [setSearchParams]);

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.query) count++;
    if (filters.location !== 'all') count++;
    if (filters.workMode !== 'all') count++;
    if (filters.experienceLevel !== 'all') count++;
    if (filters.category !== 'all') count++;
    if (filters.freshness !== 'all') count++;
    if (filters.minSalary > 0) count++;
    return count;
  }, [filters]);

  return {
    filters,
    setQuery,
    setLocation,
    setWorkMode,
    setExperienceLevel,
    setCategory,
    setFreshness,
    setMinSalary,
    setSort,
    setSelectedJobId,
    resetFilters,
    activeFilterCount,
  };
}
