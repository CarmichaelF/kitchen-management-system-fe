import { InventoryProvider } from "@/context/inventory-context";
import { ProductTable } from "./table";

export default function ProductPage() {
  return (
    <InventoryProvider>
      <div className="container">
        <ProductTable /> {/* Modal para visualizar produtos */}
      </div>
    </InventoryProvider>
  );
}
