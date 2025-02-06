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

const chartData = [
  { month: "Janeiro", income: 203012 },
  { month: "Fevereiro", income: 503012 },
  { month: "Março", income: 406112 },
  { month: "Abril", income: 783112 },
  { month: "May", income: 233812 },
  { month: "Junho", income: 403912 },
  { month: "Julho", income: 323912 },
  { month: "Agosto", income: 102412 },
  { month: "Setembro", income: 683912 },
  { month: "Outubro", income: 123912 },
  { month: "Novembro", income: 503912 },
  { month: "Dezembro", income: 903912 },
];

const total = chartData.reduce((acc, { income }) => acc + income, 0);

const chartConfig = {
  income: {
    label: "Income",
    color: "rgba(148, 233, 184, 60%)",
  },
} satisfies ChartConfig;

export function MonthChart() {
  return (
    <Card className="p-6">
      <div className="flex flex-col">
        <CardTitle className="text-5xl font-semibold">
          {valueToLocaleString(total)}
        </CardTitle>
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
