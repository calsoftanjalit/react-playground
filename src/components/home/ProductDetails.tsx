import { fetchProductById } from '@/services/productService';
import {
  Anchor,
  Center,
  Loader,
  Text,
  Stack,
  Group,
  Button,
  Breadcrumbs,
  Box,
  Paper,
  Grid,
  Badge,
} from '@mantine/core';
import { useQuery } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router-dom';
import { IconShoppingCartCopy, IconShoppingCart } from '@tabler/icons-react';
import ProductReviewComponent from '@/components/miscellaneous/ProductReviewComponent';

const ProductDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const {
    data: product,
    isLoading,
    isFetching,
    isError,
    error,
  } = useQuery({
    queryKey: ['product', id],
    queryFn: () => fetchProductById(id!),
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <Center>
        <Loader size="lg" />
      </Center>
    );
  }

  if (isError || !product)
    return (
      <Center h="100vh">
        <Text c="red" size="lg">
          {error instanceof Error ? error.message : 'Product not found'}
        </Text>
      </Center>
    );

  if (isFetching) {
    return (
      <Center>
        <Loader size="lg">
          <Text>The data is showing up</Text>
        </Loader>
      </Center>
    );
  }

  const breadcrumbItems = [
    { title: 'Home', href: '/' },
    { title: product.title, href: '#' },
  ].map((item, index) => (
    <Anchor
      key={index}
      href={item.href}
      underline="hover"
      onClick={(e) => {
        e.preventDefault();
        navigate(item.href);
      }}
    >
      {item.title}
    </Anchor>
  ));

  return (
    <>
      <Breadcrumbs mb="lg">{breadcrumbItems}</Breadcrumbs>

      <Paper shadow="sm" p="xl" radius="md">
        <Grid align="flex-start" gutter="xl">
          {/* LEFT SIDE — Image */}
          <Grid.Col span={{ base: 12, md: 5 }}>
            <Stack gap="md">
              <Box pos="relative">
                <img
                  src={product.thumbnail}
                  alt={product.title}
                  style={{
                    width: '100%',
                    height: 'auto',
                    objectFit: 'contain',
                    display: 'block',
                    borderRadius: '8px',
                  }}
                />
                <Badge
                  color={product.availabilityStatus === 'In Stock' ? 'green' : 'red'}
                  size="lg"
                  pos="absolute"
                  top={10}
                  left={10}
                >
                  {product.availabilityStatus === 'In Stock'
                    ? product.availabilityStatus
                    : 'Out of Stock'}
                </Badge>
              </Box>
              <Text fw={700} size="xl" ta="center">
                {product.title}
              </Text>
              <Text fw={500} size="lg" ta="center" c="blue">
                ${product.price}
              </Text>
            </Stack>
          </Grid.Col>

          {/* RIGHT SIDE — Text with max-width */}
          <Grid.Col span={{ base: 12, md: 7 }}>
            <Stack gap="lg">
              {/* Add max-width to improve readability */}
              <Box style={{ maxWidth: '65ch' }}>
                <Text ta="justify" size="sm" style={{ lineHeight: 1.6 }}>
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Laudantium quam nesciunt
                  nam, officiis, sint facere pariatur, perferendis eum itaque earum non! Quibusdam
                  eum nisi itaque excepturi officiis harum nesciunt. Molestias. Molestiae dolorum
                  beatae autem voluptatibus accusantium debitis maiores asperiores libero,
                  necessitatibus vel iste consequatur porro. Minima ad ut alias corporis, aliquam,
                  corrupti ipsum ab quis cupiditate consectetur fugiat vitae obcaecati? Lorem ipsum
                  dolor sit amet consectetur adipisicing elit. Laudantium quam nesciunt nam,
                  officiis, sint facere pariatur, perferendis eum itaque earum non! Quibusdam eum
                  nisi itaque excepturi officiis harum nesciunt. Molestias. Molestiae dolorum beatae
                  autem voluptatibus accusantium debitis maiores asperiores libero, necessitatibus
                  vel iste consequatur porro. Minima ad ut alias corporis, aliquam, corrupti ipsum
                  ab quis cupiditate consectetur fugiat vitae obcaecati? Lorem ipsum dolor sit amet
                  consectetur adipisicing elit. Laudantium quam nesciunt nam, officiis, sint facere
                  pariatur, perferendis eum itaque earum non! Quibusdam eum nisi itaque excepturi
                  officiis harum nesciunt. Molestias. Molestiae dolorum beatae autem voluptatibus
                  accusantium debitis maiores asperiores libero, necessitatibus vel iste consequatur
                  porro. Minima ad ut alias corporis, aliquam, corrupti ipsum ab quis cupiditate
                  consectetur fugiat vitae obcaecati?
                </Text>
              </Box>

              <Group mt="md" justify="flex-start" gap="md">
                <Button color="red" size="md" leftSection={<IconShoppingCartCopy size={18} />}>
                  Buy Now
                </Button>
                <Button size="md" leftSection={<IconShoppingCart size={18} />}>
                  Add To Cart
                </Button>
              </Group>
            </Stack>
          </Grid.Col>
        </Grid>
      </Paper>
      <ProductReviewComponent reviews={product?.reviews} />
    </>
  );
};

export default ProductDetails;
