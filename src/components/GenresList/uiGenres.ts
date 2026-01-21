import drama from '../../assets/genres/drama.jpg';
import comedy from '../../assets/genres/comedy.jpg';
import mystery from '../../assets/genres/crime.jpg';
import family from '../../assets/genres/family.jpg';
import history from '../../assets/genres/history.jpg';
import thriller from '../../assets/genres/thriller.jpg';
import scifi from '../../assets/genres/fantasy.jpg';
import adventure from '../../assets/genres/adventure.jpg';

export const UI_GENRES = [
  { apiKey: 'drama', title: 'Драма', image: drama },
  { apiKey: 'comedy', title: 'Комедия', image: comedy },
  { apiKey: 'mystery', title: 'Детектив', image: mystery },
  { apiKey: 'family', title: 'Семейное', image: family },
  { apiKey: 'history', title: 'Историческое', image: history },
  { apiKey: 'thriller', title: 'Триллер', image: thriller },
  { apiKey: 'scifi', title: 'Фантастика', image: scifi },
  { apiKey: 'adventure', title: 'Приключение', image: adventure },
] as const;
