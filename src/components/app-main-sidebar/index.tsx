"use client";

import { Bot, SquareTerminal } from "lucide-react";

import { Sidebar, SidebarContent, SidebarRail } from "@/components/ui/sidebar";
import { NavMain } from "./nav-main";

const data = {
  navMain: [
    {
      title: "Visão Geral",
      url: "/dashboard",
      icon: SquareTerminal,
    },
    {
      title: "Estoque",
      url: "/dashboard/inventory",
      icon: SquareTerminal,
    },
    {
      title: "Insumos",
      url: "/dashboard/input",
      icon: Bot,
    },
    {
      title: "Precificação",
      url: "/dashboard/pricing",
      icon: Bot,
    },
    {
      title: "Produtos",
      url: "/dashboard/product",
      icon: Bot,
    },
  ],
};

export function AppMainSideBar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
