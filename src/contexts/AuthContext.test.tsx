import { act, renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useContext, type FormEvent, type ReactNode } from 'react';
import { AuthProvider } from './AuthContext';
import { AuthContext } from './authContextTypes';
import { login } from '../api/auth/login';
import { userRegister } from '../api/auth/user-register';
import { fetchProfile } from '../api/auth/profile';
import { queryClient as sharedQueryClient } from '../api/queryClient';

vi.mock('../api/auth/login', () => ({
  login: vi.fn(),
  LoginRequestSchema: {
    safeParse: (data: { email: string; password: string }) => {
      const email = data.email.trim();
      if (!email.includes('@')) {
        return {
          success: false,
          error: { issues: [{ message: 'Некорректный email' }] },
        };
      }

      return {
        success: true,
        data: { email: email.toLowerCase(), password: data.password },
      };
    },
  },
}));

vi.mock('../api/auth/user-register', () => ({
  userRegister: vi.fn(),
  UserRequestSchema: {
    safeParse: (data: {
      email: string;
      password: string;
      confirmPassword: string;
      name: string;
      surname: string;
    }) => {
      const issues: Array<{ path: string[]; message: string }> = [];

      if (!data.email.includes('@')) {
        issues.push({ path: ['email'], message: 'Некорректный email' });
      }

      if (data.password.length < 8) {
        issues.push({ path: ['password'], message: 'Минимум 8 символов' });
      }

      if (data.password !== data.confirmPassword) {
        issues.push({ path: ['confirmPassword'], message: 'Пароли не совпадают' });
      }

      if (!data.name.trim()) {
        issues.push({ path: ['name'], message: 'Поле обязательно' });
      }

      if (!data.surname.trim()) {
        issues.push({ path: ['surname'], message: 'Поле обязательно' });
      }

      if (issues.length > 0) {
        return {
          success: false,
          error: { issues },
        };
      }

      return {
        success: true,
        data,
      };
    },
  },
}));

vi.mock('../api/auth/profile', () => ({
  fetchProfile: vi.fn(),
}));

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
      mutations: {
        retry: false,
      },
    },
  });

  return ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>{children}</AuthProvider>
    </QueryClientProvider>
  );
};

describe('AuthContext', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    window.localStorage.clear();
    vi.mocked(fetchProfile).mockResolvedValue({
      favorites: [],
      name: 'Ivan',
      email: 'ivan@test.com',
      surname: 'Petrov',
    });
  });

  it('должен устанавливать loginError при невалидном логине и не вызывать login', async () => {
    const { result } = renderHook(() => useContext(AuthContext)!, {
      wrapper: createWrapper(),
    });

    act(() => {
      result.current.setEmail('wrong-email');
      result.current.setPassword('12345678');
    });

    act(() => {
      result.current.handleSubmit({
        preventDefault: vi.fn(),
      } as unknown as FormEvent<HTMLFormElement>);
    });

    await waitFor(() => {
      expect(result.current.loginError).toBeTruthy();
    });

    expect(login).not.toHaveBeenCalled();
  });

  it('должен устанавливать registerErrors при невалидной регистрации и не вызывать userRegister', async () => {
    const { result } = renderHook(() => useContext(AuthContext)!, {
      wrapper: createWrapper(),
    });

    act(() => {
      result.current.setEmail('wrong-email');
      result.current.setPassword('123');
      result.current.setConfirmPassword('456');
      result.current.setName('');
      result.current.setSurname('');
    });

    act(() => {
      result.current.handleRegisterSubmit({
        preventDefault: vi.fn(),
      } as unknown as FormEvent<HTMLFormElement>);
    });

    await waitFor(() => {
      expect(result.current.registerErrors.email).toBeTruthy();
      expect(result.current.registerErrors.password).toBeTruthy();
      expect(result.current.registerErrors.passwordConfirm).toBeTruthy();
    });

    expect(userRegister).not.toHaveBeenCalled();
  });

  it('должен сбрасывать modalType и ошибки через closeModal', async () => {
    const { result } = renderHook(() => useContext(AuthContext)!, {
      wrapper: createWrapper(),
    });

    act(() => {
      result.current.setModalType('login');
      result.current.setEmail('wrong-email');
      result.current.setPassword('12345678');
    });

    act(() => {
      result.current.handleSubmit({
        preventDefault: vi.fn(),
      } as unknown as FormEvent<HTMLFormElement>);
    });

    await waitFor(() => {
      expect(result.current.loginError).toBeTruthy();
    });

    act(() => {
      result.current.closeModal();
    });

    expect(result.current.modalType).toBeNull();
    expect(result.current.loginError).toBeNull();
    expect(result.current.registerErrors).toEqual({});
  });

  it('должен очищать localStorage и query cache через logoutLocal', () => {
    const removeQueriesSpy = vi.spyOn(sharedQueryClient, 'removeQueries');
    const setQueryDataSpy = vi.spyOn(sharedQueryClient, 'setQueryData');

    window.localStorage.setItem('userName', 'ivan@test.com');

    const { result } = renderHook(() => useContext(AuthContext)!, {
      wrapper: createWrapper(),
    });

    act(() => {
      result.current.logoutLocal();
    });

    expect(window.localStorage.getItem('userName')).toBeNull();
    expect(removeQueriesSpy).toHaveBeenCalledWith({ queryKey: ['profile'] });
    expect(removeQueriesSpy).toHaveBeenCalledWith({ queryKey: ['favorites'] });
    expect(setQueryDataSpy).toHaveBeenCalledWith(['profile'], null);
  });
});
