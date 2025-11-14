import { fetchProductById } from '@/services/productService';
import { Anchor, Center, Loader, Text,  Stack, Group, Button, Image, Breadcrumbs, Title, Box, Card, Paper, Grid } from '@mantine/core';
import { useQuery } from '@tanstack/react-query';
import React from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { IconShoppingCartCopy ,IconShoppingCart} from '@tabler/icons-react';
import ProductReviewComponent from '../miscellaneous/ProductReviewComponent';

const ProductDetails = () => {
  const {id}= useParams<{id:string}>();
  const navigate = useNavigate()
  const {data:product, isLoading,isFetching,isError,error} = useQuery({
    queryKey:["product",id],
    queryFn:()=> fetchProductById(id!),
    enabled:!!id
  })
  console.log(product?.reviews[0]);
  if(isLoading){
    return <Center>
      <Loader size="lg" />
    </Center>
  }
   if (isError || !product)
     return (
       <Center h="100vh">
         <Text c="red" size="lg">
           {error instanceof Error ? error.message : 'Product not found'}
         </Text>
       </Center>
     );
    if(isFetching){
      return <center>
        <Loader size="lg" >
          <Text>
            The data is showing up
          </Text>
          </Loader>
      </center>
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

      <Paper shadow="sm" p="4.5rem" radius="md">
        <Grid align="flex-start">
          {/* LEFT SIDE — Image */}
          <Grid.Col span={{ base: 12, md: 4 }}>
            <Box>
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
              <Stack style={{ position: 'absolute', top: '9rem', left:"14rem", padding:"1rem" }}>
                {product.availabilityStatus == 'In Stock' ? (
                  <Text color="green" fw={500}>
                    {product.availabilityStatus}
                  </Text>
                ) : (
                  <Text color="red" fw={500}>
                    "Out of Stock"
                  </Text>
                )}
              </Stack>
              <Text fw={700}>{product.title}</Text>
              <Group justify="center">
                <Text fw={500}>{product.price}$</Text>
              </Group>
            </Box>
          </Grid.Col>

          {/* RIGHT SIDE — Text */}
          <Grid.Col span={{ base: 12, md: 8 }}>
            <Text ta="justify">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Laudantium quam nesciunt nam,
              officiis, sint facere pariatur, perferendis eum itaque earum non! Quibusdam eum nisi
              itaque excepturi officiis harum nesciunt. Molestias. Molestiae dolorum beatae autem
              voluptatibus accusantium debitis maiores asperiores libero, necessitatibus vel iste
              consequatur porro. Minima ad ut alias corporis, aliquam, corrupti ipsum ab quis
              cupiditate consectetur fugiat vitae obcaecati? Lorem ipsum dolor sit amet consectetur
              adipisicing elit. Laudantium quam nesciunt nam, officiis, sint facere pariatur,
              perferendis eum itaque earum non! Quibusdam eum nisi itaque excepturi officiis harum
              nesciunt. Molestias. Molestiae dolorum beatae autem voluptatibus accusantium debitis
              maiores asperiores libero, necessitatibus vel iste consequatur porro. Minima ad ut
              alias corporis, aliquam, corrupti ipsum ab quis cupiditate consectetur fugiat vitae
              obcaecati? Lorem ipsum dolor sit amet consectetur adipisicing elit. Laudantium quam
              nesciunt nam, officiis, sint facere pariatur, perferendis eum itaque earum non!
              Quibusdam eum nisi itaque excepturi officiis harum nesciunt. Molestias. Molestiae
              dolorum beatae autem voluptatibus accusantium debitis maiores asperiores libero,
              necessitatibus vel iste consequatur porro. Minima ad ut alias corporis, aliquam,
              corrupti ipsum ab quis cupiditate consectetur fugiat vitae obcaecati?
            </Text>
            <Group mt="2rem" justify="space-around">
              <Button color="red">
                Buy Now <IconShoppingCartCopy stroke={2} />
              </Button>
              <Button>
                {' '}
                Add To Cart
                <IconShoppingCart />{' '}
              </Button>
            </Group>
          </Grid.Col>
        </Grid>
      </Paper>
      <ProductReviewComponent reviews={product?.reviews}/>
    </>
  );


}

export default ProductDetails