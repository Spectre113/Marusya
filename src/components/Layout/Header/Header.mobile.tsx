import { Link } from '../../Link/Link';
import { Logo } from '../../Link/linkIcons';
import { Search } from '../../Search/Search';
import { type HeaderProps } from './Header.types';
import { GenresIco, SearchIco, UserIco } from '../../Link/linkIcons';
import './Header.css';

export const HeaderMobile = ({
  search,
  searchResult,
  searchWrapperRef,
  isSearchOpen,
  onSearchOpen,
  onSearchClose,
  button,
}: HeaderProps) => {
  return (
    <header className="header">
      <div className="flex container">
        <div className="header__logo-block">
          <Link variant="logo" ariaLabel="logo" path="/" imagePath={<Logo />} />
        </div>
        <nav className="flex header__nav--mobile">
          <Link variant="logo" ariaLabel="genres" path="/genres" imagePath={<GenresIco />} />
          <button className="btn-reset header__search--mobile" onClick={onSearchOpen}>
            <SearchIco />
          </button>
          {isSearchOpen && (
            <div className="flex mobile-search-overlay">
              <div className="mobile-search" ref={searchWrapperRef}>
                <Search value={search.value} onChange={search.onChange} onClose={onSearchClose} />
                {searchResult}
              </div>
            </div>
          )}
          <button className="btn-reset header__log--mobile" onClick={button.onClick}>
            <UserIco />
          </button>
        </nav>
      </div>
    </header>
  );
};
