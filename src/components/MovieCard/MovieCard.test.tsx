import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { MovieCard } from './MovieCard';

const movie = {
  id: 1,
  title: 'Movie 1',
  posterUrl: 'poster.jpg',
  genres: ['Drama'],
} as never;

describe('MovieCard', () => {
  it('должен вызывать onClick при клике по карточке', () => {
    const onClick = vi.fn();

    render(<MovieCard movie={movie} onClick={onClick} />);

    fireEvent.click(screen.getByAltText('Movie poster'));

    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('должен показывать позицию, если она передана', () => {
    render(<MovieCard movie={movie} position={3} />);

    expect(screen.getByText('3')).toBeInTheDocument();
  });

  it('должен показывать кнопку удаления по hover и вызывать onRemove', () => {
    const onRemove = vi.fn();

    render(<MovieCard movie={movie} onRemove={onRemove} />);

    const card = screen.getByAltText('Movie poster').closest('.movie-background')!;

    fireEvent.mouseEnter(card);
    fireEvent.click(screen.getByRole('button'));

    expect(onRemove).toHaveBeenCalledWith(1);
  });
});
