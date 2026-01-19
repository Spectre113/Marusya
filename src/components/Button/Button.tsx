import type { MouseEventHandler, ReactNode } from 'react';
import './Button.css';

export interface ButtonProps {
  title: string;
  variant?: 'primary' | 'secondary' | 'logIn';
  subclass?: 'bright' | 'dark';
  type?: 'button' | 'submit' | 'reset';
  width?: 'medium' | 'wide';
  onClick?: MouseEventHandler<HTMLButtonElement>;
  isDisabled?: boolean;
  isLog?: boolean;
  isAccountPage?: boolean;
  imageSvg?: ReactNode;
  className?: string;
}

export const Button = ({
  type,
  title,
  onClick,
  isDisabled,
  variant = 'primary',
  subclass = 'bright',
  width = 'medium',
  isLog = false,
  isAccountPage = false,
  imageSvg,
  className = '',
}: ButtonProps) => {
  return (
    <button
      className={`btn-reset flex button ${isLog ? 'button--disabled' : ''} ${isAccountPage ? 'header-link--selected' : ''} ${className}`}
      type={type}
      onClick={onClick}
      disabled={isDisabled}
      data-variant={variant}
      data-subclass={subclass}
      data-width={width}
    >
      {imageSvg && <span className="button__image">{imageSvg}</span>}
      {title}
    </button>
  );
};
