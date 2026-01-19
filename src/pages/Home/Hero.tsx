import { useQuery } from '@tanstack/react-query';
import './Hero.css';
import { fetchRandomMovie } from '../../api/movies/movies';
import { Rating } from '../../components/Rating/Rating';
import { Button } from '../../components/Button/Button';
import { HeroButton } from '../../components/HeroButton/HeroButton';
import { Heart, Refresh } from '../../components/HeroButton/heroButtons';
import { Loader } from '../../components/Loader/Loader';
import { useToggle } from '../../hooks/useToggle';
import { Modal } from '../../components/Modal/Modal';
import { useEffect, useState } from 'react';
import { Spinner } from '../../components/Spinner/Spinner';
import type { ProfileResponse } from '../../api/auth/profile';

export const Hero = ({
  onClick,
  profileData,
}: {
  onClick: (id: number) => void;
  profileData?: ProfileResponse;
}) => {
  const randomMovie = useQuery({
    queryFn: () => fetchRandomMovie(),
    queryKey: ['randomMovie'],
    refetchOnWindowFocus: false,
  });

  const [isOpen, toggle] = useToggle(false);
  const [isTrailerLoading, setIsTrailerLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsTrailerLoading(true);
    }
  }, [isOpen]);

  switch (randomMovie.status) {
    case 'pending':
      return <Loader />;
    case 'success': {
      const currentIsFavorite =
        profileData?.favorites.includes(String(randomMovie.data.id)) ?? false;
      return (
        <section className="hero">
          <div className="flex container">
            <div className="flex hero__info">
              <div className="flex hero__top-menu">
                <Rating value={randomMovie.data.tmdbRating} size="large" />
                <span className="hero__data hero__date">
                  {randomMovie.data.releaseDate.split('-')[0]}
                </span>
                {randomMovie.data.genres?.[0] && (
                  <span className="hero__data hero__genre">{randomMovie.data.genres[0]}</span>
                )}
                <span className="hero__data hero__duration">{randomMovie.data.runtime}m</span>
              </div>
              <h1 className="hero__title">{randomMovie.data.title}</h1>
              <p className="hero__description">{randomMovie.data.plot}</p>
              <div className="flex hero__buttons-section">
                <Button title="Трейлер" onClick={toggle} />
                <Button title="О фильме" variant="secondary" subclass="dark" />
                <HeroButton
                  imagePath={<Heart />}
                  onClick={() => onClick(randomMovie.data.id)}
                  isFavorite={currentIsFavorite}
                />
                <HeroButton imagePath={<Refresh />} onClick={() => randomMovie.refetch()} />
              </div>
            </div>
            <div className="flex hero__poster">
              {randomMovie.data.backdropUrl ? (
                <img
                  className="hero__poster-img"
                  src={randomMovie.data.backdropUrl}
                  alt="Постер к фильму"
                />
              ) : (
                <div className="hero__poster-fallback">Нет постера</div>
              )}
            </div>
          </div>
          <Modal isOpen={isOpen} onClose={toggle}>
            {(() => {
              if (!randomMovie.data.trailerUrl) {
                return <span className="modal__error">Трейлер не доступен</span>;
              }
              const urlMatch = randomMovie.data.trailerUrl.match(/[?&]v=([^&]+)/);
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
    case 'error': {
      const err = randomMovie.error;
      const message = err instanceof Error ? err.message : 'Unknown error';
      return (
        <div className="hero__error">
          Ошибка загрузки: {message}
          <button onClick={() => randomMovie.refetch()}>Повторить</button>
        </div>
      );
    }
  }
};
