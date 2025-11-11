import { Center, Loader } from "@mantine/core";
import { FC } from "react";

export const LoadingFallback: FC = () => (
  <Center h="100vh">
    <Loader size="lg" />
  </Center>
);
