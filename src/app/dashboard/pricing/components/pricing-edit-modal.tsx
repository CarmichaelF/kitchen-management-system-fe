"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { api } from "@/service/axios";
import { toast } from "sonner";

interface Product {
  _id: string;
  name: string;
}

interface Pricing {
  _id: string;
  product: Product;
  profitMargin: number;
  additionalCosts: number;
  platformFee: number;
}

export interface PricingEditData {
  pricingId: string;
  profitMargin?: number;
  additionalCosts?: number;
  platformFee?: number;
}

interface PricingEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  pricingData: Pricing | null;
  products: Product[];
}

export function PricingEditModal({
  isOpen,
  onClose,
  pricingData,
}: PricingEditModalProps) {
  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
      pricingId: "",
    } as PricingEditData,
  });

  useEffect(() => {
    if (pricingData) {
      reset({
        pricingId: pricingData._id,
        profitMargin: pricingData.profitMargin,
        additionalCosts: pricingData.additionalCosts,
        platformFee: pricingData.platformFee,
      });
    }
  }, [pricingData, reset]);

  const onSubmit = async (data: PricingEditData) => {
    if (!pricingData) return;

    try {
      const response = await api.put(`/pricing/${pricingData._id}`, data);
      toast(response.data.message);
      onClose();
    } catch (err) {
      console.error("Erro ao atualizar precificação:", err);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar Precificação</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit">Salvar</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
