import { useNavigate } from 'react-router-dom';
import { EmptyState } from '../components/feedback/EmptyState';
import { Button } from '../components/ui/Button';
import { HelpCircle, Compass } from 'lucide-react';

export function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div style={{ padding: 'var(--space-8) 0' }}>
      <EmptyState
        icon={<HelpCircle size={32} />}
        title="Page Not Found"
        description="The view or opportunity listing you are looking for does not exist or has been moved."
        action={
          <Button variant="primary" onClick={() => navigate('/')}>
            <Compass size={16} aria-hidden="true" />
            <span>Return to Discover</span>
          </Button>
        }
      />
    </div>
  );
}
