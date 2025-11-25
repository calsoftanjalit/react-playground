import { Box } from '@mantine/core';
import { IconStarFilled, IconStarHalfFilled } from '@tabler/icons-react';
import { RatingStarProp } from '@/types/index';
import styles from '@/styles/RatingStar.module.scss';

const RatingStars = ({ value }: RatingStarProp) => {
  const fullStars = Math.floor(value);
  const hasHalf = value % 1 !== 0;

  return (
    <Box className={styles.ratingStars}>
      {[...Array(fullStars)].map((_, idx) => (
        <IconStarFilled key={`full-${idx}`} size={35} color="gold" data-testid="full-star" />
      ))}

      {hasHalf && <IconStarHalfFilled size={35} color="gold" data-testid="half-star" />}
    </Box>
  );
};

export default RatingStars;
