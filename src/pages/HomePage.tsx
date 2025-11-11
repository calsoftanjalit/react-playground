import { Stack } from "@mantine/core";
import {
  HeroSection,
  FeaturedCategories,
  PopularProducts,
  PostList,
} from "@components/home";
import { Footer } from "@components/miscellaneous";

const HomePage = () => {
  return (
    <Stack>
      <HeroSection />
      <FeaturedCategories />
      <PopularProducts />
      <PostList />
      <Footer />
    </Stack>
  );
};

export default HomePage;
