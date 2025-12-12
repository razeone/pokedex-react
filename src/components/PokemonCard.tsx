import type { Pokemon } from '../types/pokemon';
import { TypeBadge, getTypeGradient } from './TypeBadge';
import './PokemonCard.css';

interface PokemonCardProps {
  pokemon: Pokemon;
  onClick: (pokemon: Pokemon) => void;
}

export function PokemonCard({ pokemon, onClick }: PokemonCardProps) {
  const types = pokemon.types.map((t) => t.type.name);
  const sprite =
    pokemon.sprites.other?.['official-artwork']?.front_default ||
    pokemon.sprites.front_default;

  const formattedId = `#${String(pokemon.id).padStart(3, '0')}`;

  return (
    <article
      className="pokemon-card"
      style={{ background: getTypeGradient(types) }}
      onClick={() => onClick(pokemon)}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          onClick(pokemon);
        }
      }}
      role="button"
      aria-label={`View details for ${pokemon.name}`}
    >
      <div className="pokemon-card__image-container">
        <div className="pokemon-card__bg-circle" />
        {sprite ? (
          <img
            src={sprite}
            alt={pokemon.name}
            className="pokemon-card__image"
            loading="lazy"
          />
        ) : (
          <div className="pokemon-card__no-image">?</div>
        )}
      </div>

      <div className="pokemon-card__info">
        <span className="pokemon-card__id">{formattedId}</span>
        <h3 className="pokemon-card__name">{pokemon.name}</h3>
        <div className="pokemon-card__types">
          {types.map((type) => (
            <TypeBadge key={type} type={type} size="small" />
          ))}
        </div>
      </div>
    </article>
  );
}

export default PokemonCard;
