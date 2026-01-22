import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { fetchGenre } from '../../api/movies/genres';
import { UI_GENRES } from './uiGenres';
import { GenreCard } from '../../components/GenreCard/GenreCard';
import { Loader } from '../../components/Loader/Loader';
import './GenresList.css';

export const GenreList = () => {
  const navigate = useNavigate();

  const {
    data: apiGenres,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['genres'],
    queryFn: fetchGenre,
    staleTime: 10 * 60 * 1000,
  });

  if (isLoading) {
    return (
      <div className="flex home-loader">
        <Loader />
      </div>
    );
  }

  if (isError || !apiGenres) {
    return <div>Ошибка загрузки жанров</div>;
  }

  const genresToRender = UI_GENRES.filter((genre) => apiGenres.includes(genre.apiKey));

  return (
    <ul className="list-reset flex genres__list">
      {genresToRender.map((genre) => (
        <GenreCard
          key={genre.apiKey}
          genre={genre.title}
          pathToImage={genre.image}
          alternateImageText={genre.title}
          onClick={() => navigate(`/genres/${genre.apiKey}`)}
        />
      ))}
    </ul>
  );
};
