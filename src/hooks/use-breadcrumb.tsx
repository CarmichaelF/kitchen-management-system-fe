import { usePathname } from "next/navigation";

export function useBreadcrumb() {
  const pathname = usePathname();

  const breadcrumbs: { [key: string]: string }[] = [
    {
      "/dashboard": "Visão Geral",
      "/dashboard/inventory": "Estoque",
      "/dashboard/input": "Insumos",
      "/dashboard/pricing": "Precificação",
      "/dashboard/product": "Produtos",
    },
  ];

  const getBreadcrumb = (): string => {
    return breadcrumbs.reduce((acc, breadcrumb) => {
      return breadcrumb[pathname] || acc;
    }, "");
  };

  return getBreadcrumb();
}
