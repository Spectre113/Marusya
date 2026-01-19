import './index.css';
import { useQuery } from '@tanstack/react-query';
import { AppLayout } from '../../components/Layout/AppLayout';
import { MoviesList } from '../../components/MoviesList/MoviesList';
import { Loader } from '../../components/Loader/Loader';
import { Ok, Telegram, Vk, YouTube } from '../../components/Link/linkIcons';
import { fetchFavorites } from '../../api/favorites/favorites';
import { Button } from '../../components/Button/Button';

export const Home = () => {
  const bestMoviesQuery = useQuery({
    queryFn: () => fetchFavorites(),
    queryKey: ['bestMovies'],
  });

  let bestMovies: React.ReactNode = null;

  switch (bestMoviesQuery.status) {
    case 'pending':
      bestMovies = <Loader />;
      break;
    case 'success': {
      bestMovies = (
        <MoviesList
          movies={bestMoviesQuery.data}
          variant="top"
          showLoadMore={false}
          hasMore={false}
          isLoading={false}
        />
      );
      break;
    }
    case 'error': {
      const err = bestMoviesQuery.error;
      const message = err instanceof Error ? err.message : 'Unknown error';
      bestMovies = <div className="best_error">Ошибка: {message}</div>;
      break;
    }
  }

  return (
    <AppLayout
      headerLinks={[
        { path: '/', value: 'Главная', current: true },
        { path: '/genres', value: 'Жанры', current: false },
      ]}
      footerLinks={[
        { path: '#', variant: 'footer', imagePath: <Vk /> },
        { path: '#', variant: 'footer', imagePath: <YouTube /> },
        { path: '#', variant: 'footer', imagePath: <Ok /> },
        { path: '#', variant: 'footer', imagePath: <Telegram /> },
      ]}
    >
      <section className="favoriteMovies">
        <div className="container">
          <h1 className="user__title">Мой аккаунт</h1>
          <Button type="button" title="Избранные фильмы" variant="logIn" />
          {bestMovies}
        </div>
      </section>
    </AppLayout>
  );
};
