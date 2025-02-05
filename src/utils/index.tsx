export function valueToLocaleString(value: number) {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

export function trimString(string: string, length = 25) {
  return string.length > length
    ? string.slice(0, length) + "..."
    : string;
}