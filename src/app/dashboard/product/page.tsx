import { InventoryProvider } from "@/context/inventory-context";
import { ProductTable } from "./table";
import { CreateProductForm } from "./create-product-form";

export default function ProductPage() {
  return (
    <InventoryProvider>
      <div className="container">
        <CreateProductForm />
        <ProductTable /> {/* Modal para visualizar produtos */}
      </div>
    </InventoryProvider>
  );
}
