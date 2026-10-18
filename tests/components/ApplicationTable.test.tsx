import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { ApplicationTable } from '../../src/features/applications/ApplicationTable';
import { JobApplicationRecord } from '../../src/types';

describe('ApplicationTable Component', () => {
  const sampleApps: JobApplicationRecord[] = [
    {
      id: 'app-1',
      jobId: 'opp-in-001',
      jobTitle: 'Frontend Intern',
      companyName: 'Kavach Tech',
      location: 'Bengaluru, Karnataka',
      status: 'applied',
      appliedDate: '2026-10-18',
      notes: 'Submitted resume via career portal',
      createdAt: '2026-10-18T10:00:00Z',
      updatedAt: '2026-10-18T10:00:00Z',
    },
    {
      id: 'app-2',
      jobId: 'opp-in-002',
      jobTitle: 'Junior React Dev',
      companyName: 'Zypher Health',
      location: 'Hyderabad, Telangana',
      status: 'interview',
      appliedDate: '2026-10-15',
      interviewDate: '2026-10-22',
      notes: 'Technical round scheduled',
      createdAt: '2026-10-15T10:00:00Z',
      updatedAt: '2026-10-16T10:00:00Z',
    },
  ];

  it('renders application funnel metric counters', () => {
    render(
      <MemoryRouter>
        <ApplicationTable
          applications={sampleApps}
          onUpdateStatus={vi.fn()}
          onUpdateNotes={vi.fn()}
          onDeleteApplication={vi.fn()}
        />
      </MemoryRouter>
    );

    expect(screen.getByText('Total Tracked')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
  });

  it('renders table rows with job title, company, and stage', () => {
    render(
      <MemoryRouter>
        <ApplicationTable
          applications={sampleApps}
          onUpdateStatus={vi.fn()}
          onUpdateNotes={vi.fn()}
          onDeleteApplication={vi.fn()}
        />
      </MemoryRouter>
    );

    expect(screen.getByText('Frontend Intern')).toBeInTheDocument();
    expect(screen.getByText('Kavach Tech')).toBeInTheDocument();
    expect(screen.getByText('Junior React Dev')).toBeInTheDocument();
    expect(screen.getByText('Zypher Health')).toBeInTheDocument();
  });

  it('filters by status tab', async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter>
        <ApplicationTable
          applications={sampleApps}
          onUpdateStatus={vi.fn()}
          onUpdateNotes={vi.fn()}
          onDeleteApplication={vi.fn()}
        />
      </MemoryRouter>
    );

    // Switch to Interviewing tab
    const interviewTab = screen.getByRole('tab', { name: /Interviewing \(1\)/i });
    await user.click(interviewTab);

    expect(screen.getByText('Junior React Dev')).toBeInTheDocument();
    expect(screen.queryByText('Frontend Intern')).not.toBeInTheDocument();
  });

  it('calls onDeleteApplication when delete action is clicked', async () => {
    const user = userEvent.setup();
    const handleDelete = vi.fn();

    render(
      <MemoryRouter>
        <ApplicationTable
          applications={sampleApps}
          onUpdateStatus={vi.fn()}
          onUpdateNotes={vi.fn()}
          onDeleteApplication={handleDelete}
        />
      </MemoryRouter>
    );

    const deleteBtn = screen.getByRole('button', {
      name: /Delete record for Frontend Intern/i,
    });
    await user.click(deleteBtn);

    expect(handleDelete).toHaveBeenCalledWith('app-1');
  });
});
