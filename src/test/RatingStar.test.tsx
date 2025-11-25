import { render, screen } from '@testing-library/react';
import RatingStars from '@/components/miscellaneous/RatingStars';
import { describe, it, expect } from 'vitest';

describe('RatingStars Component', () => {
  it('renders full stars correctly', () => {
    render(<RatingStars value={4} />);

    const fullStars = screen.getAllByTestId('full-star');
    expect(fullStars.length).toBe(4);
  });

  it('renders half star when needed', () => {
    render(<RatingStars value={3.5} />);

    expect(screen.getByTestId('half-star')).toBeInTheDocument();
  });

  it('does not render half star when value is an integer', () => {
    render(<RatingStars value={5} />);

    const halfStar = screen.queryByTestId('half-star');
    expect(halfStar).not.toBeInTheDocument();
  });
});
