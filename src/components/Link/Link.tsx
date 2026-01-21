import type { ReactNode } from 'react';
import { Link as RouterLink, NavLink } from 'react-router-dom';
import './Link.css';

export interface LinkProps {
  value?: string;
  path: string;
  current?: boolean;
  variant?: 'default' | 'footer' | 'logo';
  imagePath?: ReactNode;
  ariaLabel?: string;
  external?: boolean;
}

export const Link = ({
  value,
  path,
  current,
  imagePath,
  variant = 'default',
  ariaLabel,
  external = false,
}: LinkProps) => {
  if (external) {
    return (
      <a
        href={path}
        className={getClassName(variant, current)}
        aria-label={ariaLabel}
        target="_blank"
        rel="noopener noreferrer"
      >
        {imagePath ?? value}
      </a>
    );
  }

  if (variant === 'default') {
    return (
      <NavLink
        to={path}
        className={({ isActive }) =>
          `header-link${isActive || current ? ' header-link--selected' : ''}`
        }
      >
        {value}
      </NavLink>
    );
  }

  return (
    <RouterLink to={path} className={getClassName(variant, current)} aria-label={ariaLabel}>
      {imagePath ?? value}
    </RouterLink>
  );
};

const getClassName = (variant: string, current?: boolean) => {
  switch (variant) {
    case 'footer':
      return 'footer-link';
    case 'logo':
      return 'header-logo';
    default:
      return `header-link${current ? ' header-link--selected' : ''}`;
  }
};
