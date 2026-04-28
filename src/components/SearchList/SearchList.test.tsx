import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { SearchList } from './SearchList';

const navigateMock = vi.fn();

vi.mock('react-router-dom', () => ({
  useNavigate: () => navigateMock,
}));

vi.mock('../Spinner/Spinner', () => ({
  Spinner: () => <div data-testid="spinner">Loading</div>,
}));

vi.mock('../SearchItem/SearchItem', () => ({
  SearchItem: ({
    movie,
    onClick,
  }: {
    movie: { id: number; title: string };
    onClick?: (id: number) => void;
  }) => (
    <button onClick={() => onClick?.(movie.id)}>{movie.title}</button>
  ),
}));

describe('SearchList', () => {
  it('должен показывать spinner во время загрузки', () => {
    render(<SearchList isLoading={true} />);

    expect(screen.getByTestId('spinner')).toBeInTheDocument();
  });

  it('должен рендерить список фильмов', () => {
    render(
      <SearchList
        movies={[
          { id: 1, title: 'Movie 1' },
          { id: 2, title: 'Movie 2' },
        ] as never}
      />
    );

    expect(screen.getByText('Movie 1')).toBeInTheDocument();
    expect(screen.getByText('Movie 2')).toBeInTheDocument();
  });

  it('должен переходить на страницу фильма при клике', () => {
    render(<SearchList movies={[{ id: 5, title: 'Movie 5' }] as never} />);

    fireEvent.click(screen.getByText('Movie 5'));

    expect(navigateMock).toHaveBeenCalledWith('/movie/5');
  });
});
