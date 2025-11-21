import { IconStar, IconStarFilled, IconStarHalfFilled } from '@tabler/icons-react';

const RatingStars = ({ value}) => {
  const fullStars = Math.floor(value);
  console.log('Full Stars:', fullStars);  
  const hasHalf = value % 1 !== 0;
  const emptyStars = 5 - fullStars - (hasHalf ? 1 : 0);

  return (
    <div>
      {[...Array(fullStars)].map((_, i) => (
        <IconStarFilled key={`full-${i}`} size={35} color="gold" />
      ))}

      {hasHalf && <IconStarHalfFilled size={35} color="gold" />}
    </div>
  );
};

export default RatingStars;
