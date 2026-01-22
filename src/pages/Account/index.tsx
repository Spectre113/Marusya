import { useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
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
import { logout } from '../../api/auth/logout';
import { useNavigate } from 'react-router-dom';

type AccountTab = 'favorites' | 'settings';

export const Account = () => {
  const [activeTab, setActiveTab] = useState<AccountTab>('favorites');

  const { profileQuery, logoutLocal } = useAuth();
  const navigate = useNavigate();

  const favoritesQuery = useQuery({
    queryKey: ['favorites'],
    queryFn: fetchFavorites,
    retry: false,
    enabled: activeTab === 'favorites',
    staleTime: 0,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
  });

  const logoutMutation = useMutation({
    mutationFn: logout,
    onSuccess: () => {
      logoutLocal();
      navigate('/', { replace: false });
    },
  });

  const { removeFavoriteMutation } = useFavorites();

  const loaderContent = (
    <div className="flex home-loader">
      <Loader />
    </div>
  );

  const handleClick = (id: number) => {
    navigate(`/movie/${id}`);
  };

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
              {favoritesQuery.isPending && loaderContent}
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
                  onCardClick={handleClick}
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
              {profileQuery.isPending && loaderContent}
              {profileQuery.isError && (
                <div className="account__error">Ошибка загрузки данных профиля</div>
              )}
              {profileQuery.isSuccess && profileQuery.data && (
                <ul className="list-reset flex account__list">
                  <li className="flex account__item">
                    <span className="flex account__item-user">
                      {profileQuery.data.name.charAt(0)}
                      {profileQuery.data.surname.charAt(0)}
                    </span>
                    <div className="flex account__item-info-block">
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
                    <span className="flex account__item-user">
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M21 3C21.5523 3 22 3.44772 22 4V20.0066C22 20.5552 21.5447 21 21.0082 21H2.9918C2.44405 21 2 20.5551 2 20.0066V19H20V7.3L12 14.5L2 5.5V4C2 3.44772 2.44772 3 3 3H21ZM8 15V17H0V15H8ZM5 10V12H0V10H5ZM19.5659 5H4.43414L12 11.8093L19.5659 5Z"
                          fill="white"
                        />
                      </svg>
                    </span>
                    <div className="flex account__item-info-block">
                      <p className="account__item-info">Электронная почта</p>
                      <h3 className="account__item-name">{profileQuery.data.email}</h3>
                    </div>
                  </li>
                </ul>
              )}
              <Button
                title="Выйти из аккаунта"
                width="long"
                onClick={() => logoutMutation.mutate()}
                isDisabled={logoutMutation.isPending}
              />
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
};
