import './TypeBadge.css';

// Type color mapping
export const typeColors: Record<string, string> = {
  normal: '#A8A878',
  fire: '#F08030',
  water: '#6890F0',
  electric: '#F8D030',
  grass: '#78C850',
  ice: '#98D8D8',
  fighting: '#C03028',
  poison: '#A040A0',
  ground: '#E0C068',
  flying: '#A890F0',
  psychic: '#F85888',
  bug: '#A8B820',
  rock: '#B8A038',
  ghost: '#705898',
  dragon: '#7038F8',
  dark: '#705848',
  steel: '#B8B8D0',
  fairy: '#EE99AC',
};

export function getTypeColor(type: string): string {
  return typeColors[type.toLowerCase()] || '#777777';
}

export function getTypeGradient(types: string[]): string {
  if (types.length === 1) {
    const color = getTypeColor(types[0]);
    return `linear-gradient(135deg, ${color}66 0%, ${color}33 100%)`;
  }
  const color1 = getTypeColor(types[0]);
  const color2 = getTypeColor(types[1]);
  return `linear-gradient(135deg, ${color1}66 0%, ${color2}66 100%)`;
}

interface TypeBadgeProps {
  type: string;
  size?: 'small' | 'medium' | 'large';
  onClick?: () => void;
}

export function TypeBadge({ type, size = 'medium', onClick }: TypeBadgeProps) {
  const color = getTypeColor(type);
  
  return (
    <span
      className={`type-badge type-badge--${size} ${onClick ? 'type-badge--clickable' : ''}`}
      style={{
        backgroundColor: color,
        boxShadow: `0 2px 8px ${color}66`,
      }}
      onClick={onClick}
    >
      {type}
    </span>
  );
}

export default TypeBadge;
