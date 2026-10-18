import { FitScoreBreakdown } from '../../../types';
import { CheckCircle2, XCircle, Sparkles } from 'lucide-react';
import styles from './JobFitExplainer.module.css';

export interface JobFitExplainerProps {
  fit: FitScoreBreakdown;
  onOpenPreferences?: () => void;
}

export function JobFitExplainer({ fit, onOpenPreferences }: JobFitExplainerProps) {
  const getScoreStyle = () => {
    if (fit.score >= 80) return { bg: '#ECFDF5', text: '#047857', border: '#A7F3D0' };
    if (fit.score >= 60) return { bg: '#FFFBEB', text: '#B45309', border: '#FDE68A' };
    return { bg: '#F1F5F9', text: '#475569', border: '#CBD5E1' };
  };

  const style = getScoreStyle();

  return (
    <div className={styles.container} aria-label="Job-Fit Match Explanation">
      <div className={styles.header}>
        <div className={styles.titleArea}>
          <Sparkles size={16} color="var(--color-brand-primary)" aria-hidden="true" />
          <h4 className={styles.title}>Candidate Fit Heuristic</h4>
        </div>
        <span
          className={styles.scoreBadge}
          style={{
            backgroundColor: style.bg,
            color: style.text,
            border: `1px solid ${style.border}`,
          }}
        >
          {fit.score} / 100
        </span>
      </div>

      <p className={styles.summaryText}>{fit.summary}</p>

      <div className={styles.breakdownGrid}>
        {/* Skills Matched */}
        <div className={styles.category}>
          <span className={styles.categoryTitle}>
            Skills Overlap ({fit.matchedSkills.length})
          </span>
          <div className={styles.chips}>
            {fit.matchedSkills.length > 0 ? (
              fit.matchedSkills.map((skill) => (
                <span key={skill} className={styles.matchedChip}>
                  <CheckCircle2 size={10} aria-hidden="true" />
                  {skill}
                </span>
              ))
            ) : (
              <span className={styles.disclaimer}>No direct skill overlap found</span>
            )}
          </div>
        </div>

        {/* Missing Required Skills */}
        <div className={styles.category}>
          <span className={styles.categoryTitle}>
            Missing Skills ({fit.missingSkills.length})
          </span>
          <div className={styles.chips}>
            {fit.missingSkills.length > 0 ? (
              fit.missingSkills.map((skill) => (
                <span key={skill} className={styles.missingChip}>
                  <XCircle size={10} aria-hidden="true" />
                  {skill}
                </span>
              ))
            ) : (
              <span className={styles.disclaimer}>All required skills present!</span>
            )}
          </div>
        </div>

        {/* Alignment Factors */}
        <div className={styles.category}>
          <span className={styles.categoryTitle}>Preference Alignment</span>
          <div className={styles.alignmentItem}>
            {fit.workModeMatch ? (
              <CheckCircle2 size={13} className={styles.aligned} aria-hidden="true" />
            ) : (
              <XCircle size={13} color="var(--color-text-muted)" aria-hidden="true" />
            )}
            <span>Work mode aligns with your target</span>
          </div>
          <div className={styles.alignmentItem}>
            {fit.experienceMatch ? (
              <CheckCircle2 size={13} className={styles.aligned} aria-hidden="true" />
            ) : (
              <XCircle size={13} color="var(--color-text-muted)" aria-hidden="true" />
            )}
            <span>Seniority band compatible</span>
          </div>
          <div className={styles.alignmentItem}>
            {fit.locationMatch ? (
              <CheckCircle2 size={13} className={styles.aligned} aria-hidden="true" />
            ) : (
              <XCircle size={13} color="var(--color-text-muted)" aria-hidden="true" />
            )}
            <span>Location / Remote eligibility satisfied</span>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <p className={styles.disclaimer}>
          100% deterministic heuristic comparison against your profile preferences.
        </p>
        {onOpenPreferences && (
          <button
            type="button"
            onClick={onOpenPreferences}
            style={{ fontSize: 11, color: 'var(--color-brand-primary)', textDecoration: 'underline' }}
          >
            Adjust preferences
          </button>
        )}
      </div>
    </div>
  );
}
