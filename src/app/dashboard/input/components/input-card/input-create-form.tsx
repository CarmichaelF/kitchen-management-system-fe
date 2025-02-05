"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm, SubmitHandler } from "react-hook-form";
import { toast } from "sonner";
import {
  InputDTO,
  useInputContext,
} from "../../../../../context/input-context";
import { AxiosError } from "axios";
import { useFetchData } from "@/hooks/useFetchData";

export function InputCreateForm() {
  const { fetchAndPopulateNames } = useInputContext();
  const { create } = useFetchData({ path: "input" });

  const { register, handleSubmit } = useForm<InputDTO>({
    defaultValues: { date: new Date() },
  });

  const onSubmit: SubmitHandler<InputDTO> = async (data: InputDTO) => {
    try {
      const response = await create({ data });
      toast(response.data.message);
      await fetchAndPopulateNames();
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
      <Input
        placeholder="Nome"
        type="text"
        {...register("name", { required: true })}
      />
      <Input
        placeholder="Limite de estoque"
        type="number"
        {...register("stockLimit", { required: true })}
      />

      <div className="p-2 flex justify-end gap-4">
        <Button variant="ghost">Cancelar</Button>
        <Button type="submit">Salvar</Button>
      </div>
    </form>
  );
}
