import { useMutation } from '@tanstack/react-query';
import { addToFavorites, deleteFromFavorites } from '../api/favorites/favorites';
import { useAuth } from './useAuth';

export const useFavorites = () => {
  const { profileQuery, setModalType } = useAuth();

  const addFavoriteMutation = useMutation({
    mutationFn: addToFavorites,
    onSuccess: () => {
      profileQuery.refetch();
    },
    onError: (err) => {
      console.log(err);
    },
  });

  const removeFavoriteMutation = useMutation({
    mutationFn: deleteFromFavorites,
    onSuccess: () => {
      profileQuery.refetch();
    },
    onError: (err) => {
      console.log(err);
    },
  });

  const handleToggleFavorite = (movieId: number) => {
    if (!profileQuery.data) {
      setModalType('login');
      return;
    }

    const isFavorite = profileQuery.data.favorites.includes(String(movieId));

    if (isFavorite) {
      removeFavoriteMutation.mutate(movieId);
    } else {
      addFavoriteMutation.mutate({
        id: String(movieId),
        name: profileQuery.data.name,
        email: profileQuery.data.email,
        surname: profileQuery.data.surname,
      });
    }
  };

  return {
    handleToggleFavorite,
    addFavoriteMutation,
    removeFavoriteMutation,
  };
};

