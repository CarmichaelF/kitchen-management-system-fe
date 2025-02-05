"use client";

import { Button } from "@/components/ui/button";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { toast } from "sonner";
import { useState } from "react";
import { Combobox, ComboboxItemDTO } from "@/components/ui/combobox";
import { AxiosError } from "axios";
import { useFetchData } from "@/hooks/useFetchData";
import { InputDTO, useInputContext } from "@/context/input-context";

export function InputDeleteForm() {
  const { names, fetchAndPopulateNames } = useInputContext();
  const { remove } = useFetchData({ path: "input" });

  const [currentItem, setCurrentItem] = useState<ComboboxItemDTO>(
    {} as ComboboxItemDTO
  );

  const { control, handleSubmit, reset } = useForm<InputDTO>({
    defaultValues: { date: new Date(), unity: "kg" },
  });

  const onSubmit: SubmitHandler<InputDTO> = async () => {
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
    <form
      className="flex flex-col bg-slate-50 gap-4"
      onSubmit={handleSubmit(onSubmit)}
    >
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
        <Button type="submit">Deletar</Button>
      </div>
    </form>
  );
}
