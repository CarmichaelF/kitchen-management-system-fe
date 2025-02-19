"use client";

import { useEffect, useState } from "react";
import { MoneyCard } from "@/components/money-card";
import { MonthChart, MonthlyRevenue } from "@/components/month-chart";
import { getCurrentMonthName } from "@/utils";
import { api } from "@/service/axios";
import { getMonthBetween, getMonthRange } from "@/utils";
import { OrdersTable } from "@/components/orders-table";

interface Sales {
  totalSales: number;
  totalProductionCost: number;
  totalFixedCosts: number;
  netProfit: number;
}

export default function Home() {
  const [anualRevenue, setAnualRevenue] = useState<MonthlyRevenue[]>([]);
  const [sales, setSales] = useState<Sales>({} as Sales);

  useEffect(() => {
    (async () => {
      // Busca os dados do mês atual
      const response = await api.get("/order/sales", {
        params: getMonthBetween(),
      });
      setSales(response.data);
    })();
  }, []);

  useEffect(() => {
    (async () => {
      const months = [
        "Janeiro",
        "Fevereiro",
        "Março",
        "Abril",
        "Maio",
        "Junho",
        "Julho",
        "Agosto",
        "Setembro",
        "Outubro",
        "Novembro",
        "Dezembro",
      ];

      const revenueData: MonthlyRevenue[] = [];

      // Loop para buscar dados de cada mês do ano
      for (let monthIndex = 0; monthIndex < 12; monthIndex++) {
        const { startDate, endDate } = getMonthRange(monthIndex);
        const response = await api.get<{
          totalSales: number;
        }>("/order/sales", {
          params: { startDate, endDate },
        });

        revenueData.push({
          month: months[monthIndex],
          income: response.data.totalSales,
        });
      }

      setAnualRevenue(revenueData);
    })();
  }, []);

  return (
    <div className="grid-cols-2 items-center">
      <div className="grid-cols-2 grid px-6 gap-8 mb-8 mt-6">
        {sales && (
          <>
            <MoneyCard
              title="Faturamento Bruto"
              description={`(${getCurrentMonthName()})`}
              value={sales?.totalSales}
              variant={sales?.totalSales < 0 ? "negative" : "positive"}
            />
            <MoneyCard
              title="Custos Fixos"
              description={`(${getCurrentMonthName()})`}
              value={sales?.totalFixedCosts}
              variant="negative"
            />
            <MoneyCard
              title="Lucro Liquido"
              description={`(${getCurrentMonthName()})`}
              value={sales?.netProfit}
              variant={sales?.netProfit < 0 ? "negative" : "positive"}
            />
            <MoneyCard
              title="Custo de Produção"
              description={`(${getCurrentMonthName()})`}
              value={sales?.totalProductionCost}
              variant="negative"
            />
          </>
        )}
      </div>
      <div className="px-6 mb-8">
        <OrdersTable />
      </div>
      <div className="px-6">
        <MonthChart chartData={anualRevenue} />
      </div>
    </div>
  );
}
