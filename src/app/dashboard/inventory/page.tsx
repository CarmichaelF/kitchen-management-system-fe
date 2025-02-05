import { Metadata } from "next";
import { InventoryCard } from "./components/inventory/index";
import { InputProvider } from "@/context/input-context";
import { InventoryProvider } from "@/context/inventory-context";
import { InventoryModal } from "./components/inventory/modal";

export const metadata: Metadata = {
  title: "Inventory entries",
  description: "Inventory entries",
};

export default function InventoryEntries() {
  return (
    <div className="px-6 flex flex-col gap-4">
      <InventoryModal />
      <InventoryProvider>
        <InputProvider>
          <InventoryCard label="Registrar entrada" />
          <InventoryCard label="Registrar saída" type="update" />
          <InventoryCard label="Deletar estoque" type="exit" />
        </InputProvider>
      </InventoryProvider>
    </div>
  );
}
