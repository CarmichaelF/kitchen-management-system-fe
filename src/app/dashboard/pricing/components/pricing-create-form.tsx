"use client";

import { useForm, Controller } from "react-hook-form";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Combobox } from "@/components/ui/combobox";
import { api } from "@/service/axios";
import { Pricing } from "./pricing-dashboard";

interface Product {
  _id: string;
  name: string;
}

interface PricingFormProps {
  products: Product[];
  onPricingCreated: (newPricing: Pricing) => void;
}

export function PricingForm({ products, onPricingCreated }: PricingFormProps) {
  const { register, handleSubmit, control, reset } = useForm({
    defaultValues: {
      productId: "",
    } as {
      productId: string;
      profitMargin?: number;
      additionalCosts?: number;
      platformFee?: number;
    },
  });

  const onSubmit = async (data: {
    productId: string;
    profitMargin?: number;
    additionalCosts?: number;
    platformFee?: number;
  }) => {
    try {
      const response = await api.post("/pricing", data);
      onPricingCreated(response.data);
      reset();
    } catch (err) {
      console.error("Erro ao criar precificação:", err);
    }
  };

  return (
    <Card>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Controller
            name="productId"
            control={control}
            render={({ field }) => (
              <Combobox
                items={products.map((p) => ({ value: p._id, label: p.name }))}
                value={field.value}
                onChange={(ev) => field.onChange(ev.value)}
              />
            )}
          />

          <Input
            {...register("profitMargin", { valueAsNumber: true })}
            type="number"
            placeholder="Margem de Lucro (%)"
          />
          <Input
            {...register("additionalCosts", { valueAsNumber: true })}
            type="number"
            placeholder="Custos Adicionais (R$)"
          />
          <Input
            {...register("platformFee", { valueAsNumber: true })}
            type="number"
            placeholder="Taxa Plataforma (%)"
          />

          <Button type="submit" className="w-full">
            Criar Precificação
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
