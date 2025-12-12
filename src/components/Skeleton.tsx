import './Skeleton.css';

interface SkeletonProps {
  width?: string;
  height?: string;
  borderRadius?: string;
  className?: string;
}

// Base skeleton component
export function Skeleton({
  width = '100%',
  height = '1rem',
  borderRadius = '0.25rem',
  className = '',
}: SkeletonProps) {
  return (
    <div
      className={`skeleton ${className}`}
      style={{ width, height, borderRadius }}
    />
  );
}

// Card skeleton for Pokemon grid
export function CardSkeleton() {
  return (
    <div className="card-skeleton">
      <div className="card-skeleton__image">
        <Skeleton width="96px" height="96px" borderRadius="50%" />
      </div>
      <div className="card-skeleton__content">
        <Skeleton width="40px" height="0.75rem" className="card-skeleton__id" />
        <Skeleton width="80%" height="1.25rem" className="card-skeleton__name" />
        <div className="card-skeleton__types">
          <Skeleton width="60px" height="1.5rem" borderRadius="1rem" />
          <Skeleton width="60px" height="1.5rem" borderRadius="1rem" />
        </div>
      </div>
    </div>
  );
}

// Grid skeleton showing multiple card skeletons
interface GridSkeletonProps {
  count?: number;
}

export function GridSkeleton({ count = 20 }: GridSkeletonProps) {
  return (
    <div className="grid-skeleton">
      {Array.from({ length: count }).map((_, index) => (
        <CardSkeleton key={index} />
      ))}
    </div>
  );
}

// Detail skeleton for Pokemon detail view
export function DetailSkeleton() {
  return (
    <div className="detail-skeleton">
      <div className="detail-skeleton__header">
        <Skeleton width="120px" height="120px" borderRadius="50%" />
        <div className="detail-skeleton__info">
          <Skeleton width="60px" height="1rem" />
          <Skeleton width="180px" height="2rem" />
          <div className="detail-skeleton__types">
            <Skeleton width="70px" height="1.75rem" borderRadius="1rem" />
            <Skeleton width="70px" height="1.75rem" borderRadius="1rem" />
          </div>
        </div>
      </div>

      <div className="detail-skeleton__section">
        <Skeleton width="80px" height="1.25rem" />
        <div className="detail-skeleton__stats">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="detail-skeleton__stat">
              <Skeleton width="80px" height="0.875rem" />
              <Skeleton width="100%" height="0.5rem" borderRadius="0.25rem" />
            </div>
          ))}
        </div>
      </div>

      <div className="detail-skeleton__section">
        <Skeleton width="80px" height="1.25rem" />
        <div className="detail-skeleton__abilities">
          <Skeleton width="100px" height="2rem" borderRadius="0.5rem" />
          <Skeleton width="100px" height="2rem" borderRadius="0.5rem" />
        </div>
      </div>

      <div className="detail-skeleton__section">
        <Skeleton width="120px" height="1.25rem" />
        <div className="detail-skeleton__evolution">
          <Skeleton width="80px" height="80px" borderRadius="50%" />
          <Skeleton width="40px" height="1rem" />
          <Skeleton width="80px" height="80px" borderRadius="50%" />
          <Skeleton width="40px" height="1rem" />
          <Skeleton width="80px" height="80px" borderRadius="50%" />
        </div>
      </div>
    </div>
  );
}

// Search bar skeleton
export function SearchSkeleton() {
  return (
    <div className="search-skeleton">
      <Skeleton width="100%" height="3rem" borderRadius="0.5rem" />
      <Skeleton width="150px" height="3rem" borderRadius="0.5rem" />
    </div>
  );
}
