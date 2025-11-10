import { ActionIcon, Avatar, Menu } from "@mantine/core";
import {
  IconLogout,
  IconSettings,
  IconUser,
} from "@tabler/icons-react";

export const UserMenu = () => {
  return (
    <Menu shadow="md" width={200}>
      <Menu.Target>
        <ActionIcon variant="subtle" size="lg">
          <Avatar size="sm" radius="xl" color="blue" className="cursor-pointer">
            <IconUser size={18} />
          </Avatar>
        </ActionIcon>
      </Menu.Target>

      <Menu.Dropdown>
        <Menu.Label>My Account</Menu.Label>
        <Menu.Item leftSection={<IconUser size={16} />}>Profile</Menu.Item>
        <Menu.Item leftSection={<IconSettings size={16} />}>Settings</Menu.Item>

        <Menu.Divider />

        <Menu.Label>Session</Menu.Label>
        <Menu.Item color="red" leftSection={<IconLogout size={16} />}>
          Logout
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
};
