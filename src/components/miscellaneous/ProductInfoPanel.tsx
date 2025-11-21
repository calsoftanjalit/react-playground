import { Card, Group, Text, Stack } from '@mantine/core';
import { IconBox, IconRuler, IconWeight, IconTag, IconShield, IconStar } from '@tabler/icons-react';
import { ProductInfoPanelProps } from '@/types/productInfoPanelProps';
import RatingStars from '@/components/miscellaneous/RatingStars';
import UserFeedBack from '@/components/miscellaneous/UserFeedBack';
const ProductInfoPanel : React.FC<ProductInfoPanelProps> = ({ product }) => {
  const {
    brand,
    sku,
    weight,
    dimensions,
    warrantyInformation,
    rating,
    
  } = product;

  return (
    <Card withBorder={false} radius="md" shadow="none" padding="lg" mt="xl">
      <Stack gap="md">
        <Group justify="space-between">
          <Text fw={600} size="lg">
            Product Details
          </Text>
        </Group>
        <Group gap="xs">
          <IconTag size={20} />
          <Text fw={600}>Brand:</Text>
          <Text>{brand}</Text>
        </Group>

        <Group gap="xs">
          <IconBox size={20} />
          <Text fw={600}>SKU:</Text>
          <Text>{sku}</Text>
        </Group>

        <Group gap="xs">
          <IconWeight size={20} />
          <Text fw={600}>Weight:</Text>
          <Text>{weight} kg</Text>
        </Group>

        <Group gap="xs">
          <IconRuler size={20} />
          <Text fw={600}>Dimensions:</Text>
          <Text>
            {dimensions?.width} × {dimensions?.height} × {dimensions?.depth} cm
          </Text>
        </Group>

        <Group gap="xs">
          <IconShield size={20} />
          <Text fw={600}>Warranty:</Text>
          <Text>{warrantyInformation}</Text>
        </Group>

        <Group gap="xs">
          <IconStar size={20} />
          <Text fw={600}>Rating:</Text>
          <Text>{rating} / 5</Text>
        </Group>
      </Stack>
      <Group className="rating-stars">
        <RatingStars value={rating}/>
        <UserFeedBack />
      </Group>
    </Card>
  );
};

export default ProductInfoPanel;
