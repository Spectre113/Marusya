import type { Movie } from '../../api/movies/movies';
import { SearchItem } from '../SearchItem/SearchItem';
import { Spinner } from '../Spinner/Spinner';
import './SearchList.css';

export interface SearchListProps {
  movies?: Movie[];
  onItemClick?: (id: number) => void;
  isLoading?: boolean;
}

export const SearchList = ({ movies, onItemClick, isLoading }: SearchListProps) => {
  if (isLoading) {
    return (
      <ul className="flex list-reset search__list">
        <Spinner />
      </ul>
    );
  }
  return (
    <ul className="list-reset search__list">
      {movies &&
        movies.map((movie) => (
          <SearchItem movie={movie} key={movie.id} onClick={() => onItemClick?.(movie.id)} />
        ))}
    </ul>
  );
};
