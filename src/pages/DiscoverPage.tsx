import { useMemo, useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { JobListing, ApplicationStatus } from '../types';
import { jobService } from '../services/jobService';
import { filterAndSortJobs } from '../features/jobs/utils/searchFilter';
import { useJobFilters } from '../features/search/useJobFilters';
import { usePreferences } from '../features/preferences/usePreferences';
import { useSavedJobs } from '../features/saved/useSavedJobs';
import { useApplications } from '../features/applications/useApplications';
import { SearchBar } from '../features/search/SearchBar';
import { FilterBar } from '../features/search/FilterBar';
import { ActiveFilterChips } from '../features/search/ActiveFilterChips';
import { JobCard } from '../features/jobs/components/JobCard';
import { JobDetailView } from '../features/jobs/components/JobDetailView';
import { SkeletonLoader } from '../components/feedback/SkeletonLoader';
import { EmptyState } from '../components/feedback/EmptyState';
import { Drawer } from '../components/ui/Drawer';
import { Button } from '../components/ui/Button';
import { SearchX, RotateCcw } from 'lucide-react';
import { useOutletContext } from 'react-router-dom';
import styles from './DiscoverPage.module.css';

export interface DiscoverPageProps {
  onOpenPreferences?: () => void;
}

export function DiscoverPage({ onOpenPreferences }: DiscoverPageProps) {
  const outlet = useOutletContext<{ onOpenPreferences?: () => void }>();
  const handleOpenPreferences =
    onOpenPreferences || outlet?.onOpenPreferences || (() => {});

  const {
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
  } = useJobFilters();

  const { preferences } = usePreferences();
  const { isSaved, toggleSave } = useSavedJobs();
  const { getApplication, setJobStatus } = useApplications();

  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);

  // TanStack Query for Job Listings
  const {
    data: allJobs = [],
    isLoading,
    isError,
    refetch,
  } = useQuery<JobListing[]>({
    queryKey: ['jobs'],
    queryFn: ({ signal }) => jobService.getJobs(signal),
  });

  // Filter and sort listings
  const filteredJobs = useMemo(() => {
    return filterAndSortJobs(allJobs, filters, preferences);
  }, [allJobs, filters, preferences]);

  // Selected Job Logic (URL priority, defaults to first item)
  const selectedJob = useMemo(() => {
    if (filters.selectedJobId) {
      const found = allJobs.find((j) => j.id === filters.selectedJobId);
      if (found) return found;
    }
    return filteredJobs[0] || null;
  }, [allJobs, filteredJobs, filters.selectedJobId]);

  // Handle job card selection
  const handleSelectJob = (job: JobListing) => {
    setSelectedJobId(job.id);
    // If on small viewport, open drawer
    if (typeof window !== 'undefined' && window.innerWidth <= 900) {
      setIsMobileDrawerOpen(true);
    }
  };

  const handleUpdateStatus = (
    job: JobListing,
    status: ApplicationStatus,
    notes?: string
  ) => {
    setJobStatus(job, status, notes);
  };

  // Keep mobile drawer state clean if resized
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 900) {
        setIsMobileDrawerOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className={styles.discoverContainer}>
      {/* Search Input */}
      <SearchBar query={filters.query} onSearchChange={setQuery} />

      {/* Filter Controls & Sort Bar */}
      <FilterBar
        filters={filters}
        onWorkModeChange={setWorkMode}
        onFreshnessChange={setFreshness}
        onExperienceChange={setExperienceLevel}
        onLocationChange={setLocation}
        onCategoryChange={setCategory}
        onSortChange={setSort}
        onResetFilters={resetFilters}
        activeFilterCount={activeFilterCount}
      />

      {/* Active Filter Chips */}
      <ActiveFilterChips
        filters={filters}
        onRemoveQuery={() => setQuery('')}
        onRemoveLocation={() => setLocation('all')}
        onRemoveWorkMode={() => setWorkMode('all')}
        onRemoveExperience={() => setExperienceLevel('all')}
        onRemoveCategory={() => setCategory('all')}
        onRemoveFreshness={() => setFreshness('all')}
        onRemoveMinSalary={() => setMinSalary(0)}
      />

      {/* Results Header */}
      <div className={styles.resultsHeader}>
        <div className={styles.resultsCount} aria-live="polite">
          Found <span className={styles.highlight}>{filteredJobs.length}</span> matching
          opportunities
        </div>
      </div>

      {/* Loading & Error States */}
      {isLoading && <SkeletonLoader count={4} />}

      {isError && (
        <EmptyState
          icon={<SearchX size={28} />}
          title="Unable to Load Opportunities"
          description="There was an issue fetching the latest job dataset. Please retry."
          action={
            <Button variant="primary" onClick={() => refetch()}>
              Retry Fetch
            </Button>
          }
        />
      )}

      {/* Empty State when zero jobs match */}
      {!isLoading && !isError && filteredJobs.length === 0 && (
        <EmptyState
          icon={<SearchX size={28} />}
          title="No Opportunities Match Your Current Filters"
          description="Try broadening your criteria, clearing search keywords, or selecting 'All' work modes and freshness windows."
          action={
            <Button variant="primary" onClick={resetFilters}>
              <RotateCcw size={15} aria-hidden="true" />
              <span>Reset All Filters</span>
            </Button>
          }
        />
      )}

      {/* Dual Pane Workspace (Desktop) */}
      {!isLoading && !isError && filteredJobs.length > 0 && (
        <div className={styles.workspaceLayout}>
          {/* Left Master List */}
          <div className={styles.listPane} role="feed" aria-label="Job listings list">
            {filteredJobs.map((job) => (
              <JobCard
                key={job.id}
                job={job}
                isSelected={selectedJob?.id === job.id}
                isSaved={isSaved(job.id)}
                applicationStatus={getApplication(job.id)?.status}
                preferences={preferences}
                onSelect={handleSelectJob}
                onToggleSave={toggleSave}
              />
            ))}
          </div>

          {/* Right Detail Pane (Desktop sticky) */}
          <div className={styles.detailPane}>
            {selectedJob && (
              <JobDetailView
                job={selectedJob}
                isSaved={isSaved(selectedJob.id)}
                application={getApplication(selectedJob.id)}
                preferences={preferences}
                onToggleSave={toggleSave}
                onUpdateStatus={handleUpdateStatus}
                onOpenPreferences={handleOpenPreferences}
              />
            )}
          </div>
        </div>
      )}

      {/* Responsive Slide-Over Drawer (Mobile & Tablet) */}
      {selectedJob && (
        <Drawer
          isOpen={isMobileDrawerOpen}
          onClose={() => setIsMobileDrawerOpen(false)}
          title={selectedJob.title}
        >
          <JobDetailView
            job={selectedJob}
            isSaved={isSaved(selectedJob.id)}
            application={getApplication(selectedJob.id)}
            preferences={preferences}
            onToggleSave={toggleSave}
            onUpdateStatus={handleUpdateStatus}
            onOpenPreferences={handleOpenPreferences}
          />
        </Drawer>
      )}
    </div>
  );
}
