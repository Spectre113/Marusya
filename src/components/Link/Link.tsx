import type { ReactNode } from 'react';
import './Link.css';

export interface LinkProps {
  value?: string;
  path: string;
  current?: boolean;
  variant?: 'default' | 'footer' | 'logo';
  imagePath?: ReactNode;
  ariaLabel?: string;
}

export const Link = ({
  value,
  path,
  current,
  imagePath,
  variant = 'default',
  ariaLabel,
}: LinkProps) => {
  if (variant === 'default') {
    return (
      <a href={path} className={`header-link${current ? ' header-link--selected' : ''}`}>
        {value}
      </a>
    );
  }

  if (variant === 'footer') {
    return (
      <a href={path} className="footer-link" aria-label={ariaLabel}>
        {imagePath ?? value}
      </a>
    );
  }

  return (
    <a href={path} className="header-logo" aria-label={ariaLabel}>
      {imagePath ?? value}
    </a>
  );
};
