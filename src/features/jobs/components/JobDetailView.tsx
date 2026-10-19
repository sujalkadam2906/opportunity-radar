import { useState, useEffect } from 'react';
import {
  JobListing,
  UserPreferences,
  ApplicationStatus,
  JobApplicationRecord,
} from '../../../types';
import { calculateFitScore } from '../utils/scoreCalculator';
import { formatSalary, formatWorkMode, formatExperience } from '../utils/formatters';
import { formatDate } from '../utils/dateUtils';
import { JobFitExplainer } from './JobFitExplainer';
import { Button } from '../../../components/ui/Button';
import { Select } from '../../../components/ui/Select';
import { Bookmark, CheckCircle, ExternalLink } from 'lucide-react';
import styles from './JobDetailView.module.css';

export interface JobDetailViewProps {
  job: JobListing;
  isSaved: boolean;
  application?: JobApplicationRecord;
  preferences: UserPreferences;
  onToggleSave: (job: JobListing) => void;
  onUpdateStatus: (job: JobListing, status: ApplicationStatus, notes?: string) => void;
  onOpenPreferences?: () => void;
}

const STATUS_OPTIONS = [
  { value: 'none', label: 'Not Tracked' },
  { value: 'saved', label: 'Saved / Reviewing' },
  { value: 'applied', label: 'Applied' },
  { value: 'interview', label: 'Interviewing' },
  { value: 'offer', label: 'Offer Received' },
  { value: 'rejected', label: 'Not Selected' },
];

