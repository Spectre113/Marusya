import type { ChangeEvent, ReactNode } from 'react';
import './Input.css';

export interface InputProps {
  placeholder?: string;
  icoPath: ReactNode;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  theme?: 'dark' | 'light';
  value: string;
  type?: 'text' | 'email' | 'password';
  error?: string;
}

export const Input = ({
  type,
  placeholder,
  icoPath,
  onChange,
  theme = 'dark',
  value,
  error,
}: InputProps) => {
  const hasError = !!error;
  
  return (
    <div className="input-container">
      <label
        className={`flex input-wrapper ${hasError ? 'input-wrapper--error' : ''}`}
        data-theme={theme}
      >
        <span className={`flex input-wrapper__ico ${hasError ? 'input-wrapper__ico--error' : ''}`}>
          {icoPath}
        </span>
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="input-wrapper__item"
        />
      </label>
      {hasError && <div className="input-error">{error}</div>}
    </div>
  );
};
