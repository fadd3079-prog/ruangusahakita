import { formatCurrency } from "@/lib/formatters/currency";

type PriceTextProps = {
  value: number;
  prefix?: string;
};

export function PriceText({ value, prefix = "Mulai dari" }: PriceTextProps) {
  return (
    <span className="font-semibold text-foreground">
      {prefix} {formatCurrency(value)}
    </span>
  );
}
