import { cva, type VariantProps } from "class-variance-authority";
import { Card, CardContent, CardDescription, CardTitle } from "../ui/card";
import { cn } from "@/lib/utils";
import { valueToLocaleString } from "@/utils";

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

interface MoneyCardProps {
  title: string;
  description: string;
  value: number;
  percentage: number;
}

export function MoneyCard({
  title,
  description,
  value,
  percentage,
  variant,
  className,
}: MoneyCardProps &
  React.ButtonHTMLAttributes<HTMLDivElement> &
  VariantProps<typeof cardVariants>) {
  const isNegativeTextFeedback = (num: number) => (num < 0 ? "menos" : "mais");

  return (
    <Card className={cn(cardVariants({ variant, className }))}>
      <div className="flex items-center gap-1">
        <CardTitle className="text-sm">{title}</CardTitle>
        <CardDescription className="text-xs">{description}</CardDescription>
      </div>
      <CardContent className="flex justify-between items-center mt-2">
        <span className="font-semibold text-[24px]">
          {valueToLocaleString(value)}
        </span>
        <span className="text-[12px]">
          {percentage}% à {isNegativeTextFeedback(percentage)} do que ontem
        </span>
      </CardContent>
    </Card>
  );
}
