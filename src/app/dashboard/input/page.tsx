import { Metadata } from "next";
import { InputCard } from "./components/input-card";
import { InputUpdateForm } from "./components/input-card/input-update-form";
import { InputCreateForm } from "./components/input-card/input-create-form";
import { InputDeleteForm } from "./components/input-card/input-delete-form";
import { InputProvider } from "@/context/input-context";

export const metadata: Metadata = {
  title: "Inventory entries",
  description: "Inventory entries",
};

export default function InputEntries() {
  return (
    <div className="px-6 flex flex-col gap-4">
      <InputProvider>
        <InputCard label="Registrar insumo">
          <InputCreateForm />
        </InputCard>
        <InputCard label="Editar insumo">
          <InputUpdateForm />
        </InputCard>
        <InputCard label="Deletar insumo">
          <InputDeleteForm />
        </InputCard>
      </InputProvider>
    </div>
  );
}
