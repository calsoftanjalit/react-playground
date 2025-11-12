import { Stack } from '@mantine/core';
import { HeroSection, FeaturedCategories, PopularProducts } from '@/components/home';
import { Footer } from '@/components/miscellaneous';

const HomePage = () => {
  return (
    <Stack>
      <HeroSection />
      <FeaturedCategories />
      <PopularProducts />
      <Footer />
    </Stack>
  );
};

export default HomePage;
