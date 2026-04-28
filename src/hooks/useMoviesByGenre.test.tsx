import { act, renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { beforeEach, describe, expect, it, vi, type Mock } from 'vitest';
import type { ReactNode } from 'react';
import { useMoviesByGenre } from './useMoviesByGenre';
import { fetchMoviesByGenre } from '../api/movies/movies';

vi.mock('../api/movies/movies', () => ({
  fetchMoviesByGenre: vi.fn(),
}));

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  return ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe('useMoviesByGenre', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('должен запрашивать фильмы по жанру с первой страницы', async () => {
    const fetchMoviesByGenreMock = fetchMoviesByGenre as Mock;
    fetchMoviesByGenreMock.mockResolvedValue([{ id: 1 }, { id: 2 }]);

    const { result } = renderHook(() => useMoviesByGenre('comedy', 2), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.status).toBe('success');
    });

    expect(fetchMoviesByGenreMock).toHaveBeenCalledWith('comedy', 1, 2);
  });

  it('должен загружать следующую страницу, если последняя страница полная', async () => {
    const fetchMoviesByGenreMock = fetchMoviesByGenre as Mock;
    fetchMoviesByGenreMock
      .mockResolvedValueOnce([{ id: 1 }, { id: 2 }])
      .mockResolvedValueOnce([{ id: 3 }, { id: 4 }]);

    const { result } = renderHook(() => useMoviesByGenre('action', 2), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.status).toBe('success');
    });

    await act(async () => {
      await result.current.fetchNextPage();
    });

    await waitFor(() => {
      expect(fetchMoviesByGenreMock).toHaveBeenCalledTimes(2);
    });

    expect(fetchMoviesByGenreMock.mock.calls[1]).toEqual(['action', 2, 2]);
  });

  it('не должен иметь следующую страницу, если последняя страница короче pageSize', async () => {
    const fetchMoviesByGenreMock = fetchMoviesByGenre as Mock;
    fetchMoviesByGenreMock.mockResolvedValue([{ id: 1 }]);

    const { result } = renderHook(() => useMoviesByGenre('drama', 2), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.status).toBe('success');
    });

    expect(result.current.hasNextPage).toBe(false);
  });
});
