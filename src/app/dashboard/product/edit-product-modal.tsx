import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Dispatch, SetStateAction, useState } from "react";
import { Combobox, ComboboxItemDTO } from "@/components/ui/combobox";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Trash } from "lucide-react";
import { QuantityInput } from "@/components/ui/quantity-input";
import { Unity } from "@/context/input-context";
import {
  InventoryData,
  InventoryDTO,
  useInventoryContext,
} from "@/context/inventory-context";
import { toast } from "sonner";
import { api } from "@/service/axios";
import { AxiosError } from "axios";

export interface ProductDTO {
  _id: string;
  name: string;
  ingredients: {
    _id: string;
    inventory: InventoryDTO;
    quantity: number;
    name: string;
  }[];
}

const editProductSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  ingredients: z.array(
    z.object({
      inventory: z.string().min(1, "Selecione um insumo"),
      quantity: z.number().min(0.01, "Quantidade inválida"),
    })
  ),
});

type EditProductFormData = z.infer<typeof editProductSchema>;

interface EditProductModalProps {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  product: ProductDTO;
}

export function EditProductModal({
  open,
  setOpen,
  product,
}: EditProductModalProps) {
  const { allInventory } = useInventoryContext();
  const [currentItem, setCurrentItem] = useState<ComboboxItemDTO[]>(() =>
    product.ingredients.map((ingredient) => ({
      value: ingredient.inventory._id,
      label: ingredient.name,
    }))
  );

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<EditProductFormData>({
    resolver: zodResolver(editProductSchema),
    defaultValues: {
      name: product.name,
      ingredients: product.ingredients.map((ingredient) => ({
        inventory: ingredient.inventory._id,
        quantity: ingredient.quantity,
      })),
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "ingredients",
  });

  const onSubmit = async (data: EditProductFormData) => {
    try {
      await api.put(`/product/${product._id}`, {
        name: data.name,
        ingredients: data.ingredients.map((ingredient, index) => ({
          inventory: ingredient.inventory,
          quantity: ingredient.quantity,
          name: currentItem[index]?.label,
        })),
      });

      toast.success("Produto atualizado com sucesso!");
      setOpen(false);
    } catch (error) {
      console.error("Erro ao editar produto:", error);
      if (error instanceof AxiosError)
        return toast.error(error.response?.data.message);
      return toast.error("Erro ao editar o produto.");
    }
  };

  const getIngredientUnity = (index: number) => {
    const ingredient = allInventory.find(
      (n: InventoryData) => n.value === currentItem?.[index]?.value
    );
    return ingredient?.unity || "kg";
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar Produto</DialogTitle>
        </DialogHeader>
        <Card>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <Controller
                name="name"
                control={control}
                render={({ field }) => (
                  <div>
                    <Input
                      {...field}
                      placeholder="Nome do Produto"
                      className="w-full"
                    />
                    {errors.name && (
                      <p className="text-sm text-red-500">
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
                onClick={() => append({ inventory: "", quantity: 0 })}
                className="w-full"
              >
                <Plus size={16} className="mr-2" />
                Adicionar Insumo
              </Button>

              <Button type="submit" className="w-full">
                Salvar Alterações
              </Button>
            </form>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
}
