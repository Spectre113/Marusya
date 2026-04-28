import { act, renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { useToggle } from './useToggle';

describe('useToggle', () => {
  it('должен возвращать false по умолчанию', () => {
    const { result } = renderHook(() => useToggle());

    expect(result.current[0]).toBe(false);
  });

  it('должен принимать начальное значение', () => {
    const { result } = renderHook(() => useToggle(true));

    expect(result.current[0]).toBe(true);
  });

  it('должен переключать значение при вызове toggle', () => {
    const { result } = renderHook(() => useToggle());

    act(() => {
      result.current[1]();
    });

    expect(result.current[0]).toBe(true);

    act(() => {
      result.current[1]();
    });

    expect(result.current[0]).toBe(false);
  });
});
