"use client";

import { useForm, Controller, useFieldArray } from "react-hook-form";
import { Fragment, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Combobox, ComboboxItemDTO } from "@/components/ui/combobox";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Plus, Trash } from "lucide-react";
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
import { ProductModal } from "./modal";

export interface ProductDTO {
  _id: string;
  name: string;
  ingredients: {
    _id: string;
    inventoryID: string;
    quantity: number;
    name: string;
  }[];
  createdAt: Date;
}

const productSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  ingredients: z.array(
    z.object({
      inventoryID: z.string().min(1, "Selecione um insumo"),
      quantity: z.number().min(0.01, "Quantidade inválida"),
    })
  ),
});

type ProductFormData = z.infer<typeof productSchema>;

export function CreateProductForm() {
  const [currentItem, setCurrentItem] = useState<ComboboxItemDTO[]>(
    [] as ComboboxItemDTO[]
  );
  const { allInventory } = useInventoryContext();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      ingredients: [{ inventoryID: "", quantity: 0 }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "ingredients",
  });

  const onSubmit = async (data: ProductFormData) => {
    try {
      await api.post<ProductDTO>("/product", {
        name: data.name,
        ingredients: data.ingredients.map(
          (ingredient: { inventoryID: string; quantity: number }, index) => ({
            inventoryID: ingredient.inventoryID,
            quantity: ingredient.quantity,
            name: currentItem[index].label,
          })
        ),
      });

      toast.success("Produto criado com sucesso!");
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
      <Card className="mx-auto px-6 pt-4">
        <CardHeader className="flex justify-between mb-4">
          <ProductModal />
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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
                          name={`ingredients.${index}.inventoryID`}
                          control={control}
                          render={({ field }) => (
                            <Combobox
                              items={allInventory}
                              value={currentItem[index]?.value || ""}
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
                        {errors.ingredients?.[index]?.inventoryID && (
                          <p className="text-sm text-red-500">
                            {errors.ingredients[index]?.inventoryID?.message}
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
                        onClick={() => remove(index)}
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
                onClick={() => append({ inventoryID: "", quantity: 0 })}
                className="w-full"
              >
                <Plus size={16} className="mr-2" />
                Adicionar Insumo
              </Button>
            </div>

            <Button type="submit" className="w-full">
              Salvar Produto
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Modal para exibir os produtos cadastrados */}
    </>
  );
}
