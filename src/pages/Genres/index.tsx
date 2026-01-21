import { GenreList } from '../../components/GenresList/GenresList';
import { AppLayout } from '../../components/Layout/AppLayout';
import { Ok, Telegram, Vk, YouTube } from '../../components/Link/linkIcons';
import './index.css';

export const Genres = () => {
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
      <section className="genre">
        <div className="container">
          <h1 className="genre__title">Жанры фильмов</h1>
          <GenreList />
        </div>
      </section>
    </AppLayout>
  );
};
