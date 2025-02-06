"use client";

import { useForm, Controller } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { api } from "@/service/axios";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const customerSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  email: z.string().email("E-mail inválido"),
  phone: z.string().min(10, "Telefone inválido"),
  address: z.string().min(5, "Endereço inválido"),
});

type CustomerFormData = z.infer<typeof customerSchema>;

export default function CustomerRegisterPage() {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<CustomerFormData>({
    resolver: zodResolver(customerSchema),
  });

  const onSubmit = async (data: CustomerFormData) => {
    try {
      await api.post("/customer", data);
      toast.success("Cliente cadastrado com sucesso!");
    } catch (error) {
      console.error("Erro ao cadastrar cliente:", error);
      toast.error("Erro ao cadastrar o cliente.");
    }
  };

  return (
    <Card className="mx-auto px-6 pt-4">
      <CardHeader className="text-center mb-4">
        <h2 className="text-xl font-semibold">Cadastro de Cliente</h2>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <div>
                  <Input {...field} placeholder="Nome" className="w-full" />
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
                  <Input {...field} placeholder="E-mail" className="w-full" />
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
                  <Input {...field} placeholder="Telefone" className="w-full" />
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
                  <Input {...field} placeholder="Endereço" className="w-full" />
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
  );
}
