// Pokemon List API Response
export interface PokemonListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: PokemonListItem[];
}

export interface PokemonListItem {
  name: string;
  url: string;
}

// Pokemon Detail
export interface Pokemon {
  id: number;
  name: string;
  height: number;
  weight: number;
  sprites: PokemonSprites;
  types: PokemonTypeSlot[];
  stats: PokemonStat[];
  abilities: PokemonAbility[];
  species: {
    name: string;
    url: string;
  };
}

export interface PokemonSprites {
  front_default: string | null;
  front_shiny: string | null;
  other?: {
    'official-artwork'?: {
      front_default: string | null;
    };
    dream_world?: {
      front_default: string | null;
    };
  };
}

export interface PokemonTypeSlot {
  slot: number;
  type: {
    name: string;
    url: string;
  };
}

export interface PokemonStat {
  base_stat: number;
  effort: number;
  stat: {
    name: string;
    url: string;
  };
}

export interface PokemonAbility {
  ability: {
    name: string;
    url: string;
  };
  is_hidden: boolean;
  slot: number;
}

// Pokemon Species (for evolution chain)
export interface PokemonSpecies {
  id: number;
  name: string;
  evolution_chain: {
    url: string;
  };
  flavor_text_entries: FlavorTextEntry[];
  genera: Genus[];
}

export interface FlavorTextEntry {
  flavor_text: string;
  language: {
    name: string;
  };
  version: {
    name: string;
  };
}

export interface Genus {
  genus: string;
  language: {
    name: string;
  };
}

// Evolution Chain
export interface EvolutionChain {
  id: number;
  chain: ChainLink;
}

export interface ChainLink {
  species: {
    name: string;
    url: string;
  };
  evolves_to: ChainLink[];
  evolution_details: EvolutionDetail[];
}

export interface EvolutionDetail {
  min_level: number | null;
  trigger: {
    name: string;
  };
  item: {
    name: string;
  } | null;
}

// Pokemon Types
export interface PokemonType {
  name: string;
  url: string;
}

export interface TypeListResponse {
  count: number;
  results: PokemonType[];
}

export interface TypeDetail {
  id: number;
  name: string;
  pokemon: TypePokemon[];
}

export interface TypePokemon {
  pokemon: {
    name: string;
    url: string;
  };
  slot: number;
}

// Processed Evolution for UI
export interface EvolutionStage {
  id: number;
  name: string;
  sprite: string | null;
  minLevel: number | null;
  trigger: string | null;
  item: string | null;
}

// Type colors mapping
export type PokemonTypeName =
  | 'normal'
  | 'fire'
  | 'water'
  | 'electric'
  | 'grass'
  | 'ice'
  | 'fighting'
  | 'poison'
  | 'ground'
  | 'flying'
  | 'psychic'
  | 'bug'
  | 'rock'
  | 'ghost'
  | 'dragon'
  | 'dark'
  | 'steel'
  | 'fairy';
