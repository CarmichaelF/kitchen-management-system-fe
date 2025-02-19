export function valueToLocaleString(value: number) {
  if (!value) return;
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

export function trimString(string: string, length = 25) {
  return string.length > length ? string.slice(0, length) + "..." : string;
}

export const getMonthBetween = (
  date = new Date()
): {
  startDate: string;
  endDate: string;
} => {
  const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
  const endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);

  return {
    startDate: startOfMonth.toISOString().split("T")[0], // Formato YYYY-MM-DD
    endDate: endOfMonth.toISOString().split("T")[0],
  };
};

export function getMonthRange(monthIndex?: number) {
  const now = new Date();
  const year = now.getFullYear();
  const month = monthIndex ?? now.getMonth(); // Se não passar um índice, usa o mês atual

  const startDate = new Date(year, month, 1); // Primeiro dia do mês
  const endDate = new Date(year, month + 1, 0); // Último dia do mês

  return {
    startDate: startDate.toISOString().split("T")[0], // Formato YYYY-MM-DD
    endDate: endDate.toISOString().split("T")[0],
  };
}

import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
};

export const parseCurrency = (value: string) => {
  return parseFloat(value.replace(/[^0-9.]/g, ""));
};

export const getCurrentMonthName = () => {
  const currentDate = new Date();
  const currentMonthIndex = currentDate.getMonth();

  // Arrays com os nomes dos meses em inglês e português
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

  // Retorna o nome do mês na linguagem desejada (default é inglês)
  return months[currentMonthIndex];
};

export const formatRelativeTime = (date: Date) => {
  return formatDistanceToNow(new Date(date), { locale: ptBR, addSuffix: true });
};

export const formatBrazilianDate = (
  date: Date,
  dateFormat = "dd/MM/yyyy HH:mm:ss"
) => {
  return format(date, dateFormat, { locale: ptBR });
};
