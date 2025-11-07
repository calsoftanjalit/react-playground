import {
  ActionIcon,
  Group,
  Tooltip,
  useMantineColorScheme,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import {
  IconBell,
  IconBrandGithub,
  IconMoon,
  IconSun,
} from "@tabler/icons-react";
import { UserMenu } from "./UserMenu";

export const HeaderActions = () => {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();

  const handleNotification = () => {
    notifications.show({
      title: "Welcome! 🎉",
      message: "You're using Mantine with React Router!",
      color: "blue",
    });
  };

  return (
    <Group gap="xs">
      <Tooltip label="View on GitHub">
        <ActionIcon
          variant="subtle"
          color="gray"
          size="lg"
          component="a"
          href="https://github.com/calsoftanjalit/react-playground"
          target="_blank"
        >
          <IconBrandGithub size={20} stroke={1.5} />
        </ActionIcon>
      </Tooltip>

      <Tooltip label="Notifications">
        <ActionIcon
          variant="subtle"
          color="gray"
          size="lg"
          onClick={handleNotification}
        >
          <IconBell size={20} stroke={1.5} />
        </ActionIcon>
      </Tooltip>

      <Tooltip label={colorScheme === "dark" ? "Light mode" : "Dark mode"}>
        <ActionIcon
          variant="subtle"
          color="gray"
          size="lg"
          onClick={() => toggleColorScheme()}
        >
          {colorScheme === "dark" ? (
            <IconSun size={20} stroke={1.5} />
          ) : (
            <IconMoon size={20} stroke={1.5} />
          )}
        </ActionIcon>
      </Tooltip>

      <UserMenu />
    </Group>
  );
};
