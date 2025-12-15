import { useState } from "react";
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

import { notifications } from "@mantine/notifications";
import { isNotEmpty, useForm } from "@mantine/form";
import {
  IconUser,
  IconMail,
  IconLogout,
  IconShoppingBag,
} from "@tabler/icons-react";

import { useAuthStore } from "@/hooks/useAuthStore";
import { AUTH_ROUTES } from "@/constants/auth";
import { ICON_SIZES, AVATAR_SIZES } from "@/constants/ui";

import { EditableField } from "./EditableField";

import styles from "@/styles/ProfilePage.module.scss";

export const ProfilePage = () => {
  const { user, logout, updateUser } = useAuthStore();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);

  const form = useForm({
    initialValues: {
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      email: user?.email || "",
      username: user?.username || "",
    },

    validate: {
      firstName: isNotEmpty("First name is required"),
      lastName: isNotEmpty("Last name is required"),
      username: isNotEmpty("Username is required"),
      email: (v) => (/^\S+@\S+$/.test(v) ? null : "Invalid email"),
    },

    validateInputOnChange: true,
    validateInputOnBlur: true,
  });

  const canUpdate = isEditing && form.isValid();

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

  async function updateProfileDetails() {
    try {
      await updateUser(form.values);
      setIsEditing(false);
      notifications.show({
        title: "Profile updated",
        message: "Your changes have been saved.",
        color: "green",
        autoClose: 3000,
        withBorder: true,
      });
    } catch (err) {
      notifications.show({
        title: "Update failed",
        message: err instanceof Error ? err.message : "Please try again.",
        color: "red",
        autoClose: 5000,
        withBorder: true,
      });
    }
  }

  const cancelEdit = () => {
    form.reset();
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

        <form onSubmit={form.onSubmit(() => updateProfileDetails())}>
          <Card shadow="sm" padding="lg" radius="md">
            <Stack gap="md">
              <Group justify="space-between" align="center">
                <Title order={3}>Profile Information</Title>
                {isEditing ? (
                  <Group>
                    <Button
                      radius="md"
                      color="green"
                      type="submit"
                      disabled={!canUpdate}
                      aria-disabled={!canUpdate}
                    >
                      Update
                    </Button>
                    <Button radius="md" variant="light" onClick={cancelEdit}>
                      Cancel
                    </Button>
                  </Group>
                ) : (
                  <Button radius="md" onClick={() => setIsEditing(true)}>
                    Edit
                  </Button>
                )}
              </Group>

              <EditableField
                icon={<IconUser size={ICON_SIZES.LG} />}
                label="Full Name"
                isEditing={isEditing}
                displayValue={`${user.firstName} ${user.lastName}`}
                className={styles.infoBox}
                renderInputs={() => (
                  <Group>
                    <TextInput {...form.getInputProps("firstName")} />
                    <TextInput {...form.getInputProps("lastName")} />
                  </Group>
                )}
              />

              <EditableField
                icon={<IconMail size={ICON_SIZES.LG} />}
                label="Email Address"
                isEditing={isEditing}
                displayValue={user.email}
                className={styles.infoBox}
                inputProps={form.getInputProps("email")}
              />
              <EditableField
                icon={<IconUser size={ICON_SIZES.LG} />}
                label="Username"
                isEditing={isEditing}
                displayValue={user.username}
                className={styles.infoBox}
                inputProps={form.getInputProps("username")}
              />
            </Stack>
          </Card>
        </form>

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
