"use client";

import { Sidebar, SidebarContent, SidebarRail } from "@/components/ui/sidebar";
import { NavMain } from "./nav-main";

import {
  LayoutDashboard,
  Package,
  Warehouse,
  ShoppingBag,
  Tag,
  Users,
  FileText,
  ClipboardList,
  Sheet,
} from "lucide-react";

export const data = {
  navMain: [
    {
      title: "Visão Geral",
      url: "/dashboard",
      icon: LayoutDashboard, // Ícone que representa um painel de controle
    },
    {
      title: "Insumos",
      url: "/dashboard/input",
      icon: Package, // Representa pacotes ou insumos
    },
    {
      title: "Estoque",
      url: "/dashboard/inventory",
      icon: Warehouse, // Representa armazenamento/estoque
    },
    {
      title: "Produtos",
      url: "/dashboard/product",
      icon: ShoppingBag, // Representa itens/produtos
    },
    {
      title: "Precificação",
      url: "/dashboard/pricing",
      icon: Tag, // Ícone de etiqueta de preço
    },
    {
      title: "Cadastro de Cliente",
      url: "/dashboard/customer",
      icon: Users, // Ícone que representa múltiplas pessoas
    },
    {
      title: "Encomendas / Vendas",
      url: "/dashboard/order",
      icon: FileText, // Ícone de documento, representando pedidos
    },
    {
      title: "Quadro de Pedidos",
      url: "/dashboard/order/board",
      icon: ClipboardList, // Ícone de checklist/quadro de tarefas
    },
    {
      title: "Relatórios",
      url: "/dashboard/report",
      icon: Sheet,
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
