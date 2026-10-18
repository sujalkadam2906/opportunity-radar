import { useState, useEffect, useRef } from 'react';
import { Search, X } from 'lucide-react';
import styles from './SearchBar.module.css';

export interface SearchBarProps {
  query: string;
  onSearchChange: (newQuery: string) => void;
  placeholder?: string;
}

export function SearchBar({
  query,
  onSearchChange,
  placeholder = 'Search by title, skills (e.g. React, TypeScript), company, or location...',
}: SearchBarProps) {
  const [localValue, setLocalValue] = useState(query);
  const isFirstRender = useRef(true);

  // Sync from external query parameter changes
  useEffect(() => {
    setLocalValue(query);
  }, [query]);

  // Debounced search propagation to parent / URL
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    const timer = setTimeout(() => {
      if (localValue !== query) {
        onSearchChange(localValue);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [localValue, query, onSearchChange]);

  const handleClear = () => {
    setLocalValue('');
    onSearchChange('');
  };

  return (
    <div className={styles.searchContainer}>
      <Search size={18} className={styles.searchIcon} aria-hidden="true" />
      <input
        type="search"
        value={localValue}
        onChange={(e) => setLocalValue(e.target.value)}
        placeholder={placeholder}
        className={styles.searchInput}
        aria-label="Search job opportunities"
      />
      {localValue && (
        <button
          type="button"
          onClick={handleClear}
          className={styles.clearButton}
          aria-label="Clear search input"
        >
          <X size={16} aria-hidden="true" />
        </button>
      )}
    </div>
  );
}
