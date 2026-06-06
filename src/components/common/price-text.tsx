import { formatCurrency } from "@/lib/formatters/currency";

type PriceTextProps = {
  value: number;
  prefix?: string;
};

export function PriceText({ value, prefix = "Mulai dari" }: PriceTextProps) {
  const formattedValue = formatCurrency(value);

  return (
    <span className="font-semibold text-foreground">
      {prefix ? `${prefix} ${formattedValue}` : formattedValue}
    </span>
  );
}
