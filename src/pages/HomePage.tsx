import { Stack } from "@mantine/core";
import {
  HeroSection,
  FeaturedCategories,
  PopularProducts,
  Footer,
} from "../components/home";

export const HomePage = () => {
  return (
    <Stack>
      <HeroSection />
      <FeaturedCategories />
      <PopularProducts />
      <Footer />
    </Stack>
  );
};
