"use client";

import { useForm, Controller } from "react-hook-form";
import { useEffect } from "react";
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

interface FixedCostsData {
  rent: number;
  taxes: number;
  utilities: number;
  marketing: number;
  accounting: number;
  expectedMonthlySales: number; // novo campo
}

interface PricingFormData {
  productId: string;
  profitMargin?: number;
  platformFee?: number;
  fixedCosts: FixedCostsData;
  yields: number;
}

interface PricingFormProps {
  products: Product[];
  onPricingCreated: (newPricing: Pricing) => void;
}

export function PricingForm({ products, onPricingCreated }: PricingFormProps) {
  const { register, handleSubmit, control, reset, setValue, getValues } =
    useForm<PricingFormData>();

  // Busca os fixedCosts globais ao montar o componente
  useEffect(() => {
    const fetchFixedCosts = async () => {
      try {
        const response = await api.get("/pricing/fixed-costs");
        const fixedCosts = response.data;
        setValue("fixedCosts.rent", fixedCosts.rent);
        setValue("fixedCosts.taxes", fixedCosts.taxes);
        setValue("fixedCosts.utilities", fixedCosts.utilities);
        setValue("fixedCosts.marketing", fixedCosts.marketing);
        setValue("fixedCosts.accounting", fixedCosts.accounting);
        setValue(
          "fixedCosts.expectedMonthlySales",
          fixedCosts.expectedMonthlySales
        );
      } catch (err) {
        console.error("Erro ao buscar fixed costs:", err);
      }
    };
    fetchFixedCosts();
  }, [setValue]);

  // Função para atualizar os fixed costs globalmente
  const handleUpdateFixedCosts = async () => {
    try {
      const fixedCostsData = getValues("fixedCosts");
      await api.post("/pricing/fixed-costs", fixedCostsData);
      console.log("Fixed costs atualizados com sucesso.");
    } catch (err) {
      console.error("Erro ao atualizar fixed costs:", err);
    }
  };

  const onSubmit = async (data: PricingFormData) => {
    try {
      // Atualiza os custos fixos globais (incluindo expectedMonthlySales)
      await api.post("/pricing/fixed-costs", data.fixedCosts);
      // Cria a precificação (não envia fixedCosts, pois o BE já os utiliza globalmente)
      const pricingData = {
        productId: data.productId,
        profitMargin: data.profitMargin,
        platformFee: data.platformFee,
        yields: data.yields,
      };
      const response = await api.post("/pricing", pricingData);
      onPricingCreated(response.data);
      reset();
      const fixedCostsResponse = await api.get("/pricing/fixed-costs");
      setValue("fixedCosts", fixedCostsResponse.data);
    } catch (err) {
      console.error("Erro ao criar precificação:", err);
    }
  };

  return (
    <Card>
      <h1 className="text-2xl font-bold my-6">Custos Fixos</h1>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-6">
          {/* Seção de Fixed Costs */}
          <div className="grid grid-cols-2 gap-4">
            <Input
              {...register("fixedCosts.rent", { valueAsNumber: true })}
              type="number"
              placeholder="Aluguel (R$)"
            />
            <Input
              {...register("fixedCosts.taxes", { valueAsNumber: true })}
              type="number"
              placeholder="Impostos (R$)"
            />
            <Input
              {...register("fixedCosts.utilities", { valueAsNumber: true })}
              type="number"
              placeholder="Utilidades (R$)"
            />
            <Input
              {...register("fixedCosts.marketing", { valueAsNumber: true })}
              type="number"
              placeholder="Marketing (R$)"
            />
            <Input
              {...register("fixedCosts.accounting", { valueAsNumber: true })}
              type="number"
              placeholder="Contabilidade (R$)"
            />
            <Input
              {...register("fixedCosts.expectedMonthlySales", {
                valueAsNumber: true,
              })}
              type="number"
              placeholder="Vendas esperadas no mês"
            />
          </div>
          {/* Botão para atualizar os fixed costs */}
          <div className="flex justify-end mt-2">
            <Button type="button" onClick={handleUpdateFixedCosts}>
              Atualizar Custos Fixos
            </Button>
          </div>

          <span className="bg-gray-400 h-0.5 block rounded !my-8" />

          <h1 className="text-2xl font-bold my-6">Cadastro de Precificação</h1>
          {/* Seção de Dados da Precificação */}
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
            {...register("yields", { valueAsNumber: true })}
            type="number"
            placeholder="Rendimento"
          />
          <Input
            {...register("profitMargin", { valueAsNumber: true })}
            type="number"
            placeholder="Margem de Lucro (%)"
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
