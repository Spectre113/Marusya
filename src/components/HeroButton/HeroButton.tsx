import type { MouseEventHandler, ReactNode } from 'react';
import './HeroButton.css';

export interface HeroButtonProps {
  isFavorite?: boolean;
  type?: 'favorite' | 'refresh';
  imagePath: ReactNode;
  onClick?: MouseEventHandler<HTMLButtonElement>;
}

export const HeroButton = ({
  isFavorite = false,
  imagePath,
  type = 'favorite',
  onClick,
}: HeroButtonProps) => {
  return (
    <button
      className={`btn-reset flex hero-button ${isFavorite && type === 'favorite' ? 'hero-button--active' : ''}`}
      onClick={onClick}
    >
      {imagePath}
    </button>
  );
};
