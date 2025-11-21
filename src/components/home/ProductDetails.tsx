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
import { IconShoppingCart, IconBolt } from '@tabler/icons-react';
import ProductReviewComponent from '@/components/miscellaneous/ProductReviewDetails';
import { useCartStore } from '@/context';
import { useCheckoutFormContext } from '@/hooks/useCheckoutFormContext';
import { ROUTE_PATHS } from '@/routes';
import QuantitySelector from '@/components/home/QuantitySelector';
import ProductInfoPanel from '../miscellaneous/ProductInfoPanel';
import { calculateDiscountedPrice } from '@/utils';
import { useMemo } from 'react';

const ProductDetails = () => {
  const { items, addItem, updateItem, removeItem } = useCartStore();
  const { clearFormData } = useCheckoutFormContext();
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

  const finalPrice = useMemo(() => {
    if (!product) return null;
    return calculateDiscountedPrice(product.price, product.discountPercentage);
  }, [product]);

  if (isLoading) {
    return (
      <Center>
        <Loader size="lg" />
      </Center>
    );
  }

  if (isError || !product) {
    return (
      <Center h="100vh">
        <Text className="errorText" size="lg">
          {error instanceof Error ? error.message : 'Product not found'}
        </Text>
      </Center>
    );
  }

  if (isFetching) {
    return (
      <Center>
        <Loader size="lg" />
      </Center>
    );
  }

  const cartItem = items.find((item) => item.id === product.id);
  const quantity = cartItem?.quantity ?? 0;

  const handleIncrement = () => {
    addItem({
      id: product.id,
      title: product.title,
      price: product.price,
    });
  };

  const handleDecrement = () => {
    if (!cartItem) return;

    if (cartItem.quantity <= 1) {
      removeItem(product.id);
      return;
    }

    updateItem(product.id, cartItem.quantity - 1);
  };

  const handleBuyNow = () => {
    clearFormData();
    const currentQuantity = cartItem?.quantity ?? 1;

    const checkoutPath = ROUTE_PATHS.PRODUCT_CHECKOUT.replace(':id', product.id.toString());

    navigate(checkoutPath, {
      state: {
        buyNowItem: {
          id: product.id,
          title: product.title,
          price: product.price,
          quantity: currentQuantity,
          thumbnail: product.thumbnail,
        },
      },
    });
  };

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
              <Group justify="center" gap={2}>
                <Text c="red" fw="500" size="sm">
                  -{product.discountPercentage}%
                </Text>
                <Text fw={500} size="xl" ta="center" c="blue">
                  ${finalPrice}
                </Text>
              </Group>
              <Text fw={500} size="sm" ta="center" c="blue" td="line-through">
                ${product.price}
              </Text>
            </Stack>
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 7 }}>
            <Stack gap="lg">
              <Box style={{ maxWidth: '65ch' }}>
                <Text size="sm" fw={500} c="gray.7" style={{ lineHeight: 1.65 }} ta="justify">
                  {product.description}
                </Text>
              </Box>
              <Group mt="md" justify="flex-start" gap="md">
                <Button
                  variant="filled"
                  color="blue"
                  size="md"
                  leftSection={<IconBolt size={18} />}
                  onClick={handleBuyNow}
                >
                  Buy Now
                </Button>
                {!cartItem ? (
                  <Button
                    size="md"
                    variant="light"
                    onClick={handleIncrement}
                    leftSection={<IconShoppingCart size={18} />}
                  >
                    Add To Cart
                  </Button>
                ) : (
                  <QuantitySelector
                    quantity={quantity}
                    handleIncrement={handleIncrement}
                    handleDecrement={handleDecrement}
                  />
                )}
              </Group>
              <ProductInfoPanel product={product} />
            </Stack>
          </Grid.Col>
        </Grid>
      </Paper>
      <ProductReviewComponent reviews={product?.reviews} />
    </>
  );
};

export default ProductDetails;
