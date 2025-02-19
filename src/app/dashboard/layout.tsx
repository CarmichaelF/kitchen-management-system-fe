import type { Metadata } from "next";

import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppMainSideBar } from "@/components/app-main-sidebar";
import { Container } from "@/components/container";
import { CommandMenu } from "@/components/command-menu";
import { AppNotifications } from "@/components/app-notifications";
import { MainNav } from "@/components/main-nav";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SidebarProvider>
      <AppMainSideBar />

      <SidebarInset>
        <Container>
          <MainNav />
          {children}
        </Container>
      </SidebarInset>
      <AppNotifications />
      <CommandMenu />
    </SidebarProvider>
  );
}
