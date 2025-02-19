"use client";

import { Button } from "@/components/ui/button";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { toast } from "sonner";
import { useState } from "react";
import { Combobox, ComboboxItemDTO } from "@/components/ui/combobox";
import { AxiosError } from "axios";
import { useFetchData } from "@/hooks/useFetchData";
import { InputDTO, useInputContext } from "@/context/input-context";
import { DeleteDialog } from "@/components/ui/delete-dialog";

export function InputDeleteForm() {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const { names, fetchAndPopulateNames } = useInputContext();
  const { remove } = useFetchData({ path: "input" });

  const [currentItem, setCurrentItem] = useState<ComboboxItemDTO>(
    {} as ComboboxItemDTO
  );

  const { control, handleSubmit, reset } = useForm<InputDTO>({
    defaultValues: { date: new Date(), unity: "kg" },
  });

  const onSubmit: SubmitHandler<InputDTO> = async () => {
    setIsDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    try {
      const response = await remove({
        id: currentItem.value,
      });
      toast(response.data.message);
      await fetchAndPopulateNames();
      reset();
    } catch (error) {
      if (error instanceof AxiosError) {
        toast(error.response?.data.message);
      } else {
        toast("An unexpected error occurred");
      }
    }
  };

  return (
    <form className="flex flex-col  gap-4" onSubmit={handleSubmit(onSubmit)}>
      <Controller
        name="name"
        control={control}
        render={({ field }) => (
          <Combobox
            items={names}
            value={field.value}
            onChange={(ev) => {
              field.onChange(ev.value);
              setCurrentItem(ev);
            }}
          />
        )}
      />

      <div className=" p-2 flex justify-end gap-4">
        <Button variant="ghost">Cancelar</Button>
        <Button variant="destructive" type="submit">
          Deletar
        </Button>
      </div>
      {/* Dialog para Deleção */}
      <DeleteDialog
        title="Deletar Insumo"
        description="Tem certeza de que deseja deletar este insumo? Esta ação não pode ser
                                desfeita."
        confirmText="Confirmar Deleção"
        isDeleteDialogOpen={isDeleteDialogOpen}
        setIsDeleteDialogOpen={setIsDeleteDialogOpen}
        handleDeleteOrder={handleDelete}
      />
    </form>
  );
}
