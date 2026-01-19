import type { Movie } from '../../api/movies/movies';
import { Rating } from '../Rating/Rating';
import './SearchItem.css';

export interface SearchItemProps {
  movie: Movie;
  onClick?: (id: number) => void;
}

export const SearchItem = ({ movie, onClick }: SearchItemProps) => {
  return (
    <li className="flex search__item" onClick={() => onClick?.(movie.id)}>
      <div className="search__poster-block">
        {movie.posterUrl ? (
          <img src={movie.posterUrl} className="search__poster" alt="poster" />
        ) : (
          <div className="search__poster-fallback" />
        )}
      </div>
      <div className="search__film-info">
        <div className="flex search__main-info">
          <Rating value={movie.tmdbRating} size="small" />
          {movie.releaseDate && (
            <span className="search__data search__date">{movie.releaseDate.split('-')[0]}</span>
          )}
          {movie.genres?.[0] && (
            <span className="search__data search__genre">{movie.genres[0]}</span>
          )}
          <span className="search__data search__duration">{movie.runtime}m</span>
        </div>
        <h3 className="search__title">{movie.title}</h3>
      </div>
    </li>
  );
};
