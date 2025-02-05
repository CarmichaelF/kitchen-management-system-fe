"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Unity } from "@/context/input-context";
import { InventoryDTO } from "@/context/inventory-context";
import { useFetchData } from "@/hooks/useFetchData";

export interface ProductDTO {
  _id: string;
  name: string;
  ingredients?: {
    _id: string;
    inventoryID: string;
    name: string;
    quantity: number;
    unity?: Unity;
  }[];
}

export function ProductModal() {
  const { getAll } = useFetchData({ path: "product" });
  const { getByID } = useFetchData({ path: "inventory" });
  const [modalOpen, setModalOpen] = useState(false);
  const [products, setProducts] = useState<ProductDTO[]>([]);

  const getInventory = async ({ id }: { id: string }) => {
    return await getByID<InventoryDTO>({ id });
  };

  const handleViewProducts = async () => {
    try {
      const response = await getAll<ProductDTO[]>();
      // Enriquecer os produtos com a propriedade 'unity' para cada ingrediente
      const productsWithUnity = await Promise.all(
        response.data.map(async (product) => {
          const enrichedIngredients = await Promise.all(
            (product.ingredients || []).map(async (ingredient) => {
              const { data } = await getInventory({
                id: ingredient.inventoryID,
              });
              return { ...ingredient, unity: data.unity };
            })
          );
          return { ...product, ingredients: enrichedIngredients };
        })
      );
      setProducts(productsWithUnity);
      setModalOpen(true);
    } catch (error) {
      console.error("Erro ao buscar produtos:", error);
      toast.error("Erro ao buscar produtos cadastrados");
    }
  };

  return (
    <Dialog open={modalOpen} onOpenChange={setModalOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" onClick={handleViewProducts}>
          Visualizar Produtos
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Produtos Cadastrados</DialogTitle>
          <DialogDescription>
            Abaixo segue a listagem dos produtos cadastrados com seus
            ingredientes:
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="h-96">
          <div className="space-y-6">
            {products && products.length > 0 ? (
              products.map((product) => (
                <div key={product._id} className="border p-4 rounded">
                  <h3 className="font-bold text-lg mb-2">{product.name}</h3>
                  {product.ingredients && product.ingredients.length > 0 ? (
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="border-b">
                          <th className="px-4 py-2 text-left text-sm font-medium">
                            Inventory ID
                          </th>
                          <th className="px-4 py-2 text-left text-sm font-medium">
                            Name
                          </th>
                          <th className="px-4 py-2 text-left text-sm font-medium">
                            Quantity
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {product.ingredients.map((ingredient) => (
                          <tr
                            key={ingredient._id}
                            className="border-b last:border-0"
                          >
                            <td className="px-4 py-2 text-sm">
                              {ingredient.inventoryID}
                            </td>
                            <td className="px-4 py-2 text-sm">
                              {ingredient.name}
                            </td>
                            <td className="px-4 py-2 text-sm">
                              {ingredient.quantity}
                              {ingredient.unity}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      Nenhum ingrediente cadastrado.
                    </p>
                  )}
                </div>
              ))
            ) : (
              <p className="p-4 text-sm text-muted-foreground">
                Nenhum produto cadastrado.
              </p>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
