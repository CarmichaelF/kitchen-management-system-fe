"use client";

import { useForm, Controller, useFieldArray } from "react-hook-form";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Combobox, ComboboxItemDTO } from "@/components/ui/combobox";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Plus, Trash, RefreshCw } from "lucide-react"; // Adicionei o ícone RefreshCw
import { toast } from "sonner";
import { api } from "@/service/axios";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { QuantityInput } from "@/components/ui/quantity-input";
import { Unity } from "@/context/input-context";
import "react-json-view-lite/dist/index.css";
import {
  InventoryData,
  useInventoryContext,
} from "@/context/inventory-context";
import { AxiosError } from "axios";

export interface ProductDTO {
  _id: string;
  name: string;
  ingredients: {
    inventory: {
      id: string;
    };
    unity: string;
    name: string;
    quantity: number;
    id: string;
  }[];
  createdAt: Date;
}

const productSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  ingredients: z.array(
    z.object({
      inventory: z.string().min(1, "Selecione um insumo"),
      quantity: z.number().min(0.000000000001, "Quantidade inválida"),
    })
  ),
});

type ProductFormData = z.infer<typeof productSchema>;

interface CreateProductFormProps {
  onCreate(): void;
  products: ProductDTO[]; // Lista de produtos existentes
}

export function CreateProductForm({
  onCreate,
  products,
}: CreateProductFormProps) {
  const [currentItem, setCurrentItem] = useState<ComboboxItemDTO[]>([]);
  const [selectedBaseProduct, setSelectedBaseProduct] = useState<string>(""); // Estado para o produto base selecionado
  const { allInventory } = useInventoryContext();
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      ingredients: [{ inventory: "", quantity: 0 }],
    },
  });

  const { fields, append, remove, replace } = useFieldArray({
    control,
    name: "ingredients",
  });

  // Preenche o formulário com os dados do produto selecionado
  const handleSelectProduct = (productId: string) => {
    const selectedProduct = products.find((p) => p._id === productId);
    if (selectedProduct) {
      // Preenche o nome do produto
      reset({ name: selectedProduct.name });

      // Preenche os ingredientes
      const ingredientsWithInventory = selectedProduct.ingredients.map(
        (ing) => ({
          inventory: ing.inventory.id,
          quantity: ing.quantity,
        })
      );
      replace(ingredientsWithInventory);

      // Atualiza o estado currentItem com os dados dos ingredientes
      const newCurrentItems = selectedProduct.ingredients.map((ing) => ({
        value: ing.inventory.id,
        label: ing.name,
      }));
      setCurrentItem(newCurrentItems);

      // Atualiza o estado do produto base selecionado
      setSelectedBaseProduct(productId);
    }
  };

  // Função para resetar o formulário
  const handleResetForm = () => {
    reset({
      name: "",
      ingredients: [{ inventory: "", quantity: 0 }],
    });
    setCurrentItem([]);
    setSelectedBaseProduct("");
  };

  const onSubmit = async (data: ProductFormData) => {
    try {
      await api.post<ProductDTO>("/product", {
        name: data.name,
        ingredients: data.ingredients.map(
          (ingredient: { inventory: string; quantity: number }, index) => ({
            inventory: ingredient.inventory,
            quantity: ingredient.quantity,
            name: currentItem[index].label,
          })
        ),
      });

      toast.success("Produto criado com sucesso!");
      onCreate();
    } catch (error) {
      console.error("Erro ao criar produto:", error);
      if (error instanceof AxiosError)
        return toast.error(error.response?.data.message);
      return toast.error("Erro ao criar o produto.");
    }
  };

  const getIngredientUnity = (index: number) => {
    const ingredient = allInventory.find(
      (n: InventoryData) => n.value === currentItem?.[index]?.value
    );
    return ingredient?.unity || "kg"; // Default para kg se não encontrado
  };

  return (
    <>
      <Card className="">
        <CardHeader className="flex justify-between mb-4"></CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Campo para selecionar um produto base */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Selecione um produto para usar como base(Opcional)
              </label>
              <Combobox
                items={products.map((p) => ({ value: p._id, label: p.name }))}
                value={selectedBaseProduct} // Valor selecionado
                onChange={(ev) => handleSelectProduct(ev.value)}
              />
            </div>

            <div className="space-y-4 mt-4">
              <Controller
                name="name"
                control={control}
                render={({ field }) => (
                  <div>
                    <Input
                      {...field}
                      placeholder="Nome do produto"
                      className="w-full"
                    />
                    {errors.name && (
                      <p className="text-sm text-red-500 mt-1">
                        {errors.name.message}
                      </p>
                    )}
                  </div>
                )}
              />

              <div className="space-y-4">
                {fields.map((field, index) => {
                  const unity = getIngredientUnity(index);
                  return (
                    <div key={field.id} className="flex gap-4 items-start">
                      <div className="flex-1 space-y-2">
                        <Controller
                          name={`ingredients.${index}.inventory`}
                          control={control}
                          render={({ field }) => (
                            <Combobox
                              items={allInventory}
                              value={currentItem[index]?.value || ""} // Valor selecionado
                              onChange={(ev) => {
                                field.onChange(ev.value);
                                setCurrentItem((prevItems) => {
                                  const newItems = [...prevItems];
                                  newItems[index] = ev;
                                  return newItems;
                                });
                              }}
                            />
                          )}
                        />
                        {errors.ingredients?.[index]?.inventory && (
                          <p className="text-sm text-red-500">
                            {errors.ingredients[index]?.inventory?.message}
                          </p>
                        )}
                      </div>

                      <div className="flex-1 space-y-2">
                        <Controller
                          name={`ingredients.${index}.quantity`}
                          control={control}
                          render={({ field }) => (
                            <QuantityInput
                              {...field}
                              value={String(field.value)}
                              unity={unity as Unity}
                              onChange={(value) =>
                                field.onChange(Number(value))
                              }
                            />
                          )}
                        />
                        {errors.ingredients?.[index]?.quantity && (
                          <p className="text-sm text-red-500">
                            {errors.ingredients[index]?.quantity?.message}
                          </p>
                        )}
                      </div>

                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        onClick={() => {
                          remove(index); // Remove o campo do formulário
                          setCurrentItem((prev) => {
                            const newItems = [...prev];
                            newItems.splice(index, 1); // Remove o item correspondente em currentItem
                            return newItems;
                          });
                        }}
                        className="mt-1"
                      >
                        <Trash size={16} />
                      </Button>
                    </div>
                  );
                })}
              </div>

              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  append({ inventory: "", quantity: 0 });
                  setCurrentItem((prev) => [...prev, { value: "", label: "" }]); // Adiciona um item vazio em currentItem
                }}
                className="w-full"
              >
                <Plus size={16} className="mr-2" />
                Adicionar Insumo
              </Button>
            </div>

            {/* Botões de Salvar e Resetar */}
            <div className="flex gap-4">
              <Button type="submit" className="flex-1">
                Salvar Produto
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={handleResetForm}
                className="flex-1"
              >
                <RefreshCw size={16} className="mr-2" />
                Resetar
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </>
  );
}
