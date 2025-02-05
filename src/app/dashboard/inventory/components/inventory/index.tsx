import { InventoryCardForm } from "./form";

export interface InventoryCardProps {
  label: string;
  type?: "entry" | "update" | "exit";
}

export function InventoryCard({ label, type = "entry" }: InventoryCardProps) {
  return (
    <div className="flex flex-col gap-4 bg-slate-50 p-4 rounded-xl">
      <span className="font-semibold size text-sm">{label}</span>
      <InventoryCardForm type={type} />
    </div>
  );
}
