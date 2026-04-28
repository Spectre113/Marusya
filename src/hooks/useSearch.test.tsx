import { act, render, renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { beforeEach, describe, expect, it, vi, type Mock } from 'vitest';
import type { ChangeEvent, MutableRefObject, ReactNode } from 'react';
import { useSearch } from './useSearch';
import { fetchMoviesList } from '../api/movies/movies';

vi.mock('./useDebounce', () => ({
  useDebounce: (value: string) => value,
}));

vi.mock('../api/movies/movies', () => ({
  fetchMoviesList: vi.fn(),
}));

vi.mock('../components/SearchList/SearchList', () => ({
  SearchList: ({
    isLoading,
    movies,
  }: {
    isLoading?: boolean;
    movies?: Array<{ id: number; title: string }>;
  }) => (
    <div data-testid="search-list">
      {isLoading ? 'loading' : `movies:${movies?.length ?? 0}`}
    </div>
  ),
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

describe('useSearch', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('должен возвращать начальное состояние', () => {
    const { result } = renderHook(() => useSearch(), {
      wrapper: createWrapper(),
    });

    expect(result.current.term).toBe('');
    expect(result.current.isSearchOpen).toBe(false);
    expect(result.current.searchResults).toBeNull();
  });

  it('должен открывать поиск и загружать результаты при вводе', async () => {
    const fetchMoviesListMock = fetchMoviesList as Mock;
    fetchMoviesListMock.mockResolvedValue([{ id: 1, title: 'Movie 1' }]);

    const { result } = renderHook(() => useSearch(), {
      wrapper: createWrapper(),
    });

    act(() => {
      result.current.handleSearchChange({
        target: { value: 'batman' },
      } as ChangeEvent<HTMLInputElement>);
    });

    expect(result.current.term).toBe('batman');
    expect(result.current.isSearchOpen).toBe(true);

    await waitFor(() => {
      expect(fetchMoviesListMock).toHaveBeenCalledWith({ title: 'batman' });
    });

    await waitFor(() => {
      expect(result.current.searchQuery.status).toBe('success');
    });

    const { getByTestId } = render(<>{result.current.searchResults}</>);
    expect(getByTestId('search-list')).toHaveTextContent('movies:1');
  });

  it('должен закрывать поиск при клике вне searchRef', async () => {
    const { result } = renderHook(() => useSearch(), {
      wrapper: createWrapper(),
    });

    act(() => {
      result.current.setIsSearchOpen(true);
    });

    const insideElement = document.createElement('div');
    document.body.appendChild(insideElement);

    (result.current.searchRef as MutableRefObject<HTMLDivElement | null>).current =
      insideElement as HTMLDivElement;

    const outsideElement = document.createElement('button');
    document.body.appendChild(outsideElement);

    act(() => {
      outsideElement.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
    });

    await waitFor(() => {
      expect(result.current.isSearchOpen).toBe(false);
    });
  });

  it('должен показывать ошибку при неудачном запросе', async () => {
    const fetchMoviesListMock = fetchMoviesList as Mock;
    fetchMoviesListMock.mockRejectedValue(new Error('Failed'));

    const { result } = renderHook(() => useSearch(), {
      wrapper: createWrapper(),
    });

    act(() => {
      result.current.handleSearchChange({
        target: { value: 'error' },
      } as ChangeEvent<HTMLInputElement>);
    });

    await waitFor(() => {
      expect(result.current.searchQuery.status).toBe('error');
    });

    const { container } = render(<>{result.current.searchResults}</>);
    expect(container.querySelector('.search__error')).not.toBeNull();
  });
});
