import type { Pokemon } from '../types/pokemon';
import PokemonCard from './PokemonCard';
import { GridSkeleton } from './Skeleton';
import './PokemonGrid.css';

interface PokemonGridProps {
  pokemon: Pokemon[];
  loading: boolean;
  error: string | null;
  onPokemonClick: (pokemon: Pokemon) => void;
}

export function PokemonGrid({
  pokemon,
  loading,
  error,
  onPokemonClick,
}: PokemonGridProps) {
  if (loading) {
    return <GridSkeleton count={20} />;
  }

  if (error) {
    return (
      <div className="pokemon-grid__error">
        <div className="pokemon-grid__error-icon">⚠️</div>
        <h3>Oops! Something went wrong</h3>
        <p>{error}</p>
      </div>
    );
  }

  if (pokemon.length === 0) {
    return (
      <div className="pokemon-grid__empty">
        <div className="pokemon-grid__empty-icon">🔍</div>
        <h3>No Pokémon found</h3>
        <p>Try adjusting your search or filters</p>
      </div>
    );
  }

  return (
    <div className="pokemon-grid">
      {pokemon.map((p) => (
        <PokemonCard key={p.id} pokemon={p} onClick={onPokemonClick} />
      ))}
    </div>
  );
}

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  disabled?: boolean;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  disabled = false,
}: PaginationProps) {
  const getVisiblePages = () => {
    const pages: (number | string)[] = [];
    const showPages = 5;
    
    if (totalPages <= showPages + 2) {
      // Show all pages if total is small
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);
      
      if (currentPage > 3) {
        pages.push('...');
      }
      
      // Show pages around current
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
      
      if (currentPage < totalPages - 2) {
        pages.push('...');
      }
      
      // Always show last page
      pages.push(totalPages);
    }
    
    return pages;
  };

  return (
    <div className="pagination">
      <button
        className="pagination__btn pagination__btn--prev"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={disabled || currentPage === 1}
        aria-label="Previous page"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M15 18l-6-6 6-6" />
        </svg>
        <span>Prev</span>
      </button>

      <div className="pagination__pages">
        {getVisiblePages().map((page, index) =>
          typeof page === 'number' ? (
            <button
              key={index}
              className={`pagination__page ${
                page === currentPage ? 'pagination__page--active' : ''
              }`}
              onClick={() => onPageChange(page)}
              disabled={disabled}
              aria-label={`Page ${page}`}
              aria-current={page === currentPage ? 'page' : undefined}
            >
              {page}
            </button>
          ) : (
            <span key={index} className="pagination__ellipsis">
              {page}
            </span>
          )
        )}
      </div>

      <button
        className="pagination__btn pagination__btn--next"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={disabled || currentPage === totalPages}
        aria-label="Next page"
      >
        <span>Next</span>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M9 18l6-6-6-6" />
        </svg>
      </button>
    </div>
  );
}

export default PokemonGrid;
