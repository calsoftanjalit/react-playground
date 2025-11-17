import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { MantineProvider } from '@mantine/core';
import ProductReviewComponent from '@/components/miscellaneous/ProductReviewDetails';

const mockReviews = [
  {
    reviewerName: 'John Doe',
    rating: 5,
    date: '2024-01-15',
    comment: 'Excellent product! Highly recommend.',
  },
  {
    reviewerName: 'Jane Smith',
    rating: 4,
    date: '2024-01-20',
    comment: 'Good quality, fast delivery.',
  },
  {
    reviewerName: 'Bob Johnson',
    rating: 3,
    date: '2024-01-25',
    comment: 'Average product, could be better.',
  },
];

describe('ProductReviewComponent', () => {
  const renderComponent = (reviews = mockReviews) => {
    return render(
      <MantineProvider>
        <ProductReviewComponent reviews={reviews} />
      </MantineProvider>
    );
  };

  it('should render all reviews', () => {
    renderComponent();

    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Jane Smith')).toBeInTheDocument();
    expect(screen.getByText('Bob Johnson')).toBeInTheDocument();
  });

  it('should display reviewer comments', () => {
    renderComponent();

    expect(screen.getByText('Excellent product! Highly recommend.')).toBeInTheDocument();
    expect(screen.getByText('Good quality, fast delivery.')).toBeInTheDocument();
    expect(screen.getByText('Average product, could be better.')).toBeInTheDocument();
  });

  it('should display formatted dates', () => {
    renderComponent();

    // Check if dates are displayed (format depends on locale)
    const dates = screen.getAllByText(/\d{1,2}\/\d{1,2}\/\d{4}/);
    expect(dates.length).toBeGreaterThan(0);
  });

  it('should render avatar with first letter of reviewer name', () => {
    const { container } = renderComponent();

    // Check for avatars containing first letters
    const avatars = container.querySelectorAll('.mantine-Avatar-root');
    expect(avatars.length).toBe(3);

    // Check avatars contain text (multiple J's exist, so use getAllByText)
    const jAvatars = screen.getAllByText('J');
    expect(jAvatars.length).toBeGreaterThanOrEqual(2); // John and Jane both start with J

    // Check for Bob's avatar
    expect(screen.getByText('B')).toBeInTheDocument();
  });

  it('should render rating stars for each review', () => {
    const { container } = renderComponent();

    // Check for rating components
    const ratings = container.querySelectorAll('.mantine-Rating-root');
    expect(ratings.length).toBe(3);
  });

  it('should render carousel with correct slides', () => {
    const { container } = renderComponent();

    // Check for Mantine Carousel
    const carousel = container.querySelector('.mantine-Carousel-root');
    expect(carousel).toBeInTheDocument();

    // Check for carousel slides
    const slides = container.querySelectorAll('.mantine-Carousel-slide');
    expect(slides.length).toBe(3);
  });

  it('should render cards with borders', () => {
    const { container } = renderComponent();

    const cards = container.querySelectorAll('.mantine-Card-root');
    expect(cards.length).toBe(3);
  });

  it('should handle empty reviews array', () => {
    const { container } = renderComponent([]);

    const carousel = container.querySelector('.mantine-Carousel-root');
    expect(carousel).toBeInTheDocument();

    // case when No slides should be rendered
    const slides = container.querySelectorAll('.mantine-Carousel-slide');
    expect(slides.length).toBe(0);
  });

  it('should render single review correctly', () => {
    const singleReview = [mockReviews[0]];
    renderComponent(singleReview);

    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Excellent product! Highly recommend.')).toBeInTheDocument();
  });

  it('should display all review information in correct layout', () => {
    renderComponent();

    // Check that each review has name, date, comment, and rating
    const johnDoeElement = screen.getByText('John Doe');
    const card = johnDoeElement.closest('.mantine-Card-root');
    expect(card).toBeInTheDocument();
  });

  it('should render reviews with different ratings', () => {
    const reviewsWithDifferentRatings = [
      { ...mockReviews[0], rating: 5 },
      { ...mockReviews[1], rating: 1 },
      { ...mockReviews[2], rating: 3 },
    ];

    const { container } = renderComponent(reviewsWithDifferentRatings);

    const ratings = container.querySelectorAll('.mantine-Rating-root');
    expect(ratings.length).toBe(3);
  });
});
