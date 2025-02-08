// components/OrderDetailsModal.tsx
"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { User, Box, List } from "lucide-react";

interface OrderDetailsModalProps {
  order: {
    _id: string;
    status: string;
    totalPrice: number;
    dueDate: string;
    customer: {
      name: string;
      email?: string;
      phone?: string;
    };
    items?: {
      product: {
        name: string;
      };
      quantity: number;
      pricing: {
        additionalCosts: number;
        createdAt: Date;
        platformFee: number;
        product: string;
        profitMargin: number;
        sellingPrice: number;
      };
    }[];
  };
  isOpen: boolean;
  onClose: () => void;
}

export function OrderDetailsModal({
  order,
  isOpen,
  onClose,
}: OrderDetailsModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle className="text-xl">Detalhes do Pedido</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Informações do Cliente */}
          <div className="space-y-2">
            <h3 className="font-semibold flex items-center gap-2">
              <User className="h-5 w-5" />
              Cliente
            </h3>
            <div className="pl-7 space-y-1">
              <p className="text-sm">{order.customer.name}</p>
              {order.customer.email && (
                <p className="text-sm text-muted-foreground">
                  {order.customer.email}
                </p>
              )}
              {order.customer.phone && (
                <p className="text-sm text-muted-foreground">
                  {order.customer.phone}
                </p>
              )}
            </div>
          </div>

          {/* Itens do Pedido */}
          {order.items && (
            <div className="space-y-2">
              <h3 className="font-semibold flex items-center gap-2">
                <Box className="h-5 w-5" />
                Itens
              </h3>
              <div className="pl-7 space-y-2">
                {order.items.map((item, index) => (
                  <div key={index} className="flex justify-between">
                    <div>
                      <p className="text-sm">{item?.product?.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {item.quantity}x R${" "}
                        {item?.pricing?.sellingPrice.toFixed(2)}
                      </p>
                    </div>
                    <p className="text-sm font-medium">
                      R${" "}
                      {(item.quantity * item.pricing?.sellingPrice).toFixed(2)}
                    </p>
                  </div>
                ))}
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
        </div>
      </DialogContent>
    </Dialog>
  );
}
