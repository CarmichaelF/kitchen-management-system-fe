import { usePathname } from "next/navigation";

export function useBreadcrumb({ id }: { id?: string }) {
  const pathname = usePathname();

  // Mapeamento de breadcrumbs com caminhos únicos
  const breadcrumbsMap = new Map<string, string>([
    ["/dashboard", "Visão Geral"],
    ["/dashboard/input", "Insumos"],
    ["/dashboard/inventory", "Estoque"],
    ["/dashboard/product", "Produtos"],
    ["/dashboard/pricing", "Precificação"],
    ["/dashboard/customer", "Cadastro de Clientes"],
    ["/dashboard/order", "Encomendas / Vendas"],
    ["/dashboard/order/board", "Quadro de Pedidos"],
  ]);

  // Adiciona o breadcrumb do ID se existir
  if (id) {
    const orderPath = `/dashboard/order/board/${id}`;
    breadcrumbsMap.set(orderPath, `Pedido #${id.slice(-4)}`);
  }

  // Cria os breadcrumbs baseados no caminho atual
  const breadcrumbs: { label: string; href: string }[] = [];
  let accumulatedPath = "";

  pathname.split("/").forEach((segment) => {
    if (!segment) return; // Evita segmentos vazios
    accumulatedPath += `/${segment}`;

    if (
      breadcrumbsMap.has(accumulatedPath) &&
      !breadcrumbs.some((b) => b.href === accumulatedPath)
    ) {
      breadcrumbs.push({
        label: breadcrumbsMap.get(accumulatedPath)!,
        href: accumulatedPath,
      });
    }
  });

  return breadcrumbs.length > 0
    ? breadcrumbs
    : [{ label: "Página não encontrada", href: "#" }];
}
