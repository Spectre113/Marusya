import { useInfiniteQuery } from '@tanstack/react-query';
import { fetchMoviesByGenre } from '../api/movies/movies';

const PAGE_SIZE = 15;

export const useMoviesByGenre = (genre: string) => {
  return useInfiniteQuery({
    queryKey: ['movies', 'genre', genre],
    queryFn: ({ pageParam = 1 }) => fetchMoviesByGenre(genre, pageParam, PAGE_SIZE),

    initialPageParam: 1,

    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.length < PAGE_SIZE) {
        return undefined;
      }

      return allPages.length + 1;
    },
  });
};
