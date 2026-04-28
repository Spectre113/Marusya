import { fireEvent, render, screen } from '@testing-library/react';
import type { FormEvent } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { RegisterForm } from './RegisterForm';

vi.mock('../Link/linkIcons', () => ({
  Logo: () => <div data-testid="logo">Logo</div>,
}));

describe('RegisterForm', () => {
  it('должен рендерить все поля формы', () => {
    render(
      <RegisterForm
        email={{ placeholder: 'Email', type: 'email', icoPath: <span>@</span>, onChange: vi.fn(), value: '' }}
        name={{ placeholder: 'Name', type: 'text', icoPath: <span>N</span>, onChange: vi.fn(), value: '' }}
        surname={{ placeholder: 'Surname', type: 'text', icoPath: <span>S</span>, onChange: vi.fn(), value: '' }}
        password={{ placeholder: 'Password', type: 'password', icoPath: <span>P</span>, onChange: vi.fn(), value: '' }}
        passConfirm={{ placeholder: 'Confirm password', type: 'password', icoPath: <span>C</span>, onChange: vi.fn(), value: '' }}
        registerButton={{ title: 'Создать аккаунт', type: 'submit' }}
        onSubmit={vi.fn()}
      />
    );

    expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Name')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Surname')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Confirm password')).toBeInTheDocument();
  });

  it('должен отправлять форму', () => {
    const onSubmit = vi.fn((e: FormEvent<HTMLFormElement>) => e.preventDefault());

    const { container } = render(
      <RegisterForm
        email={{ placeholder: 'Email', type: 'email', icoPath: <span>@</span>, onChange: vi.fn(), value: '' }}
        name={{ placeholder: 'Name', type: 'text', icoPath: <span>N</span>, onChange: vi.fn(), value: '' }}
        surname={{ placeholder: 'Surname', type: 'text', icoPath: <span>S</span>, onChange: vi.fn(), value: '' }}
        password={{ placeholder: 'Password', type: 'password', icoPath: <span>P</span>, onChange: vi.fn(), value: '' }}
        passConfirm={{ placeholder: 'Confirm password', type: 'password', icoPath: <span>C</span>, onChange: vi.fn(), value: '' }}
        registerButton={{ title: 'Создать аккаунт', type: 'submit' }}
        onSubmit={onSubmit}
      />
    );

    fireEvent.submit(container.querySelector('form')!);

    expect(onSubmit).toHaveBeenCalledTimes(1);
  });
});
