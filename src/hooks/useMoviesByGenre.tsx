import { useInfiniteQuery } from '@tanstack/react-query';
import { fetchMoviesByGenre } from '../api/movies/movies';

export const useMoviesByGenre = (genre: string, pageSize: number) => {
  return useInfiniteQuery({
    queryKey: ['movies', 'genre', genre, pageSize],
    queryFn: ({ pageParam = 1 }) => fetchMoviesByGenre(genre, pageParam, pageSize),

    initialPageParam: 1,

    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.length < pageSize) {
        return undefined;
      }
      return allPages.length + 1;
    },
  });
};
