import { cva, type VariantProps } from "class-variance-authority";
import { Card, CardContent, CardDescription, CardTitle } from "../ui/card";
import { cn } from "@/utils";
import { valueToLocaleString } from "@/utils";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react"; // Importe ícones de olho

// Variantes do card
const cardVariants = cva("p-6", {
  variants: {
    variant: {
      positive: "bg-lightGreen",
      negative: "bg-lightRed",
    },
  },
  defaultVariants: {
    variant: "positive",
  },
});

// Tipagem para as props do MoneyCard
interface MoneyCardProps {
  title: string;
  description: string;
  value: number;
  percentage?: number;
  showValue?: boolean; // Prop para controlar a visibilidade do valor
}

export function MoneyCard({
  title,
  description,
  value,
  percentage,
  variant,
  className,
  showValue = false, // Valor padrão para mostrar o valor
}: MoneyCardProps &
  React.ButtonHTMLAttributes<HTMLDivElement> &
  VariantProps<typeof cardVariants>) {
  const [isValueVisible, setIsValueVisible] = useState(showValue); // Estado para controlar a visibilidade

  const isNegativeTextFeedback = (num: number) => (num < 0 ? "menos" : "mais");

  // Função para alternar a visibilidade do valor
  const toggleValueVisibility = () => {
    setIsValueVisible((prev) => !prev);
  };

  return (
    <Card className={cn(cardVariants({ variant, className }))}>
      <div className="flex items-center gap-1">
        <CardTitle className="text-sm">{title}</CardTitle>
        <CardDescription className="text-xs">{description}</CardDescription>
      </div>
      <CardContent className="flex justify-between items-center mt-2">
        <span
          className={`font-semibold text-[24px] transition-all ${
            !isValueVisible ? "blur-sm cursor-not-allowed" : ""
          }`}
        >
          {isValueVisible ? valueToLocaleString(value) : "*****"}
        </span>
        <div className="flex items-center gap-2">
          {percentage && (
            <span className="text-[12px]">
              {percentage}% à {isNegativeTextFeedback(percentage)} do que ontem
            </span>
          )}
          <button
            onClick={toggleValueVisibility}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
            aria-label={isValueVisible ? "Ocultar valor" : "Mostrar valor"}
          >
            {isValueVisible ? <Eye size={16} /> : <EyeOff size={16} />}
          </button>
        </div>
      </CardContent>
    </Card>
  );
}
