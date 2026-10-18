import { useApplications } from '../features/applications/useApplications';
import { ApplicationTable } from '../features/applications/ApplicationTable';
import { ApplicationStatus } from '../types';

export function ApplicationsPage() {
  const { applications, saveApplication, deleteApplication } = useApplications();

  const handleUpdateStatus = (id: string, newStatus: ApplicationStatus) => {
    const existing = applications.find((a) => a.id === id);
    if (!existing) return;

    saveApplication({
      ...existing,
      status: newStatus,
      updatedAt: new Date().toISOString(),
    });
  };

  const handleUpdateNotes = (id: string, notes: string) => {
    const existing = applications.find((a) => a.id === id);
    if (!existing) return;

    saveApplication({
      ...existing,
      notes,
      updatedAt: new Date().toISOString(),
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)', width: '100%' }}>
      <header style={{ borderBottom: '1px solid var(--color-border)', paddingBottom: 'var(--space-2)' }}>
        <h1 style={{ fontSize: 'var(--text-xl)', fontWeight: 'var(--font-bold)', color: 'var(--color-text-primary)' }}>
          Candidate Application Tracker
        </h1>
        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', marginTop: 2 }}>
          Manage your hiring pipeline, interview stages, notes, and records offline via IndexedDB.
        </p>
      </header>

      <ApplicationTable
        applications={applications}
        onUpdateStatus={handleUpdateStatus}
        onUpdateNotes={handleUpdateNotes}
        onDeleteApplication={deleteApplication}
      />
    </div>
  );
}
