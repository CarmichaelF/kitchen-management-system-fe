"use client";
import { useBreadcrumb } from "@/hooks/use-breadcrumb";

export function PageTitle() {
  const title = useBreadcrumb();
  return (
    <div className="flex px-6 pt-4 mb-8">
      <span className="font-semibold size text-sm">{title}</span>
    </div>
  );
}
