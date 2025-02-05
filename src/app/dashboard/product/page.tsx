import { CreateProductForm } from "./create-product-form";
import { InventoryProvider } from "@/context/inventory-context";

export default function ProductPage() {
  return (
    <InventoryProvider>
      <div className="container">
        <CreateProductForm />
      </div>
    </InventoryProvider>
  );
}
