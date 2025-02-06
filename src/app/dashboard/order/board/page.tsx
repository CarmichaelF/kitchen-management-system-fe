"use client";
import { useEffect, useState } from "react";
import {
  DndContext,
  DragOverlay,
  closestCorners,
  DragStartEvent,
  DragEndEvent,
  useSensors,
  PointerSensor,
  useSensor,
  Over,
  Active,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { api } from "@/service/axios";
import { OrderItem } from "../page";
import { SortableCard } from "./sortable-card";
import OrderCard from "./order-card";
import { useDroppable } from "@dnd-kit/core";

export interface OrderWithDetails extends OrderItem {
  _id: string;
  customer: {
    name: string;
  };
  status: "Não Iniciado" | "Em Andamento" | "Concluído";
  totalPrice: number;
  dueDate: string;
  position: number;
  items?: {
    pricing: {
      additionalCosts: number;
      createdAt: Date;
      platformFee: number;
      product: string;
      profitMargin: number;
      sellingPrice: number;
    };
    quantity: number;
  }[];
}

const STATUSES = ["Não Iniciado", "Em Andamento", "Concluído"] as const;

function Column({
  id,
  status,
  children,
}: {
  id: string;
  status: string;
  children: React.ReactNode;
}) {
  const { setNodeRef } = useDroppable({
    id,
    data: {
      status,
    },
  });

  return (
    <div ref={setNodeRef} className="bg-muted/50 p-4 rounded-lg flex-1">
      {children}
    </div>
  );
}

export default function OrdersBoard() {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const [orders, setOrders] = useState<OrderWithDetails[]>([]);
  const [activeOrder, setActiveOrder] = useState<OrderWithDetails | null>(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const sortByPosition = (a: OrderWithDetails, b: OrderWithDetails) => {
    return a.position - b.position;
  };

  const fetchOrders = async () => {
    try {
      const response = await api.get<OrderWithDetails[]>("/order");
      setOrders(response.data.sort(sortByPosition));
    } catch (error) {
      console.error("Erro ao buscar pedidos:", error);
    }
  };

  const handleStatusChange = async (
    orderId: string,
    newStatus: (typeof STATUSES)[number]
  ) => {
    try {
      await api.patch(`/order/${orderId}/status`, { status: newStatus });
      setOrders((prev) =>
        prev.map((order) =>
          order._id === orderId ? { ...order, status: newStatus } : order
        )
      );
    } catch (error) {
      console.error("Erro ao atualizar status:", error);
    }
  };
  const handlePositionChange = async (over: Over, active: Active) => {
    try {
      await api.patch(`/order/${active.id}/position`, {
        position: over?.data?.current?.order?.position,
      });
      await api.patch(`/order/${over.id}/position`, {
        position: active?.data?.current?.order?.position,
      });
      await fetchOrders();
    } catch (error) {
      console.error("Erro ao atualizar position:", error);
    }
  };

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const order = orders.find((o) => o._id === active.id);
    if (order) setActiveOrder(order);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id.toString();
    const overId = over.id.toString();

    if (activeId === overId) return;

    const activeOrder = orders.find((order) => order._id === activeId);

    if (!activeOrder) return;

    // Movimento entre colunas
    if (over.data?.current?.status) {
      const newStatus = over.data.current.status;
      handleStatusChange(activeId, newStatus);
      handlePositionChange(over, active);
      return;
    }

    // Movimento dentro da mesma coluna
    const oldIndex = orders.findIndex((o) => o._id === activeId);
    const newIndex = orders.findIndex((o) => o._id === overId);
    setOrders((prev) => arrayMove(prev, oldIndex, newIndex));
  };

  const getOrdersByStatus = (status: (typeof STATUSES)[number]) =>
    orders.filter((order) => order.status === status);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Quadro de Pedidos</h1>

      <DndContext
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        sensors={sensors}
      >
        <div className="flex gap-4 overflow-x-auto pb-4">
          {STATUSES.map((status) => (
            <Column key={status} id={status} status={status}>
              <h2 className="font-semibold mb-4">{status}</h2>
              <SortableContext
                items={getOrdersByStatus(status).map((o) => o._id)}
                strategy={verticalListSortingStrategy}
              >
                <div className="space-y-2 min-w-[300px]">
                  {getOrdersByStatus(status).map((order) => (
                    <SortableCard key={order._id} order={order} />
                  ))}
                </div>
              </SortableContext>
            </Column>
          ))}
        </div>

        <DragOverlay>
          {activeOrder && <OrderCard order={activeOrder} isDragging />}
        </DragOverlay>
      </DndContext>
    </div>
  );
}
