import { Group, Title, Burger } from "@mantine/core";
import { FC } from "react";
import { NavLink } from "react-router-dom";
import { IconShoppingCart } from "@tabler/icons-react";

interface HeaderProps {
  opened: boolean;
  toggle: () => void;
}

const links = [
  { label: "Home", to: "/" },
  { label: "Products", to: "/products" },
  { label: "Cart", to: "/cart" },
  { label: "Checkout", to: "/checkout" },
];

export const Header: FC<HeaderProps> = ({opened, toggle }) => {
  return (
       <Group h="100%" px="md" className="justify-between">

        {/* Left side: hamburger + logo */}
        <Group gap="xs">
           <Burger opened={opened} onClick={toggle} size="sm" />
          <Group>
            <IconShoppingCart size={28} stroke={2} color="#1c7ed6" />
            <Title order={3} style={{ margin: 0 }}>
              MyShop
            </Title>
          </Group>
        </Group>

        {/* Navigation */}
        <Group gap="lg">
          {links.map((link) => (
            <NavLink
              key={link.label}
              to={link.to}
              style={({ isActive }) => ({
                fontWeight: isActive ? 700 : 500,
                color: isActive ? "#1c7ed6" : "#1a1a1a",
                textDecoration: "none",
              })}
            >
              {link.label}
            </NavLink>
          ))}
        </Group>
     </Group>
  );
};
