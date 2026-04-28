import { fireEvent, render, screen } from '@testing-library/react';
import type { FormEvent } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { LogIn } from './Login';

vi.mock('../Link/linkIcons', () => ({
  Logo: () => <div data-testid="logo">Logo</div>,
}));

describe('LogIn', () => {
  it('должен рендерить поля и отправлять форму', () => {
    const onSubmit = vi.fn((e: FormEvent<HTMLFormElement>) => e.preventDefault());

    const { container } = render(
      <LogIn
        email={{
          placeholder: 'Email',
          type: 'email',
          icoPath: <span>@</span>,
          onChange: vi.fn(),
          value: '',
        }}
        password={{
          placeholder: 'Password',
          type: 'password',
          icoPath: <span>*</span>,
          onChange: vi.fn(),
          value: '',
        }}
        entry={{
          title: 'Войти',
          type: 'submit',
        }}
        registerButton={{
          title: 'Регистрация',
          onClick: vi.fn(),
        }}
        onSubmit={onSubmit}
      />
    );

    expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();

    fireEvent.submit(container.querySelector('form')!);

    expect(onSubmit).toHaveBeenCalledTimes(1);
  });

  it('должен вызывать обработчик кнопки регистрации', () => {
    const onRegisterClick = vi.fn();

    render(
      <LogIn
        email={{
          placeholder: 'Email',
          type: 'email',
          icoPath: <span>@</span>,
          onChange: vi.fn(),
          value: '',
        }}
        password={{
          placeholder: 'Password',
          type: 'password',
          icoPath: <span>*</span>,
          onChange: vi.fn(),
          value: '',
        }}
        entry={{
          title: 'Войти',
          type: 'submit',
        }}
        registerButton={{
          title: 'Регистрация',
          onClick: onRegisterClick,
        }}
        onSubmit={vi.fn()}
      />
    );

    fireEvent.click(screen.getByText('Регистрация'));

    expect(onRegisterClick).toHaveBeenCalledTimes(1);
  });
});
