"use client";
import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { Combobox, ComboboxItemDTO } from "@/components/ui/combobox";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import { api } from "@/service/axios";
import { Skeleton } from "@/components/ui/skeleton";

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
  sellingPrice: number;
  createdAt: string;
}

export function PricingDashboard() {
  const [currentItem, setCurrentItem] = useState<ComboboxItemDTO>(
    {} as ComboboxItemDTO
  );
  const [products, setProducts] = useState<Product[]>([]);
  const [pricings, setPricings] = useState<Pricing[]>([]);
  const [loading, setLoading] = useState(true);
  const { control, register, handleSubmit, reset } = useForm();

  useEffect(() => {
    const loadData = async () => {
      try {
        const [productsRes, pricingsRes] = await Promise.all([
          api.get("/product"),
          api.get("/pricing"),
        ]);
        setProducts(productsRes.data);
        setPricings(pricingsRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onSubmit = async (data: any) => {
    try {
      const res = await api.post("/pricing", data);
      setPricings((prev) => [...prev, res.data]);
      reset();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="mb-4">
          <CardTitle>Nova Precificação</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Controller
              name="productId"
              control={control}
              render={({ field }) => (
                <Combobox
                  items={products?.map((p) => ({
                    value: p._id,
                    label: p.name,
                  }))}
                  value={currentItem?.value || ""} // Usa o valor do currentItem
                  onChange={(ev) => {
                    field.onChange(ev.value); // Atualiza o valor do campo "name" no formulário
                    setCurrentItem(ev); // Atualiza o currentItem
                  }}
                />
              )}
            />

            <div className="grid grid-cols-3 gap-4">
              <Input
                {...register("profitMargin", { valueAsNumber: true })}
                type="number"
                placeholder="Margem de Lucro (%)"
                step="0.1"
              />

              <Input
                {...register("additionalCosts", { valueAsNumber: true })}
                type="number"
                placeholder="Custos Adicionais (R$)"
                step="0.01"
              />

              <Input
                {...register("platformFee", { valueAsNumber: true })}
                type="number"
                placeholder="Taxa Plataforma (%)"
                step="0.1"
              />
            </div>

            <Button type="submit" className="w-full">
              Calcular e Salvar
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Histórico de Precificações</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Produto</TableHead>
                <TableHead>Margem</TableHead>
                <TableHead>Custos Extras</TableHead>
                <TableHead>Taxa</TableHead>
                <TableHead>Preço Final</TableHead>
                <TableHead>Data</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading
                ? Array(5)
                    .fill(0)
                    .map((_, i) => (
                      <TableRow key={i}>
                        <TableCell>
                          <Skeleton className="h-4 w-[120px]" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-4 w-[60px]" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-4 w-[80px]" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-4 w-[60px]" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-4 w-[80px]" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-4 w-[100px]" />
                        </TableCell>
                      </TableRow>
                    ))
                : pricings.map((pricing) => (
                    <TableRow key={pricing._id}>
                      <TableCell>{pricing.product?.name}</TableCell>
                      <TableCell>{pricing.profitMargin}%</TableCell>
                      <TableCell>
                        {formatCurrency(pricing.additionalCosts)}
                      </TableCell>
                      <TableCell>{pricing.platformFee}%</TableCell>
                      <TableCell className="font-bold text-primary">
                        {formatCurrency(pricing.sellingPrice)}
                      </TableCell>
                      <TableCell>
                        {new Date(pricing.createdAt).toLocaleDateString()}
                      </TableCell>
                    </TableRow>
                  ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
