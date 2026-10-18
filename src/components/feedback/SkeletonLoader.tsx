import styles from './SkeletonLoader.module.css';

export interface SkeletonLoaderProps {
  count?: number;
}

export function SkeletonLoader({ count = 4 }: SkeletonLoaderProps) {
  return (
    <div
      className={styles.skeletonList}
      role="status"
      aria-label="Loading job opportunities..."
      aria-busy="true"
    >
      {Array.from({ length: count }).map((_, idx) => (
        <div key={idx} className={styles.skeletonCard}>
          <div className={`${styles.line} ${styles.title}`} />
          <div className={`${styles.line} ${styles.company}`} />
          <div className={styles.tags}>
            <div className={`${styles.line} ${styles.tag}`} />
            <div className={`${styles.line} ${styles.tag}`} />
            <div className={`${styles.line} ${styles.tag}`} />
          </div>
        </div>
      ))}
      <span className="sr-only">Loading opportunities, please wait...</span>
    </div>
  );
}
