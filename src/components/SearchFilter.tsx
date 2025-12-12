import { useState, useEffect, useCallback } from 'react';
import { usePokemonTypes } from '../hooks/usePokemon';
import { TypeBadge } from './TypeBadge';
import './SearchFilter.css';

interface SearchFilterProps {
  onSearch: (query: string, type: string) => void;
  onClear: () => void;
  isSearching: boolean;
}

export function SearchFilter({ onSearch, onClear, isSearching }: SearchFilterProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const { types, loading: typesLoading } = usePokemonTypes();

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery || selectedType) {
        onSearch(searchQuery, selectedType);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery, selectedType, onSearch]);

  const handleClear = useCallback(() => {
    setSearchQuery('');
    setSelectedType('');
    onClear();
  }, [onClear]);

  const handleTypeSelect = (type: string) => {
    setSelectedType((prev) => (prev === type ? '' : type));
  };

  return (
    <div className="search-filter">
      <div className="search-filter__controls">
        <div className="search-filter__input-wrapper">
          <svg
            className="search-filter__icon"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="M21 21l-4.35-4.35" />
          </svg>
          <input
            type="text"
            className="search-filter__input"
            placeholder="Search Pokémon..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            aria-label="Search Pokémon by name"
          />
          {searchQuery && (
            <button
              className="search-filter__clear-input"
              onClick={() => setSearchQuery('')}
              aria-label="Clear search"
            >
              ×
            </button>
          )}
        </div>

        <select
          className="search-filter__select"
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
          aria-label="Filter by type"
          disabled={typesLoading}
        >
          <option value="">All Types</option>
          {types?.results.map((type) => (
            <option key={type.name} value={type.name}>
              {type.name.charAt(0).toUpperCase() + type.name.slice(1)}
            </option>
          ))}
        </select>

        {isSearching && (
          <button className="search-filter__clear-btn" onClick={handleClear}>
            Clear Filters
          </button>
        )}
      </div>

      {/* Type badges for quick filter */}
      <div className="search-filter__types">
        {types?.results.slice(0, 18).map((type) => (
          <TypeBadge
            key={type.name}
            type={type.name}
            size="small"
            onClick={() => handleTypeSelect(type.name)}
          />
        ))}
      </div>

      {selectedType && (
        <div className="search-filter__active">
          <span>Filtering by:</span>
          <TypeBadge type={selectedType} size="medium" />
          <button
            className="search-filter__remove-filter"
            onClick={() => setSelectedType('')}
            aria-label="Remove type filter"
          >
            ×
          </button>
        </div>
      )}
    </div>
  );
}

export default SearchFilter;
