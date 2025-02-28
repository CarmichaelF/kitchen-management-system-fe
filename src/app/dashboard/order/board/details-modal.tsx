"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { User, Box, List, FileText } from "lucide-react";
import { OrderWithDetails } from "./page";
import { Dispatch, SetStateAction } from "react";
import { Button } from "@/components/ui/button";

interface OrderDetailsModalProps {
  order: OrderWithDetails;
  isDetailsOpen: boolean;
  setIsDetailsOpen: Dispatch<SetStateAction<boolean>>;
  onCancelOrder: (orderId: string, force?: boolean) => void;
}

export function OrderDetailsModal({
  order,
  isDetailsOpen,
  setIsDetailsOpen,
  onCancelOrder,
}: OrderDetailsModalProps) {
  return (
    <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
      <DialogContent className="z-50">
        <DialogHeader>
          <DialogTitle className="text-xl">Detalhes do Pedido</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Informações do Cliente */}
          {order.customerDetails && (
            <div className="space-y-2">
              <h3 className="font-semibold flex items-center gap-2">
                <User className="h-5 w-5" />
                Cliente
              </h3>
              <div className="pl-7 space-y-1">
                <p className="text-sm">{order?.customerDetails?.name}</p>
                {order?.customerDetails?.email && (
                  <p className="text-sm text-muted-foreground">
                    {order?.customerDetails?.email}
                  </p>
                )}
                {order?.customerDetails?.phone && (
                  <p className="text-sm text-muted-foreground">
                    {order?.customerDetails?.phone}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Itens do Pedido */}
          {order.items && (
            <div className="space-y-2">
              <h3 className="font-semibold flex items-center gap-2">
                <Box className="h-5 w-5" />
                Itens
              </h3>
              <div className="pl-7 space-y-2">
                {order.items.map((item, index) => {
                  return (
                    <div key={index} className="flex justify-between">
                      <div>
                        <p className="text-sm">
                          {item?.pricingDetails.product.name}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {item.quantity}x R$ {item.pricingDetails.sellingPrice}
                        </p>
                      </div>
                      <p className="text-sm font-medium">
                        R${" "}
                        {(
                          item.pricingDetails.sellingPrice * item.quantity
                        ).toFixed(2)}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Informações Gerais */}
          <div className="space-y-2">
            <h3 className="font-semibold flex items-center gap-2">
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
        </div>

        {/* Botão de Cancelar Pedido */}
        <div className="mt-4">
          <Button
            variant="destructive"
            onClick={() => onCancelOrder(order._id)} // Chama a função de cancelamento
          >
            Cancelar Pedido
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
