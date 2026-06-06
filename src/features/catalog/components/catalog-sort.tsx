import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
  value: CatalogSortValue;
  onChange: (value: CatalogSortValue) => void;
};

export function CatalogSort({ value, onChange }: CatalogSortProps) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-foreground">
        Urutkan
      </span>
      <Select
        value={value}
        onValueChange={(nextValue) => onChange(nextValue as CatalogSortValue)}
      >
        <SelectTrigger className="h-11 w-full bg-background">
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
