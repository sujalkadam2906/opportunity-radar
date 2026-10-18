import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SearchBar } from '../../src/features/search/SearchBar';

describe('SearchBar Component', () => {
  it('renders input with placeholder', () => {
    render(<SearchBar query="" onSearchChange={vi.fn()} />);

    expect(
      screen.getByPlaceholderText(/Search by title, skills/i)
    ).toBeInTheDocument();
  });

  it('debounces user typing before propagating onSearchChange', () => {
    vi.useFakeTimers();
    const handleSearch = vi.fn();

    render(<SearchBar query="" onSearchChange={handleSearch} />);

    const input = screen.getByRole('searchbox');
    fireEvent.change(input, { target: { value: 'React' } });

    // Before debounce timer expires
    expect(handleSearch).not.toHaveBeenCalled();

    // Advance 300ms
    vi.advanceTimersByTime(300);

    expect(handleSearch).toHaveBeenCalledWith('React');
    vi.useRealTimers();
  });

  it('displays clear button when query is present and clears on click', async () => {
    const user = userEvent.setup();
    const handleSearch = vi.fn();

    render(<SearchBar query="TypeScript" onSearchChange={handleSearch} />);

    const clearButton = screen.getByRole('button', { name: /Clear search input/i });
    expect(clearButton).toBeInTheDocument();

    await user.click(clearButton);
    expect(handleSearch).toHaveBeenCalledWith('');
  });
});
