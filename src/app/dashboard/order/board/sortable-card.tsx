// components/SortableOrderCard.tsx
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { OrderWithDetails } from "./page";
import OrderCard from "./order-card";

export function SortableCard({ order }: { order: OrderWithDetails }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: order._id,
    data: {
      type: "Order",
      order,
      status: order.status,
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 1 : 0,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="touch-none"
    >
      <OrderCard order={order} isDragging={isDragging} />
    </div>
  );
}
