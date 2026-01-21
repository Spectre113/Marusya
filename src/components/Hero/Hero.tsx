import { useQuery } from '@tanstack/react-query';
import './Hero.css';
import { fetchMovie, fetchRandomMovie } from '../../api/movies/movies';
import { Rating } from '../../components/Rating/Rating';
import { Button } from '../../components/Button/Button';
import { HeroButton } from '../../components/HeroButton/HeroButton';
import { Heart, Refresh } from '../../components/HeroButton/heroButtons';
import { useToggle } from '../../hooks/useToggle';
import { Modal } from '../../components/Modal/Modal';
import { useEffect, useState } from 'react';
import { Spinner } from '../../components/Spinner/Spinner';
import type { ProfileResponse } from '../../api/auth/profile';

export interface HeroProps {
  onClick: (id: number) => void;
  onButtonClick?: (id: number) => void;
  profileData?: ProfileResponse;
  type?: 'mainPage' | 'filmPage';
  id?: number;
}

export const Hero = ({ onClick, onButtonClick, profileData, type = 'mainPage', id }: HeroProps) => {
  const randomMovie = useQuery({
    queryFn: () => fetchRandomMovie(),
    queryKey: ['randomMovie'],
    refetchOnWindowFocus: false,
  });

  const movieQuery = useQuery({
    queryKey: ['movie', id],
    queryFn: () => fetchMovie(id!),
    enabled: type === 'filmPage' && typeof id === 'number',
    refetchOnWindowFocus: false,
  });

  const movie = type === 'mainPage' ? randomMovie.data : movieQuery.data;

  const [isOpen, toggle] = useToggle(false);
  const [isTrailerLoading, setIsTrailerLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsTrailerLoading(true);
    }
  }, [isOpen]);

  switch (type === 'mainPage' ? randomMovie.status : movieQuery.status) {
    case 'pending':
      return (
        <div className="flex hero-loader">
          <Spinner />
        </div>
      );
    case 'error': {
      const err = type === 'mainPage' ? randomMovie.error : movieQuery.error;
      const message = err instanceof Error ? err.message : 'Unknown error';
      return (
        <div className="hero__error">
          Ошибка загрузки: {message}
          <button
            onClick={() => (type === 'mainPage' ? randomMovie.refetch() : movieQuery.refetch())}
          >
            Повторить
          </button>
        </div>
      );
    }
    case 'success': {
      if (!movie) return null;

      const currentIsFavorite = profileData?.favorites.includes(String(movie.id)) ?? false;

      return (
        <section className="hero">
          <div className="flex container">
            <div className="flex hero__info">
              <div className="flex hero__top-menu">
                <Rating value={movie.tmdbRating} size="large" />
                <span className="hero__data hero__date">{movie.releaseDate.split('-')[0]}</span>
                {movie.genres?.[0] && (
                  <span className="hero__data hero__genre">{movie.genres[0]}</span>
                )}
                <span className="hero__data hero__duration">{movie.runtime}m</span>
              </div>
              <h1 className="hero__title">{movie.title}</h1>
              <p className="hero__description">{movie.plot}</p>
              <div className="flex hero__buttons-section">
                <Button title="Трейлер" onClick={toggle} />
                {type === 'mainPage' && (
                  <Button
                    title="О фильме"
                    variant="secondary"
                    subclass="dark"
                    onClick={() => onButtonClick && onButtonClick(movie.id)}
                  />
                )}
                <HeroButton
                  imagePath={<Heart />}
                  onClick={() => onClick(movie.id)}
                  isFavorite={currentIsFavorite}
                />
                {type === 'mainPage' && (
                  <HeroButton imagePath={<Refresh />} onClick={() => randomMovie.refetch()} />
                )}
              </div>
            </div>
            <div className="flex hero__poster">
              {movie.backdropUrl ? (
                <img className="hero__poster-img" src={movie.backdropUrl} alt="Постер к фильму" />
              ) : (
                <div className="hero__poster-fallback">Нет постера</div>
              )}
            </div>
          </div>
          <Modal isOpen={isOpen} onClose={toggle}>
            {(() => {
              if (!movie.trailerUrl) {
                return <span className="modal__error">Трейлер не доступен</span>;
              }
              const urlMatch = movie.trailerUrl.match(/[?&]v=([^&]+)/);
              const videoId = urlMatch ? urlMatch[1] : null;
              if (!videoId) {
                return <span className="modal__error">Трейлер не доступен</span>;
              }
              const embedUrl = `https://www.youtube.com/embed/${videoId}`;

              return (
                <>
                  {isTrailerLoading && <Spinner />}
                  <iframe
                    className="video"
                    width="100%"
                    height="100%"
                    src={embedUrl}
                    title="Трейлер"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    onLoad={() => setIsTrailerLoading(false)}
                    style={{ display: isTrailerLoading ? 'none' : 'block' }}
                  />
                </>
              );
            })()}
          </Modal>
        </section>
      );
    }
  }
};
