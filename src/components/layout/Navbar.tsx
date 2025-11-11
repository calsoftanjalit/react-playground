import { NavLink, ScrollArea, Stack } from "@mantine/core";
import { IconHome, IconInfoCircle } from "@tabler/icons-react";
import { FC } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ROUTE_PATHS } from "../../routes";
import { NavbarProps } from "../../types";

export const Navbar: FC<NavbarProps> = ({ opened, toggle }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { icon: IconHome, label: "Home", path: ROUTE_PATHS.HOME },
    { icon: IconInfoCircle, label: "About", path: ROUTE_PATHS.ABOUT },
  ];

  return (
    <ScrollArea>
      <Stack gap="xs">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            active={location.pathname === item.path}
            label={item.label}
            leftSection={<item.icon size={20} stroke={1.5} />}
            onClick={() => {
              navigate(item.path);
              if (opened) toggle();
            }}
            className="rounded-lg"
          />
        ))}
      </Stack>
    </ScrollArea>
  );
};
