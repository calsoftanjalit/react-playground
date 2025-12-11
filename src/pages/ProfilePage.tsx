import { useNavigate } from "react-router-dom";
import {
  Container,
  Paper,
  Title,
  Text,
  Stack,
  Group,
  Avatar,
  Button,
  Card,
  Box,
  TextInput,
} from "@mantine/core";
import {
  IconUser,
  IconMail,
  IconLogout,
  IconShoppingBag,
} from "@tabler/icons-react";
import { useAuthStore } from "@/hooks/useAuthStore";
import { AUTH_ROUTES } from "@/constants/auth";
import { ICON_SIZES, AVATAR_SIZES } from "@/constants/ui";
import styles from "@/styles/ProfilePage.module.scss";
import { useState } from "react";

export const ProfilePage = () => {
  const { user, logout, updateUser } = useAuthStore();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);

  const [form, setForm] = useState({
    firstName: user?.firstName,
    lastName: user?.lastName,
    email: user?.email,
    username: user?.username,
  });

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  if (!user) {
    return null;
  }

  const editProfileDetails = () => {
    console.log("edit the personal info");
    setIsEditing(true);
  };

  const updateProfileDetails = () => {
    updateUser({
      firstName: form.firstName,
      lastName: form.lastName,
      email: form.email,
      username: form.username,
    });
    setIsEditing(false);
  };

  const cancelEdit = () => {
    setForm({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      username: user.username,
    });
    setIsEditing(false);
  };

  return (
    <Container size="md" py="xl">
      <Stack gap="lg">
        <Paper shadow="sm" p="xl" radius="md" className={styles.header}>
          <Group>
            <Avatar src={user.image} size={AVATAR_SIZES.LG} radius="xl" />
            <Box>
              <Title order={2}>
                {user.firstName} {user.lastName}
              </Title>
              <Text c="dimmed" size="sm">
                @{user.username}
              </Text>
            </Box>
          </Group>
        </Paper>

        <Card shadow="sm" padding="lg" radius="md">
          <Stack gap="md">
            <Group justify="space-between" align="center">
              <Title order={3}>Profile Information</Title>
              {isEditing ? (
                <Group>
                  <Button
                    radius="md"
                    color="green"
                    onClick={updateProfileDetails}
                  >
                    Update
                  </Button>
                  <Button radius="md" variant="light" onClick={cancelEdit}>
                    Cancel
                  </Button>
                </Group>
              ) : (
                <Button radius="md" onClick={editProfileDetails}>
                  Edit
                </Button>
              )}
            </Group>

            <Group gap="sm" align="flex-start">
              <IconUser size={ICON_SIZES.LG} />
              <Box className={styles.infoBox}>
                <Text size="sm" c="dimmed" ta="left">
                  Full Name
                </Text>
                {isEditing ? (
                  <Group>
                    <TextInput
                      value={form.firstName}
                      onChange={(e) =>
                        setForm({ ...form, firstName: e.target.value })
                      }
                    />
                    <TextInput
                      value={form.lastName}
                      onChange={(e) =>
                        setForm({ ...form, lastName: e.target.value })
                      }
                    />
                  </Group>
                ) : (
                  <Text fw={500} ta="left">
                    {user.firstName} {user.lastName}
                  </Text>
                )}
              </Box>
            </Group>

            <Group gap="sm" align="flex-start">
              <IconMail size={ICON_SIZES.LG} />
              <Box className={styles.infoBox}>
                <Text size="sm" c="dimmed" ta="left">
                  Email Address
                </Text>
                {isEditing ? (
                  <TextInput
                    value={form.email}
                    onChange={(e) =>
                      setForm({ ...form, email: e.target.value })
                    }
                  />
                ) : (
                  <Text fw={500} ta="left">
                    {user.email}
                  </Text>
                )}
              </Box>
            </Group>

            <Group gap="sm" align="flex-start">
              <IconUser size={ICON_SIZES.LG} />
              <Box className={styles.infoBox}>
                <Text size="sm" c="dimmed" ta="left">
                  Username
                </Text>
                {isEditing ? (
                  <TextInput
                    value={form.username}
                    onChange={(e) =>
                      setForm({ ...form, username: e.target.value })
                    }
                  />
                ) : (
                  <Text fw={500} ta="left">
                    {user.username}
                  </Text>
                )}
              </Box>
            </Group>
          </Stack>
        </Card>

        <Card shadow="sm" padding="lg" radius="md">
          <Stack gap="md">
            <Title order={3}>Quick Actions</Title>

            <Button
              variant="light"
              leftSection={<IconShoppingBag size={ICON_SIZES.MD} />}
              onClick={() => navigate(AUTH_ROUTES.ORDERS)}
              fullWidth
            >
              View My Orders
            </Button>

            <Button
              variant="outline"
              color="red"
              leftSection={<IconLogout size={ICON_SIZES.MD} />}
              onClick={handleLogout}
              fullWidth
            >
              Logout
            </Button>
          </Stack>
        </Card>
      </Stack>
    </Container>
  );
};
