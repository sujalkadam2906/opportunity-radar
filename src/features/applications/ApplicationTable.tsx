import { useState, useMemo } from 'react';
import { JobApplicationRecord, ApplicationStatus } from '../../types';
import { Select } from '../../components/ui/Select';
import { Button } from '../../components/ui/Button';
import { EmptyState } from '../../components/feedback/EmptyState';
import { Download, Trash2, Edit3, Briefcase, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import styles from './ApplicationTable.module.css';

export interface ApplicationTableProps {
  applications: JobApplicationRecord[];
  onUpdateStatus: (id: string, newStatus: ApplicationStatus) => void;
  onUpdateNotes: (id: string, notes: string) => void;
  onDeleteApplication: (id: string) => void;
}

const STAGE_OPTIONS = [
  { value: 'saved', label: 'Saved / Reviewing' },
  { value: 'applied', label: 'Applied' },
  { value: 'interview', label: 'Interviewing' },
  { value: 'offer', label: 'Offer Received' },
  { value: 'rejected', label: 'Not Selected' },
];

export function ApplicationTable({
  applications,
  onUpdateStatus,
  onUpdateNotes,
  onDeleteApplication,
}: ApplicationTableProps) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<string>('all');
  const [editingNotesId, setEditingNotesId] = useState<string | null>(null);
  const [tempNotes, setTempNotes] = useState<string>('');

  // Status counts
  const stats = useMemo(() => {
    const counts = {
      total: applications.length,
      saved: 0,
      applied: 0,
      interview: 0,
      offer: 0,
      rejected: 0,
    };
    applications.forEach((a) => {
      if (counts[a.status] !== undefined) {
        counts[a.status]++;
      }
    });
    return counts;
  }, [applications]);

  const filteredApplications = useMemo(() => {
    if (activeTab === 'all') return applications;
    return applications.filter((a) => a.status === activeTab);
  }, [applications, activeTab]);

  const handleStartEditNotes = (app: JobApplicationRecord) => {
    setEditingNotesId(app.id);
    setTempNotes(app.notes || '');
  };

  const handleSaveNotes = (id: string) => {
    onUpdateNotes(id, tempNotes);
    setEditingNotesId(null);
  };

  const handleExportCsv = () => {
    if (applications.length === 0) return;

    const headers = [
      'Job ID',
      'Job Title',
      'Company Name',
      'Location',
      'Status',
      'Applied Date',
      'Interview Date',
      'Notes',
      'Updated At',
    ];

    const rows = applications.map((a) => [
      `"${a.jobId}"`,
      `"${a.jobTitle.replace(/"/g, '""')}"`,
      `"${a.companyName.replace(/"/g, '""')}"`,
      `"${a.location.replace(/"/g, '""')}"`,
      `"${a.status}"`,
      `"${a.appliedDate || ''}"`,
      `"${a.interviewDate || ''}"`,
      `"${(a.notes || '').replace(/"/g, '""')}"`,
      `"${a.updatedAt}"`,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute(
      'download',
      `opportunity-radar-applications-${new Date().toISOString().split('T')[0]}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (applications.length === 0) {
    return (
      <EmptyState
        icon={<Briefcase size={28} />}
        title="No Applications Tracked Yet"
        description="When you discover jobs you are interested in, set their stage to 'Applied' or 'Interviewing' to keep all your candidate progress in one place."
        action={
          <Button variant="primary" onClick={() => navigate('/')}>
            <Plus size={16} aria-hidden="true" />
            <span>Discover Opportunities</span>
          </Button>
        }
      />
    );
  }

  return (
    <div className={styles.container}>
      {/* Funnel Metric Counters */}
      <div className={styles.statsBar}>
        <div className={styles.statCard}>
          <span className={styles.statLabel}>Total Tracked</span>
          <span className={styles.statValue}>{stats.total}</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statLabel}>Applied</span>
          <span className={`${styles.statValue} ${styles.appliedStat}`}>
            {stats.applied}
          </span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statLabel}>Interviewing</span>
          <span className={`${styles.statValue} ${styles.interviewStat}`}>
            {stats.interview}
          </span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statLabel}>Offers</span>
          <span className={`${styles.statValue} ${styles.offerStat}`}>{stats.offer}</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statLabel}>Not Selected</span>
          <span className={`${styles.statValue} ${styles.rejectedStat}`}>
            {stats.rejected}
          </span>
        </div>
      </div>

      {/* Toolbar */}
      <div className={styles.toolbar}>
        <div
          className={styles.tabs}
          role="tablist"
          aria-label="Filter applications by stage"
        >
          {[
            { id: 'all', label: `All (${stats.total})` },
            { id: 'applied', label: `Applied (${stats.applied})` },
            { id: 'interview', label: `Interviewing (${stats.interview})` },
            { id: 'offer', label: `Offers (${stats.offer})` },
            { id: 'saved', label: `Saved (${stats.saved})` },
            { id: 'rejected', label: `Not Selected (${stats.rejected})` },
          ].map((tab) => (
            <button
              key={tab.id}
              role="tab"
              aria-selected={activeTab === tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`${styles.tab} ${activeTab === tab.id ? styles.activeTab : ''}`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <Button variant="outline" size="sm" onClick={handleExportCsv}>
          <Download size={14} aria-hidden="true" />
          <span>Export CSV</span>
        </Button>
      </div>

      {/* Applications Table */}
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th className={styles.th}>Role & Company</th>
              <th className={styles.th}>Location</th>
              <th className={styles.th}>Current Stage</th>
              <th className={styles.th}>Applied Date</th>
              <th className={styles.th}>Personal Notes</th>
              <th className={styles.th} style={{ textAlign: 'right' }}>
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredApplications.map((app) => (
              <tr key={app.id} className={styles.row}>
                <td className={styles.td}>
                  <div className={styles.jobTitleCell}>
                    <span className={styles.jobTitle}>{app.jobTitle}</span>
                    <span className={styles.companyName}>{app.companyName}</span>
                  </div>
                </td>
                <td className={styles.td}>{app.location}</td>
                <td className={styles.td}>
                  <div style={{ minWidth: 150 }}>
                    <Select
                      value={app.status}
                      options={STAGE_OPTIONS}
                      onChange={(e) =>
                        onUpdateStatus(app.id, e.target.value as ApplicationStatus)
                      }
                      aria-label={`Change stage for ${app.jobTitle}`}
                    />
                  </div>
                </td>
                <td className={styles.td}>{app.appliedDate || '—'}</td>
                <td className={styles.td}>
                  {editingNotesId === app.id ? (
                    <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
                      <input
                        type="text"
                        value={tempNotes}
                        onChange={(e) => setTempNotes(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleSaveNotes(app.id);
                          if (e.key === 'Escape') setEditingNotesId(null);
                        }}
                        style={{ padding: '4px 8px', fontSize: 13, minWidth: 180 }}
                        autoFocus
                      />
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => handleSaveNotes(app.id)}
                      >
                        Save
                      </Button>
                    </div>
                  ) : (
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 6,
                        cursor: 'pointer',
                      }}
                      onClick={() => handleStartEditNotes(app)}
                      title="Click to edit notes"
                    >
                      <span className={styles.notesSnippet}>
                        {app.notes || <em>No notes added. Click to add...</em>}
                      </span>
                      <Edit3
                        size={12}
                        color="var(--color-text-muted)"
                        aria-hidden="true"
                      />
                    </div>
                  )}
                </td>
                <td className={styles.td} style={{ textAlign: 'right' }}>
                  <button
                    type="button"
                    onClick={() => onDeleteApplication(app.id)}
                    className={styles.deleteBtn}
                    aria-label={`Delete record for ${app.jobTitle}`}
                  >
                    <Trash2 size={16} aria-hidden="true" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
