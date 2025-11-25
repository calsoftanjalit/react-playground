import { useRef } from 'react';
import { Card, Text, Rating, Group, Avatar, Stack, Box } from '@mantine/core';
import { Product } from '@/types/index';
import { Carousel } from '@mantine/carousel';
import Autoplay from 'embla-carousel-autoplay';
import { DELAY_BETWEEN_SLIDES_MS } from '@/constants/index';

const ProductReviewComponent = ({ reviews }: Product) => {
  const autoplay = useRef(Autoplay({ delay: DELAY_BETWEEN_SLIDES_MS }));
  // adding the fallBack UI when there is no reviews
  if (!reviews || reviews.length === 0) {
    return (
      <Box maw={700} mx="auto" mt="xl">
        <Card withBorder padding="lg">
          <Text ta="center" c="dimmed" fw={500}>
            No reviews yet. Be the first to review this product!
          </Text>
        </Card>
      </Box>
    );
  }
  return (
    <Box maw={700} mx="auto">
      <Carousel
        withIndicators={false}
        slideGap="md"
        mt="2rem"
        plugins={[autoplay.current]}
        onMouseEnter={autoplay.current.stop}
        onMouseLeave={autoplay.current.reset}
      >
        {reviews.map((review, index) => (
          <Carousel.Slide key={index}>
            <Card shadow="sm" padding="md" radius="md" withBorder>
              <Group align="flex-start">
                <Avatar radius="xl">{review.reviewerName[0]}</Avatar>

                <Stack gap={4} style={{ flex: 1 }}>
                  <Group justify="space-between">
                    <Text fw={600}>{review.reviewerName}</Text>
                    <Rating value={review.rating} readOnly />
                  </Group>

                  <Text size="sm" c="dimmed">
                    {new Date(review.date).toLocaleDateString()}
                  </Text>

                  <Text mt="xs">{review.comment}</Text>
                </Stack>
              </Group>
            </Card>
          </Carousel.Slide>
        ))}
      </Carousel>
    </Box>
  );
};

export default ProductReviewComponent;
