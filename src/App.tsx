import { useState, useCallback } from 'react';
import type { Pokemon } from './types/pokemon';
import { usePokemonList, usePokemonSearch } from './hooks/usePokemon';
import { fetchPokemonDetail } from './services/pokemonApi';
import ErrorBoundary from './components/ErrorBoundary';
import SearchFilter from './components/SearchFilter';
import PokemonGrid, { Pagination } from './components/PokemonGrid';
import PokemonDetail from './components/PokemonDetail';
import './App.css';

function App() {
  const [selectedPokemon, setSelectedPokemon] = useState<Pokemon | null>(null);
  
  // Paginated list hook
  const {
    pokemon: listPokemon,
    loading: listLoading,
    error: listError,
    totalCount,
    currentPage,
    totalPages,
    goToPage,
  } = usePokemonList(20);

  // Search hook
  const {
    pokemon: searchPokemon,
    loading: searchLoading,
    error: searchError,
    search,
    clearSearch,
    isSearching,
  } = usePokemonSearch();

  // Determine which data to display
  const displayPokemon = isSearching ? searchPokemon : listPokemon;
  const displayLoading = isSearching ? searchLoading : listLoading;
  const displayError = isSearching ? searchError : listError;

  const handlePokemonClick = useCallback((pokemon: Pokemon) => {
    setSelectedPokemon(pokemon);
  }, []);

  const handleCloseDetail = useCallback(() => {
    setSelectedPokemon(null);
  }, []);

  const handleEvolutionClick = useCallback(async (id: number) => {
    try {
      const pokemon = await fetchPokemonDetail(id);
      setSelectedPokemon(pokemon);
    } catch (error) {
      console.error('Failed to fetch evolution:', error);
    }
  }, []);

  const handleSearch = useCallback((query: string, type: string) => {
    search(query, type);
  }, [search]);

  const handleClearSearch = useCallback(() => {
    clearSearch();
  }, [clearSearch]);

  return (
    <ErrorBoundary>
      <div className="app">
        {/* Header */}
        <header className="app-header">
          <div className="app-header__content">
            <div className="app-header__logo">
              <div className="app-header__pokeball" aria-hidden="true" />
              <h1 className="app-header__title">Pokédex</h1>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="app-main">
          {/* Search & Filter */}
          <SearchFilter
            onSearch={handleSearch}
            onClear={handleClearSearch}
            isSearching={isSearching}
          />

          {/* Results Info */}
          {!displayLoading && !displayError && (
            <div className="results-info">
              {isSearching ? (
                <span>
                  Found <strong>{displayPokemon.length}</strong> Pokémon
                </span>
              ) : (
                <span>
                  Showing <strong>{displayPokemon.length}</strong> of{' '}
                  <strong>{totalCount}</strong> Pokémon
                </span>
              )}
              {!isSearching && (
                <span>
                  Page <strong>{currentPage}</strong> of <strong>{totalPages}</strong>
                </span>
              )}
            </div>
          )}

          {/* Pokemon Grid */}
          <ErrorBoundary>
            <PokemonGrid
              pokemon={displayPokemon}
              loading={displayLoading}
              error={displayError}
              onPokemonClick={handlePokemonClick}
            />
          </ErrorBoundary>

          {/* Pagination (only show when not searching) */}
          {!isSearching && !displayLoading && !displayError && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={goToPage}
              disabled={displayLoading}
            />
          )}
        </main>

        {/* Footer */}
        <footer className="app-footer">
          <p>
            Data from{' '}
            <a
              href="https://pokeapi.co/"
              target="_blank"
              rel="noopener noreferrer"
            >
              PokéAPI
            </a>{' '}
            • Built with React + TypeScript
          </p>
        </footer>

        {/* Pokemon Detail Modal */}
        {selectedPokemon && (
          <PokemonDetail
            pokemon={selectedPokemon}
            onClose={handleCloseDetail}
            onEvolutionClick={handleEvolutionClick}
          />
        )}
      </div>
    </ErrorBoundary>
  );
}

export default App;
