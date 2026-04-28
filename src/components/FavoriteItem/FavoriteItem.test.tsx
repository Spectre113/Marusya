import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { FavoriteItem } from './FavoriteItem';

const movie = {
  id: 7,
  title: 'Favorite movie',
  posterUrl: 'poster.jpg',
  relaseYear: 2024,
} as never;

describe('FavoriteItem', () => {
  it('должен рендерить заголовок и год', () => {
    render(<FavoriteItem movie={movie} onRemove={vi.fn()} />);

    expect(screen.getByText('Favorite movie')).toBeInTheDocument();
    expect(screen.getByText('2024')).toBeInTheDocument();
  });

  it('должен показывать кнопку удаления по hover и вызывать onRemove', () => {
    const onRemove = vi.fn();

    render(<FavoriteItem movie={movie} onRemove={onRemove} />);

    const item = screen.getByText('Favorite movie').closest('.favorite-item')!;

    fireEvent.mouseEnter(item);
    fireEvent.click(screen.getByRole('button'));

    expect(onRemove).toHaveBeenCalledWith(7);
  });
});
