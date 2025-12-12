import type {
  Pokemon,
  PokemonListResponse,
  PokemonSpecies,
  EvolutionChain,
  TypeListResponse,
  TypeDetail,
} from '../types/pokemon';

const BASE_URL = 'https://pokeapi.co/api/v2';

// Cache for API responses
const cache = new Map<string, unknown>();

async function fetchWithCache<T>(url: string): Promise<T> {
  if (cache.has(url)) {
    return cache.get(url) as T;
  }

  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error(`API Error: ${response.status} ${response.statusText}`);
  }
  
  const data = await response.json();
  cache.set(url, data);
  
  return data as T;
}

// Fetch paginated list of Pokemon
export async function fetchPokemonList(
  offset: number = 0,
  limit: number = 20
): Promise<PokemonListResponse> {
  const url = `${BASE_URL}/pokemon?offset=${offset}&limit=${limit}`;
  return fetchWithCache<PokemonListResponse>(url);
}

// Fetch single Pokemon details by ID or name
export async function fetchPokemonDetail(
  idOrName: number | string
): Promise<Pokemon> {
  const url = `${BASE_URL}/pokemon/${idOrName}`;
  return fetchWithCache<Pokemon>(url);
}

// Fetch Pokemon species data (for evolution chain URL)
export async function fetchPokemonSpecies(
  idOrName: number | string
): Promise<PokemonSpecies> {
  const url = `${BASE_URL}/pokemon-species/${idOrName}`;
  return fetchWithCache<PokemonSpecies>(url);
}

// Fetch evolution chain by ID
export async function fetchEvolutionChain(
  id: number
): Promise<EvolutionChain> {
  const url = `${BASE_URL}/evolution-chain/${id}`;
  return fetchWithCache<EvolutionChain>(url);
}

// Fetch evolution chain by URL
export async function fetchEvolutionChainByUrl(
  url: string
): Promise<EvolutionChain> {
  return fetchWithCache<EvolutionChain>(url);
}

// Fetch all Pokemon types
export async function fetchPokemonTypes(): Promise<TypeListResponse> {
  const url = `${BASE_URL}/type`;
  return fetchWithCache<TypeListResponse>(url);
}

// Fetch Pokemon by type
export async function fetchPokemonByType(
  typeName: string
): Promise<TypeDetail> {
  const url = `${BASE_URL}/type/${typeName}`;
  return fetchWithCache<TypeDetail>(url);
}

// Fetch multiple Pokemon details in parallel
export async function fetchMultiplePokemon(
  items: { name: string; url: string }[]
): Promise<Pokemon[]> {
  const promises = items.map((item) => fetchPokemonDetail(item.name));
  return Promise.all(promises);
}

// Search Pokemon by name (client-side filtering from full list)
export async function searchPokemon(
  query: string,
  limit: number = 1000
): Promise<Pokemon[]> {
  // Fetch a large list to search from
  const list = await fetchPokemonList(0, limit);
  
  // Filter by name
  const filtered = list.results.filter((pokemon) =>
    pokemon.name.toLowerCase().includes(query.toLowerCase())
  );
  
  // Fetch details for filtered results (limit to avoid too many requests)
  const limitedResults = filtered.slice(0, 20);
  return fetchMultiplePokemon(limitedResults);
}

// Get Pokemon ID from URL
export function getPokemonIdFromUrl(url: string): number {
  const matches = url.match(/\/pokemon\/(\d+)\//);
  return matches ? parseInt(matches[1], 10) : 0;
}

// Get evolution chain ID from URL
export function getEvolutionChainIdFromUrl(url: string): number {
  const matches = url.match(/\/evolution-chain\/(\d+)\//);
  return matches ? parseInt(matches[1], 10) : 0;
}

// Get species ID from URL
export function getSpeciesIdFromUrl(url: string): number {
  const matches = url.match(/\/pokemon-species\/(\d+)\//);
  return matches ? parseInt(matches[1], 10) : 0;
}

// Clear cache (useful for testing or memory management)
export function clearCache(): void {
  cache.clear();
}
