import { Stack } from '@mantine/core';
import { HeroSection, FeaturedCategories, PopularProducts } from '@/components/home';
import { Footer } from '@/components/miscellaneous';
import { RecentlyViewed } from '@/components/recently-viewed';

const HomePage = () => {
  return (
    <Stack>
      <HeroSection />
      <FeaturedCategories />
      <PopularProducts />
      <RecentlyViewed />
      <Footer />
    </Stack>
  );
};

export default HomePage;
