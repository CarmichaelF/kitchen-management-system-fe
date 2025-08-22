"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { InventoryDTO } from "@/context/inventory-context";
import { useFetchData } from "@/hooks/useFetchData";
import { CreateProductForm, ProductDTO } from "./create-product-form";
import { EditProductModal } from "./edit-product-modal";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import { api } from "@/service/axios";
import { DeleteDialog } from "@/components/ui/delete-dialog";
import { PDFDocument } from "./pdf-product";
import { PDFDownloadLink } from "@react-pdf/renderer";

export function ProductTable() {
  const { getAll } = useFetchData({ path: "product" });
  const { getByID } = useFetchData({ path: "inventory" });
  const [products, setProducts] = useState<ProductDTO[]>([] as ProductDTO[]);
  const [open, setOpen] = useState(false);
  const [deletingProductID, setDeletingProductID] = useState<string>();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
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
                id: ingredient?.inventory.id,
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

  const deleteProduct = async () => {
    try {
      await api.delete(`/product/${deletingProductID}`);
      setProducts((prev) => prev.filter((p) => p._id !== deletingProductID));
    } catch (err) {
      console.error("Erro ao deletar produto:", err);
    }
  };

  useEffect(() => {
    handleViewProducts();
  }, [open]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Cadastro de Produtos</h1>
      <CreateProductForm onCreate={handleViewProducts} products={products} />

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
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-lg mb-2">{product.name}</h3>
                  <Button variant="link">
                    <PDFDownloadLink
                      document={<PDFDocument product={product} />}
                      fileName={`Ficha técnica - ${product.name}`}
                    >
                      {({ loading }) =>
                        loading
                          ? "Carregando documento..."
                          : "Baixar ficha técnica"
                      }
                    </PDFDownloadLink>
                  </Button>
                </div>
                {product.ingredients && product.ingredients.length > 0 ? (
                  <>
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="border-b">
                          <th className="px-4 py-2 text-left text-sm font-medium">
                            ID do Estoque
                          </th>
                          <th className="px-4 py-2 text-left text-sm font-medium">
                            Nome
                          </th>
                          <th className="px-4 py-2 text-left text-sm font-medium">
                            Quantidade
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
                              {ingredient.inventory.id}
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
                    <div className="flex">
                      <Button
                        variant="outline"
                        onClick={() => handleOpenEditProduct(product)}
                      >
                        Editar Produto
                      </Button>
                      <Button
                        className="ml-auto"
                        variant="destructive"
                        onClick={() => {
                          setIsDeleteDialogOpen(true);
                          setDeletingProductID(product._id);
                        }}
                      >
                        <Trash />
                      </Button>
                    </div>
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
      {/* Dialog para Deleção */}
      <DeleteDialog
        title="Deletar Estoque"
        description="Tem certeza de que deseja deletar este produto? Esta ação não pode ser
                                desfeita."
        confirmText="Confirmar Deleção"
        isDeleteDialogOpen={isDeleteDialogOpen}
        setIsDeleteDialogOpen={setIsDeleteDialogOpen}
        handleDeleteOrder={deleteProduct}
      />
    </div>
  );
}
