import { useState } from 'react';
import type { Movie } from '../../api/movies/movies';
import './MovieCard.css';

export interface MovieCardProps {
  movie: Movie;
  variant?: 'default' | 'top';
  showGenre?: boolean;
  position?: number;
  onClick?: () => void;
  onRemove?: (movieId: number) => void;
}

export const MovieCard = ({
  movie,
  variant = 'default',
  showGenre = true,
  position,
  onClick,
  onRemove,
}: MovieCardProps) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <li
      className="movie-background"
      data-variant={variant}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex movie-card" onClick={onClick} data-variant={variant}>
        {movie.posterUrl ? (
          <img
            src={movie.posterUrl}
            alt="Movie poster"
            className="movie-card__poster"
            data-variant={variant}
          />
        ) : (
          <div className="movie-card__poster movie-card__poster--fallback" data-variant={variant} />
        )}
        {showGenre && variant !== 'top' && variant !== 'default' && movie.genres?.[0] && (
          <span className="movie-card__genre">{movie.genres[0]}</span>
        )}
        {position !== undefined && (
          <div className="flex movie-card__position">
            <span className="movie-card__number">{position}</span>
          </div>
        )}
        {onRemove && isHovered && (
          <button
            className="movie-card__remove"
            onClick={(e) => {
              e.stopPropagation();
              onRemove(movie.id);
            }}
            aria-label="Удалить из избранного"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M18 6L6 18M6 6L18 18"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        )}
      </div>
    </li>
  );
};
