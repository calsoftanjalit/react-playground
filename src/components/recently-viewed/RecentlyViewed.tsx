import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, Image, Text, Box, Title } from '@mantine/core';
import { useRecentlyViewed } from '@/hooks';
import { ProductInterface } from '@/types';
import styles from './RecentlyViewed.module.scss';

export const RecentlyViewed = () => {
  const { getItems } = useRecentlyViewed();
  const [items, setItems] = useState<ProductInterface[]>([]);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    setItems(getItems());
  }, [getItems, id]);

  if (items.length === 0) return null;

  return (
    <Box mt="xl" className={styles.wrapper}>
      <Title order={2} ta="center" mb="lg">
        Recently Viewed Products
      </Title>

      <Box className={styles.list}>
        {items.map((item) => (
          <Card
            key={item.id}
            className={styles.card}
            shadow="sm"
            onClick={() => navigate(`/products/${item.id}`)}
          >
            <Image src={item.thumbnail} height={120} alt={item.title} />
            <Text fw={500} mt="sm">
              {item.title}
            </Text>
            <Text>${item.price}</Text>
          </Card>
        ))}
      </Box>
    </Box>
  );
};
