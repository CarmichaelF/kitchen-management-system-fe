import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge, CalendarDays, CircleDollarSign, User } from "lucide-react";
import { OrderWithDetails, Status } from "./page";

interface OrderCardProps {
  order: OrderWithDetails;
  onStatusChange?: (orderId: string, newStatus: Status) => void;
  setIsDetailsOpen?: (isOpen: boolean) => void;
  setActiveOrder?: (order: OrderWithDetails | null) => void;
}

export function OrderCard({
  order,
  onStatusChange,
  setIsDetailsOpen,
  setActiveOrder,
}: OrderCardProps) {
  const statusColors = {
    "Não Iniciado": "bg-gray-500",
    "Em Andamento": "bg-blue-500",
    Concluído: "bg-green-500",
    Cancelado: "bg-red-500",
  };

  return (
    <Card className="relative overflow-hidden p-4">
      {/* Barra lateral de status */}
      <div
        className={`absolute left-0 top-0 h-full w-1 ${
          statusColors[order.status]
        }`}
      />

      {/* Cabeçalho */}
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg font-semibold">
            Pedido #{order._id.slice(-4)}
          </CardTitle>
          <Badge className="text-sm">{order.status}</Badge>
        </div>
      </CardHeader>

      {/* Conteúdo */}
      <CardContent className="space-y-3">
        <div className="flex items-center gap-2">
          <User className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm">{order.customerDetails?.name}</span>
        </div>

        <div className="flex items-center gap-2">
          <CircleDollarSign className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm">
            Total:{" "}
            <span className="font-medium">
              R$ {order.totalPrice.toFixed(2)}
            </span>
          </span>
        </div>

        <div className="flex items-center gap-2 pb-2">
          <CalendarDays className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm">
            Entrega:{" "}
            <span className="font-medium">
              {new Date(order.dueDate).toLocaleDateString()}
            </span>
          </span>
        </div>
      </CardContent>

      {/* Rodapé */}
      <CardFooter className="flex justify-between gap-2">
        {order.status !== "Cancelado" && onStatusChange && (
          <Select
            value={order.status}
            onValueChange={(value) =>
              onStatusChange(order._id, value as Status)
            }
          >
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Não Iniciado">Não Iniciado</SelectItem>
              <SelectItem value="Em Andamento">Em Andamento</SelectItem>
              <SelectItem value="Concluído">Concluído</SelectItem>
            </SelectContent>
          </Select>
        )}
        <Button
          variant="outline"
          size="sm"
          className="flex-1"
          onClick={() => {
            setIsDetailsOpen?.(true);
            setActiveOrder?.(order);
          }}
        >
          Detalhes
        </Button>
      </CardFooter>
    </Card>
  );
}
