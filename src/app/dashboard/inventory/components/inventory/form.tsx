"use client";

import { useFetchData } from "@/hooks/useFetchData";
import { Button } from "@/components/ui/button";
import { Combobox, ComboboxItemDTO } from "@/components/ui/combobox";
import { DatePicker } from "@/components/ui/date-picker";
import { Unity, useInputContext } from "@/context/input-context";
import { api } from "@/service/axios";
import { AxiosError } from "axios";
import { useEffect, useState } from "react";
import { useForm, SubmitHandler, Controller, useWatch } from "react-hook-form";
import { toast } from "sonner";
import { InventoryCardProps } from ".";
import { useInventoryContext } from "@/context/inventory-context";
import { QuantityInput } from "@/components/ui/quantity-input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useHookFormMask } from "use-mask-input";

interface FormData {
  input: string;
  quantity: number;
  date: Date | undefined;
  unity: Unity;
  costPerUnit: string;
}

export function InventoryCardForm({
  type,
}: {
  type: InventoryCardProps["type"];
}) {
  const submitLabel =
    type === "entry" ? "Entrada" : type === "update" ? "Atualizar" : "Saída";
  const { names, fetchAndPopulateNames } = useInputContext();
  const { allInventory, fetchAndPopulateInventory } = useInventoryContext();
  const { create } = useFetchData({ path: "inventory" });

  const [currentItem, setCurrentItem] = useState<ComboboxItemDTO>(
    {} as ComboboxItemDTO
  );

  const { control, register, handleSubmit, reset } = useForm<FormData>({
    defaultValues: { date: new Date(), quantity: 10, unity: "kg" },
  });
  // Para registrar máscaras (ex.: para custo)

  const registerWithMask = useHookFormMask(register);

  // Observe a unidade selecionada para passar ao QuantityInput
  const selectedUnity = useWatch({ control, name: "unity" });
  // Se a unidade for "uni" no select, converte para "un" para o QuantityInput

  const handleCreate = async (data: FormData) => {
    try {
      const response = await create({
        data: {
          input: currentItem.value,
          quantity: data.quantity,
          date: data.date,
          costPerUnit: data.costPerUnit,
          unity: data.unity,
        },
      });
      toast(response.data.message);
    } catch (error) {
      if (error instanceof AxiosError) {
        toast(error.response?.data.message);
      } else {
        console.error("An unexpected error occurred");
      }
    }
  };

  const handleUpdate = async (data: FormData) => {
    try {
      const response = await api.put(`/inventory/${currentItem.value}`, {
        quantity: data.quantity,
        date: data.date,
        unit: data.unity,
        costPerUnit: data.costPerUnit,
      });
      toast(response.data.message);
      fetchItemDetails();
    } catch (error) {
      if (error instanceof AxiosError) {
        toast(error.response?.data.message);
      } else {
        console.error("An unexpected error occurred");
      }
    }
  };

  const handleRemove = async () => {
    try {
      const response = await api.delete(`/inventory/${currentItem.value}`);
      toast(response.data.message);
    } catch (error) {
      if (error instanceof AxiosError) {
        toast(error.response?.data.message);
      } else {
        console.error("An unexpected error occurred");
      }
    }
  };

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    switch (type) {
      case "entry":
        await handleCreate(data);
        await refreshSelects();
        break;
      case "update":
        await handleUpdate(data);
        await refreshSelects();
        break;
      case "exit":
        await handleRemove();
        await refreshSelects();
        break;
    }
  };

  const refreshSelects = async () => {
    await fetchAndPopulateInventory();
    await fetchAndPopulateNames();
    reset();
  };

  const fetchItemDetails = async () => {
    if (type !== "update") return;
    if (currentItem?.value) {
      try {
        // Faz a requisição para buscar o item pelo ID
        const response = await api.get(`/inventory/${currentItem.value}`);
        const item = response.data;

        reset({
          input: currentItem.value,
          quantity: item.quantity,
          date: new Date(item.date),
          unity: item.unity,
          costPerUnit: item.costPerUnit,
        });
      } catch (error) {
        console.error("Error fetching item details:", error);
        // Se o item não for encontrado, reseta apenas quantity e date
        reset({
          input: currentItem.value,
          quantity: 0,
          date: new Date(),
          unity: "kg",
          costPerUnit: "0",
        });
      }
    }
  };

  useEffect(() => {
    fetchAndPopulateInventory();
  }, []);

  useEffect(() => {
    fetchItemDetails();
  }, [currentItem, reset]);

  return (
    <form
      className="flex flex-col bg-slate-50 gap-4"
      onSubmit={handleSubmit(onSubmit)}
    >
      <Controller
        name="input"
        control={control}
        defaultValue="" // Garante um valor inicial vazio
        render={({ field }) => (
          <Combobox
            items={type === "entry" ? names : allInventory}
            value={currentItem?.value || ""} // Usa o valor do currentItem
            onChange={(ev) => {
              field.onChange(ev.value); // Atualiza o valor do campo "name" no formulário
              setCurrentItem(ev); // Atualiza o currentItem
            }}
          />
        )}
      />
      {type !== "exit" && (
        <>
          <Controller
            name="unity"
            control={control}
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger className="form-select">
                  {field.value ? field.value : "Select Unity"}
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="kg">Kilogramas(KG)</SelectItem>
                  <SelectItem value="un">Unidade(Un)</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
          <Input
            placeholder={`Custo por ${selectedUnity}`}
            {...registerWithMask("costPerUnit", "brl-currency", {
              required: true,
            })}
            className="!text-left"
          />
          <Controller
            name="quantity"
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <QuantityInput
                value={field.value.toString()}
                unity={selectedUnity as Unity}
                onChange={field.onChange}
              />
            )}
          />
          <Controller
            name="date"
            control={control}
            render={({ field }) => (
              <DatePicker
                className="w-full"
                value={field.value}
                onChange={field.onChange}
              />
            )}
          />
        </>
      )}
      <div className=" p-2 flex justify-end gap-4">
        <Button variant="ghost">Cancelar</Button>
        <Button
          variant={type === "exit" ? "destructive" : "default"}
          type="submit"
        >
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}
