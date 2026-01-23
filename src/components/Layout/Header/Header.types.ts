import type { LinkProps } from '../../Link/Link';
import type { SearchProps } from '../../Search/Search';
import type { ButtonProps } from '../../Button/Button';
import type { ReactNode, RefObject } from 'react';

export interface HeaderProps {
  links: LinkProps[];
  search: SearchProps;
  button: ButtonProps;
  searchResult?: ReactNode;
  searchWrapperRef?: RefObject<HTMLDivElement | null>;
  onMenuClick?: () => void;
  isMenuOpen?: boolean;
  isSearchOpen?: boolean;
  onSearchOpen?: () => void;
  onSearchClose?: () => void;
}
