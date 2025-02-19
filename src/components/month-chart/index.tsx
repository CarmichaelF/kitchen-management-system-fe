"use client";

import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Card, CardContent, CardDescription, CardTitle } from "../ui/card";
import { ValueType } from "recharts/types/component/DefaultTooltipContent";
import { valueToLocaleString } from "@/utils";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react"; // Importe ícones de olho

export interface MonthlyRevenue {
  month: string;
  income: number;
}

const chartConfig = {
  income: {
    label: "Income",
    color: "rgba(148, 233, 184, 60%)",
  },
} satisfies ChartConfig;

export function MonthChart({ chartData }: { chartData: MonthlyRevenue[] }) {
  const [isValueVisible, setIsValueVisible] = useState(false); // Estado para controlar a visibilidade
  const total = chartData.reduce((acc, { income }) => acc + income, 0);

  // Função para alternar a visibilidade do valor
  const toggleValueVisibility = () => {
    setIsValueVisible((prev) => !prev);
  };

  return (
    <Card className="p-6">
      <div className="flex flex-col">
        <div className="flex items-center">
          <CardTitle
            className={`text-5xl font-semibold transition-all ${
              !isValueVisible ? "blur-sm" : ""
            }`}
          >
            {isValueVisible ? valueToLocaleString(total) : "*****"}
          </CardTitle>
          <button
            onClick={toggleValueVisibility}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors ml-4"
            aria-label={isValueVisible ? "Ocultar valor" : "Mostrar valor"}
          >
            {isValueVisible ? <Eye size={16} /> : <EyeOff size={16} />}
          </button>
        </div>
        <CardDescription className="text-black opacity-40 mt-2 ml-1">
          Faturamento anual
        </CardDescription>
      </div>
      <CardContent className="mt-4">
        <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  formatter={(value: ValueType) =>
                    valueToLocaleString(Number(value))
                  }
                />
              }
            />
            <ChartLegend content={<ChartLegendContent />} />
            <Bar dataKey="income" fill="var(--color-income)" radius={4} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
