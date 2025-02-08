"use client";

import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { api } from "@/service/axios";
import { Pencil, Trash } from "lucide-react";
import { PricingForm } from "./pricing-create-form";
import { PricingEditModal } from "./pricing-edit-modal";

interface Product {
  _id: string;
  name: string;
}

export interface Pricing {
  _id: string;
  product: Product;
  profitMargin: number;
  additionalCosts: number;
  platformFee: number;
  sellingPrice: number;
}

export function PricingDashboard() {
  const [products, setProducts] = useState<Product[]>([]);
  const [pricings, setPricings] = useState<Pricing[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedPricing, setSelectedPricing] = useState<Pricing | null>(null);

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
    }
  };

  const deletePricing = async (id: string) => {
    if (!confirm("Tem certeza que deseja deletar esta precificação?")) return;

    try {
      await api.delete(`/pricing/${id}`);
      setPricings((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      console.error("Erro ao deletar precificação:", err);
    }
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    loadData();
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div className="space-y-6">
      <PricingForm
        products={products}
        onPricingCreated={(newPricing) =>
          setPricings([...pricings, newPricing])
        }
      />

      <Card>
        <CardHeader>
          <CardTitle>Histórico de Precificações</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Produto</TableHead>
                <TableHead>Preço Final</TableHead>
                <TableHead>Editar</TableHead>
                <TableHead className="text-right">Deletar</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pricings.map((pricing) => (
                <TableRow key={pricing._id}>
                  <TableCell>{pricing?.product?.name}</TableCell>
                  <TableCell>R$ {pricing?.sellingPrice?.toFixed(2)}</TableCell>
                  <TableCell>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => {
                        setSelectedPricing(pricing);
                        setModalOpen(true);
                      }}
                    >
                      <Pencil />
                    </Button>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      size="icon"
                      variant="destructive"
                      onClick={() => deletePricing(pricing._id)}
                    >
                      <Trash />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <PricingEditModal
        isOpen={modalOpen}
        onClose={handleCloseModal}
        pricingData={selectedPricing}
        products={products}
      />
    </div>
  );
}
