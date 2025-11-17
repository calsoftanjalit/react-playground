import React from 'react'
import { Card, Text, Rating, Group, Avatar, Stack } from '@mantine/core';
import {Product} from "@/types/index"
import { Carousel } from '@mantine/carousel';

const ProductReviewComponent = ({reviews}:Product) => {
  return (
    <Carousel slideSize="70%" height="auto" slideGap="md" loop mt="2rem">
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