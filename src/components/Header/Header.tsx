import { type FC } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Group, Title, Burger, Menu, Avatar, Text, Button } from '@mantine/core';
import { IconShoppingCart, IconUser, IconShoppingBag, IconLogout, IconLogin } from '@tabler/icons-react';
import { useAuthStore } from '@/hooks/useAuthStore';
import { AUTH_ROUTES } from '@/constants/auth';
import { ICON_SIZES, AVATAR_SIZES } from '@/constants/ui';
import styles from './Header.module.scss';

interface HeaderProps {
  opened: boolean;
  toggle: () => void;
}

const links = [
  { label: 'Home', to: '/' },
  { label: 'Products', to: '/products' },
  { label: 'Wishlist', to: '/wishlist' },
  { label: 'Cart', to: '/cart' },
  { label: 'Checkout', to: '/checkout' },
];

export const Header: FC<HeaderProps> = ({ opened, toggle }) => {
  const { user, isAuthenticated, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <Group h="100%" px="md" className="justify-between">
      {/* Left side: hamburger + logo */}
      <Group gap="xs">
        <Burger opened={opened} onClick={toggle} size="sm" />
        <Group>
          <IconShoppingCart
            data-testid="tabler-icon-shopping-cart"
            size={ICON_SIZES.XL}
            stroke={2}
            className={styles.iconPrimary}
          />
          <Title order={3} m={0}>
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
            className={({ isActive }) => (isActive ? styles.activeLink : styles.inactiveLink)}
          >
            {link.label}
          </NavLink>
        ))}

        {/* User Menu or Login Button */}
        {isAuthenticated && user ? (
          <Menu shadow="md" width={200} position="bottom-end">
            <Menu.Target>
              <Group gap="xs" className={styles.userMenu}>
                <Avatar src={user.image} size={AVATAR_SIZES.SM} radius="xl" />
                <Text size="sm" fw={500}>
                  {user.firstName}
                </Text>
              </Group>
            </Menu.Target>

            <Menu.Dropdown>
              <Menu.Label>
                {user.email}
              </Menu.Label>
              <Menu.Item
                leftSection={<IconUser size={ICON_SIZES.SM} />}
                onClick={() => navigate(AUTH_ROUTES.PROFILE)}
              >
                Profile
              </Menu.Item>
              <Menu.Item
                leftSection={<IconShoppingBag size={ICON_SIZES.SM} />}
                onClick={() => navigate(AUTH_ROUTES.ORDERS)}
              >
                My Orders
              </Menu.Item>
              <Menu.Divider />
              <Menu.Item
                color="red"
                leftSection={<IconLogout size={ICON_SIZES.SM} />}
                onClick={handleLogout}
              >
                Logout
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        ) : (
          <Button
            variant="light"
            size="sm"
            leftSection={<IconLogin size={ICON_SIZES.SM} />}
            onClick={() => navigate(AUTH_ROUTES.LOGIN)}
          >
            Login
          </Button>
        )}
      </Group>
    </Group>
  );
};
