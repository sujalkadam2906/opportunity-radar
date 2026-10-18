import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ToastProvider } from '../../src/components/feedback/ToastContext';
import { DiscoverPage } from '../../src/pages/DiscoverPage';

function renderWithProviders(ui: React.ReactElement) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <ToastProvider>
        <MemoryRouter initialEntries={['/']}>{ui}</MemoryRouter>
      </ToastProvider>
    </QueryClientProvider>
  );
}

describe('DiscoverPage Integration', () => {
  it('renders search bar, filter bar, and loads job opportunities', async () => {
    renderWithProviders(<DiscoverPage onOpenPreferences={vi.fn()} />);

    // Check search input exists
    expect(
      screen.getByPlaceholderText(/Search by title, skills/i)
    ).toBeInTheDocument();

    // Wait for jobs to load from jobService
    await waitFor(() => {
      expect(
        screen.getAllByText('Frontend Engineering Intern').length
      ).toBeGreaterThan(0);
    });
  });

  it('filters results when clicking Remote work mode filter', async () => {
    const user = userEvent.setup();
    renderWithProviders(<DiscoverPage onOpenPreferences={vi.fn()} />);

    await waitFor(() => {
      expect(
        screen.getAllByText('Frontend Engineering Intern').length
      ).toBeGreaterThan(0);
    });

    const remoteBtn = screen.getByRole('button', { name: /^Remote$/i });
    await user.click(remoteBtn);

    // Hybrid job (Kavach Tech) should disappear, Remote job should remain
    await waitFor(() => {
      expect(screen.queryByText('Kavach Technologies')).not.toBeInTheDocument();
      expect(
        screen.getAllByText('Associate Software Engineer - Frontend').length
      ).toBeGreaterThan(0);
    });
  });

  it('toggles bookmark when save button on a job card is clicked', async () => {
    const user = userEvent.setup();
    renderWithProviders(<DiscoverPage onOpenPreferences={vi.fn()} />);

    await waitFor(() => {
      expect(
        screen.getAllByText('Frontend Engineering Intern').length
      ).toBeGreaterThan(0);
    });

    const saveBtn = screen.getByRole('button', {
      name: /Save Frontend Engineering Intern/i,
    });
    await user.click(saveBtn);

    // Should trigger toast feedback
    await waitFor(() => {
      expect(screen.getByText('Job Bookmarked')).toBeInTheDocument();
    });
  });
});
