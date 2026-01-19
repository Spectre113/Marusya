import { useState } from 'react';
import { type FavoriteMovie } from '../../api/favorites/favorites';
import './FavoriteItem.css';

interface FavoriteItemProps {
  movie: FavoriteMovie;
  onRemove: (movieId: number) => void;
}

export const FavoriteItem = ({ movie, onRemove }: FavoriteItemProps) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <li
      className="favorite-item"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="favorite-item__poster-wrapper">
        {movie.posterUrl ? (
          <img
            src={movie.posterUrl}
            alt={movie.title}
            className="favorite-item__poster"
          />
        ) : (
          <div className="favorite-item__poster favorite-item__poster--fallback" />
        )}
        {isHovered && (
          <button
            className="favorite-item__remove"
            onClick={() => onRemove(movie.id)}
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
      <h3 className="favorite-item__title">{movie.title}</h3>
      {movie.relaseYear && (
        <p className="favorite-item__year">{movie.relaseYear}</p>
      )}
    </li>
  );
};

