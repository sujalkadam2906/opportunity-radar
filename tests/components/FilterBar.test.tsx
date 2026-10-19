import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FilterBar } from '../../src/features/search/FilterBar';
import { FilterState } from '../../src/types';

describe('FilterBar Component', () => {
  const baseFilters: FilterState = {
    query: '',
    location: 'all',
    workMode: 'all',
    experienceLevel: 'all',
    category: 'all',
    freshness: 'all',
    minSalary: 0,
    sort: 'freshness_desc',
  };

  it('renders freshness and work arrangement segmented buttons', () => {
    render(
      <FilterBar
        filters={baseFilters}
        onWorkModeChange={vi.fn()}
        onFreshnessChange={vi.fn()}
        onExperienceChange={vi.fn()}
        onLocationChange={vi.fn()}
        onCategoryChange={vi.fn()}
        onSortChange={vi.fn()}
        onResetFilters={vi.fn()}
        activeFilterCount={0}
      />
    );

    expect(screen.getByRole('button', { name: /⚡ 24h Fresh/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Remote/i })).toBeInTheDocument();
  });

  it('triggers onFreshnessChange when a freshness pill is clicked', async () => {
    const user = userEvent.setup();
    const handleFreshness = vi.fn();

    render(
      <FilterBar
        filters={baseFilters}
        onWorkModeChange={vi.fn()}
        onFreshnessChange={handleFreshness}
        onExperienceChange={vi.fn()}
        onLocationChange={vi.fn()}
        onCategoryChange={vi.fn()}
        onSortChange={vi.fn()}
        onResetFilters={vi.fn()}
        activeFilterCount={0}
      />
    );

    const btn = screen.getByRole('button', { name: /⚡ 24h Fresh/i });
    await user.click(btn);

    expect(handleFreshness).toHaveBeenCalledWith('24h');
  });

  it('triggers onWorkModeChange when a work mode pill is clicked', async () => {
    const user = userEvent.setup();
    const handleWorkMode = vi.fn();

    render(
      <FilterBar
        filters={baseFilters}
        onWorkModeChange={handleWorkMode}
        onFreshnessChange={vi.fn()}
        onExperienceChange={vi.fn()}
        onLocationChange={vi.fn()}
        onCategoryChange={vi.fn()}
        onSortChange={vi.fn()}
        onResetFilters={vi.fn()}
        activeFilterCount={0}
      />
    );

    const btn = screen.getByRole('button', { name: /Hybrid/i });
    await user.click(btn);

    expect(handleWorkMode).toHaveBeenCalledWith('hybrid');
  });

  it('displays reset filters button only when activeFilterCount > 0', async () => {
    const user = userEvent.setup();
    const handleReset = vi.fn();

    const { rerender } = render(
      <FilterBar
        filters={baseFilters}
        onWorkModeChange={vi.fn()}
        onFreshnessChange={vi.fn()}
        onExperienceChange={vi.fn()}
        onLocationChange={vi.fn()}
        onCategoryChange={vi.fn()}
        onSortChange={vi.fn()}
        onResetFilters={handleReset}
        activeFilterCount={0}
      />
    );

    expect(
      screen.queryByRole('button', { name: /Reset Filters/i })
    ).not.toBeInTheDocument();

    rerender(
      <FilterBar
        filters={{ ...baseFilters, workMode: 'remote' }}
        onWorkModeChange={vi.fn()}
        onFreshnessChange={vi.fn()}
        onExperienceChange={vi.fn()}
        onLocationChange={vi.fn()}
        onCategoryChange={vi.fn()}
        onSortChange={vi.fn()}
        onResetFilters={handleReset}
        activeFilterCount={1}
      />
    );

    const resetBtn = screen.getByRole('button', { name: /Reset Filters \(1\)/i });
    expect(resetBtn).toBeInTheDocument();

    await user.click(resetBtn);
    expect(handleReset).toHaveBeenCalled();
  });
});
