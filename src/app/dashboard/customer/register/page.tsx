"use client";

import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { api } from "@/service/axios";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Pencil } from "lucide-react";

const customerSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  email: z.string().email("E-mail inválido"),
  phone: z.string().min(10, "Telefone inválido"),
  address: z.string().min(5, "Endereço inválido"),
});

type CustomerFormData = z.infer<typeof customerSchema>;

interface Customer extends CustomerFormData {
  _id: string;
}

export default function CustomerRegisterPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CustomerFormData>({
    resolver: zodResolver(customerSchema),
  });

  // Buscar clientes cadastrados
  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await api.get("/customer");
        setCustomers(response.data);
      } catch (error) {
        console.error("Erro ao buscar clientes:", error);
      }
    };
    fetchCustomers();
  }, []);

  // Cadastro de novo cliente
  const onSubmit = async (data: CustomerFormData) => {
    try {
      const response = await api.post("/customer", data);
      setCustomers((prev) => [...prev, response.data.customer]); // Atualiza a tabela
      toast.success("Cliente cadastrado com sucesso!");
      reset();
    } catch (error) {
      console.error("Erro ao cadastrar cliente:", error);
      toast.error("Erro ao cadastrar o cliente.");
    }
  };

  // Abrir modal de edição
  const openEditModal = (customer: Customer) => {
    setEditingCustomer(customer);
    reset(customer);
    setIsModalOpen(true);
  };

  // Atualizar cliente
  const handleUpdate = async (data: CustomerFormData) => {
    if (!editingCustomer) return;

    try {
      const response = await api.put(`/customer/${editingCustomer._id}`, data);
      setCustomers((prev) =>
        prev.map((c) =>
          c._id === editingCustomer._id ? response.data.customer : c
        )
      );
      toast.success("Cliente atualizado com sucesso!");
      setIsModalOpen(false);
    } catch (error) {
      console.error("Erro ao atualizar cliente:", error);
      toast.error("Erro ao atualizar o cliente.");
    }
  };

  return (
    <>
      {/* Formulário de cadastro */}
      <Card className="mx-auto px-6 pt-4">
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
              <Controller
                name="name"
                control={control}
                render={({ field }) => (
                  <div>
                    <Input {...field} placeholder="Nome" />
                    {errors.name && (
                      <p className="text-sm text-red-500 mt-1">
                        {errors.name.message}
                      </p>
                    )}
                  </div>
                )}
              />
              <Controller
                name="email"
                control={control}
                render={({ field }) => (
                  <div>
                    <Input {...field} placeholder="E-mail" />
                    {errors.email && (
                      <p className="text-sm text-red-500 mt-1">
                        {errors.email.message}
                      </p>
                    )}
                  </div>
                )}
              />
              <Controller
                name="phone"
                control={control}
                render={({ field }) => (
                  <div>
                    <Input {...field} placeholder="Telefone" />
                    {errors.phone && (
                      <p className="text-sm text-red-500 mt-1">
                        {errors.phone.message}
                      </p>
                    )}
                  </div>
                )}
              />
              <Controller
                name="address"
                control={control}
                render={({ field }) => (
                  <div>
                    <Input {...field} placeholder="Endereço" />
                    {errors.address && (
                      <p className="text-sm text-red-500 mt-1">
                        {errors.address.message}
                      </p>
                    )}
                  </div>
                )}
              />
            </div>

            <Button type="submit" className="w-full">
              Cadastrar Cliente
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Tabela de clientes */}
      <div className="mt-6 px-6">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>E-mail</TableHead>
              <TableHead>Telefone</TableHead>
              <TableHead>Endereço</TableHead>
              <TableHead>Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {customers.map((customer) => (
              <TableRow key={customer._id}>
                <TableCell>{customer.name}</TableCell>
                <TableCell>{customer.email}</TableCell>
                <TableCell>{customer.phone}</TableCell>
                <TableCell>{customer.address}</TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    onClick={() => openEditModal(customer)}
                  >
                    <Pencil className="h-5 w-5" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Modal de edição */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Cliente</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(handleUpdate)} className="space-y-4">
            <Controller
              name="name"
              control={control}
              render={({ field }) => <Input {...field} placeholder="Nome" />}
            />
            <Controller
              name="email"
              control={control}
              render={({ field }) => <Input {...field} placeholder="E-mail" />}
            />
            <Controller
              name="phone"
              control={control}
              render={({ field }) => (
                <Input {...field} placeholder="Telefone" />
              )}
            />
            <Controller
              name="address"
              control={control}
              render={({ field }) => (
                <Input {...field} placeholder="Endereço" />
              )}
            />
            <DialogFooter>
              <Button type="submit">Atualizar Cliente</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
