import { fetchProductById } from '@/services/productService';
import { Center, Loader, Text, Stack, Group, Button, Box, Paper, Grid, Badge } from '@mantine/core';
import { useQuery } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router-dom';
import { IconShoppingCart, IconBolt } from '@tabler/icons-react';
import ProductReviewComponent from '@/components/miscellaneous/ProductReviewDetails';
import { useCartStore } from '@/context';
import { useCheckoutFormContext } from '@/hooks/useCheckoutFormContext';
import { ROUTE_PATHS } from '@/routes';
import QuantitySelector from '@/components/home/QuantitySelector';
import ProductInfoPanel from '../miscellaneous/ProductInfoPanel';
import { calculateDiscountedPrice, getLocalReviews } from '@/utils';
import { useMemo } from 'react';
import { WishlistButton } from '@/components/common/WishlistButton';
import styles from '@/styles/Product.module.scss';
import { ProductGallery } from '@/components/product';

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

  const localReviews = getLocalReviews(product?.id);
  const mergedReviews = [...(product.reviews ?? []), ...(localReviews ?? [])];
  const cartItem = items.find((item) => item.id === product.id);
  const quantity = cartItem?.quantity ?? 0;

  const handleIncrement = () => {
    addItem({
      id: product.id,
      title: product.title,
      price: product.price,
      thumbnail: product.thumbnail,
      ...(product.discountPercentage > 0 && finalPrice && { discountedPrice: finalPrice }),
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
          ...(product.discountPercentage > 0 && finalPrice && { discountedPrice: finalPrice }),
        },
      },
    });
  };

  return (
    <>
      <Paper shadow="sm" p="xl" radius="md" mt="lg">
        <Grid align="flex-start" gutter="xl">
          {/* LEFT SIDE — Image */}
          <Grid.Col span={{ base: 12, md: 8 }}>
            <Stack gap="md">
              <Box pos="relative">
                <ProductGallery images={[product.thumbnail, ...product.images]} />
                <Badge
                  color={product.availabilityStatus === 'In Stock' ? 'green' : 'red'}
                  size="lg"
                  pos="absolute"
                  top={0}
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

          <Grid.Col span={{ base: 12, md: 4 }}>
            <Stack gap="lg">
              <Box style={{ maxWidth: '65ch' }}>
                <Text
                  size="sm"
                  fw={500}
                  c="gray.7"
                  ta="justify"
                  className={styles.productDescription}
                >
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
                <WishlistButton product={product} size="xl" radius="md" />
              </Group>
              <ProductInfoPanel product={product} />
            </Stack>
          </Grid.Col>
        </Grid>
      </Paper>
      <ProductReviewComponent reviews={mergedReviews} />
    </>
  );
};

export default ProductDetails;
