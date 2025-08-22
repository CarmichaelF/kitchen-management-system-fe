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
import { Dispatch, SetStateAction, useEffect, useMemo } from "react";
import { Combobox, ComboboxItemDTO } from "@/components/ui/combobox";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Trash } from "lucide-react";
import { QuantityInput } from "@/components/ui/quantity-input";
import { useInventoryContext } from "@/context/inventory-context";
import { toast } from "sonner";
import { api } from "@/service/axios";
import { AxiosError } from "axios";
import { Unity } from "@/context/input-context";
import { Textarea } from "@/components/ui/textarea";

const editProductSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  ingredients: z.array(
    z.object({
      inventory: z.object({
        id: z.string(),
      }),
      quantity: z.number().min(0.000000000001, "Quantidade inválida"),
      unity: z.string().optional(),
    })
  ),
  preparationMethod: z.string(),
});

type EditProductFormData = z.infer<typeof editProductSchema>;

interface EditProductModalProps {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  product: {
    _id: string;
    name: string;
    ingredients: {
      inventory: {
        id: string;
      };
      unity: string;
      quantity: number;
      name: string;
    }[];
    preparationMethod: string;
  };
}

export function EditProductModal({
  open,
  setOpen,
  product,
}: EditProductModalProps) {
  const { allInventory } = useInventoryContext();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
    setValue,
  } = useForm<EditProductFormData>({
    resolver: zodResolver(editProductSchema),
    defaultValues: {
      name: product.name,
      ingredients: product.ingredients.map((ingredient) => ({
        quantity: ingredient.quantity,
        unity: ingredient.unity,
        inventory: {
          id: ingredient.inventory.id,
        },
        name: ingredient.name,
      })),
      preparationMethod: product.preparationMethod,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "ingredients",
  });

  const inventoryMap = useMemo(() => {
    return new Map(allInventory.map((item) => [item.value, item]));
  }, [allInventory]);

  useEffect(() => {
    reset({
      name: product.name,
      ingredients: product.ingredients.map((ingredient) => ({
        quantity: ingredient.quantity,
        unity: ingredient.unity,
        inventory: {
          id: ingredient.inventory.id,
        },
        name: ingredient.name,
      })),
      preparationMethod: product.preparationMethod,
    });
  }, [product, reset]);

  const onSubmit = async (data: EditProductFormData) => {
    try {
      const payload = {
        name: data.name,
        ingredients: data.ingredients.map((ingredient) => ({
          ...ingredient,
          inventory: {
            _id: ingredient.inventory.id,
            name: inventoryMap.get(ingredient.inventory.id)?.label || "",
          },
          unity: ingredient.unity,
          name: inventoryMap.get(ingredient.inventory.id)?.label,
        })),
        preparationMethod: data.preparationMethod,
      };

      await api.put(`/product/${product._id}`, payload);
      toast.success("Produto atualizado com sucesso!");
      setOpen(false);
    } catch (error) {
      console.error("Erro ao editar produto:", error);
      if (error instanceof AxiosError) {
        toast.error(error.response?.data.message);
      } else {
        toast.error("Erro ao editar o produto.");
      }
    }
  };

  const handleInventoryChange = (index: number, selected: ComboboxItemDTO) => {
    const inventory = allInventory.find(
      (item) => item.value === selected.value
    );
    if (inventory) {
      // Atualiza apenas os campos derivados do inventário
      setValue(`ingredients.${index}.inventory`, { id: selected.value });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen} key={product._id}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar Produto</DialogTitle>
        </DialogHeader>

        <Card>
          <CardContent className="pt-4">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <Controller
                name="name"
                control={control}
                render={({ field }) => (
                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      Nome do Produto
                    </label>
                    <Input {...field} placeholder="Nome do Produto" />
                    {errors.name && (
                      <p className="text-red-500 text-sm">
                        {errors.name.message}
                      </p>
                    )}
                  </div>
                )}
              />

              <Controller
                name="preparationMethod"
                control={control}
                render={({ field }) => (
                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      Método de Preparo
                    </label>
                    <Textarea {...field} placeholder="Método de Preparo" />
                    {errors.preparationMethod && (
                      <p className="text-red-500 text-sm">
                        {errors.preparationMethod.message}
                      </p>
                    )}
                  </div>
                )}
              />

              <div className="space-y-4">
                <label className="text-sm font-medium text-gray-700">
                  Insumos
                </label>
                <div className="max-h-60 overflow-y-auto ">
                  {fields.map((field, index) => (
                    <div key={field.id} className="flex gap-4 items-start ">
                      <div className="flex-1 space-y-2">
                        <Controller
                          name={`ingredients.${index}.inventory.id`}
                          control={control}
                          render={({ field: innerField }) => {
                            return (
                              <Combobox
                                items={allInventory}
                                value={innerField.value}
                                onChange={(selected) =>
                                  handleInventoryChange(index, selected)
                                }
                              />
                            );
                          }}
                        />
                        {errors.ingredients?.[index]?.inventory && (
                          <p className="text-red-500 text-sm">
                            {errors.ingredients[index]?.inventory?.message}
                          </p>
                        )}
                      </div>

                      <div className="flex-1 space-y-2">
                        <Controller
                          name={`ingredients.${index}.quantity`}
                          control={control}
                          render={({ field: innerField }) => {
                            return (
                              <QuantityInput
                                {...innerField}
                                value={String(innerField.value)}
                                unity={field.unity as Unity}
                                onChange={(value) =>
                                  innerField.onChange(Number(value))
                                }
                              />
                            );
                          }}
                        />

                        {errors.ingredients?.[index]?.quantity && (
                          <p className="text-red-500 text-sm">
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
                  ))}
                </div>
              </div>

              <Button
                type="button"
                variant="outline"
                onClick={() =>
                  append({
                    quantity: 0,
                    unity: "un",
                    inventory: {
                      id: "",
                    },
                  })
                }
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
