import { renderHook, act } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { useDevice } from './useDevice';

describe('useDevice', () => {
  it('должен возвращать правильные значения для мобильных устройств', () => {
    window.innerWidth = 500;

    const { result } = renderHook(() => useDevice());

    expect(result.current.isMobile).toBe(true);
    expect(result.current.isSmallScreen).toBe(true);
    expect(result.current.width).toBe(500);
  });

  it('должен возвращать правильные значения для десктопа', () => {
    window.innerWidth = 1920;
    const { result } = renderHook(() => useDevice());

    expect(result.current.isMobile).toBe(false);
    expect(result.current.isSmallScreen).toBe(false);
  });

  it('должен обновлять значения при изменении размера окна (resize)', () => {
    window.innerWidth = 1920;
    const { result } = renderHook(() => useDevice());

    act(() => {
      window.innerWidth = 1000;
      window.dispatchEvent(new Event('resize'));
    });

    expect(result.current.width).toBe(1000);
    expect(result.current.isMobile).toBe(true);
    expect(result.current.isSmallScreen).toBe(false);
  });
});
