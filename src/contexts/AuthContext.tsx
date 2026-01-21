import React, { useMemo, useState, type ReactNode } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { login, LoginRequestSchema } from '../api/auth/login';
import { userRegister, UserRequestSchema } from '../api/auth/user-register';
import { fetchProfile, type ProfileResponse } from '../api/auth/profile';
import { ZodError } from 'zod';
import { AuthContext, type AuthContextType, type ModalType } from './authContextTypes';
import { queryClient } from '../api/queryClient';

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [modalType, setModalType] = useState<ModalType>(null);

  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setConfirmPassword] = useState('');

  const [loginError, setLoginError] = useState<string | null>(null);
  const [registerErrors, setRegisterErrors] = useState<{
    email?: string;
    name?: string;
    surname?: string;
    password?: string;
    passwordConfirm?: string;
  }>({});

  const [hasStoredUserName, setHasStoredUserName] = useState(() => !!localStorage.getItem('userName'));

  const profileQuery = useQuery<ProfileResponse>({
    queryKey: ['profile'],
    queryFn: fetchProfile,
    retry: false,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    enabled: hasStoredUserName,
    staleTime: 5 * 60 * 1000,
  });

  const userName = useMemo(() => {
    if (profileQuery.status === 'success' && profileQuery.data) {
      const nameValue = profileQuery.data.name || profileQuery.data.email;
      localStorage.setItem('userName', nameValue);
      return nameValue;
    }
    if (profileQuery.status === 'error') {
      const storedName = localStorage.getItem('userName');
      if (profileQuery.error instanceof Error && profileQuery.error.message === 'Unauthorized') {
        localStorage.removeItem('userName');
        return null;
      }
      return storedName;
    }
    return hasStoredUserName ? localStorage.getItem('userName') : null;
  }, [profileQuery.status, profileQuery.data, profileQuery.error, hasStoredUserName]);

  const loginMutation = useMutation({
    mutationFn: login,
    onError: (err) => {
      if (err instanceof ZodError) {
        setLoginError(err.issues[0]?.message ?? 'Неверные данные');
      } else {
        setLoginError(err instanceof Error ? err.message : 'Ошибка авторизации');
      }
    },
    onSuccess: () => {
      setModalType(null);
      if (email) {
        localStorage.setItem('userName', email);
        setHasStoredUserName(true);
      }
      profileQuery.refetch();
    },
  });

  const registerMutation = useMutation({
    mutationFn: userRegister,
    onError: (err) => {
      const errors: {
        email?: string;
        name?: string;
        surname?: string;
        password?: string;
        passwordConfirm?: string;
      } = {};

      if (err instanceof ZodError) {
        err.issues.forEach((issue) => {
          const path = issue.path[0] as string;
          if (path === 'confirmPassword') {
            errors.passwordConfirm = issue.message;
          } else if (path && ['email', 'name', 'surname', 'password'].includes(path)) {
            errors[path as keyof typeof errors] = issue.message;
          }
        });
      } else {
        errors.email = err instanceof Error ? err.message : 'Ошибка регистрации';
      }

      setRegisterErrors(errors);
    },
    onSuccess: () => {
      setModalType('login');
      setRegisterErrors({});
    },
  });

  const handleRegisterSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const parsed = UserRequestSchema.safeParse({
      email,
      password,
      confirmPassword: passwordConfirm,
      name,
      surname,
    });

    if (!parsed.success) {
      const errors: {
        email?: string;
        name?: string;
        surname?: string;
        password?: string;
        passwordConfirm?: string;
      } = {};

      parsed.error.issues.forEach((issue) => {
        const path = issue.path[0] as string;
        if (path === 'confirmPassword') {
          errors.passwordConfirm = issue.message;
        } else if (path && ['email', 'name', 'surname', 'password'].includes(path)) {
          errors[path as keyof typeof errors] = issue.message;
        }
      });

      setRegisterErrors(errors);
      return;
    }

    setRegisterErrors({});

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { confirmPassword, ...dataToSend } = parsed.data;

    registerMutation.mutate(dataToSend);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const parsed = LoginRequestSchema.safeParse({ email, password });
    if (!parsed.success) {
      setLoginError(parsed.error.issues[0]?.message ?? 'Неверные данные');
      return;
    }
    setLoginError(null);
    loginMutation.mutate(parsed.data);
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (registerErrors.email) {
      setRegisterErrors((prev) => ({ ...prev, email: undefined }));
    }
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
    if (registerErrors.name) {
      setRegisterErrors((prev) => ({ ...prev, name: undefined }));
    }
  };

  const handleSurnameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSurname(e.target.value);
    if (registerErrors.surname) {
      setRegisterErrors((prev) => ({ ...prev, surname: undefined }));
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    if (registerErrors.password) {
      setRegisterErrors((prev) => ({ ...prev, password: undefined }));
    }
    if (registerErrors.passwordConfirm) {
      setRegisterErrors((prev) => ({ ...prev, passwordConfirm: undefined }));
    }
  };

  const handlePasswordConfirmChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConfirmPassword(e.target.value);
    if (registerErrors.passwordConfirm) {
      setRegisterErrors((prev) => ({ ...prev, passwordConfirm: undefined }));
    }
  };

  const closeModal = () => {
    setModalType(null);
    setLoginError(null);
    setRegisterErrors({});
  };

  const logoutLocal = () => {
    localStorage.removeItem('userName');
    setHasStoredUserName(false);
    queryClient.removeQueries({ queryKey: ['profile'] });
    queryClient.removeQueries({ queryKey: ['favorites'] });
    queryClient.setQueryData(['profile'], null);
  };

  const value: AuthContextType = {
    profileQuery,
    userName,
    modalType,
    setModalType,
    email,
    name,
    surname,
    password,
    passwordConfirm,
    setEmail,
    setName,
    setSurname,
    setPassword,
    setConfirmPassword,
    loginError,
    registerErrors,
    handleSubmit,
    handleRegisterSubmit,
    handleEmailChange,
    handleNameChange,
    handleSurnameChange,
    handlePasswordChange,
    handlePasswordConfirmChange,
    closeModal,
    logoutLocal,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
