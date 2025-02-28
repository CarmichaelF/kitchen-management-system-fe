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
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { api } from "@/service/axios";
import { Pencil, Trash, RefreshCw } from "lucide-react";
import { PricingForm } from "./pricing-create-form";
import { PricingEditModal } from "./pricing-edit-modal";
import { DeleteDialog } from "@/components/ui/delete-dialog";
import { toast } from "sonner";

interface Product {
  _id: string;
  name: string;
}

export interface Pricing {
  _id: string;
  product: Product;
  profitMargin: number;
  fixedCosts: {
    rent: number;
    taxes: number;
    utilities: number;
    marketing: number;
    accounting: number;
  };
  platformFee: number;
  sellingPrice: number;
  createdAt: Date;
  productionCost: number;
  yields: number;
  packing: number;
}

export function PricingDashboard() {
  const [deletingPricingID, setDeletingPricingID] = useState<string>("");
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
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

  const deletePricing = async () => {
    try {
      await api.delete(`/pricing/${deletingPricingID}`);
      setPricings((prev) => prev.filter((p) => p._id !== deletingPricingID));
    } catch (err) {
      console.error("Erro ao deletar precificação:", err);
    }
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    loadData();
  };

  // Função para recalcular a precificação
  const handleRecalculatePricing = async (pricingId: string) => {
    try {
      const response = await api.post(`/pricing/${pricingId}/recalculate`);
      const updatedPricing = response.data;

      setPricings((prev) =>
        prev.map((p) => (p._id === pricingId ? updatedPricing : p))
      );

      toast.success("Precificação recalculada com sucesso!");
    } catch (err) {
      console.error("Erro ao recalcular precificação:", err);
      toast.error("Erro ao recalcular precificação.");
    }
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
          <h2 className="text-2xl font-bold mb-6">
            Histórico de Precificações
          </h2>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Produto</TableHead>
                <TableHead>Preço Final</TableHead>
                <TableHead>Editar</TableHead>
                <TableHead>Recalcular</TableHead>
                <TableHead>Excluir</TableHead>
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
                  <TableCell>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => handleRecalculatePricing(pricing._id)}
                    >
                      <RefreshCw />
                    </Button>
                  </TableCell>
                  <TableCell>
                    <Button
                      size="icon"
                      variant="destructive"
                      onClick={() => {
                        setIsDeleteDialogOpen(true);
                        setDeletingPricingID(pricing._id);
                      }}
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

      <DeleteDialog
        title="Deletar Precificação"
        description="Tem certeza de que deseja deletar esta precificação? Esta ação não pode ser desfeita."
        confirmText="Confirmar Deleção"
        isDeleteDialogOpen={isDeleteDialogOpen}
        setIsDeleteDialogOpen={setIsDeleteDialogOpen}
        handleDeleteOrder={deletePricing}
      />
    </div>
  );
}
