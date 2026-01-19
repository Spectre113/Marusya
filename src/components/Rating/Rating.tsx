import './Rating.css';
import { ratingColor } from './ratingColor';

export interface RatingProps {
  value: number;
  size?: 'small' | 'large';
}

export const Rating = ({ value, size = 'large' }: RatingProps) => {
  const normalizedValue = Math.max(0, Math.min(10, value));
  const formattedValue = normalizedValue.toFixed(1);

  const color = ratingColor(normalizedValue);

  return (
    <div className={`flex rating rating--${color}`} data-size={size}>
      <svg
        className="rating__image"
        viewBox="0 0 16 15"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        data-size={size}
      >
        <path
          d="M7.60847 11.84L2.90617 14.4721L3.95639 9.1866L0 5.52787L5.35136 4.89337L7.60847 0L9.86554 4.89337L15.2169 5.52787L11.2605 9.1866L12.3107 14.4721L7.60847 11.84Z"
          fill="white"
        />
      </svg>

      <span className={`rating__text`} data-size={size}>
        {formattedValue}
      </span>
    </div>
  );
};
