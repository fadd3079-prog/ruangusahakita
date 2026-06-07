import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

export type CatalogSortValue =
  | "relevant"
  | "rating"
  | "price_low"
  | "projects"
  | "fastest";

const sortOptions: readonly {
  value: CatalogSortValue;
  label: string;
}[] = [
  { value: "relevant", label: "Paling relevan" },
  { value: "rating", label: "Rating tertinggi" },
  { value: "price_low", label: "Harga terendah" },
  { value: "projects", label: "Proyek terbanyak" },
  { value: "fastest", label: "Estimasi tercepat" },
];

type CatalogSortProps = {
  className?: string;
  labelClassName?: string;
  value: CatalogSortValue;
  onChange: (value: CatalogSortValue) => void;
};

export function CatalogSort({
  className,
  labelClassName,
  value,
  onChange,
}: CatalogSortProps) {
  return (
    <label className={cn("block", className)}>
      <span
        className={cn(
          "mb-2 block text-sm font-medium text-foreground",
          labelClassName,
        )}
      >
        Urutkan
      </span>
      <Select
        value={value}
        onValueChange={(nextValue) => onChange(nextValue as CatalogSortValue)}
      >
        <SelectTrigger className="h-10 w-full bg-background">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {sortOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </label>
  );
}
