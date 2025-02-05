"use client";

import * as React from "react";
import { Calendar } from "lucide-react";

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
              <Calendar />
              <Link href="/dashboard/inventory">Estoque</Link>
            </CommandItem>
            <CommandItem>
              <Calendar />
              <Link href="/dashboard/input">Insumos</Link>
            </CommandItem>
            <CommandItem>
              <Calendar />
              <Link href="/dashboard/pricing">Precificação</Link>
            </CommandItem>
            <CommandItem>
              <Calendar />
              <Link href="/dashboard/product">Produtos</Link>
            </CommandItem>
          </CommandGroup>
          <CommandSeparator />
        </CommandList>
      </CommandDialog>
    </>
  );
}
