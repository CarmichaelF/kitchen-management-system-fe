"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { InventoryDTO } from "@/context/inventory-context";
import { useFetchData } from "@/hooks/useFetchData";
import { ProductDTO } from "./create-product-form";
import { EditProductModal } from "./edit-product-modal";
import { Button } from "@/components/ui/button";

export function ProductTable() {
  const { getAll } = useFetchData({ path: "product" });
  const { getByID } = useFetchData({ path: "inventory" });
  const [products, setProducts] = useState<ProductDTO[]>([]);
  const [open, setOpen] = useState(false);

  const [selectedProduct, setSelectedProduct] = useState<ProductDTO | null>(
    null
  );

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
                id: ingredient.inventory._id,
              });
              return { ...ingredient, unity: data.unity };
            })
          );
          return { ...product, ingredients: enrichedIngredients };
        })
      );
      setProducts(productsWithUnity);
    } catch (error) {
      console.error("Erro ao buscar produtos:", error);
      toast.error("Erro ao buscar produtos cadastrados");
    }
  };

  const handleOpenEditProduct = (product: ProductDTO) => {
    setOpen(true);
    setSelectedProduct(product);
  };

  useEffect(() => {
    handleViewProducts();
  }, [open]);

  return (
    <div className="p-6">
      <div className=" mt-4">
        <h2 className="text-xl font-semibold mb-4">Produtos Cadastrados</h2>
        <p>
          Abaixo segue a listagem dos produtos cadastrados com seus
          ingredientes:
        </p>
        <div className="space-y-6 mt-4">
          {products && products.length > 0 ? (
            products.map((product) => (
              <div key={product._id} className="border p-4 rounded">
                <h3 className="font-bold text-lg mb-2">{product.name}</h3>

                {product.ingredients && product.ingredients.length > 0 ? (
                  <>
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
                              {ingredient.inventory._id}
                            </td>
                            <td className="px-4 py-2 text-sm">
                              {ingredient.name}
                            </td>
                            <td className="px-4 py-2 text-sm">
                              {ingredient.quantity}
                              {ingredient.inventory.unity}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    <Button
                      variant="outline"
                      onClick={() => handleOpenEditProduct(product)}
                      className="mt-4"
                    >
                      Editar Produto
                    </Button>
                  </>
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
      </div>
      {selectedProduct && (
        <EditProductModal
          open={open}
          setOpen={setOpen}
          product={selectedProduct}
        />
      )}
    </div>
  );
}
