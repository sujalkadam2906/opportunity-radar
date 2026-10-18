import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { AppHeader } from './components/layout/AppHeader';
import { PageContainer } from './components/layout/PageContainer';
import { PreferencesModal } from './features/preferences/PreferencesModal';
import { usePreferences } from './features/preferences/usePreferences';
import { useSavedJobs } from './features/saved/useSavedJobs';
import { useApplications } from './features/applications/useApplications';
import { useJobStream } from './hooks/useJobStream';

export function App() {
  const [isPrefModalOpen, setIsPrefModalOpen] = useState(false);
  const { preferences, savePreferences, isSaving } = usePreferences();
  const { savedJobs } = useSavedJobs();
  const { applications } = useApplications();
  const { status: streamStatus, newJobsCount } = useJobStream();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppHeader
        streamStatus={streamStatus}
        newJobsCount={newJobsCount}
        savedCount={savedJobs.length}
        applicationCount={applications.length}
        onOpenPreferences={() => setIsPrefModalOpen(true)}
      />

      <PageContainer>
        <Outlet context={{ onOpenPreferences: () => setIsPrefModalOpen(true) }} />
      </PageContainer>

      <footer
        style={{
          marginTop: 'auto',
          borderTop: '1px solid var(--color-border)',
          backgroundColor: 'var(--color-surface)',
          padding: 'var(--space-4)',
          textAlign: 'center',
          fontSize: 'var(--text-xs)',
          color: 'var(--color-text-muted)',
        }}
      >
        <div style={{ maxWidth: 1400, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
          <span>
            <strong>Opportunity Radar</strong> — Portfolio Engineering Demonstration (Indian Tech Ecosystem).
          </span>
          <span>
            Demonstration Dataset • IndexedDB Storage • Deterministic Fit Engine • WCAG 2.2 AA
          </span>
        </div>
      </footer>

      <PreferencesModal
        isOpen={isPrefModalOpen}
        onClose={() => setIsPrefModalOpen(false)}
        preferences={preferences}
        onSave={savePreferences}
        isSaving={isSaving}
      />
    </div>
  );
}

export default App;
