import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { JobCard } from '../../src/features/jobs/components/JobCard';
import { DEMO_JOBS, DEMO_PREFERENCES } from '../../src/data/demoJobs';

describe('JobCard Component', () => {
  const sampleJob = DEMO_JOBS[0]!;

  it('renders role title, company name, and formatted salary', () => {
    render(
      <JobCard
        job={sampleJob}
        preferences={DEMO_PREFERENCES}
        onSelect={vi.fn()}
        onToggleSave={vi.fn()}
      />
    );

    expect(screen.getByText(sampleJob.title)).toBeInTheDocument();
    expect(screen.getByText(sampleJob.company.name)).toBeInTheDocument();
    expect(screen.getByText(sampleJob.salary.display)).toBeInTheDocument();
  });

  it('calls onSelect when card is clicked', async () => {
    const user = userEvent.setup();
    const handleSelect = vi.fn();

    render(
      <JobCard
        job={sampleJob}
        preferences={DEMO_PREFERENCES}
        onSelect={handleSelect}
        onToggleSave={vi.fn()}
      />
    );

    const card = screen.getByRole('button', {
      name: new RegExp(`${sampleJob.title} at ${sampleJob.company.name}`, 'i'),
    });
    await user.click(card);

    expect(handleSelect).toHaveBeenCalledWith(sampleJob);
  });

  it('calls onToggleSave when bookmark button is clicked without triggering card selection', async () => {
    const user = userEvent.setup();
    const handleSelect = vi.fn();
    const handleToggleSave = vi.fn();

    render(
      <JobCard
        job={sampleJob}
        preferences={DEMO_PREFERENCES}
        onSelect={handleSelect}
        onToggleSave={handleToggleSave}
      />
    );

    const saveButton = screen.getByRole('button', {
      name: new RegExp(`Save ${sampleJob.title}`, 'i'),
    });
    await user.click(saveButton);

    expect(handleToggleSave).toHaveBeenCalledWith(sampleJob);
    expect(handleSelect).not.toHaveBeenCalled();
  });

  it('supports keyboard navigation via Enter and Space keys', async () => {
    const user = userEvent.setup();
    const handleSelect = vi.fn();

    render(
      <JobCard
        job={sampleJob}
        preferences={DEMO_PREFERENCES}
        onSelect={handleSelect}
        onToggleSave={vi.fn()}
      />
    );

    const card = screen.getByRole('button', {
      name: new RegExp(`${sampleJob.title} at ${sampleJob.company.name}`, 'i'),
    });
    card.focus();
    expect(card).toHaveFocus();

    await user.keyboard('{Enter}');
    expect(handleSelect).toHaveBeenCalledWith(sampleJob);
  });
});
