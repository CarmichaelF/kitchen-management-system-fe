import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { OrderWithDetails } from "./page";
import { SortableCard } from "./sortable-card";

export function Column({
  id,
  title,
  orders,
}: {
  id: string;
  title: string;
  orders: OrderWithDetails[];
}) {
  const { setNodeRef, isOver } = useDroppable({
    id,
    data: {
      type: "Column",
      status: title,
    },
  });

  return (
    <div
      ref={setNodeRef}
      className={`column droppable ${isOver ? "is-over" : ""}`}
      style={{
        backgroundColor: isOver ? "#f0f9ff" : "transparent",
        transition: "background-color 0.2s ease",
      }}
    >
      <h2 className="font-semibold mb-4">{title}</h2>
      <SortableContext
        items={orders.map((o) => o._id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="space-y-2">
          {orders.map((order) => (
            <SortableCard key={order._id} order={order} />
          ))}
        </div>
      </SortableContext>
    </div>
  );
}
