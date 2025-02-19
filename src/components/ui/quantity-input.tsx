"use client";
import { NumericFormat } from "react-number-format";
import { Input } from "@/components/ui/input";
import { forwardRef } from "react";
import { Unity } from "@/context/input-context";

interface QuantityInputProps {
  unity?: Unity;
  value: string;
  onChange: (value: string) => void;
}

export const QuantityInput = forwardRef<HTMLInputElement, QuantityInputProps>(
  ({ unity = "kg", value, onChange, ...props }, ref) => {
    const handleChange = (values: { value: string }) => {
      let cleanValue = values.value;

      // Permite dígitos, vírgulas e pontos.
      cleanValue = cleanValue
        .replace(/[^\d,.]/g, "")
        .replace(/(,.*?),(.*)/, "$1");

      const parts = cleanValue.split(",");
      let formatted = parts[0];
      if (parts.length > 1) {
        formatted += "," + parts[1].slice(0, 3);
      }
      cleanValue = formatted;

      onChange(cleanValue);
    };

    return (
      <NumericFormat
        value={value}
        allowNegative={false}
        decimalSeparator=","
        thousandSeparator="."
        allowLeadingZeros={false}
        onValueChange={handleChange}
        customInput={Input}
        placeholder={
          unity === "un"
            ? "Quantidade (unidades)"
            : `Quantidade em ${unity} (ex: 1,500)`
        }
        inputMode="decimal"
        getInputRef={ref}
        suffix={unity !== "un" ? ` ${unity}` : ""}
        {...props}
      />
    );
  }
);

QuantityInput.displayName = "QuantityInput";
