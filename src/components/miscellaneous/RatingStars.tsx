import {IconStarFilled, IconStarHalfFilled } from '@tabler/icons-react';

const RatingStars = ( {value} :{value:number}) => {
  const fullStars = Math.floor(value);
  const hasHalf = value % 1 !== 0;

  return (
    <div>
      {[...Array(fullStars)].map((_, i) => (
        <IconStarFilled key={`full-${i}`} size={35} color="gold" data-testid="full-star" />
      ))}

      {hasHalf && <IconStarHalfFilled size={35} color="gold" data-testid="half-star" />}
    </div>
  );
};

export default RatingStars;
