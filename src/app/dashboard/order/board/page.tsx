"use client";
import { useEffect, useState } from "react";
import { api } from "@/service/axios";
import { OrderItem } from "../page";
import { OrderDetailsModal } from "./details-modal";
import { AxiosError } from "axios";
import { toast } from "sonner";
import { OrderCard } from "./order-card";
import { Pricing } from "../../pricing/components/pricing-dashboard";

export type Status =
  | "Não Iniciado"
  | "Em Andamento"
  | "Concluído"
  | "Cancelado";

export interface OrderWithDetails extends OrderItem {
  _id: string;
  totalPrice: number;
  dueDate: string;
  status: Status;
  notes: string;
  customer: {
    _id: string;
    name: string;
    email?: string;
    phone?: string;
  };
  customerDetails: {
    name: string;
    email?: string;
    phone?: string;
  };
  items?: {
    quantity: number;
    pricingDetails: Pricing;
  }[];
}

const STATUSES = [
  "Não Iniciado",
  "Em Andamento",
  "Concluído",
  "Cancelado",
] as const;

export default function OrdersBoard() {
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [orders, setOrders] = useState<OrderWithDetails[]>([]);
  const [activeOrder, setActiveOrder] = useState<OrderWithDetails | null>(null);

  // Busca os pedidos ao carregar o componente
  useEffect(() => {
    fetchOrders();
  }, []);

  // Função para buscar os pedidos
  const fetchOrders = async () => {
    try {
      const response = await api.get<OrderWithDetails[]>("/order");
      setOrders(response.data);
    } catch (error) {
      console.error("Erro ao buscar pedidos:", error);
      toast.error("Erro ao buscar pedidos. Tente novamente mais tarde.");
    }
  };

  // Função para atualizar o status de um pedido
  const updateOrderStatus = async (orderId: string, newStatus: Status) => {
    try {
      await api.patch(`/order/${orderId}/status`, { status: newStatus });
      setOrders((prev) =>
        prev.map((order) =>
          order._id === orderId ? { ...order, status: newStatus } : order
        )
      );
      toast.success("Status atualizado com sucesso!");
    } catch (error) {
      console.error("Erro ao atualizar status:", error);
      toast.error("Erro ao atualizar status do pedido.");
    }
  };

  // Função para cancelar um pedido
  const handleCancelOrder = async (orderId: string, force = false) => {
    try {
      await api.delete(`/order/${orderId}`, { params: force });
      toast.success("Pedido cancelado com sucesso!");
      await fetchOrders();
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data.message || "Erro ao cancelar pedido.");
      } else {
        console.error("Erro inesperado:", error);
        toast.error("Erro inesperado ao cancelar pedido.");
      }
    }
  };

  // Filtra os pedidos por status
  const getOrdersByStatus = (status: Status) =>
    orders.filter((order) => order.status === status);

  return (
    <div className="p-6 overflow-x-auto w-full">
      <h1 className="text-2xl font-bold mb-6">Quadro de Pedidos</h1>

      <div className="flex gap-4  pb-4 ">
        {STATUSES.map((status) => (
          <div key={status} className="bg-muted/50 p-4 rounded-lg flex-1">
            <h2 className="font-semibold mb-4">{status}</h2>
            <div className="space-y-2">
              {getOrdersByStatus(status).map((order) => (
                <OrderCard
                  key={order._id}
                  order={order}
                  onStatusChange={updateOrderStatus}
                  setIsDetailsOpen={setIsDetailsOpen}
                  setActiveOrder={setActiveOrder}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      {activeOrder && (
        <OrderDetailsModal
          order={activeOrder}
          isDetailsOpen={isDetailsOpen}
          setIsDetailsOpen={setIsDetailsOpen}
          onCancelOrder={handleCancelOrder}
        />
      )}
    </div>
  );
}
