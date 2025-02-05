"use client";

import { Sidebar, SidebarContent } from "@/components/ui/sidebar";
import { NotificationsNav } from "./notifications-nav";
import { ActivitiesNav } from "./activities-nav";

export function AppNotifications({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar
      collapsible="none"
      className="border-l border-gray-200 min-h-screen min-w-[280px] p-4 sticky top-0 h-svh"
      {...props}
    >
      <SidebarContent className="flex flex-col">
        <NotificationsNav />
        <ActivitiesNav />
      </SidebarContent>
    </Sidebar>
  );
}
