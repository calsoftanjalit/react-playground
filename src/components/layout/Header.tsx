import { Burger, Group, Text } from "@mantine/core";
import { IconRocket } from "@tabler/icons-react";
import { FC } from "react";
import { HeaderProps } from "../../types";
import { HeaderActions } from "./HeaderActions";

export const Header: FC<HeaderProps> = ({ opened, toggle }) => {
  return (
    <Group h="100%" px="md" className="justify-between">
      <Group>
        <Burger opened={opened} onClick={toggle} size="sm" />
        <IconRocket size={28} className="text-blue-500" stroke={2} />
        <Text
          size="xl"
          fw={700}
          className="bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent"
        >
          React Playground
        </Text>
      </Group>

      <HeaderActions />
    </Group>
  );
};
