import { AppLayout } from '../../components/Layout/AppLayout';
import { Ok, Telegram, Vk, YouTube } from '../../components/Link/linkIcons';
import { Hero } from '../../components/Hero/Hero';
import { useAuth } from '../../hooks/useAuth';
import { useFavorites } from '../../hooks/useFavorites';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { fetchMovie } from '../../api/movies/movies';
import './index.css';
import { Spinner } from '../../components/Spinner/Spinner';

export const FilmPage = () => {
  const { profileQuery } = useAuth();
  const { handleToggleFavorite } = useFavorites();
  const { id } = useParams();

  const { data, isLoading, error } = useQuery({
    queryKey: ['item', id],
    queryFn: () => fetchMovie(Number(id!)),
    enabled: !!id,
  });

  if (isLoading)
    return (
      <div className="flex loader-content">
        <Spinner />
      </div>
    );
  if (error) return <span> Ошибка загрузки данных</span>;

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
      <Hero
        onClick={handleToggleFavorite}
        profileData={profileQuery.data}
        type="filmPage"
        id={data?.id}
      />

      <section className="film-info">
        <div className="container">
          <h2 className="film-info__title">О фильме</h2>

          <ul className="list-reset flex film-info__list">
            <li className="film-info__item">
              <span className="film-info__label">Язык оригинала</span>
              <span className="film-info__dots"></span>
              {data?.language ? (
                <span className="film-info__value">{data.language}</span>
              ) : (
                <span className="film-info__value">Нет данных</span>
              )}
            </li>

            <li className="film-info__item">
              <span className="film-info__label">Бюджет</span>
              <span className="film-info__dots"></span>
              {data?.budget ? (
                <span className="film-info__value">{data.budget}</span>
              ) : (
                <span className="film-info__value">Нет данных</span>
              )}
            </li>

            <li className="film-info__item">
              <span className="film-info__label">Выручка</span>
              <span className="film-info__dots"></span>
              {data?.revenue ? (
                <span className="film-info__value">{data.revenue}</span>
              ) : (
                <span className="film-info__value">Нет данных</span>
              )}
            </li>

            <li className="film-info__item">
              <span className="film-info__label">Режиссер</span>
              <span className="film-info__dots"></span>
              {data?.director ? (
                <span className="film-info__value">{data.director}</span>
              ) : (
                <span className="film-info__value">Нет данных</span>
              )}
            </li>

            <li className="film-info__item">
              <span className="film-info__label">Продакшен</span>
              <span className="film-info__dots"></span>
              {data?.production ? (
                <span className="film-info__value">{data.production}</span>
              ) : (
                <span className="film-info__value">Нет данных</span>
              )}
            </li>

            <li className="film-info__item">
              <span className="film-info__label">Награды</span>
              <span className="film-info__dots"></span>
              {data?.awardsSummary ? (
                <span className="film-info__value">{data.awardsSummary}</span>
              ) : (
                <span className="film-info__value">Нет данных</span>
              )}
            </li>
          </ul>
        </div>
      </section>
    </AppLayout>
  );
};
