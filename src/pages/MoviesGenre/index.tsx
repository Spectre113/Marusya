import { useNavigate, useParams } from 'react-router-dom';
import { AppLayout } from '../../components/Layout/AppLayout';
import { Ok, Telegram, Vk, YouTube } from '../../components/Link/linkIcons';
import { GENRES_MAP } from './genres';
import { MoviesList } from '../../components/MoviesList/MoviesList';
import { useMoviesByGenre } from '../../hooks/useMoviesByGenre';
import { Loader } from '../../components/Loader/Loader';
import { Button } from '../../components/Button/Button';
import { useDevice } from '../../hooks/useDevice';
import './index.css';

export const MoviesGenre = () => {
  const navigate = useNavigate();
  const { genre } = useParams<{ genre: string }>();
  const { isSmallScreen } = useDevice();
  const pageSize = isSmallScreen ? 5 : 15;

  const handleClick = (id: number) => {
    navigate(`/movie/${id}`);
  };

  const title = genre ? (GENRES_MAP[genre] ?? 'Неизвестный жанр') : '';

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } = useMoviesByGenre(
    genre!,
    pageSize
  );

  const movies = data?.pages.flat() ?? [];

  if (isLoading) {
    return (
      <div className="flex loader-content">
        <Loader />;
      </div>
    );
  }

  return (
    <AppLayout
      headerLinks={[
        { path: '/', value: 'Главная', current: false },
        { path: '/genres', value: 'Жанры', current: false },
      ]}
      footerLinks={[
        { path: '#', variant: 'footer', imagePath: <Vk /> },
        { path: '#', variant: 'footer', imagePath: <YouTube /> },
        { path: '#', variant: 'footer', imagePath: <Ok /> },
        { path: '#', variant: 'footer', imagePath: <Telegram /> },
      ]}
    >
      <section className="movies-genre">
        <div className="container">
          <h1 className="movies-genre__title" onClick={() => navigate('/genres')}>
            <span>
              <svg
                width="13"
                height="22"
                viewBox="0 0 13 22"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M4.714 10.6066L12.9637 18.8561L10.6067 21.2131L0 10.6066L10.6067 0L12.9637 2.35702L4.714 10.6066Z"
                  fill="white"
                />
              </svg>
            </span>
            {title}
          </h1>
          <div className="movies-genre__list">
            <MoviesList movies={movies} variant="default" onCardClick={handleClick} genreType />
          </div>
          <div className="flex movies-genre__button">
            {hasNextPage && (
              <Button
                title={isFetchingNextPage ? 'Загрузка...' : 'Показать ещё'}
                onClick={() => {
                  fetchNextPage();
                }}
                width="medium-big"
              />
            )}
          </div>
        </div>
      </section>
    </AppLayout>
  );
};
