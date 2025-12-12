import { render, screen, fireEvent } from '@testing-library/react';
import { describe, test, expect, vi } from 'vitest';
import PokemonCard from './PokemonCard';
import type { Pokemon } from '../types/pokemon';

// Mock Pokemon data
const mockPokemon: Pokemon = {
  id: 25,
  name: 'pikachu',
  height: 4,
  weight: 60,
  sprites: {
    front_default: 'https://example.com/pikachu.png',
    front_shiny: null,
    other: {
      'official-artwork': {
        front_default: 'https://example.com/pikachu-artwork.png',
      },
    },
  },
  types: [
    { slot: 1, type: { name: 'electric', url: '' } },
  ],
  stats: [
    { base_stat: 35, effort: 0, stat: { name: 'hp', url: '' } },
  ],
  abilities: [
    { ability: { name: 'static', url: '' }, is_hidden: false, slot: 1 },
  ],
  species: { name: 'pikachu', url: '' },
};

describe('PokemonCard', () => {
  test('renders pokemon name correctly', () => {
    const handleClick = vi.fn();
    render(<PokemonCard pokemon={mockPokemon} onClick={handleClick} />);
    
    expect(screen.getByText('pikachu')).toBeInTheDocument();
  });

  test('renders pokemon ID formatted correctly', () => {
    const handleClick = vi.fn();
    render(<PokemonCard pokemon={mockPokemon} onClick={handleClick} />);
    
    expect(screen.getByText('#025')).toBeInTheDocument();
  });

  test('displays the pokemon image with correct alt text', () => {
    const handleClick = vi.fn();
    render(<PokemonCard pokemon={mockPokemon} onClick={handleClick} />);
    
    const imgElement = screen.getByAltText('pikachu');
    expect(imgElement).toBeInTheDocument();
    expect(imgElement).toHaveAttribute('src', 'https://example.com/pikachu-artwork.png');
  });

  test('renders type badge', () => {
    const handleClick = vi.fn();
    render(<PokemonCard pokemon={mockPokemon} onClick={handleClick} />);
    
    expect(screen.getByText('electric')).toBeInTheDocument();
  });

  test('calls onClick when card is clicked', () => {
    const handleClick = vi.fn();
    render(<PokemonCard pokemon={mockPokemon} onClick={handleClick} />);
    
    const card = screen.getByRole('button', { name: /view details for pikachu/i });
    fireEvent.click(card);
    
    expect(handleClick).toHaveBeenCalledTimes(1);
    expect(handleClick).toHaveBeenCalledWith(mockPokemon);
  });

  test('calls onClick when Enter key is pressed', () => {
    const handleClick = vi.fn();
    render(<PokemonCard pokemon={mockPokemon} onClick={handleClick} />);
    
    const card = screen.getByRole('button', { name: /view details for pikachu/i });
    fireEvent.keyDown(card, { key: 'Enter' });
    
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  test('has correct aria-label for accessibility', () => {
    const handleClick = vi.fn();
    render(<PokemonCard pokemon={mockPokemon} onClick={handleClick} />);
    
    expect(screen.getByLabelText('View details for pikachu')).toBeInTheDocument();
  });
});