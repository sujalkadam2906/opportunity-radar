import { useState } from 'react';
import { useSavedJobs } from '../features/saved/useSavedJobs';
import { usePreferences } from '../features/preferences/usePreferences';
import { useApplications } from '../features/applications/useApplications';
import { JobListing, ApplicationStatus } from '../types';
import { JobCard } from '../features/jobs/components/JobCard';
import { JobDetailView } from '../features/jobs/components/JobDetailView';
import { Drawer } from '../components/ui/Drawer';
import { EmptyState } from '../components/feedback/EmptyState';
import { Button } from '../components/ui/Button';
import { Bookmark, Plus } from 'lucide-react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import styles from './SavedPage.module.css';

export interface SavedPageProps {
  onOpenPreferences?: () => void;
}

export function SavedPage({ onOpenPreferences }: SavedPageProps) {
  const outlet = useOutletContext<{ onOpenPreferences?: () => void }>();
  const handleOpenPreferences =
    onOpenPreferences || outlet?.onOpenPreferences || (() => {});
  const navigate = useNavigate();
  const { savedJobs, toggleSave, isSaved } = useSavedJobs();
  const { preferences } = usePreferences();
  const { getApplication, setJobStatus } = useApplications();

  const [inspectingJob, setInspectingJob] = useState<JobListing | null>(null);

  const handleUpdateStatus = (
    job: JobListing,
    status: ApplicationStatus,
    notes?: string
  ) => {
    setJobStatus(job, status, notes);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.titleArea}>
          <h1 className={styles.title}>Bookmarked Opportunities</h1>
          <p className={styles.subtitle}>
            {savedJobs.length} {savedJobs.length === 1 ? 'listing' : 'listings'} saved
            locally in IndexedDB
          </p>
        </div>
      </div>

      {savedJobs.length === 0 ? (
        <EmptyState
          icon={<Bookmark size={28} />}
          title="No Bookmarked Jobs"
          description="You haven't saved any jobs yet. When exploring opportunities on the Discover page, click the bookmark icon to review them later."
          action={
            <Button variant="primary" onClick={() => navigate('/')}>
              <Plus size={15} aria-hidden="true" />
              <span>Explore Opportunities</span>
            </Button>
          }
        />
      ) : (
        <div className={styles.grid}>
          {savedJobs.map((record) => (
            <JobCard
              key={record.jobId}
              job={record.jobSnapshot}
              isSelected={inspectingJob?.id === record.jobId}
              isSaved={isSaved(record.jobId)}
              applicationStatus={getApplication(record.jobId)?.status}
              preferences={preferences}
              onSelect={(job) => setInspectingJob(job)}
              onToggleSave={toggleSave}
            />
          ))}
        </div>
      )}

      {inspectingJob && (
        <Drawer
          isOpen={!!inspectingJob}
          onClose={() => setInspectingJob(null)}
          title={inspectingJob.title}
        >
          <JobDetailView
            job={inspectingJob}
            isSaved={isSaved(inspectingJob.id)}
            application={getApplication(inspectingJob.id)}
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
