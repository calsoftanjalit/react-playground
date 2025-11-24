import { Box } from '@mantine/core';
import { IconStarFilled, IconStarHalfFilled } from '@tabler/icons-react';
import {RatingStarProp} from '@/types/index'
const RatingStars = ({ value }:RatingStarProp ) => {
  const fullStars = Math.floor(value);
  const hasHalf = value % 1 !== 0;

  return (
    <Box>
      {[...Array(fullStars)].map((_, i) => (
        <IconStarFilled key={`full-${i}`} size={35} color="gold" data-testid="full-star" />
      ))}

      {hasHalf && <IconStarHalfFilled size={35} color="gold" data-testid="half-star" />}
    </Box>
  );
};

export default RatingStars;
