import { useEffect, useRef, useState, type ReactNode } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchMoviesList } from '../api/movies/movies';
import { useDebounce } from './useDebounce';
import { SearchList } from '../components/SearchList/SearchList';

export const useSearch = () => {
  const [term, setTerm] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  const debouncedTerm = useDebounce(term, 400);

  const searchQuery = useQuery({
    queryKey: ['moviesList', debouncedTerm],
    queryFn: () => fetchMoviesList({ title: debouncedTerm }),
    enabled: debouncedTerm.trim().length > 0,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    const onClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setIsSearchOpen(false);
      }
    };
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTerm(e.target.value);
    setIsSearchOpen(true);
  };

  const renderSearchResults = (): ReactNode => {
    if (!isSearchOpen || debouncedTerm.trim().length === 0) {
      return null;
    }

    switch (searchQuery.status) {
      case 'pending':
        return <SearchList isLoading={true} />;
      case 'success':
        return <SearchList movies={searchQuery.data} onItemClick={(id) => console.log(id)} />;
      case 'error':
        return <span className="search__error">Произошла ошибка</span>;
      default:
        return null;
    }
  };

  return {
    term,
    setTerm,
    isSearchOpen,
    setIsSearchOpen,
    searchRef,
    searchQuery,
    handleSearchChange,
    searchResults: renderSearchResults(),
  };
};
