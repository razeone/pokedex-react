# 🔴 Pokédex React

A modern, responsive Pokédex web application built with React, TypeScript, and Vite. Browse, search, and explore Pokémon with detailed stats, abilities, and evolution chains.

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?logo=typescript)
![Vite](https://img.shields.io/badge/Vite-7-646CFF?logo=vite)
![License](https://img.shields.io/badge/License-MIT-green)

## ✨ Features

- **📱 Responsive Design** - Mobile-first CSS Grid layout that adapts from 2 to 5 columns
- **🔍 Search & Filter** - Search Pokémon by name with debounced input, filter by type
- **📄 Pagination** - Browse through 1000+ Pokémon, 20 per page
- **📊 Detail View** - View stats, abilities, and evolution chains in a modal
- **🎨 Type Colors** - Each Pokémon type has its signature color
- **⚡ Performance** - API response caching, lazy loading images
- **🦴 Loading States** - Skeleton loaders for smooth UX
- **🛡️ Error Handling** - Error boundaries with retry functionality

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/razeone/pokedex-react.git
cd pokedex-react

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build for Production

```bash
npm run build
npm run preview
```

## 🏗️ Project Structure

```
src/
├── components/
│   ├── ErrorBoundary.tsx    # Error boundary with retry
│   ├── PokemonCard.tsx      # Individual Pokémon card
│   ├── PokemonDetail.tsx    # Detail modal with stats/evolution
│   ├── PokemonGrid.tsx      # Responsive grid + pagination
│   ├── SearchFilter.tsx     # Search input + type filter
│   ├── Skeleton.tsx         # Loading skeleton components
│   └── TypeBadge.tsx        # Type badge with colors
├── hooks/
│   └── usePokemon.ts        # Custom hooks for API calls
├── services/
│   └── pokemonApi.ts        # PokéAPI service layer
├── types/
│   └── pokemon.ts           # TypeScript interfaces
├── App.tsx                  # Main application component
├── App.css                  # App-specific styles
├── index.css                # Global styles & CSS variables
└── main.tsx                 # Application entry point
```

## 🎣 Custom Hooks

### `usePokemonList(itemsPerPage)`
Fetches paginated Pokémon list with navigation controls.

```typescript
const {
  pokemon,      // Pokemon[]
  loading,      // boolean
  error,        // string | null
  totalCount,   // number
  currentPage,  // number
  totalPages,   // number
  goToPage,     // (page: number) => void
  nextPage,     // () => void
  prevPage,     // () => void
} = usePokemonList(20);
```

### `usePokemonDetail(idOrName)`
Fetches detailed Pokémon data including species and evolution chain.

```typescript
const {
  pokemon,        // Pokemon | null
  species,        // PokemonSpecies | null
  evolutionChain, // EvolutionStage[]
  loading,        // boolean
  error,          // string | null
} = usePokemonDetail(25); // Pikachu
```

### `usePokemonSearch()`
Search and filter Pokémon by name and type.

```typescript
const {
  pokemon,     // Pokemon[]
  loading,     // boolean
  error,       // string | null
  search,      // (query: string, type?: string) => void
  clearSearch, // () => void
  isSearching, // boolean
} = usePokemonSearch();
```

### `usePokemonTypes()`
Fetches all available Pokémon types for filtering.

```typescript
const {
  types,   // TypeListResponse | null
  loading, // boolean
  error,   // string | null
} = usePokemonTypes();
```

## 🎨 Type Colors

| Type | Color |
|------|-------|
| 🔥 Fire | `#F08030` |
| 💧 Water | `#6890F0` |
| 🌿 Grass | `#78C850` |
| ⚡ Electric | `#F8D030` |
| 🧊 Ice | `#98D8D8` |
| 👊 Fighting | `#C03028` |
| ☠️ Poison | `#A040A0` |
| 🌍 Ground | `#E0C068` |
| 🪽 Flying | `#A890F0` |
| 🔮 Psychic | `#F85888` |
| 🐛 Bug | `#A8B820` |
| 🪨 Rock | `#B8A038` |
| 👻 Ghost | `#705898` |
| 🐉 Dragon | `#7038F8` |
| 🌑 Dark | `#705848` |
| ⚙️ Steel | `#B8B8D0` |
| 🧚 Fairy | `#EE99AC` |
| ⚪ Normal | `#A8A878` |

## 🔌 API

This app uses the [PokéAPI](https://pokeapi.co/) - a free RESTful Pokémon API.

### Endpoints Used

- `GET /pokemon?offset={offset}&limit={limit}` - List Pokémon
- `GET /pokemon/{id}` - Get Pokémon details
- `GET /pokemon-species/{id}` - Get species data
- `GET /evolution-chain/{id}` - Get evolution chain
- `GET /type` - List all types
- `GET /type/{name}` - Get Pokémon by type

## 🛠️ Tech Stack

- **React 19** - UI library
- **TypeScript 5.8** - Type safety
- **Vite 7** - Build tool & dev server
- **CSS3** - Styling (no frameworks)
- **PokéAPI** - Data source

## 📝 License

MIT License - feel free to use this project for learning or personal use.

## 🙏 Acknowledgments

- [PokéAPI](https://pokeapi.co/) for the amazing free API
- Pokémon is © Nintendo/Game Freak
