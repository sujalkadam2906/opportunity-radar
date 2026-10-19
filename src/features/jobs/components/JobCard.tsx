import React from 'react';
import { JobListing, UserPreferences, ApplicationStatus } from '../../../types';
import { calculateFitScore } from '../utils/scoreCalculator';
import { formatPostingAge } from '../utils/dateUtils';
import { formatSalary, formatWorkMode, formatExperience } from '../utils/formatters';
import { Badge } from '../../../components/ui/Badge';
import { MapPin, Briefcase, Bookmark, Zap } from 'lucide-react';
import styles from './JobCard.module.css';

export interface JobCardProps {
  job: JobListing;
  isSelected?: boolean;
  isSaved?: boolean;
  applicationStatus?: ApplicationStatus;
  preferences: UserPreferences;
  onSelect: (job: JobListing) => void;
  onToggleSave: (job: JobListing) => void;
}

export const JobCard = React.memo(function JobCard({
  job,
  isSelected = false,
  isSaved = false,
  applicationStatus,
  preferences,
  onSelect,
  onToggleSave,
}: JobCardProps) {
  const fit = calculateFitScore(job, preferences);
  const postingAge = formatPostingAge(job.postedAt);

  const getScoreVariant = (score: number) => {
    if (score >= 80) return 'scoreHigh';
    if (score >= 60) return 'scoreMid';
    return 'scoreLow';
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onSelect(job);
    }
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => onSelect(job)}
      onKeyDown={handleKeyDown}
      className={`${styles.card} ${isSelected ? styles.selected : ''}`}
      aria-selected={isSelected}
      aria-label={`${job.title} at ${job.company.name}`}
    >
      <div className={styles.headerRow}>
        <div className={styles.titleArea}>
          <h3 className={styles.jobTitle}>{job.title}</h3>
          <span className={styles.companyName}>{job.company.name}</span>
        </div>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onToggleSave(job);
          }}
          className={styles.saveButton}
          aria-label={
            isSaved ? `Remove ${job.title} from saved jobs` : `Save ${job.title}`
          }
        >
          <Bookmark
            size={18}
            className={isSaved ? styles.savedIcon : undefined}
            aria-hidden="true"
          />
        </button>
      </div>

      <div className={styles.metaRow}>
        <span className={styles.metaItem}>
          <MapPin size={13} aria-hidden="true" />
          <span>{job.location}</span>
        </span>
        <span className={styles.metaItem}>
          <Briefcase size={13} aria-hidden="true" />
          <span>{formatWorkMode(job.workMode)}</span>
        </span>
        <span className={`${styles.metaItem} ${styles.salary}`}>
          {formatSalary(job.salary)}
        </span>
      </div>

      <div className={styles.badgeRow}>
        <Badge variant={getScoreVariant(fit.score)}>{fit.score}% Fit Match</Badge>
        {job.isFresh && (
          <Badge variant="fresh">
            <Zap size={10} aria-hidden="true" />
            <span>{postingAge === 'Today' ? 'Posted Today' : postingAge}</span>
          </Badge>
        )}
        <Badge variant="default">{formatExperience(job.experienceLevel)}</Badge>
        {applicationStatus && (
          <Badge variant={applicationStatus === 'saved' ? 'default' : applicationStatus}>
            Status: {applicationStatus.toUpperCase()}
          </Badge>
        )}
      </div>

      <div className={styles.skillsRow}>
        {job.requiredSkills.slice(0, 4).map((skill) => (
          <span key={skill} className={styles.skillPill}>
            {skill}
          </span>
        ))}
        {job.requiredSkills.length > 4 && (
          <span className={styles.skillPill}>+{job.requiredSkills.length - 4} more</span>
        )}
      </div>

      <div className={styles.footerRow}>
        <span>{job.company.industry}</span>
        <span>{postingAge}</span>
      </div>
    </div>
  );
});
