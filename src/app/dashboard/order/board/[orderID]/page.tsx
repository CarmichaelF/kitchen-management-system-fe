"use client";

import { useEffect, useState } from "react";
import { api } from "@/service/axios";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { User, Box, List, FileText } from "lucide-react";
import { OrderWithDetails } from "../page";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { DeleteDialog } from "@/components/ui/delete-dialog";

export default function OrderDetailsPage() {
  const { orderID } = useParams();
  const [order, setOrder] = useState<OrderWithDetails | null>(null);
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!orderID) return;
    (async () => {
      try {
        const { data } = await api.get<OrderWithDetails>(`/order/${orderID}`);
        setOrder(data);
      } catch (error) {
        if (error instanceof AxiosError) toast(error.message);
        toast("Não foi possível carregar os detalhes do pedido.");
      }
    })();
  }, [orderID]);

  const handleCancelOrder = async () => {
    try {
      await api.delete(`/order/${order?._id}`);
      toast("O pedido foi cancelado com sucesso.");
      router.push("/dashboard/order/board");
    } catch (error) {
      if (error instanceof AxiosError)
        return toast(error.response?.data.message);
      toast("Não foi possível cancelar o pedido.");
    }
  };

  return (
    <div className="container mx-auto p-6">
      {order ? (
        <>
          <h1 className="text-2xl font-semibold mb-6">
            Detalhes do Pedido{" "}
            <span className="font-bold underline">{`#${orderID?.slice(
              -4
            )}`}</span>
          </h1>

          {/* Informações do Cliente */}
          {order.customer && (
            <div className="space-y-4 mb-6">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <User className="h-5 w-5" />
                Cliente
              </h3>
              <div className="pl-7 space-y-1">
                <p className="text-sm">{order.customerDetails.name}</p>
                {order.customerDetails.email && (
                  <p className="text-sm text-muted-foreground">
                    {order.customerDetails.email}
                  </p>
                )}
                {order.customerDetails.phone && (
                  <p className="text-sm text-muted-foreground">
                    {order.customerDetails.phone}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Itens do Pedido */}
          {order.items && (
            <div className="space-y-4 mb-6">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Box className="h-5 w-5" />
                Itens
              </h3>
              <div className="pl-7 space-y-2">
                {order.items.map((item, index) => (
                  <div key={index} className="flex justify-between">
                    <div>
                      <p className="text-sm">{item?.pricing.product.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {item.quantity}x R$ {order.totalPrice}
                      </p>
                    </div>
                    <p className="text-sm font-medium">
                      R$ {(order.totalPrice / item.quantity).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Informações Gerais */}
          <div className="space-y-4 mb-6">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <List className="h-5 w-5" />
              Informações
            </h3>
            <div className="pl-7 space-y-1">
              <div className="flex justify-between">
                <p className="text-sm">Status</p>
                <p className="text-sm font-medium">{order.status}</p>
              </div>
              <div className="flex justify-between">
                <p className="text-sm">Data de Entrega</p>
                <p className="text-sm font-medium">
                  {new Date(order.dueDate).toLocaleDateString()}
                </p>
              </div>
              <div className="flex justify-between">
                <p className="text-sm">Total</p>
                <p className="text-sm font-medium">
                  R$ {order.totalPrice.toFixed(2)}
                </p>
              </div>
            </div>
          </div>

          {/* Observações */}
          {order.notes && (
            <div className="space-y-4 mb-6">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Observações
              </h3>
              <div className="pl-7">
                <p className="text-sm">{order.notes}</p>
              </div>
            </div>
          )}

          {/* Botões */}
          <div className="flex justify-between mt-4">
            <Button onClick={() => router.push("/dashboard/order/board")}>
              Voltar para o Board
            </Button>
            <Button
              variant="destructive"
              onClick={() => setIsCancelDialogOpen(true)}
            >
              Cancelar Pedido
            </Button>
          </div>

          {/* Dialog para Cancelamento */}
          <DeleteDialog
            title="Cancelar Pedido"
            description="Tem certeza de que deseja cancelar este pedido? Esta ação não pode ser desfeita."
            confirmText="Confirmar Cancelamento"
            isDeleteDialogOpen={isCancelDialogOpen}
            setIsDeleteDialogOpen={setIsCancelDialogOpen}
            handleDeleteOrder={handleCancelOrder}
          />
        </>
      ) : (
        <p>Carregando detalhes do pedido...</p>
      )}
    </div>
  );
}
