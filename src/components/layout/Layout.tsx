import { AppShell } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { Suspense } from "react";
import { Outlet } from "react-router-dom";
import { LoadingFallback } from "../common";
import { Navbar } from "./Navbar";
import {Header} from "../Header/Header";

export function Layout() {
  const [opened, { toggle }] = useDisclosure();

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{
        width: 250,
        breakpoint: "sm",
        collapsed: { mobile: !opened, desktop: !opened },
      }}
      padding="md"
    >
      <AppShell.Header data-testid="header">
          <Header opened={opened} toggle={toggle} />
      </AppShell.Header>

      <AppShell.Navbar p="md">
        <AppShell.Section grow>
          <Navbar opened={opened} toggle={toggle} />
        </AppShell.Section>
      </AppShell.Navbar>

      <AppShell.Main className="bg-gray-50">
        <Suspense fallback={<LoadingFallback />}>
          <Outlet />
        </Suspense>
      </AppShell.Main>
    </AppShell>
  );
}
