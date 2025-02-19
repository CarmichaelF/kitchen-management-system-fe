"use client";

import { InputCard } from "./components/input-card";
import { InputUpdateForm } from "./components/input-card/input-update-form";
import { InputCreateForm } from "./components/input-card/input-create-form";
import { InputDeleteForm } from "./components/input-card/input-delete-form";
import { InputProvider } from "@/context/input-context";
import { InputListModal } from "./components/input-list-modal";

export default function InputEntries() {
  return (
    <div className="px-6 flex flex-col gap-4 mt-6">
      <h1 className="text-2xl font-bold">Cadastro de Insumos</h1>
      <InputProvider>
        <InputListModal />
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
