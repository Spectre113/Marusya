import { renderHook, act, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { beforeEach, describe, expect, it, vi, type Mock } from 'vitest';
import type { ReactNode } from 'react';
import { useFavorites } from './useFavorites';
import { useAuth } from './useAuth';
import { addToFavorites, deleteFromFavorites } from '../api/favorites/favorites';

vi.mock('./useAuth', () => ({
  useAuth: vi.fn(),
}));

vi.mock('../api/favorites/favorites', () => ({
  addToFavorites: vi.fn(),
  deleteFromFavorites: vi.fn(),
}));

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe('useFavorites', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('должен открывать модалку логина, если пользователь не авторизован', () => {
    const setModalTypeMock = vi.fn();
    const useAuthMock = useAuth as Mock;

    useAuthMock.mockReturnValue({
      profileQuery: {
        data: null,
      },
      setModalType: setModalTypeMock,
    });

    const { result } = renderHook(() => useFavorites(), {
      wrapper: createWrapper(),
    });

    act(() => {
      result.current.handleToggleFavorite(123);
    });

    expect(setModalTypeMock).toHaveBeenCalledWith('login');
  });

  it('должен вызывать удаление, если фильм уже в избранном', async () => {
    const refetchMock = vi.fn();
    const setModalTypeMock = vi.fn();
    const useAuthMock = useAuth as Mock;
    const deleteMock = deleteFromFavorites as Mock;

    deleteMock.mockResolvedValue({ favorites: [] });

    useAuthMock.mockReturnValue({
      profileQuery: {
        data: {
          favorites: ['123'],
          name: 'Ivan',
          email: 'ivan@test.com',
          surname: 'Petrov',
        },
        refetch: refetchMock,
      },
      setModalType: setModalTypeMock,
    });

    const { result } = renderHook(() => useFavorites(), {
      wrapper: createWrapper(),
    });

    act(() => {
      result.current.handleToggleFavorite(123);
    });

    await waitFor(() => {
      expect(deleteMock).toHaveBeenCalledTimes(1);
    });

    expect(deleteMock.mock.calls[0][0]).toBe(123);
    expect(setModalTypeMock).not.toHaveBeenCalled();
  });

  it('должен вызывать добавление, если фильма нет в избранном', async () => {
    const refetchMock = vi.fn();
    const setModalTypeMock = vi.fn();
    const useAuthMock = useAuth as Mock;
    const addMock = addToFavorites as Mock;

    addMock.mockResolvedValue({ favorites: ['123'] });

    useAuthMock.mockReturnValue({
      profileQuery: {
        data: {
          favorites: [],
          name: 'Ivan',
          email: 'ivan@test.com',
          surname: 'Petrov',
        },
        refetch: refetchMock,
      },
      setModalType: setModalTypeMock,
    });

    const { result } = renderHook(() => useFavorites(), {
      wrapper: createWrapper(),
    });

    act(() => {
      result.current.handleToggleFavorite(123);
    });

    await waitFor(() => {
      expect(addMock).toHaveBeenCalledTimes(1);
    });

    expect(addMock.mock.calls[0][0]).toEqual({
      id: '123',
      name: 'Ivan',
      email: 'ivan@test.com',
      surname: 'Petrov',
    });
    expect(setModalTypeMock).not.toHaveBeenCalled();
  });
});
