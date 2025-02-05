import { PropsWithChildren } from "react";
import { InputCardProps } from "../../type";

export function InputCard({
  label,
  children,
}: PropsWithChildren<InputCardProps>) {
  return (
    <div className="flex flex-col gap-4 bg-slate-50 p-4 rounded-xl">
      <span className="font-semibold size text-sm">{label}</span>
      {children}
    </div>
  );
}
