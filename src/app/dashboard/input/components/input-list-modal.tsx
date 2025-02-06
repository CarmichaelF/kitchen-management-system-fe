"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useFetchData } from "@/hooks/useFetchData";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

interface InputItem {
  id: string;
  name: string;
  stockLimit: number;
}

export function InputListModal() {
  const [open, setOpen] = useState(false);
  const { getAll } = useFetchData({ path: "input" });
  const [inputs, setInputs] = useState<InputItem[]>([]);

  useEffect(() => {
    if (open) {
      getAll<InputItem[]>().then((data) => setInputs(data.data ?? []));
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {/* Botão para abrir o modal */}
      <DialogTrigger asChild className="flex items-center">
        <Button>Visualizar Insumos</Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Lista de Insumos</DialogTitle>
        </DialogHeader>

        <ScrollArea className="max-h-60">
          <ul className="space-y-2">
            {inputs.length > 0 ? (
              inputs.map((item) => (
                <li key={item.id} className="p-2 border rounded-md">
                  <strong>{item.name}</strong> - Estoque: {item.stockLimit}
                </li>
              ))
            ) : (
              <p className="text-center text-gray-500">
                Nenhum insumo cadastrado.
              </p>
            )}
          </ul>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
