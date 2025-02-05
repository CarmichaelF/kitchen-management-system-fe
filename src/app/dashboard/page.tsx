import { MoneyCard } from "@/components/money-card";
import { MonthChart } from "@/components/month-chart";
import { Tasks } from "@/components/tasks";

export default function Home() {
  return (
    <div className="grid-cols-2 items-center">
      <div className="grid-cols-2 grid px-6 gap-8 mb-8">
        <MoneyCard
          title="Entradas"
          description="(Hoje)"
          value={7625.2}
          percentage={11}
        />
        <MoneyCard
          title="Saídas"
          description="(Hoje)"
          value={3145}
          percentage={-20.3}
          variant="negative"
        />
      </div>
      <div className="px-6 mb-8">
        <Tasks />
      </div>
      <div className="px-6">
        <MonthChart />
      </div>
    </div>
  );
}
