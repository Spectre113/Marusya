import './index.css';
import { useQuery } from '@tanstack/react-query';
import { AppLayout } from '../../components/Layout/AppLayout';
import { MoviesList } from '../../components/MoviesList/MoviesList';
import { Hero } from './Hero';
import { fetchTopMovies } from '../../api/movies/movies';
import { Loader } from '../../components/Loader/Loader';
import { Ok, Telegram, Vk, YouTube } from '../../components/Link/linkIcons';
import { useAuth } from '../../hooks/useAuth';
import { useFavorites } from '../../hooks/useFavorites';

export const Home = () => {
  const topMoviesQuery = useQuery({
    queryFn: () => fetchTopMovies(),
    queryKey: ['topMovies'],
    staleTime: 10 * 60 * 1000,
  });

  const { profileQuery } = useAuth();
  const { handleToggleFavorite } = useFavorites();

  let topMovies: React.ReactNode = null;

  switch (topMoviesQuery.status) {
    case 'pending':
      topMovies = <Loader />;
      break;
    case 'success': {
      topMovies = (
        <MoviesList
          movies={topMoviesQuery.data}
          variant="top"
          showLoadMore={false}
          hasMore={false}
          isLoading={false}
        />
      );
      break;
    }
    case 'error': {
      const err = topMoviesQuery.error;
      const message = err instanceof Error ? err.message : 'Unknown error';
      topMovies = <div className="hero__error">Ошибка загрузки: {message}</div>;
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
      <Hero onClick={handleToggleFavorite} profileData={profileQuery.data} />
      <section className="topMovies">
        <div className="container">
          <h2 className="topMovie__title">Топ 10 фильмов</h2>
          {topMovies}
        </div>
      </section>
    </AppLayout>
  );
};
