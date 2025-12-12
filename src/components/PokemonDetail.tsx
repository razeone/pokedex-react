import { useEffect } from 'react';
import type { Pokemon, EvolutionStage } from '../types/pokemon';
import { usePokemonDetail } from '../hooks/usePokemon';
import { TypeBadge, getTypeGradient } from './TypeBadge';
import { DetailSkeleton } from './Skeleton';
import './PokemonDetail.css';

interface PokemonDetailProps {
  pokemon: Pokemon;
  onClose: () => void;
  onEvolutionClick: (id: number) => void;
}

const statNameMap: Record<string, string> = {
  hp: 'HP',
  attack: 'Attack',
  defense: 'Defense',
  'special-attack': 'Sp. Atk',
  'special-defense': 'Sp. Def',
  speed: 'Speed',
};

const statColorMap: Record<string, string> = {
  hp: '#ef4444',
  attack: '#f97316',
  defense: '#eab308',
  'special-attack': '#3b82f6',
  'special-defense': '#22c55e',
  speed: '#ec4899',
};

export function PokemonDetail({
  pokemon,
  onClose,
  onEvolutionClick,
}: PokemonDetailProps) {
  const { species, evolutionChain, loading, error } = usePokemonDetail(pokemon.id);

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  const types = pokemon.types.map((t) => t.type.name);
  const sprite =
    pokemon.sprites.other?.['official-artwork']?.front_default ||
    pokemon.sprites.front_default;

  const flavorText = species?.flavor_text_entries.find(
    (entry) => entry.language.name === 'en'
  )?.flavor_text.replace(/\f/g, ' ');

  const genus = species?.genera.find(
    (g) => g.language.name === 'en'
  )?.genus;

  const maxStat = 255;

  return (
    <div className="pokemon-detail-overlay" onClick={onClose}>
      <div
        className="pokemon-detail"
        onClick={(e) => e.stopPropagation()}
        style={{ background: getTypeGradient(types) }}
      >
        <button
          className="pokemon-detail__close"
          onClick={onClose}
          aria-label="Close detail view"
        >
          ×
        </button>

        {loading && !species ? (
          <DetailSkeleton />
        ) : error ? (
          <div className="pokemon-detail__error">
            <p>Failed to load details: {error}</p>
          </div>
        ) : (
          <>
            {/* Header */}
            <header className="pokemon-detail__header">
              <div className="pokemon-detail__image-container">
                {sprite && (
                  <img
                    src={sprite}
                    alt={pokemon.name}
                    className="pokemon-detail__image"
                  />
                )}
              </div>
              <div className="pokemon-detail__info">
                <span className="pokemon-detail__id">
                  #{String(pokemon.id).padStart(3, '0')}
                </span>
                <h2 className="pokemon-detail__name">{pokemon.name}</h2>
                {genus && <span className="pokemon-detail__genus">{genus}</span>}
                <div className="pokemon-detail__types">
                  {types.map((type) => (
                    <TypeBadge key={type} type={type} size="large" />
                  ))}
                </div>
              </div>
            </header>

            {/* Description */}
            {flavorText && (
              <p className="pokemon-detail__description">{flavorText}</p>
            )}

            {/* Physical */}
            <div className="pokemon-detail__physical">
              <div className="pokemon-detail__physical-item">
                <span className="pokemon-detail__physical-value">
                  {(pokemon.height / 10).toFixed(1)} m
                </span>
                <span className="pokemon-detail__physical-label">Height</span>
              </div>
              <div className="pokemon-detail__physical-item">
                <span className="pokemon-detail__physical-value">
                  {(pokemon.weight / 10).toFixed(1)} kg
                </span>
                <span className="pokemon-detail__physical-label">Weight</span>
              </div>
            </div>

            {/* Stats */}
            <section className="pokemon-detail__section">
              <h3 className="pokemon-detail__section-title">Base Stats</h3>
              <div className="pokemon-detail__stats">
                {pokemon.stats.map((stat) => {
                  const percentage = (stat.base_stat / maxStat) * 100;
                  const color = statColorMap[stat.stat.name] || '#6b7280';
                  return (
                    <div key={stat.stat.name} className="pokemon-detail__stat">
                      <span className="pokemon-detail__stat-name">
                        {statNameMap[stat.stat.name] || stat.stat.name}
                      </span>
                      <span className="pokemon-detail__stat-value">
                        {stat.base_stat}
                      </span>
                      <div className="pokemon-detail__stat-bar">
                        <div
                          className="pokemon-detail__stat-fill"
                          style={{
                            width: `${percentage}%`,
                            backgroundColor: color,
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* Abilities */}
            <section className="pokemon-detail__section">
              <h3 className="pokemon-detail__section-title">Abilities</h3>
              <div className="pokemon-detail__abilities">
                {pokemon.abilities.map((ability) => (
                  <span
                    key={ability.ability.name}
                    className={`pokemon-detail__ability ${
                      ability.is_hidden ? 'pokemon-detail__ability--hidden' : ''
                    }`}
                  >
                    {ability.ability.name.replace('-', ' ')}
                    {ability.is_hidden && (
                      <span className="pokemon-detail__ability-tag">Hidden</span>
                    )}
                  </span>
                ))}
              </div>
            </section>

            {/* Evolution Chain */}
            {evolutionChain.length > 1 && (
              <section className="pokemon-detail__section">
                <h3 className="pokemon-detail__section-title">Evolution Chain</h3>
                <div className="pokemon-detail__evolution">
                  {evolutionChain.map((stage, index) => (
                    <EvolutionStageItem
                      key={stage.id}
                      stage={stage}
                      isLast={index === evolutionChain.length - 1}
                      isCurrent={stage.id === pokemon.id}
                      onClick={() => onEvolutionClick(stage.id)}
                    />
                  ))}
                </div>
              </section>
            )}
          </>
        )}
      </div>
    </div>
  );
}

interface EvolutionStageItemProps {
  stage: EvolutionStage;
  isLast: boolean;
  isCurrent: boolean;
  onClick: () => void;
}

function EvolutionStageItem({
  stage,
  isLast,
  isCurrent,
  onClick,
}: EvolutionStageItemProps) {
  return (
    <>
      <button
        className={`pokemon-detail__evo-stage ${
          isCurrent ? 'pokemon-detail__evo-stage--current' : ''
        }`}
        onClick={onClick}
        aria-label={`View ${stage.name}`}
      >
        {stage.sprite && (
          <img
            src={stage.sprite}
            alt={stage.name}
            className="pokemon-detail__evo-image"
          />
        )}
        <span className="pokemon-detail__evo-name">{stage.name}</span>
        {stage.minLevel && (
          <span className="pokemon-detail__evo-level">Lv. {stage.minLevel}</span>
        )}
      </button>
      {!isLast && (
        <div className="pokemon-detail__evo-arrow">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </div>
      )}
    </>
  );
}

export default PokemonDetail;
