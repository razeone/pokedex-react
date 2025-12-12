import { useState, useEffect, useCallback } from 'react';
import type {
  Pokemon,
  PokemonListResponse,
  PokemonSpecies,
  EvolutionChain,
  ChainLink,
  EvolutionStage,
  TypeListResponse,
} from '../types/pokemon';
import {
  fetchPokemonList,
  fetchPokemonDetail,
  fetchPokemonSpecies,
  fetchEvolutionChainByUrl,
  fetchPokemonTypes,
  fetchPokemonByType,
  fetchMultiplePokemon,
  getSpeciesIdFromUrl,
} from '../services/pokemonApi';

interface UsePokemonListResult {
  pokemon: Pokemon[];
  loading: boolean;
  error: string | null;
  totalCount: number;
  currentPage: number;
  totalPages: number;
  goToPage: (page: number) => void;
  nextPage: () => void;
  prevPage: () => void;
  refetch: () => void;
}

interface UsePokemonDetailResult {
  pokemon: Pokemon | null;
  species: PokemonSpecies | null;
  evolutionChain: EvolutionStage[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

interface UsePokemonTypesResult {
  types: TypeListResponse | null;
  loading: boolean;
  error: string | null;
}

interface UsePokemonSearchResult {
  pokemon: Pokemon[];
  loading: boolean;
  error: string | null;
  search: (query: string, type?: string) => void;
  clearSearch: () => void;
  isSearching: boolean;
}

const ITEMS_PER_PAGE = 20;

// Hook for fetching paginated Pokemon list
export function usePokemonList(itemsPerPage: number = ITEMS_PER_PAGE): UsePokemonListResult {
  const [pokemon, setPokemon] = useState<Pokemon[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(totalCount / itemsPerPage);

  const fetchPage = useCallback(async (page: number) => {
    setLoading(true);
    setError(null);

    try {
      const offset = (page - 1) * itemsPerPage;
      const listResponse: PokemonListResponse = await fetchPokemonList(offset, itemsPerPage);
      
      setTotalCount(listResponse.count);
      
      // Fetch details for each Pokemon
      const details = await fetchMultiplePokemon(listResponse.results);
      setPokemon(details);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch Pokemon');
      setPokemon([]);
    } finally {
      setLoading(false);
    }
  }, [itemsPerPage]);

  useEffect(() => {
    fetchPage(currentPage);
  }, [currentPage, fetchPage]);

  const goToPage = useCallback((page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  }, [totalPages]);

  const nextPage = useCallback(() => {
    goToPage(currentPage + 1);
  }, [currentPage, goToPage]);

  const prevPage = useCallback(() => {
    goToPage(currentPage - 1);
  }, [currentPage, goToPage]);

  const refetch = useCallback(() => {
    fetchPage(currentPage);
  }, [currentPage, fetchPage]);

  return {
    pokemon,
    loading,
    error,
    totalCount,
    currentPage,
    totalPages,
    goToPage,
    nextPage,
    prevPage,
    refetch,
  };
}

// Helper to flatten evolution chain
function flattenEvolutionChain(chain: ChainLink): EvolutionStage[] {
  const stages: EvolutionStage[] = [];

  function traverse(link: ChainLink) {
    const speciesId = getSpeciesIdFromUrl(link.species.url);
    const evolutionDetail = link.evolution_details[0];

    stages.push({
      id: speciesId,
      name: link.species.name,
      sprite: null, // Will be fetched separately
      minLevel: evolutionDetail?.min_level || null,
      trigger: evolutionDetail?.trigger?.name || null,
      item: evolutionDetail?.item?.name || null,
    });

    link.evolves_to.forEach(traverse);
  }

  traverse(chain);
  return stages;
}

// Hook for fetching single Pokemon detail with evolution
export function usePokemonDetail(idOrName: number | string | null): UsePokemonDetailResult {
  const [pokemon, setPokemon] = useState<Pokemon | null>(null);
  const [species, setSpecies] = useState<PokemonSpecies | null>(null);
  const [evolutionChain, setEvolutionChain] = useState<EvolutionStage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDetail = useCallback(async () => {
    if (!idOrName) {
      setPokemon(null);
      setSpecies(null);
      setEvolutionChain([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Fetch Pokemon details
      const pokemonData = await fetchPokemonDetail(idOrName);
      setPokemon(pokemonData);

      // Fetch species data
      const speciesData = await fetchPokemonSpecies(pokemonData.id);
      setSpecies(speciesData);

      // Fetch evolution chain
      const evolutionData: EvolutionChain = await fetchEvolutionChainByUrl(
        speciesData.evolution_chain.url
      );
      
      // Flatten and process evolution chain
      const stages = flattenEvolutionChain(evolutionData.chain);
      
      // Fetch sprites for each evolution stage
      const stagesWithSprites = await Promise.all(
        stages.map(async (stage) => {
          try {
            const pokemon = await fetchPokemonDetail(stage.id);
            return {
              ...stage,
              sprite: pokemon.sprites.front_default,
            };
          } catch {
            return stage;
          }
        })
      );
      
      setEvolutionChain(stagesWithSprites);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch Pokemon details');
      setPokemon(null);
      setSpecies(null);
      setEvolutionChain([]);
    } finally {
      setLoading(false);
    }
  }, [idOrName]);

  useEffect(() => {
    fetchDetail();
  }, [fetchDetail]);

  return {
    pokemon,
    species,
    evolutionChain,
    loading,
    error,
    refetch: fetchDetail,
  };
}

// Hook for fetching Pokemon types
export function usePokemonTypes(): UsePokemonTypesResult {
  const [types, setTypes] = useState<TypeListResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchTypes() {
      try {
        const data = await fetchPokemonTypes();
        // Filter out non-standard types (like 'unknown' and 'shadow')
        const filteredTypes = {
          ...data,
          results: data.results.filter(
            (type) => !['unknown', 'shadow'].includes(type.name)
          ),
        };
        setTypes(filteredTypes);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch types');
      } finally {
        setLoading(false);
      }
    }

    fetchTypes();
  }, []);

  return { types, loading, error };
}

// Hook for searching and filtering Pokemon
export function usePokemonSearch(): UsePokemonSearchResult {
  const [pokemon, setPokemon] = useState<Pokemon[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  const search = useCallback(async (query: string, type?: string) => {
    if (!query && !type) {
      clearSearch();
      return;
    }

    setLoading(true);
    setError(null);
    setIsSearching(true);

    try {
      let results: Pokemon[] = [];

      if (type && !query) {
        // Filter by type only
        const typeData = await fetchPokemonByType(type);
        const pokemonItems = typeData.pokemon.slice(0, 40).map((p) => ({
          name: p.pokemon.name,
          url: p.pokemon.url,
        }));
        results = await fetchMultiplePokemon(pokemonItems);
      } else if (query) {
        // Search by name (and optionally filter by type)
        const listResponse = await fetchPokemonList(0, 1000);
        const filtered = listResponse.results.filter((p) =>
          p.name.toLowerCase().includes(query.toLowerCase())
        );
        
        const limitedResults = filtered.slice(0, 40);
        results = await fetchMultiplePokemon(limitedResults);

        // If type filter is also applied
        if (type) {
          results = results.filter((p) =>
            p.types.some((t) => t.type.name === type)
          );
        }
      }

      setPokemon(results);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Search failed');
      setPokemon([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const clearSearch = useCallback(() => {
    setPokemon([]);
    setError(null);
    setIsSearching(false);
  }, []);

  return {
    pokemon,
    loading,
    error,
    search,
    clearSearch,
    isSearching,
  };
}
