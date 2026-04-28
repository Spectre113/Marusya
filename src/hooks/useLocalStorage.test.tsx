import { renderHook, act, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useLocalStorage } from './useLocalStorage';

describe('useLocalStorage', () => {
  let store: Record<string, string>;

  beforeEach(() => {
    store = {};

    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: vi.fn((key: string) => store[key] ?? null),
        setItem: vi.fn((key: string, value: string) => {
          store[key] = value;
        }),
        removeItem: vi.fn((key: string) => {
          delete store[key];
        }),
        clear: vi.fn(() => {
          store = {};
        }),
      },
      writable: true,
      configurable: true,
    });
  });

  it('должен возвращать начальное значение, если в localStorage нет данных', () => {
    const { result } = renderHook(() => useLocalStorage('testKey', 'initialValue'));

    expect(result.current[0]).toBe('initialValue');
  });

  it('должен брать значение из localStorage, если оно там есть', () => {
    window.localStorage.setItem('testKey', JSON.stringify('storedValue'));

    const { result } = renderHook(() => useLocalStorage('testKey', 'initialValue'));

    expect(result.current[0]).toBe('storedValue');
  });

  it('должен сохранять новое значение в localStorage при его изменении', async () => {
    const { result } = renderHook(() => useLocalStorage('testKey', 'initialValue'));

    act(() => {
      result.current[1]('newValue');
    });

    await waitFor(() => {
      expect(window.localStorage.setItem).toHaveBeenCalledWith(
        'testKey',
        JSON.stringify('newValue')
      );
    });

    expect(result.current[0]).toBe('newValue');
    expect(window.localStorage.getItem('testKey')).toBe(JSON.stringify('newValue'));
  });
});
