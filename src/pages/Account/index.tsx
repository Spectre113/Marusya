import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { AppLayout } from '../../components/Layout/AppLayout';
import { fetchFavorites } from '../../api/favorites/favorites';
import { MoviesList } from '../../components/MoviesList/MoviesList';
import { Loader } from '../../components/Loader/Loader';
import { Button } from '../../components/Button/Button';
import { Ok, Telegram, Vk, YouTube } from '../../components/Link/linkIcons';
import { useFavorites } from '../../hooks/useFavorites';
import './index.css';
import { AccountHeart, AccountSettings } from './accountItems';
import { useAuth } from '../../hooks/useAuth';

type AccountTab = 'favorites' | 'settings';

export const Account = () => {
  const [activeTab, setActiveTab] = useState<AccountTab>('favorites');
  const { profileQuery } = useAuth();

  const favoritesQuery = useQuery({
    queryKey: ['favorites'],
    queryFn: fetchFavorites,
    retry: false,
    enabled: activeTab === 'favorites',
  });

  const { removeFavoriteMutation } = useFavorites();

  const handleRemoveFavorite = (movieId: number) => {
    removeFavoriteMutation.mutate(movieId, {
      onSuccess: () => {
        favoritesQuery.refetch();
      },
    });
  };

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
      <div className="container account">
        <h1 className="account__title">Мой аккаунт</h1>
        <div className="account__buttons">
          <Button
            title="Избранные фильмы"
            variant="logIn"
            width="wide"
            onClick={() => setActiveTab('favorites')}
            imageSvg={<AccountHeart />}
            className={activeTab === 'favorites' ? 'account-button--selected' : ''}
          />
          <Button
            title="Настройки аккаунта"
            variant="logIn"
            width="wide"
            onClick={() => setActiveTab('settings')}
            imageSvg={<AccountSettings />}
            className={activeTab === 'settings' ? 'account-button--selected' : ''}
          />
        </div>
        <div className="account__content">
          {activeTab === 'favorites' && (
            <>
              {favoritesQuery.isPending && <Loader />}
              {favoritesQuery.isError && (
                <div className="account__error">Ошибка загрузки избранных фильмов</div>
              )}
              {favoritesQuery.isSuccess && favoritesQuery.data.length === 0 && (
                <div className="account__empty">
                  <p>У вас пока нет избранных фильмов</p>
                </div>
              )}
              {favoritesQuery.isSuccess && favoritesQuery.data.length > 0 && (
                <MoviesList
                  movies={favoritesQuery.data}
                  variant="default"
                  showGenre={true}
                  onCardClick={(id) => console.log('Movie clicked:', id)}
                  onRemove={handleRemoveFavorite}
                  isLoading={false}
                  showLoadMore={false}
                  hasMore={false}
                />
              )}
            </>
          )}
          {activeTab === 'settings' && (
            <div className="flex account__settings">
              {profileQuery.isPending && <Loader />}
              {profileQuery.isError && (
                <div className="account__error">Ошибка загрузки данных профиля</div>
              )}
              {profileQuery.isSuccess && profileQuery.data && (
                <ul className="list-reset flex account__list">
                  <li className="flex account__item">
                    <span className="flex account__item-user">КК</span>
                    <div className="account__item-info-block">
                      <p className="account__item-info">Имя Фамилия</p>
                      <h3 className="account__item-name">
                        {(() => {
                          const { name, surname } = profileQuery.data;
                          if (name && surname) {
                            return `${name} ${surname}`;
                          }
                          if (name) {
                            return name;
                          }
                          if (surname) {
                            return surname;
                          }
                          return profileQuery.data.email;
                        })()}
                      </h3>
                    </div>
                  </li>
                  <li className="flex account__item">
                    <span className="account__item-user"></span>
                    <div className="account__item-info-block">
                      <p className="account__item-info">Электронная почта</p>
                      <h3 className="account__item-name">{profileQuery.data.email}</h3>
                    </div>
                  </li>
                </ul>
              )}
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
};
