import React,{useRef} from 'react'
import { Card, Text, Rating, Group, Avatar, Stack } from '@mantine/core';
import {Product} from "@/types/index"
import { Carousel } from '@mantine/carousel';
import Autoplay from 'embla-carousel-autoplay';

const ProductReviewComponent = ({reviews}:Product) => {
  const autoplay = useRef(Autoplay({ delay: 500,stopOnInteraction:false }));

  return (
    <Carousel
      slideSize="40%"
      withIndicators={false}
      height="auto"
      align="start"
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
              <Avatar radius="xl">{review?.reviewerName[0]}</Avatar>

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
  );
}

export default ProductReviewComponent