import './GenreCard.css';

export interface GenreCardProps {
  onClick: () => void;
  pathToImage: string;
  alternateImageText: string;
  genre: string;
}

export const GenreCard = ({ onClick, pathToImage, alternateImageText, genre }: GenreCardProps) => {
  return (
    <li className="flex genre__item genre__background" onClick={onClick}>
      <div className="genre__content">
        <img src={pathToImage} alt={alternateImageText} className="genre__item-poster" />
        <h3 className="genre__item-title">{genre}</h3>
      </div>
    </li>
  );
};
