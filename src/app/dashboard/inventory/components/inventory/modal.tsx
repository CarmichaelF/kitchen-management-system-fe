"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { api } from "@/service/axios";
import { ScrollArea } from "@/components/ui/scroll-area";

interface InventoryItem {
  _id: string;
  date: string; // data do registro de estoque
  // Outros campos do Inventory, se necessário
  input: {
    _id: string;
    name: string;
    stockLimit: number;
  };
}

export function InventoryModal() {
  const [open, setOpen] = useState(false);
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([]);

  useEffect(() => {
    if (open) {
      api
        .get("/inventory")
        .then((response) => {
          setInventoryItems(response.data);
        })
        .catch((error) => {
          console.error("Erro ao buscar itens do estoque:", error);
        });
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Ver itens do estoque</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle>Itens do Estoque</DialogTitle>
          <DialogDescription>
            Confira os itens cadastrados no estoque
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="h-96">
          <div className="overflow-x-auto py-4">
            {inventoryItems.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Nenhum item encontrado.
              </p>
            ) : (
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="px-4 py-2 text-left text-sm font-medium">
                      Nome
                    </th>
                    <th className="px-4 py-2 text-left text-sm font-medium">
                      ID
                    </th>
                    <th className="px-4 py-2 text-left text-sm font-medium">
                      Limite de estoque
                    </th>
                    <th className="px-4 py-2 text-left text-sm font-medium">
                      Data
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {inventoryItems.map((item) => (
                    <tr key={item._id} className="border-b last:border-0">
                      <td className="px-4 py-2 text-sm">{item._id}</td>
                      <td className="px-4 py-2 text-sm">{item.input.name}</td>
                      <td className="px-4 py-2 text-sm">
                        {item.input.stockLimit}
                      </td>
                      <td className="px-4 py-2 text-sm">
                        {new Date(item.date).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
