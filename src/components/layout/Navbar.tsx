import { NavLink, ScrollArea, Stack } from "@mantine/core";
import { IconHome, IconInfoCircle } from "@tabler/icons-react";
import { useLocation, useNavigate } from "react-router-dom";

interface NavbarProps {
  opened: boolean;
  toggle: () => void;
}

export const Navbar = ({ opened, toggle }: NavbarProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { icon: IconHome, label: "Home", path: "/" },
    { icon: IconInfoCircle, label: "About", path: "/about" },
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
