import { StreamConnectionStatus } from '../../types';
import styles from './StreamStatusPill.module.css';

export interface StreamStatusPillProps {
  status: StreamConnectionStatus;
  newJobsCount?: number;
}

export function StreamStatusPill({ status, newJobsCount = 0 }: StreamStatusPillProps) {
  const getStatusLabel = () => {
    switch (status) {
      case 'connected':
        return newJobsCount > 0
          ? `Live Stream (+${newJobsCount} received)`
          : 'Live Stream Active';
      case 'connecting':
        return 'Connecting to Stream...';
      case 'disconnected':
        return 'Live Stream Disconnected';
      case 'offline_mode':
      default:
        return 'Local Mode (Stream Inactive)';
    }
  };

  return (
    <div
      className={`${styles.pill} ${styles[status]}`}
      title={
        status === 'connected'
          ? 'Connected to local WebSocket opportunity stream'
          : 'Operating in local offline/cache mode. Start `npm run server` for live stream demonstrations.'
      }
      role="status"
      aria-live="polite"
    >
      <span className={styles.indicator} aria-hidden="true" />
      <span>{getStatusLabel()}</span>
    </div>
  );
}
