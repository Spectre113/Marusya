import { createContext } from 'react';
import type { useQuery } from '@tanstack/react-query';
import type { ProfileResponse } from '../api/auth/profile';

export type ModalType = 'login' | 'register' | null;

export interface AuthContextType {
  // Profile
  profileQuery: ReturnType<typeof useQuery<ProfileResponse>>;
  userName: string | null;

  // Modal
  modalType: ModalType;
  setModalType: (type: ModalType) => void;

  // Form fields
  email: string;
  name: string;
  surname: string;
  password: string;
  passwordConfirm: string;
  setEmail: (value: string) => void;
  setName: (value: string) => void;
  setSurname: (value: string) => void;
  setPassword: (value: string) => void;
  setConfirmPassword: (value: string) => void;

  // Errors
  loginError: string | null;
  registerErrors: {
    email?: string;
    name?: string;
    surname?: string;
    password?: string;
    passwordConfirm?: string;
  };

  // Handlers
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  handleRegisterSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  handleEmailChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleNameChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSurnameChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handlePasswordChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handlePasswordConfirmChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  closeModal: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);
