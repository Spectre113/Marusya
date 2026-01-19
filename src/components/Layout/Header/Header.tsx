import type { ReactNode, RefObject } from 'react';
import { Button, type ButtonProps } from '../../Button/Button';
import { Link, type LinkProps } from '../../Link/Link';
import { Logo } from '../../Link/linkIcons';
import { Search, type SearchProps } from '../../Search/Search';
import './Header.css';

export interface HeaderProps {
  links: LinkProps[];
  search: SearchProps;
  button: ButtonProps;
  searchResult?: ReactNode;
  searchWrapperRef?: RefObject<HTMLDivElement | null>;
}

export const Header = ({ links, search, button, searchResult, searchWrapperRef }: HeaderProps) => {
  return (
    <header className="header">
      <div className="flex container">
        <div className="header__logo-block">
          <Link variant="logo" ariaLabel="logo" path="/" imagePath={<Logo />} />
        </div>
        <div className="flex header__middle">
          <nav className="flex header__nav">
            {links.map((link) => (
              <Link key={link.path} {...link} />
            ))}
          </nav>
          <div className="header__search" ref={searchWrapperRef}>
            <Search value={search.value} onChange={search.onChange} />
            {searchResult}
          </div>
        </div>
        <div className="header__log">
          <Button 
            title={button.title} 
            variant="logIn" 
            onClick={button.onClick}
            isAccountPage={button.isAccountPage}
          />
        </div>
      </div>
    </header>
  );
};
