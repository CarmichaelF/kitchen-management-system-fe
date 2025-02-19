"use client";

import * as React from "react";
import {
  ClipboardList,
  FileText,
  Package,
  ShoppingBag,
  Tag,
  Users,
  Warehouse,
} from "lucide-react";

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function CommandMenu() {
  const pathName = usePathname();
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "j" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  React.useEffect(() => {
    setOpen(false);
  }, [pathName]);

  //List TODO

  return (
    <>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Type a command or search..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Páginas">
            <CommandItem>
              <Package />
              <Link href="/dashboard/input">Insumos</Link>
            </CommandItem>
            <CommandItem>
              <Warehouse />
              <Link href="/dashboard/inventory">Estoque</Link>
            </CommandItem>
            <CommandItem>
              <ShoppingBag />
              <Link href="/dashboard/product">Produtos</Link>
            </CommandItem>
            <CommandItem>
              <Tag />
              <Link href="/dashboard/pricing">Precificação</Link>
            </CommandItem>
            <CommandItem>
              <Users />
              <Link href="/dashboard/customer">Cadastro de clientes</Link>
            </CommandItem>
            <CommandItem>
              <FileText />
              <Link href="/dashboard/order">Encomendas / Vendas</Link>
            </CommandItem>
            <CommandItem>
              <ClipboardList />
              <Link href="/dashboard/order/board">Quadro de Pedidos</Link>
            </CommandItem>
          </CommandGroup>
          <CommandSeparator />
        </CommandList>
      </CommandDialog>
    </>
  );
}