export function JobDetailView({
  job,
  isSaved,
  application,
  preferences,
  onToggleSave,
  onUpdateStatus,
  onOpenPreferences,
}: JobDetailViewProps) {
  const fit = calculateFitScore(job, preferences);
  const [notes, setNotes] = useState(application?.notes || '');

  useEffect(() => {
    setNotes(application?.notes || '');
  }, [application?.notes, job.id]);

  const currentStatus = application?.status || 'none';

  const handleStatusChange = (newStatus: string) => {
    if (newStatus === 'none') {
      return;
    }
    onUpdateStatus(job, newStatus as ApplicationStatus, notes);
  };

  const handleNotesBlur = () => {
    if (application && notes !== application.notes) {
      onUpdateStatus(job, application.status, notes);
    }
  };

  return (
    <article className={styles.container} aria-labelledby="job-detail-title">
      <header className={styles.header}>
        <div className={styles.titleArea}>
          <h2 id="job-detail-title" className={styles.jobTitle}>
            {job.title}
          </h2>
          <div className={styles.companyRow}>
            <span className={styles.companyName}>{job.company.name}</span>
            <span>•</span>
            <span className={styles.tagline}>{job.company.tagline}</span>
          </div>
        </div>

        <div className={styles.metaGrid}>
          <div className={styles.metaBlock}>
            <span className={styles.metaLabel}>Compensation</span>
            <span className={styles.metaValue}>{formatSalary(job.salary)}</span>
          </div>
          <div className={styles.metaBlock}>
            <span className={styles.metaLabel}>Location</span>
            <span className={styles.metaValue}>{job.location}</span>
          </div>
          <div className={styles.metaBlock}>
            <span className={styles.metaLabel}>Work Mode</span>
            <span className={styles.metaValue}>{formatWorkMode(job.workMode)}</span>
          </div>
          <div className={styles.metaBlock}>
            <span className={styles.metaLabel}>Seniority</span>
            <span className={styles.metaValue}>
              {formatExperience(job.experienceLevel)}
            </span>
          </div>
          <div className={styles.metaBlock}>
            <span className={styles.metaLabel}>Posted Date</span>
            <span className={styles.metaValue}>{formatDate(job.postedAt)}</span>
          </div>
          <div className={styles.metaBlock}>
            <span className={styles.metaLabel}>Company Size</span>
            <span className={styles.metaValue}>{job.company.size} employees</span>
          </div>
        </div>
      </header>

      {/* Action Bar */}
      <div className={styles.actionBar}>
        <div className={styles.actionGroup}>
          <Button
            variant={isSaved ? 'primary' : 'outline'}
            size="md"
            onClick={() => onToggleSave(job)}
            aria-label={isSaved ? 'Remove from saved jobs' : 'Save this job'}
          >
            <Bookmark
              size={16}
              fill={isSaved ? 'currentColor' : 'none'}
              aria-hidden="true"
            />
            <span>{isSaved ? 'Bookmarked' : 'Save Job'}</span>
          </Button>

          {job.company.websiteUrl && (
            <a
              href={job.company.websiteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-sm text-secondary hover:underline"
            >
              <span>Company Page</span>
              <ExternalLink size={13} aria-hidden="true" />
            </a>
          )}
        </div>

        <div className={styles.actionGroup}>
          <span className={styles.statusLabel}>Application Stage:</span>
          <div style={{ minWidth: 160 }}>
            <Select
              value={currentStatus}
              options={STATUS_OPTIONS}
              onChange={(e) => handleStatusChange(e.target.value)}
              aria-label="Change application status"
            />
          </div>
        </div>
      </div>

      {/* Candidate Notes section if tracked */}
      {application && (
        <div className={styles.notesSection}>
          <span className={styles.notesTitle}>Personal Application Notes</span>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            onBlur={handleNotesBlur}
            placeholder="Add interview dates, contacts, recruiter notes, or portfolio links..."
            className={styles.notesInput}
            aria-label="Personal application notes"
          />
        </div>
      )}

      {/* Heuristic Fit Explainer */}
      <JobFitExplainer fit={fit} onOpenPreferences={onOpenPreferences} />

      {/* Role Description */}
      <section className={styles.section}>
        <h3 className={styles.sectionHeading}>About the Role</h3>
        <p className={styles.description}>{job.description}</p>
      </section>

      {/* Responsibilities */}
      <section className={styles.section}>
        <h3 className={styles.sectionHeading}>Key Responsibilities</h3>
        <ul className={styles.list}>
          {job.responsibilities.map((resp, idx) => (
            <li key={idx}>{resp}</li>
          ))}
        </ul>
      </section>

      {/* Required & Preferred Skills */}
      <section className={styles.section}>
        <h3 className={styles.sectionHeading}>Required Technical Skills</h3>
        <div className={styles.skillsContainer}>
          {job.requiredSkills.map((skill) => (
            <span key={skill} className={styles.skillBadge}>
              <CheckCircle
                size={12}
                color="var(--color-brand-primary)"
                aria-hidden="true"
                style={{ display: 'inline', marginRight: 4 }}
              />
              {skill}
            </span>
          ))}
        </div>

        {job.preferredSkills.length > 0 && (
          <>
            <h4
              className={styles.sectionHeading}
              style={{ fontSize: 'var(--text-sm)', marginTop: 8 }}
            >
              Preferred / Nice-to-Have Skills
            </h4>
            <div className={styles.skillsContainer}>
              {job.preferredSkills.map((skill) => (
                <span
                  key={skill}
                  className={`${styles.skillBadge} ${styles.preferredBadge}`}
                >
                  {skill}
                </span>
              ))}
            </div>
          </>
        )}
      </section>

      {/* Qualifications */}
      <section className={styles.section}>
        <h3 className={styles.sectionHeading}>Qualifications & Eligibility</h3>
        <ul className={styles.list}>
          {job.qualifications.map((qual, idx) => (
            <li key={idx}>{qual}</li>
          ))}
        </ul>
      </section>

      {/* Benefits */}
      <section className={styles.section}>
        <h3 className={styles.sectionHeading}>Benefits & Perks</h3>
        <ul className={styles.list}>
          {job.benefits.map((b, idx) => (
            <li key={idx}>{b}</li>
          ))}
        </ul>
      </section>

      {/* Demo Notice Box */}
      <div className={styles.demoBox} role="note">
        <strong>Portfolio Demonstration Listing:</strong> {job.demoNotice} Track this
        opportunity locally to test bookmarks, funnel status transitions, and notes
        persistence.
      </div>
    </article>
  );
}
