import type { MouseEventHandler } from 'react';
import './MenuItem.css';

export interface MenuItemProps {
  title: string;
  type?: 'desktop' | 'mobile';
  onClick?: MouseEventHandler<HTMLButtonElement>;
  active: boolean;
}

export const MenuItem = ({ title, type = 'desktop', onClick, active }: MenuItemProps) => {
  return (
    <button
      className={`btn-reset flex menu__item ${active ? 'menu__item--active' : ''}`}
      onClick={onClick}
      data-type={type}
    >
      {title}
    </button>
  );
};
