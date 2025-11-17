import { Card, Group, Text, Stack, Badge } from '@mantine/core';
import { IconBox, IconRuler, IconWeight, IconTag, IconShield, IconStar } from '@tabler/icons-react';

const ProductInfoPanel = ({ product }) => {
  const {
    brand,
    sku,
    weight,
    dimensions,
    warrantyInformation,
    rating,
    discountPercentage,
    category,
  } = product;

  return (
    <Card withBorder radius="md" shadow="sm" padding="lg" mt="xl" style={{ maxWidth: 450 }}>
      <Stack gap="md">
        <Group justify="space-between">
          <Text fw={600} size="lg">
            Product Details
          </Text>
          <Badge color="blue" variant="light">
            {category?.toUpperCase()}
          </Badge>
        </Group>

        <Group>
          <IconTag size={20} />
          <Text>
            <b>Brand:</b> {brand}
          </Text>
        </Group>

        <Group>
          <IconBox size={20} />
          <Text>
            <b>SKU:</b> {sku}
          </Text>
        </Group>

        <Group>
          <IconWeight size={20} />
          <Text>
            <b>Weight:</b> {weight} kg
          </Text>
        </Group>

        <Group>
          <IconRuler size={20} />
          <Text>
            <b>Dimensions:</b> {dimensions?.width} × {dimensions?.height} × {dimensions?.depth} cm
          </Text>
        </Group>

        <Group>
          <IconShield size={20} />
          <Text>
            <b>Warranty:</b> {warrantyInformation}
          </Text>
        </Group>

        <Group>
          <IconStar size={20} />
          <Text>
            <b>Rating:</b> {rating} / 5
          </Text>
        </Group>

        <Group>
          <Badge color="green" radius="xs" size="lg">
            {discountPercentage}% OFF
          </Badge>
        </Group>
      </Stack>
    </Card>
  );
};

export default ProductInfoPanel;
