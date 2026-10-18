import { NavLink } from 'react-router-dom';
import {
  Compass,
  Bookmark,
  Briefcase,
  SlidersHorizontal,
  Radar,
} from 'lucide-react';
import { StreamStatusPill } from '../feedback/StreamStatusPill';
import { StreamConnectionStatus } from '../../types';
import { Button } from '../ui/Button';
import styles from './AppHeader.module.css';

export interface AppHeaderProps {
  streamStatus: StreamConnectionStatus;
  newJobsCount: number;
  savedCount: number;
  applicationCount: number;
  onOpenPreferences: () => void;
}

export function AppHeader({
  streamStatus,
  newJobsCount,
  savedCount,
  applicationCount,
  onOpenPreferences,
}: AppHeaderProps) {
  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <div className={styles.leftSection}>
          <NavLink to="/" className={styles.brand} aria-label="Opportunity Radar Home">
            <div className={styles.logoIcon}>
              <Radar size={18} aria-hidden="true" />
            </div>
            <div className={styles.brandText}>
              <span className={styles.brandTitle}>Opportunity Radar</span>
              <span className={styles.brandTagline}>Freshness-First Job Engine</span>
            </div>
          </NavLink>

          <StreamStatusPill status={streamStatus} newJobsCount={newJobsCount} />
        </div>

        <nav className={styles.nav} aria-label="Main application navigation">
          <NavLink
            to="/"
            end
            aria-label="Discover"
            className={({ isActive }) =>
              `${styles.navLink} ${isActive ? styles.activeNavLink : ''}`
            }
          >
            <Compass size={16} aria-hidden="true" />
            <span>Discover</span>
          </NavLink>

          <NavLink
            to="/saved"
            aria-label="Saved"
            className={({ isActive }) =>
              `${styles.navLink} ${isActive ? styles.activeNavLink : ''}`
            }
          >
            <Bookmark size={16} aria-hidden="true" />
            <span>Saved</span>
            {savedCount > 0 && <span className={styles.countBadge}>{savedCount}</span>}
          </NavLink>

          <NavLink
            to="/applications"
            aria-label="Applications"
            className={({ isActive }) =>
              `${styles.navLink} ${isActive ? styles.activeNavLink : ''}`
            }
          >
            <Briefcase size={16} aria-hidden="true" />
            <span>Applications</span>
            {applicationCount > 0 && (
              <span className={styles.countBadge}>{applicationCount}</span>
            )}
          </NavLink>
        </nav>

        <div className={styles.rightSection}>
          <span className={styles.demoPill} title="This app uses explicitly labelled sample data for portfolio demonstration">
            Demo Dataset
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={onOpenPreferences}
            aria-label="Open Career Preferences"
          >
            <SlidersHorizontal size={14} aria-hidden="true" />
            <span>Preferences</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
