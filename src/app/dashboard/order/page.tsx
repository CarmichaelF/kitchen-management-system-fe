"use client";

import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { AxiosError } from "axios";
import { toast } from "sonner";
import { api } from "@/service/axios";
import { CalendarIcon } from "lucide-react";

// Modelo para precificação
export interface PricingDTO {
  _id: string;
  sellingPrice: number;
  product: {
    _id: string;
    name: string;
  };
}

// Item do pedido
export interface OrderItem {
  pricingId: string;
  quantity: number;
}

// Modelo para cliente
export interface CustomerDTO {
  _id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
}

export default function OrdersPage() {
  const [pricings, setPricings] = useState<PricingDTO[]>([]);
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [customers, setCustomers] = useState<CustomerDTO[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<string>("");
  const [dueDate, setDueDate] = useState<Date | undefined>(undefined); // Novo campo: data limite
  const [notes, setNotes] = useState<string>(""); // Novo campo: observações

  // Busca as precificações disponíveis
  useEffect(() => {
    api
      .get<PricingDTO[]>("/pricing")
      .then((response) => {
        setPricings(response.data);
      })
      .catch((err) => {
        console.error("Erro ao buscar precificações:", err);
        toast.error("Erro ao buscar precificações");
      });
  }, []);

  // Busca os clientes cadastrados
  useEffect(() => {
    api
      .get<CustomerDTO[]>("/customer")
      .then((response) => {
        setCustomers(response.data);
      })
      .catch((err) => {
        console.error("Erro ao buscar clientes:", err);
        toast.error("Erro ao buscar clientes");
      });
  }, []);

  // Atualiza ou adiciona a quantidade para uma precificação
  const handleQuantityChange = (pricingId: string, quantity: number) => {
    setOrderItems((prev) => {
      const existingIndex = prev.findIndex(
        (item) => item.pricingId === pricingId
      );
      if (existingIndex !== -1) {
        const newItems = [...prev];
        newItems[existingIndex].quantity = quantity;
        return newItems;
      } else {
        return [...prev, { pricingId, quantity }];
      }
    });
  };

  // Envia o pedido para o back-end
  const handleSubmitOrder = async () => {
    if (!selectedCustomer) {
      toast.error("Selecione um cliente.");
      return;
    }

    const itemsToOrder = orderItems.filter((item) => item.quantity > 0);
    if (itemsToOrder.length === 0) {
      toast.error("Selecione ao menos um produto com quantidade.");
      return;
    }

    if (!dueDate) {
      toast.error("Selecione uma data limite.");
      return;
    }

    try {
      await api.post("/order", {
        customerId: selectedCustomer,
        items: itemsToOrder,
        dueDate: dueDate.toISOString(), // Converte a data para ISO string
        notes, // Novo campo: observações
      });
      toast.success("Pedido criado com sucesso!");
      setOrderItems([]);
      setDueDate(undefined); // Limpa o campo de data limite
      setNotes(""); // Limpa o campo de observações
    } catch (error) {
      console.error("Erro ao criar pedido:", error);
      if (error instanceof AxiosError)
        return toast.error(
          error.response?.data.message || "Erro ao criar o pedido."
        );
      toast.error("Erro ao criar o pedido.");
    }
  };

  return (
    <div className="px-6 py-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">
            Nova Encomenda / Venda
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Seção para selecionar o cliente */}
          <div className="mb-6">
            <Label htmlFor="customer-select" className="mt-4 mb-2 block">
              Cliente
            </Label>
            <Select
              value={selectedCustomer}
              onValueChange={(value) => setSelectedCustomer(value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Selecione um cliente" />
              </SelectTrigger>
              <SelectContent>
                {customers.map((customer) => (
                  <SelectItem key={customer._id} value={customer._id}>
                    {customer.name} - {customer.email}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Novo campo: Data Limite com Calendar */}
          <div className="mb-6">
            <Label htmlFor="due-date" className="mt-4 mb-2 block">
              Data Limite
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dueDate ? format(dueDate, "PPP") : "Selecione uma data"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={dueDate}
                  onSelect={setDueDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Novo campo: Observações */}
          <div className="mb-6">
            <Label htmlFor="notes" className="mt-4 mb-2 block">
              Observações (Opcional)
            </Label>
            <Input
              id="notes"
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Digite observações, se necessário"
            />
          </div>

          {/* Seção para listar as precificações e definir quantidades */}
          <div className="space-y-4">
            {pricings.length > 0 ? (
              pricings.map((pricing) => (
                <div
                  key={pricing._id}
                  className="flex items-center gap-4 border p-4 rounded"
                >
                  <div className="flex-1">
                    <p className="font-bold">{pricing.product.name}</p>
                    <p className="text-sm">
                      Preço: R$ {pricing.sellingPrice.toFixed(2)}
                    </p>
                  </div>
                  <div className="w-32">
                    <Label htmlFor={`quantity-${pricing._id}`}>
                      Quantidade
                    </Label>
                    <Input
                      id={`quantity-${pricing._id}`}
                      type="number"
                      min="0"
                      placeholder="0"
                      onChange={(e) =>
                        handleQuantityChange(
                          pricing._id,
                          Number(e.target.value)
                        )
                      }
                    />
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-sm text-muted-foreground">
                Nenhuma precificação encontrada.
              </p>
            )}
          </div>
          <div className="mt-6 flex justify-end">
            <Button onClick={handleSubmitOrder}>Criar Pedido</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
