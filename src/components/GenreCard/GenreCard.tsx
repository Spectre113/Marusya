import './GenreCard.css';

export interface GenreCardProps {
  onClick: () => void;
  pathToImage: string;
  alternateImageText: string;
  genre: string;
}

export const GenreCard = ({ onClick, pathToImage, alternateImageText, genre }: GenreCardProps) => {
  return (
    <li className="flex genre__item" onClick={onClick}>
      <div className="genre__content genre__background">
        <img src={pathToImage} alt={alternateImageText} className="genre__item-poster" />
        <h3 className="genre__item-title">{genre}</h3>
      </div>
    </li>
  );
};
