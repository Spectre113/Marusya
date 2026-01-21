import type { Movie } from '../../api/movies/movies';
import { Button } from '../Button/Button';
import { MovieCard } from '../MovieCard/MovieCard';
import { Loader } from '../Loader/Loader';
import './MoviesList.css';

export interface MoviesListProps {
  movies: Movie[];
  variant?: 'default' | 'top';
  showGenre?: boolean;
  onCardClick?: (id: number) => void;
  onRemove?: (movieId: number) => void;
  isLoading?: boolean;
  showLoadMore?: boolean;
  onLoadMore?: () => void;
  hasMore?: boolean;
}

export const MoviesList = ({
  movies,
  variant = 'top',
  showGenre = true,
  onCardClick,
  onRemove,
  isLoading,
  showLoadMore = false,
  onLoadMore,
  hasMore,
}: MoviesListProps) => {
  if (isLoading) return <Loader />;
  return (
    <div className="flex movies">
      <ul className="flex list-reset movies-list">
        {movies.map((movie, index) => (
          <MovieCard
            key={movie.id}
            movie={movie}
            variant={variant}
            showGenre={showGenre}
            position={variant === 'top' ? index + 1 : undefined}
            onClick={() => onCardClick?.(movie.id)}
            onRemove={onRemove}
          />
        ))}
      </ul>
      {showLoadMore && hasMore && (
        <div className="flex movies-list__more">
          <Button onClick={onLoadMore} title="Показать ещё" isLog={false} />
        </div>
      )}
    </div>
  );
};
